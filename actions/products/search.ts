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
  weight?: number | null;
  short_description?: string | null;
  long_description?: string | null;
  category?: { name: string; slug: string } | { name: string; slug: string }[] | null;
}

export async function searchProducts(searchTerm: string): Promise<SearchProductResult[]> {
  if (!searchTerm || !searchTerm.trim()) {
    return [];
  }

  try {
    const supabase = createAdminClient();
    const query = searchTerm.trim().toLowerCase();
    const pattern = `%${query}%`;

    // 1. Fetch matching categories first
    const { data: matchedCategories } = await supabase
      .from('categories')
      .select('id, name, slug')
      .or(`name.ilike.${pattern},slug.ilike.${pattern}`);

    const matchedCategoryIds = (matchedCategories || []).map((c) => c.id);

    // 2. Query products matching name, short_description, long_description, design, or category_id
    let productQuery = supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        price,
        images,
        tags,
        size,
        weight,
        short_description,
        long_description,
        category:categories(name, slug)
      `);

    if (matchedCategoryIds.length > 0) {
      productQuery = productQuery.or(
        `name.ilike.${pattern},short_description.ilike.${pattern},long_description.ilike.${pattern},design.ilike.${pattern},category_id.in.(${matchedCategoryIds.join(
          ','
        )})`
      );
    } else {
      productQuery = productQuery.or(
        `name.ilike.${pattern},short_description.ilike.${pattern},long_description.ilike.${pattern},design.ilike.${pattern}`
      );
    }

    const { data: products, error } = await productQuery.limit(20);

    if (error) {
      console.error('Error in searchProducts primary query:', error);
      // Fallback query
      const { data: fallbackData } = await supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          price,
          images,
          tags,
          size,
          weight,
          short_description,
          long_description,
          category:categories(name, slug)
        `)
        .ilike('name', pattern)
        .limit(10);
      return ((fallbackData as unknown) as SearchProductResult[]) || [];
    }

    let results = ((products as unknown) as SearchProductResult[]) || [];

    // In-memory filter fallback for tag arrays or category names if any were missed
    if (results.length < 10) {
      const { data: allProds } = await supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          price,
          images,
          tags,
          size,
          weight,
          short_description,
          long_description,
          category:categories(name, slug)
        `)
        .limit(60);

      if (allProds && allProds.length > 0) {
        const resultIds = new Set(results.map((r) => r.id));
        for (const prod of allProds) {
          if (resultIds.has(prod.id)) continue;

          const tagsStr = Array.isArray(prod.tags) ? prod.tags.join(' ').toLowerCase() : (prod.tags || '').toLowerCase();
          const catObj = (prod as any).category;
          const catName = Array.isArray(catObj) ? catObj[0]?.name?.toLowerCase() || '' : catObj?.name?.toLowerCase() || '';
          const prodName = prod.name.toLowerCase();
          const shortDesc = (prod.short_description || '').toLowerCase();

          if (
            tagsStr.includes(query) ||
            catName.includes(query) ||
            prodName.includes(query) ||
            shortDesc.includes(query)
          ) {
            results.push((prod as unknown) as SearchProductResult);
            resultIds.add(prod.id);
            if (results.length >= 10) break;
          }
        }
      }
    }

    return results.slice(0, 10);
  } catch (err) {
    console.error('Exception in searchProducts action:', err);
    return [];
  }
}
