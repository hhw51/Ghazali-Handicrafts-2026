'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  product_count: number;
}

// 1. Fetch all categories with product counts (for admin)
export async function getAdminCategories(): Promise<CategoryWithCount[]> {
  const supabase = createAdminClient();

  const { data: categories, error } = await supabase
    .from('categories')
    .select(`
      id,
      name,
      slug,
      created_at,
      products(id, is_active)
    `)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return (categories || []).map((cat: any) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    created_at: cat.created_at,
    product_count: (cat.products || []).filter((p: any) => p.is_active).length,
  }));
}

// 2. Fetch only non-empty categories (for storefront navbar & filters)
export async function getStorefrontCategories(): Promise<{ id: string; name: string; slug: string; count: number }[]> {
  const supabase = createAdminClient();

  const { data: categories, error } = await supabase
    .from('categories')
    .select(`
      id,
      name,
      slug,
      products(id, is_active)
    `)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching storefront categories:', error);
    return [];
  }

  return (categories || [])
    .map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      count: (cat.products || []).filter((p: any) => p.is_active).length,
    }))
    .filter((cat: any) => cat.count > 0); // Hide categories with 0 active products
}

// 3. Create or Update Category
export async function upsertCategory(formData: { id?: string; name: string; slug: string }) {
  const supabase = createAdminClient();

  // Clean slug
  const cleanSlug = formData.slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const payload: any = {
    name: formData.name.trim(),
    slug: cleanSlug,
  };

  if (formData.id) {
    payload.id = formData.id;
  }

  const { error } = await supabase.from('categories').upsert(payload);

  if (error) {
    console.error('Error saving category:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/categories');
  revalidatePath('/products');
  revalidatePath('/');
  return { success: true };
}

// 4. Delete Category (Prevent deletion if products are assigned)
export async function deleteCategory(categoryId: string) {
  const supabase = createAdminClient();

  // Check if any products are using this category
  const { count, error: countErr } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('category_id', categoryId);

  if (count && count > 0) {
    return {
      success: false,
      error: `Cannot delete category: ${count} product(s) are currently assigned to it. Reassign or delete those products first.`,
    };
  }

  const { error } = await supabase.from('categories').delete().eq('id', categoryId);

  if (error) {
    console.error('Error deleting category:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/categories');
  revalidatePath('/products');
  revalidatePath('/');
  return { success: true };
}
