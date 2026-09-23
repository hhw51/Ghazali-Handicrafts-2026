import { fetchAndUploadDriveFolderImages } from '@/lib/services/google-drive';

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
  const res = await fetchAndUploadDriveFolderImages(folderUrlOrId, productSlug);
  return {
    success: res.urls.length > 0,
    urls: res.urls,
    error: res.error,
  };
}

