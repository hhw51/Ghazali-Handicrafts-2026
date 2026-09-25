import { createAdminClient } from '@/lib/supabase/admin';
import { CatalogToolbar } from '@/components/products/catalog-toolbar';
import { StorefrontCatalogWrapper } from '@/components/products/storefront-catalog-wrapper';
import { Product, Category } from '@/types/product';
import Link from 'next/link';
import { Sparkles, Filter } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    sort?: string;
    page?: string;
    limit?: string;
  }>;
}

async function getProductsAndCategories(params: {
  category?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: string;
  sort?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const supabase = createAdminClient();
    const page = params.page || 1;
    const limit = params.limit || 25;

    // 1. Fetch categories
    const { data: categories } = await supabase.from('categories').select('*').order('name');

    // 2. Build product query with tags & internal_name support
    let query = supabase
      .from('products')
      .select('*, category:categories(*)', { count: 'exact' });

    if (params.category) {
      const cat = categories?.find((c) => c.slug === params.category);
      if (cat) {
        query = query.eq('category_id', cat.id);
      }
    }

    if (params.search) {
      const q = params.search.trim();
      query = query.or(`name.ilike.%${q}%,tags.ilike.%${q}%,internal_name.ilike.%${q}%`);
    }

    if (params.inStock === 'true') {
      query = query.eq('in_stock', true);
    }

    if (params.minPrice) {
      const minP = parseFloat(params.minPrice);
      if (!isNaN(minP)) query = query.gte('price', minP);
    }

    if (params.maxPrice) {
      const maxP = parseFloat(params.maxPrice);
      if (!isNaN(maxP)) query = query.lte('price', maxP);
    }

    // Sorting
    if (params.sort === 'price-asc') {
      query = query.order('price', { ascending: true });
    } else if (params.sort === 'price-desc') {
      query = query.order('price', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Pagination Range
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: products, count, error } = await query;

    if (error) {
      console.error('Error fetching catalog:', error);
      return { products: [], categories: categories || [], totalCount: 0 };
    }

    return {
      products: (products as Product[]) || [],
      categories: (categories as Category[]) || [],
      totalCount: count || 0,
    };
  } catch (err) {
    console.error('Database connection error:', err);
    return { products: [], categories: [], totalCount: 0 };
  }
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || '1', 10) || 1;
  const limit = parseInt(resolvedParams.limit || '25', 10) || 25;

  const { products, categories, totalCount } = await getProductsAndCategories({
    ...resolvedParams,
    page,
    limit,
  });

  const selectedCategorySlug = resolvedParams.category || '';
  const searchQuery = resolvedParams.search || '';
  const currentSort = resolvedParams.sort || 'newest';
  const inStockOnly = resolvedParams.inStock === 'true';

  return (
    <div className="pb-20 space-y-6">
      {/* PLP Cultural Overview Header */}
      <div className="bg-sandstone border-b border-border py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brass/15 text-terracotta rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-terracotta" />
            <span>100% Authentic Pakistani Craft Lineage</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal">
            Artisanal Heritage Catalog
          </h1>
          <p className="text-xs sm:text-sm text-muted max-w-xl mx-auto leading-relaxed">
            Explore authentic hand-thrown Multani ceramic vessels, Swati walnut carvings, hand-turned onyx chessboards, and Rawalpindi truck art tea kettles.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Compact Modern Catalog Toolbar */}
        <CatalogToolbar
          categories={categories}
          selectedCategorySlug={selectedCategorySlug}
          totalCount={totalCount}
          currentSort={currentSort}
          inStockOnly={inStockOnly}
          minPrice={resolvedParams.minPrice}
          maxPrice={resolvedParams.maxPrice}
          searchQuery={searchQuery}
        />

        {/* Responsive Catalog Grid */}
        {products.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <div className="w-16 h-16 bg-sandstone rounded-full flex items-center justify-center mx-auto border border-border text-muted">
              <Filter className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-charcoal">No craft items found</h3>
            <p className="text-xs text-muted max-w-sm mx-auto">
              We couldn't find any products matching your search criteria. Try clearing filters or exploring other craft categories.
            </p>
            <Link
              href="/products"
              className="inline-block px-5 py-2.5 bg-lapis text-parchment text-xs font-medium rounded-md hover:bg-lapis/90 transition-colors"
            >
              Reset All Filters
            </Link>
          </div>
        ) : (
          <StorefrontCatalogWrapper
            products={products}
            totalCount={totalCount}
            currentPage={page}
            pageSize={limit}
          />
        )}
      </div>
    </div>
  );
}
