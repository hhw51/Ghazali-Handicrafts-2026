import { google } from 'googleapis';
import { createAdminClient } from '@/lib/supabase/admin';

export function extractDriveFolderId(urlOrId: string): string | null {
  if (!urlOrId || typeof urlOrId !== 'string') return null;

  const trimmed = urlOrId.trim();

  // Pattern 1: https://drive.google.com/drive/folders/:id or /drive/u/0/folders/:id
  const matchFolder = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (matchFolder && matchFolder[1]) {
    return matchFolder[1];
  }

  // Pattern 2: id=:id or ?id=:id
  const matchIdParam = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchIdParam && matchIdParam[1]) {
    return matchIdParam[1];
  }

  // Pattern 3: Raw ID string (typically 25-50 alphanumeric chars)
  if (/^[a-zA-Z0-9_-]{20,60}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

export function isGoogleDriveLink(str: string): boolean {
  if (!str) return false;
  return str.includes('drive.google.com') || extractDriveFolderId(str) !== null;
}

export async function extractDriveFolderImages(
  folderUrlOrId: string,
  productSlug: string
): Promise<{
  success: boolean;
  urls: string[];
  error?: string;
}> {
  try {
    const folderId = extractDriveFolderId(folderUrlOrId);
    if (!folderId) {
      return { success: false, urls: [], error: 'Invalid Google Drive folder link or ID.' };
    }

    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!email || !privateKey) {
      console.warn('Google Service Account credentials not configured in environment variables.');
      return {
        success: false,
        urls: [],
        error: 'Google Service Account keys (GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_PRIVATE_KEY) are missing.',
      };
    }

    // Clean escaped newlines in private key
    privateKey = privateKey.replace(/\\n/g, '\n');

    const auth = new google.auth.JWT({
      email,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    const drive = google.drive({ version: 'v3', auth });

    // 1. List files in folder
    const listRes = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
      fields: 'files(id, name, mimeType)',
      pageSize: 20,
    });

    const files = listRes.data.files;
    if (!files || files.length === 0) {
      return {
        success: false,
        urls: [],
        error: `No image files found in Google Drive folder (ID: ${folderId}). Ensure the folder is shared with the service account email.`,
      };
    }

    const supabase = createAdminClient();
    const bucketName = 'pictures';

    // Ensure bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((b) => b.name === bucketName);

    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      });
    }

    const uploadedUrls: string[] = [];

    // 2. Download each image from Drive and upload to Supabase Storage
    for (const file of files) {
      if (!file.id || !file.name) continue;

      const fileRes = await drive.files.get(
        { fileId: file.id, alt: 'media' },
        { responseType: 'arraybuffer' }
      );

      const buffer = Buffer.from(fileRes.data as ArrayBuffer);
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storagePath = `products/${productSlug}/${Date.now()}_${sanitizedFileName}`;

      const { error: uploadErr } = await supabase.storage
        .from(bucketName)
        .upload(storagePath, buffer, {
          contentType: file.mimeType || 'image/jpeg',
          upsert: true,
        });

      if (uploadErr) {
        console.error(`Supabase storage upload error for file ${file.name}:`, uploadErr);
        continue;
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(storagePath);

      if (publicUrlData?.publicUrl) {
        uploadedUrls.push(publicUrlData.publicUrl);
      }
    }

    if (uploadedUrls.length === 0) {
      return {
        success: false,
        urls: [],
        error: 'Failed to upload extracted Google Drive images to Supabase Storage.',
      };
    }

    return {
      success: true,
      urls: uploadedUrls,
    };
  } catch (err: any) {
    console.error('extractDriveFolderImages Exception:', err);
    return {
      success: false,
      urls: [],
      error: err.message || 'Error communicating with Google Drive API.',
    };
  }
}
