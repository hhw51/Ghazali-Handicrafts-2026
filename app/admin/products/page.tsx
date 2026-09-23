import { createAdminClient } from '@/lib/supabase/admin';
import { Product, Category } from '@/types/product';
import { AdminProductsHeader } from '@/components/admin/admin-products-header';
import { AdminProductsTable } from '@/components/admin/admin-products-table';
import { AdminCatalogToolbar } from '@/components/admin/admin-catalog-toolbar';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: string;
    page?: string;
    limit?: string;
  }>;
}

async function getAdminProducts(
  search?: string,
  categorySlug?: string,
  sortBy: string = 'newest',
  page: number = 1,
  limit: number = 25
) {
  try {
    const supabase = createAdminClient();
    let query = supabase.from('products').select('*, category:categories(*)', { count: 'exact' });

    if (categorySlug) {
      const { data: cat } = await supabase.from('categories').select('id').eq('slug', categorySlug).single();
      if (cat) query = query.eq('category_id', cat.id);
    }

    if (search && search.trim()) {
      const q = search.trim();
      query = query.or(`name.ilike.%${q}%,slug.ilike.%${q}%`);
    }

    // Sorting
    if (sortBy === 'oldest') {
      query = query.order('created_at', { ascending: true });
    } else if (sortBy === 'price-asc') {
      query = query.order('price', { ascending: true });
    } else if (sortBy === 'price-desc') {
      query = query.order('price', { ascending: false });
    } else if (sortBy === 'stock') {
      query = query.order('in_stock', { ascending: false }).order('name', { ascending: true });
    } else {
      // Default: newest
      query = query.order('created_at', { ascending: false });
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: products, count } = await query;
    const { data: categories } = await supabase.from('categories').select('*').order('name');

    return {
      products: (products as Product[]) || [],
      categories: (categories as Category[]) || [],
      totalCount: count || 0,
    };
  } catch (err) {
    console.error('Error fetching admin products:', err);
    return { products: [], categories: [], totalCount: 0 };
  }
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || '1', 10) || 1;
  const limit = parseInt(resolvedParams.limit || '25', 10) || 25;
  const sortBy = resolvedParams.sort || 'newest';

  const { products, categories, totalCount } = await getAdminProducts(
    resolvedParams.search,
    resolvedParams.category,
    sortBy,
    page,
    limit
  );

  return (
    <div className="space-y-6 max-w-7xl">
      <AdminProductsHeader totalCount={totalCount} />

      {/* Advanced Filter, Search & Pagination Toolbar */}
      <AdminCatalogToolbar categories={categories} totalCount={totalCount} />

      {/* Products Data Table with Highlight Switch & Pagination */}
      <AdminProductsTable
        products={products}
        totalCount={totalCount}
        currentPage={page}
        pageSize={limit}
      />
    </div>
  );
}
