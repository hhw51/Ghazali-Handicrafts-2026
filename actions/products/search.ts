'use server';

import { createAdminClient } from '@/lib/supabase/admin';

export interface SearchProductResult {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[] | string | null;
  tags?: string[] | string | null;
  size?: string | null;
  internal_name?: string | null;
}

export async function searchProducts(query: string): Promise<SearchProductResult[]> {
  if (!query || !query.trim()) {
    return [];
  }

  try {
    const supabase = createAdminClient();
    const q = query.trim();

    const { data, error } = await supabase
      .from('products')
      .select('id, name, slug, price, images, tags, size, internal_name')
      .or(`name.ilike.%${q}%,tags.ilike.%${q}%,internal_name.ilike.%${q}%`)
      .limit(8);

    if (error) {
      console.error('Error executing searchProducts query:', error);
      return [];
    }

    return (data as SearchProductResult[]) || [];
  } catch (err) {
    console.error('Exception in searchProducts action:', err);
    return [];
  }
}
