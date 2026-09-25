import { createAdminClient } from '@/lib/supabase/admin';
import { DynamicHomepageRenderer } from '@/components/cms/dynamic-homepage-renderer';
import { Product, Category } from '@/types/product';
import { HomepageSectionRecord } from '@/actions/admin-cms';

export const dynamic = 'force-dynamic';

async function getHomepageData() {
  try {
    const supabase = createAdminClient();

    const [sectionsRes, productsRes, categoriesRes] = await Promise.all([
      supabase
        .from('homepage_sections')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true }),
      supabase
        .from('products')
        .select('*, category:categories(*)')
        .order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
    ]);

    const sectionsList = (sectionsRes.data as HomepageSectionRecord[]) || [];
    
    // Map by section_type for O(1) lookup
    const sectionsMap = sectionsList.reduce((acc: Record<string, any>, sec) => {
      acc[sec.section_type] = sec.settings || sec.config || {};
      return acc;
    }, {});

    return {
      sectionsList,
      sectionsMap,
      allProducts: (productsRes.data as Product[]) || [],
      categories: (categoriesRes.data as Category[]) || [],
    };
  } catch (err) {
    console.error('Error fetching homepage data:', err);
    return { sectionsList: [], sectionsMap: {}, allProducts: [], categories: [] };
  }
}

export default async function HomePage() {
  const { sectionsList, sectionsMap, allProducts, categories } = await getHomepageData();

  return (
    <DynamicHomepageRenderer
      sectionsList={sectionsList}
      sectionsMap={sectionsMap}
      allProducts={allProducts}
      categories={categories}
    />
  );
}
