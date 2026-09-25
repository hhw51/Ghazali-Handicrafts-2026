import { createAdminClient } from '@/lib/supabase/admin';
import { getHomepageSections } from '@/actions/admin-cms';
import { DynamicHomepageRenderer } from '@/components/cms/dynamic-homepage-renderer';
import { Product, Category } from '@/types/product';

export const dynamic = 'force-dynamic';

async function getHomepageData() {
  try {
    const supabase = createAdminClient();

    const [sectionsRes, productsRes, categoriesRes] = await Promise.all([
      getHomepageSections(),
      supabase
        .from('products')
        .select('*, category:categories(*)')
        .order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
    ]);

    return {
      sections: sectionsRes || [],
      allProducts: (productsRes.data as Product[]) || [],
      categories: (categoriesRes.data as Category[]) || [],
    };
  } catch (err) {
    console.error('Error fetching homepage data:', err);
    return { sections: [], allProducts: [], categories: [] };
  }
}

export default async function HomePage() {
  const { sections, allProducts, categories } = await getHomepageData();

  return (
    <DynamicHomepageRenderer
      sections={sections}
      allProducts={allProducts}
      categories={categories}
    />
  );
}
