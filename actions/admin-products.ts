'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { SheetProductRow, slugify } from '@/lib/validations/product';
import { extractDriveFolderImages, isGoogleDriveLink } from '@/lib/storage/google-drive';
import { parseExcelBuffer, parseGoogleSheetUrl, ParsedRowResult } from '@/lib/parsers/excel';
import { revalidatePath } from 'next/cache';

export interface SingleProductPayload {
  name: string;
  category: string;
  price: number;
  short_description?: string;
  long_description?: string;
  size?: string;
  colors?: string;
  weight?: number;
  in_stock: boolean;
  tags?: string[];
  driveFolderLink?: string;
  imageUrls?: string[];
  base64Images?: { name: string; type: string; base64: string }[];
}

export async function createSingleProduct(payload: SingleProductPayload): Promise<{
  success: boolean;
  productId?: string;
  error?: string;
}> {
  try {
    if (!payload.name || payload.name.trim().length < 2) {
      return { success: false, error: 'Product name is required.' };
    }
    if (!payload.category || payload.category.trim().length === 0) {
      return { success: false, error: 'Category is required.' };
    }
    if (!payload.price || payload.price <= 0) {
      return { success: false, error: 'Valid price (> 0 PKR) is required.' };
    }

    const supabase = createAdminClient();
    const prodSlug = slugify(payload.name);

    // 1. Ensure category exists
    const catSlug = slugify(payload.category);
    const { data: catData, error: catErr } = await supabase
      .from('categories')
      .upsert({ name: payload.category.trim(), slug: catSlug }, { onConflict: 'slug' })
      .select('id')
      .single();

    if (catErr || !catData) {
      console.error('Error upserting category for single product:', catErr);
      return { success: false, error: 'Failed to process product category.' };
    }

    const finalImageUrls: string[] = [...(payload.imageUrls || [])];

    // 2. Extract Google Drive Folder Images if provided
    if (payload.driveFolderLink && payload.driveFolderLink.trim()) {
      const driveRes = await extractDriveFolderImages(payload.driveFolderLink, prodSlug);
      if (driveRes.success && driveRes.urls.length > 0) {
        finalImageUrls.push(...driveRes.urls);
      } else if (driveRes.error) {
        console.warn('Drive folder extraction warning:', driveRes.error);
      }
    }

    // 3. Process base64 file uploads if provided
    if (payload.base64Images && payload.base64Images.length > 0) {
      const bucketName = 'pictures';
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.some((b) => b.name === bucketName)) {
        await supabase.storage.createBucket(bucketName, { public: true });
      }

      for (const img of payload.base64Images) {
        const buffer = Buffer.from(img.base64.split(',')[1] || img.base64, 'base64');
        const fileName = `${Date.now()}_${img.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const storagePath = `products/${prodSlug}/${fileName}`;

        const { error: uploadErr } = await supabase.storage
          .from(bucketName)
          .upload(storagePath, buffer, {
            contentType: img.type || 'image/jpeg',
            upsert: true,
          });

        if (!uploadErr) {
          const { data: publicUrlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(storagePath);
          if (publicUrlData?.publicUrl) {
            finalImageUrls.push(publicUrlData.publicUrl);
          }
        }
      }
    }

    // Fallback default image if none provided
    if (finalImageUrls.length === 0) {
      finalImageUrls.push('/images/hero/craft-hero.png');
    }

    // 4. Insert Product into Supabase
    const { data: product, error: insertErr } = await supabase
      .from('products')
      .upsert(
        {
          name: payload.name.trim(),
          slug: prodSlug,
          short_description: payload.short_description || null,
          long_description: payload.long_description || null,
          price: payload.price,
          size: payload.size || null,
          in_stock: payload.in_stock,
          images: finalImageUrls,
          colors: payload.colors || null,
          category_id: catData.id,
          weight: payload.weight || 0,
          tags: payload.tags || [],
        },
        { onConflict: 'slug' }
      )
      .select('id')
      .single();

    if (insertErr || !product) {
      console.error('Error creating product:', insertErr);
      return { success: false, error: insertErr?.message || 'Failed to insert product.' };
    }

    revalidatePath('/products');
    revalidatePath('/admin/products');
    revalidatePath('/');

    return {
      success: true,
      productId: product.id,
    };
  } catch (err: any) {
    console.error('createSingleProduct Exception:', err);
    return { success: false, error: err.message || 'Failed to create product.' };
  }
}

export async function bulkUpsertProducts(rows: SheetProductRow[]): Promise<{
  success: boolean;
  insertedCount?: number;
  error?: string;
}> {
  try {
    if (!rows || rows.length === 0) {
      return { success: false, error: 'No valid rows provided for bulk ingestion.' };
    }

    const supabase = createAdminClient();

    // 1. Collect all distinct categories from batch
    const categoryNames = Array.from(new Set(rows.map((r) => r.category.trim()))).filter(Boolean);
    const categoryMap = new Map<string, string>(); // category name -> category id

    // Fetch or create categories
    for (const catName of categoryNames) {
      const catSlug = slugify(catName);
      const { data: catData, error: catErr } = await supabase
        .from('categories')
        .upsert({ name: catName, slug: catSlug }, { onConflict: 'slug' })
        .select('id, name')
        .single();

      if (catErr) {
        console.error(`Error upserting category "${catName}":`, catErr);
      } else if (catData) {
        categoryMap.set(catName.toLowerCase(), catData.id);
      }
    }

    // 2. Prepare product records for batch upsert
    const productsToUpsert = [];

    for (const row of rows) {
      const prodSlug = slugify(row.name);
      const categoryId = categoryMap.get(row.category.trim().toLowerCase()) || null;

      let finalImages = [...row.images];

      // Check if image entry is a Google Drive folder link
      const firstImg = row.images[0] || '';
      if (isGoogleDriveLink(firstImg)) {
        const driveRes = await extractDriveFolderImages(firstImg, prodSlug);
        if (driveRes.success && driveRes.urls.length > 0) {
          finalImages = driveRes.urls;
        }
      }

      if (finalImages.length === 0) {
        finalImages = ['/images/hero/craft-hero.png'];
      }

      productsToUpsert.push({
        name: row.name,
        slug: prodSlug,
        short_description: row['short description (underneath product picture)'] || null,
        long_description: row['long description'] || null,
        price: row.price,
        size: row.size || null,
        in_stock: row.stock,
        images: finalImages,
        colors: row.colors || null,
        category_id: categoryId,
        weight: row.weight || 0,
        tags: row.tags || [],
      });
    }

    // 3. Perform batch upsert on products table (conflict on `slug`)
    const { data: upsertData, error: upsertErr } = await supabase
      .from('products')
      .upsert(productsToUpsert, { onConflict: 'slug' })
      .select('id');

    if (upsertErr) {
      console.error('Error during bulk product upsert:', upsertErr);
      return { success: false, error: `Database batch upsert failed: ${upsertErr.message}` };
    }

    revalidatePath('/products');
    revalidatePath('/admin/products');
    revalidatePath('/');

    return {
      success: true,
      insertedCount: upsertData?.length || productsToUpsert.length,
    };
  } catch (err) {
    console.error('bulkUpsertProducts Exception:', err);
    return {
      success: false,
      error: 'An unexpected error occurred during bulk ingestion.',
    };
  }
}

export async function toggleProductStock(
  productId: string,
  currentInStock: boolean
): Promise<{
  success: boolean;
  newStockState?: boolean;
  error?: string;
}> {
  try {
    const supabase = createAdminClient();
    const newStock = !currentInStock;

    const { error } = await supabase
      .from('products')
      .update({ in_stock: newStock, updated_at: new Date().toISOString() })
      .eq('id', productId);

    if (error) {
      console.error('Error toggling product stock:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/products');
    revalidatePath('/admin/products');
    revalidatePath('/');

    return {
      success: true,
      newStockState: newStock,
    };
  } catch (err) {
    console.error('toggleProductStock Exception:', err);
    return { success: false, error: 'Failed to update stock status.' };
  }
}

export async function deleteProduct(productId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from('products').delete().eq('id', productId);

    if (error) {
      console.error('Error deleting product:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/products');
    revalidatePath('/admin/products');
    revalidatePath('/');

    return { success: true };
  } catch (err) {
    console.error('deleteProduct Exception:', err);
    return { success: false, error: 'Failed to delete product.' };
  }
}

export async function updateProduct(
  productId: string,
  payload: SingleProductPayload
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    if (!productId) {
      return { success: false, error: 'Product ID is required.' };
    }
    if (!payload.name || payload.name.trim().length < 2) {
      return { success: false, error: 'Product name is required.' };
    }
    if (!payload.category || payload.category.trim().length === 0) {
      return { success: false, error: 'Category is required.' };
    }
    if (!payload.price || payload.price <= 0) {
      return { success: false, error: 'Valid price (> 0 PKR) is required.' };
    }

    const supabase = createAdminClient();
    const prodSlug = slugify(payload.name);

    // 1. Ensure category exists
    const catSlug = slugify(payload.category);
    const { data: catData, error: catErr } = await supabase
      .from('categories')
      .upsert({ name: payload.category.trim(), slug: catSlug }, { onConflict: 'slug' })
      .select('id')
      .single();

    if (catErr || !catData) {
      console.error('Error upserting category for product update:', catErr);
      return { success: false, error: 'Failed to process product category.' };
    }

    const finalImageUrls: string[] = [...(payload.imageUrls || [])];

    // 2. Extract Google Drive Folder Images if provided
    if (payload.driveFolderLink && payload.driveFolderLink.trim()) {
      const driveRes = await extractDriveFolderImages(payload.driveFolderLink, prodSlug);
      if (driveRes.success && driveRes.urls.length > 0) {
        finalImageUrls.push(...driveRes.urls);
      } else if (driveRes.error) {
        console.warn('Drive folder extraction warning:', driveRes.error);
      }
    }

    // 3. Process base64 file uploads if provided
    if (payload.base64Images && payload.base64Images.length > 0) {
      const bucketName = 'pictures';
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.some((b) => b.name === bucketName)) {
        await supabase.storage.createBucket(bucketName, { public: true });
      }

      for (const img of payload.base64Images) {
        const buffer = Buffer.from(img.base64.split(',')[1] || img.base64, 'base64');
        const fileName = `${Date.now()}_${img.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const storagePath = `products/${prodSlug}/${fileName}`;

        const { error: uploadErr } = await supabase.storage
          .from(bucketName)
          .upload(storagePath, buffer, {
            contentType: img.type || 'image/jpeg',
            upsert: true,
          });

        if (!uploadErr) {
          const { data: publicUrlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(storagePath);
          if (publicUrlData?.publicUrl) {
            finalImageUrls.push(publicUrlData.publicUrl);
          }
        }
      }
    }

    if (finalImageUrls.length === 0) {
      finalImageUrls.push('/images/hero/craft-hero.png');
    }

    // 4. Update Product in Supabase
    const { error: updateErr } = await supabase
      .from('products')
      .update({
        name: payload.name.trim(),
        slug: prodSlug,
        category_id: catData.id,
        price: payload.price,
        short_description: payload.short_description || null,
        long_description: payload.long_description || null,
        size: payload.size || null,
        colors: payload.colors || null,
        weight: payload.weight || 0,
        in_stock: payload.in_stock,
        images: finalImageUrls,
        tags: payload.tags || [],
        updated_at: new Date().toISOString(),
      })
      .eq('id', productId);

    if (updateErr) {
      console.error('Error updating product:', updateErr);
      return { success: false, error: updateErr.message || 'Failed to update product.' };
    }

    revalidatePath('/products');
    revalidatePath('/admin/products');
    revalidatePath('/');

    return { success: true };
  } catch (err: any) {
    console.error('updateProduct Exception:', err);
    return { success: false, error: err.message || 'Failed to update product.' };
  }
}

export async function bulkUpdateStock(
  productIds: string[],
  inStock: boolean
): Promise<{
  success: boolean;
  count?: number;
  error?: string;
}> {
  try {
    if (!productIds || productIds.length === 0) {
      return { success: false, error: 'No product IDs provided.' };
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from('products')
      .update({ in_stock: inStock, updated_at: new Date().toISOString() })
      .in('id', productIds);

    if (error) {
      console.error('Error in bulkUpdateStock:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/products');
    revalidatePath('/admin/products');
    revalidatePath('/');

    return { success: true, count: productIds.length };
  } catch (err) {
    console.error('bulkUpdateStock Exception:', err);
    return { success: false, error: 'Failed to update products stock status.' };
  }
}

export async function bulkDeleteProducts(
  productIds: string[]
): Promise<{
  success: boolean;
  count?: number;
  error?: string;
}> {
  try {
    if (!productIds || productIds.length === 0) {
      return { success: false, error: 'No product IDs provided.' };
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from('products').delete().in('id', productIds);

    if (error) {
      console.error('Error in bulkDeleteProducts:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/products');
    revalidatePath('/admin/products');
    revalidatePath('/');

    return { success: true, count: productIds.length };
  } catch (err) {
    console.error('bulkDeleteProducts Exception:', err);
    return { success: false, error: 'Failed to delete products.' };
  }
}

export async function previewGoogleSheetUrl(sheetUrl: string): Promise<{
  success: boolean;
  validRows?: SheetProductRow[];
  results?: ParsedRowResult[];
  invalidCount?: number;
  error?: string;
}> {
  try {
    if (!sheetUrl || !sheetUrl.trim()) {
      return { success: false, error: 'Google Sheet URL is required.' };
    }

    const parsedSheet = parseGoogleSheetUrl(sheetUrl.trim());
    if (!parsedSheet) {
      return {
        success: false,
        error: 'Invalid Google Sheet URL. Format must be: https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit#gid={GID}',
      };
    }

    const response = await fetch(parsedSheet.csvExportUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      redirect: 'follow',
      cache: 'no-store',
    });

    if (!response.ok || response.url.includes('accounts.google.com')) {
      return {
        success: false,
        error: 'Google Sheet is not public. Please open your Google Sheet, click Share, and set access to "Anyone with the link can view".',
      };
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      return {
        success: false,
        error: 'Google Sheet is not public or requires login. Set sheet permissions to "Anyone with link can view".',
      };
    }

    const csvText = await response.text();
    if (!csvText || csvText.trim().length === 0) {
      return { success: false, error: 'Google Sheet returned an empty CSV dataset.' };
    }

    const buffer = Buffer.from(csvText, 'utf-8');
    const { validRows, results, invalidCount } = await parseExcelBuffer(buffer, true);

    return {
      success: true,
      validRows,
      results,
      invalidCount,
    };
  } catch (err: any) {
    console.error('previewGoogleSheetUrl Exception:', err);
    return {
      success: false,
      error: err.message || 'Failed to fetch Google Sheet preview.',
    };
  }
}

export async function importFromGoogleSheetUrl(sheetUrl: string): Promise<{
  success: boolean;
  count?: number;
  invalidCount?: number;
  parsedRows?: ParsedRowResult[];
  error?: string;
}> {
  try {
    if (!sheetUrl || !sheetUrl.trim()) {
      return { success: false, error: 'Google Sheet URL is required.' };
    }

    const parsedSheet = parseGoogleSheetUrl(sheetUrl.trim());
    if (!parsedSheet) {
      return {
        success: false,
        error: 'Invalid Google Sheet URL. Format must be: https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit#gid={GID}',
      };
    }

    const response = await fetch(parsedSheet.csvExportUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      redirect: 'follow',
      cache: 'no-store',
    });

    if (!response.ok || response.url.includes('accounts.google.com')) {
      return {
        success: false,
        error: 'Google Sheet is not public. Please open your Google Sheet, click Share, and set access to "Anyone with the link can view".',
      };
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      return {
        success: false,
        error: 'Google Sheet is not public or requires login. Set sheet permissions to "Anyone with link can view".',
      };
    }

    const csvText = await response.text();
    if (!csvText || csvText.trim().length === 0) {
      return { success: false, error: 'Google Sheet returned an empty CSV dataset.' };
    }

    const buffer = Buffer.from(csvText, 'utf-8');
    const { validRows, results, invalidCount } = await parseExcelBuffer(buffer, true);

    if (validRows.length === 0) {
      return {
        success: false,
        invalidCount,
        parsedRows: results,
        error: 'No valid product rows were found in the Google Sheet.',
      };
    }

    const bulkRes = await bulkUpsertProducts(validRows);

    if (bulkRes.success) {
      revalidatePath('/products');
      revalidatePath('/admin/products');
      revalidatePath('/');

      return {
        success: true,
        count: bulkRes.insertedCount || validRows.length,
        invalidCount,
        parsedRows: results,
      };
    } else {
      return {
        success: false,
        error: bulkRes.error || 'Failed to upsert products from Google Sheet.',
      };
    }
  } catch (err: any) {
    console.error('importFromGoogleSheetUrl Exception:', err);
    return {
      success: false,
      error: err.message || 'Failed to fetch or parse Google Sheet.',
    };
  }
}


