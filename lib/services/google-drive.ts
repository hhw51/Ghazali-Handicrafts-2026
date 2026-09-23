import { google } from 'googleapis';
import { createAdminClient } from '@/lib/supabase/admin';

export function getGoogleDriveClient() {
  const privateKey = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });

  return google.drive({ version: 'v3', auth });
}

export async function fetchAndUploadDriveFolderImages(
  folderUrl: string,
  productSlug: string,
  supabaseClient: any = createAdminClient()
): Promise<string[]> {
  if (!folderUrl) return [];

  const match = folderUrl.match(/folders\/([a-zA-Z0-9_-]+)/) || folderUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  const folderId = match ? match[1] : (folderUrl.length > 20 ? folderUrl.trim() : null);
  if (!folderId) return [];

  const drive = getGoogleDriveClient();

  // 1. List all image files within the Google Drive folder
  const res = await drive.files.list({
    q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
    fields: 'files(id, name, mimeType)',
  });

  const files = res.data.files || [];
  if (files.length === 0) return [];

  const publicUrls: string[] = [];

  // Ensure 'pictures' bucket exists
  try {
    const { data: buckets } = await supabaseClient.storage.listBuckets();
    if (!buckets?.some((b: any) => b.name === 'pictures')) {
      await supabaseClient.storage.createBucket('pictures', { public: true });
    }
  } catch (bErr) {
    console.warn('[Drive Storage Bucket Warning]:', bErr);
  }

  // 2. Stream download and pipe to Supabase Storage
  for (const file of files) {
    try {
      const fileRes = await drive.files.get(
        { fileId: file.id!, alt: 'media' },
        { responseType: 'arraybuffer' }
      );

      const buffer = Buffer.from(fileRes.data as ArrayBuffer);
      const safeFileName = file.name?.replace(/\s+/g, '_') || `img_${Date.now()}.jpg`;
      const storagePath = `products/${productSlug}/${safeFileName}`;

      const { error: uploadError } = await supabaseClient.storage
        .from('pictures')
        .upload(storagePath, buffer, {
          contentType: file.mimeType || 'image/jpeg',
          upsert: true,
        });

      if (uploadError) {
        console.error(`[Drive Upload Error] Failed for ${file.name}:`, uploadError);
        continue;
      }

      const { data: publicUrlData } = supabaseClient.storage
        .from('pictures')
        .getPublicUrl(storagePath);

      if (publicUrlData?.publicUrl) {
        publicUrls.push(publicUrlData.publicUrl);
      }
    } catch (err) {
      console.error(`[Drive Download Error] Failed on file ${file.name}:`, err);
    }
  }

  console.log(`[Ingestion] Migrated ${publicUrls.length} images for ${productSlug} -> Supabase Storage.`);
  return publicUrls;
}
