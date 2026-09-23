import { google } from 'googleapis';
import sharp from 'sharp';
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

export async function processAndUploadImage(
  fileBuffer: Buffer,
  originalName: string,
  mimeType: string,
  productSlug: string,
  supabaseClient: any = createAdminClient()
): Promise<string | null> {
  try {
    const lowerName = originalName.toLowerCase();
    const isHeic = 
      lowerName.endsWith('.heic') || 
      lowerName.endsWith('.heif') || 
      mimeType.includes('heic') || 
      mimeType.includes('heif');

    let processedBuffer: Buffer;
    const cleanBase = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
    const finalFileName = `${Date.now()}_${cleanBase}.webp`;

    if (isHeic) {
      console.log(`[Image Ingestion] Converting Apple HEIC -> WebP for: ${originalName}`);
      try {
        // Sharp supports HEIC decoding out of the box on modern builds
        processedBuffer = await sharp(fileBuffer)
          .rotate() // auto-orient mobile rotation
          .resize({ width: 1400, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer();
      } catch (sharpHeicErr) {
        console.warn(`[Sharp HEIC Fallback] Using heic-convert decoder for: ${originalName}`);
        const heicConvert = (await import('heic-convert')).default;
        const jpegBuffer = await heicConvert({
          buffer: fileBuffer,
          format: 'JPEG',
          quality: 1,
        });
        processedBuffer = await sharp(Buffer.from(jpegBuffer))
          .rotate()
          .resize({ width: 1400, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer();
      }
    } else {
      // Even standard JPEG/PNG should be normalized and compressed to WebP
      processedBuffer = await sharp(fileBuffer)
        .rotate()
        .resize({ width: 1400, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();
    }

    const storagePath = `products/${productSlug}/${finalFileName}`;

    const { error: uploadError } = await supabaseClient.storage
      .from('pictures')
      .upload(storagePath, processedBuffer, {
        contentType: 'image/webp',
        upsert: true,
      });

    if (uploadError) {
      console.error(`[Upload Error] ${storagePath}:`, uploadError);
      return null;
    }

    const { data: publicUrlData } = supabaseClient.storage
      .from('pictures')
      .getPublicUrl(storagePath);

    return publicUrlData?.publicUrl || null;
  } catch (err) {
    console.error(`[Processing Error] Failed processing ${originalName}:`, err);
    return null;
  }
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
      q: `'${folderId}' in parents and (mimeType contains 'image/' or mimeType contains 'octet-stream') and trashed = false`,
      fields: 'files(id, name, mimeType, size)',
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });

    const files = listRes.data.files || [];
    console.log(`[Drive Ingest] Found ${files.length} image files in folder ${folderId}`);

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

      const rawBuffer = Buffer.from(fileRes.data as ArrayBuffer);
      const mimeType = file.mimeType || 'image/jpeg';

      const publicUrl = await processAndUploadImage(
        rawBuffer,
        file.name,
        mimeType,
        productSlug,
        supabaseClient
      );

      if (publicUrl) {
        publicUrls.push(publicUrl);
        console.log(`[Supabase Storage] Successfully uploaded WebP: ${publicUrl}`);
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
