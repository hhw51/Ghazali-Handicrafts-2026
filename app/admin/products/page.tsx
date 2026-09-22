import { createAdminClient } from '@/lib/supabase/admin';
import { Product, Category } from '@/types/product';
import { AdminCategoryFilter } from '@/components/admin/admin-category-filter';
import { AdminProductsHeader } from '@/components/admin/admin-products-header';
import { AdminProductsTable } from '@/components/admin/admin-products-table';
import { Search } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
}

async function getAdminProducts(search?: string, categorySlug?: string) {
  try {
    const supabase = createAdminClient();
    let query = supabase.from('products').select('*, category:categories(*)').order('created_at', { ascending: false });

    if (categorySlug) {
      const { data: cat } = await supabase.from('categories').select('id').eq('slug', categorySlug).single();
      if (cat) query = query.eq('category_id', cat.id);
    }

    if (search) {
      const q = search.trim();
      query = query.or(`name.ilike.%${q}%,slug.ilike.%${q}%`);
    }

    const { data: products } = await query;
    const { data: categories } = await supabase.from('categories').select('*').order('name');

    return {
      products: (products as Product[]) || [],
      categories: (categories as Category[]) || [],
    };
  } catch (err) {
    console.error('Error fetching admin products:', err);
    return { products: [], categories: [] };
  }
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const { products, categories } = await getAdminProducts(resolvedParams.search, resolvedParams.category);

  return (
    <div className="space-y-8 max-w-7xl">
      <AdminProductsHeader totalCount={products.length} />

      {/* Filter Bar */}
      <div className="p-4 bg-sandstone rounded-xl border border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <form action="/admin/products" method="GET" className="flex items-center gap-2 w-full sm:w-80">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted" />
            <input
              type="text"
              name="search"
              defaultValue={resolvedParams.search || ''}
              placeholder="Search products by title..."
              className="w-full pl-9 pr-3 py-1.5 bg-parchment border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-brass text-charcoal"
            />
          </div>
        </form>

        <AdminCategoryFilter
          categories={categories}
          selectedCategorySlug={resolvedParams.category || ''}
        />
      </div>

      {/* Products Data Table with Row Actions & Bulk Toolbar */}
      <AdminProductsTable products={products} />
    </div>
  );
}

