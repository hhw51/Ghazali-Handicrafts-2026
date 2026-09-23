import { google } from 'googleapis';
import { createAdminClient } from '@/lib/supabase/admin';

export function getGoogleDriveClient() {
  // Handle stringified private keys with escaped newlines
  let privateKey = process.env.GOOGLE_PRIVATE_KEY || '';
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1);
  }
  privateKey = privateKey.replace(/\\n/g, '\n');

  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: privateKey,
    scopes: [
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/drive',
    ],
  });

  return google.drive({ version: 'v3', auth });
}

export async function fetchAndUploadDriveFolderImages(
  folderUrl: string,
  productSlug: string,
  supabaseClient: any = createAdminClient()
): Promise<{ urls: string[]; error?: string }> {
  if (!folderUrl) return { urls: [], error: 'Empty Google Drive folder URL' };

  // Extract folder ID from URL (handles formats: /folders/ID, id=ID, etc.)
  const folderMatch = folderUrl.match(/folders\/([a-zA-Z0-9_-]+)/) || folderUrl.match(/id=([a-zA-Z0-9_-]+)/);
  let folderId = folderMatch ? folderMatch[1] : null;

  if (!folderId && /^[a-zA-Z0-9_-]{20,60}$/.test(folderUrl.trim())) {
    folderId = folderUrl.trim();
  }

  if (!folderId) {
    console.error(`[Drive Ingest] Invalid folder URL format: ${folderUrl}`);
    return { urls: [], error: 'Invalid Google Drive folder URL format' };
  }

  console.log(`[Drive Ingest] Processing Folder ID: ${folderId} for slug: ${productSlug}`);

  try {
    const drive = getGoogleDriveClient();

    // Test folder accessibility & list image files
    const listRes = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
      fields: 'files(id, name, mimeType, size)',
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });

    const files = listRes.data.files || [];
    console.log(`[Drive Ingest] Found ${files.length} images in folder ${folderId}`);

    if (files.length === 0) {
      console.warn(`[Drive Ingest] No image files found or folder not shared with Service Account: ${folderId}`);
      return { urls: [], error: 'No image files found or folder not shared with Service Account' };
    }

    // Ensure bucket 'pictures' exists
    try {
      const { data: buckets } = await supabaseClient.storage.listBuckets();
      if (!buckets?.some((b: any) => b.name === 'pictures')) {
        await supabaseClient.storage.createBucket('pictures', { public: true });
      }
    } catch (bErr) {
      console.warn('[Supabase Storage Bucket Notice]:', bErr);
    }

    const publicUrls: string[] = [];

    for (const file of files) {
      if (!file.id || !file.name) continue;

      console.log(`[Drive Ingest] Downloading ${file.name} (${file.id})...`);
      const fileRes = await drive.files.get(
        { fileId: file.id, alt: 'media', supportsAllDrives: true },
        { responseType: 'arraybuffer' }
      );

      const buffer = Buffer.from(fileRes.data as ArrayBuffer);
      const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const storagePath = `products/${productSlug}/${safeName}`;

      const { error: uploadError } = await supabaseClient.storage
        .from('pictures')
        .upload(storagePath, buffer, {
          contentType: file.mimeType || 'image/jpeg',
          upsert: true,
        });

      if (uploadError) {
        console.error(`[Supabase Storage Error] Failed to upload ${storagePath}:`, uploadError);
        continue;
      }

      const { data: publicUrlData } = supabaseClient.storage
        .from('pictures')
        .getPublicUrl(storagePath);

      if (publicUrlData?.publicUrl) {
        publicUrls.push(publicUrlData.publicUrl);
        console.log(`[Supabase Storage] Uploaded: ${publicUrlData.publicUrl}`);
      }
    }

    if (publicUrls.length === 0) {
      return { urls: [], error: 'Failed to upload images to Supabase Storage' };
    }

    return { urls: publicUrls };
  } catch (err: any) {
    console.error(`[Drive Ingest Fatal Error] Folder ${folderId}:`, err?.message || err);
    return { urls: [], error: err?.message || 'Drive API request failed' };
  }
}
