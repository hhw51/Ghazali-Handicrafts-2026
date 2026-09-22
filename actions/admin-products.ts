'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { SheetProductRow, slugify } from '@/lib/validations/product';
import { revalidatePath } from 'next/cache';

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
    const productsToUpsert = rows.map((row) => {
      const prodSlug = slugify(row.name);
      const categoryId = categoryMap.get(row.category.trim().toLowerCase()) || null;

      return {
        name: row.name,
        slug: prodSlug,
        short_description: row['short description (underneath product picture)'] || null,
        long_description: row['long description'] || null,
        price: row.price,
        size: row.size || null,
        in_stock: row.stock,
        images: row.images && row.images.length > 0 ? row.images : ['/images/hero/craft-hero.png'],
        colors: row.colors || null,
        category_id: categoryId,
        weight: row.weight || 0,
        tags: row.tags || [],
      };
    });

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

    return { success: true };
  } catch (err) {
    console.error('deleteProduct Exception:', err);
    return { success: false, error: 'Failed to delete product.' };
  }
}
