import { createAdminClient } from '@/lib/supabase/admin';
import { ProductSortSelect } from '@/components/products/product-sort-select';
import { ProductPriceFilter } from '@/components/products/product-price-filter';
import { StorefrontCatalogWrapper } from '@/components/products/storefront-catalog-wrapper';
import { Product, Category } from '@/types/product';
import Link from 'next/link';
import { Search, Sparkles, Filter, RefreshCw } from 'lucide-react';

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

    // 2. Build product query
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
      query = query.or(`name.ilike.%${q}%,tags.ilike.%${q}%,admin_name.ilike.%${q}%`);
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
    <div className="pb-20 space-y-8">
      {/* PLP Cultural Overview Banner */}
      <div className="bg-sandstone border-b border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brass/15 text-terracotta rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-terracotta" />
            <span>100% Authentic Pakistani Craft Lineage</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal">
            The Artisanal Heritage Catalog
          </h1>
          <p className="text-sm text-muted max-w-2xl mx-auto leading-relaxed">
            Explore authentic hand-thrown Multani ceramic vessels, Swati walnut carvings, hand-turned onyx chessboards, and Rawalpindi truck art tea kettles.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Pill Navigation Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none border-b border-border">
          <Link
            href="/products"
            className={`px-4 py-2 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
              !selectedCategorySlug
                ? 'bg-lapis text-parchment shadow-craft-sm'
                : 'bg-sandstone text-charcoal/80 hover:bg-chiseled border border-border'
            }`}
          >
            All Collections ({totalCount})
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`}
              className={`px-4 py-2 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                selectedCategorySlug === cat.slug
                  ? 'bg-lapis text-parchment shadow-craft-sm'
                  : 'bg-sandstone text-charcoal/80 hover:bg-chiseled border border-border'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Price Range Filter & Presets */}
        <div className="py-4 border-b border-border">
          <ProductPriceFilter
            currentMinPrice={resolvedParams.minPrice}
            currentMaxPrice={resolvedParams.maxPrice}
          />
        </div>

        {/* Filter Controls & Search Bar */}
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-border">
          {/* Active Search & Filter Count Indicator */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <form action="/products" method="GET" className="flex items-center flex-1 md:w-80">
              {selectedCategorySlug && (
                <input type="hidden" name="category" value={selectedCategorySlug} />
              )}
              {resolvedParams.minPrice && (
                <input type="hidden" name="minPrice" value={resolvedParams.minPrice} />
              )}
              {resolvedParams.maxPrice && (
                <input type="hidden" name="maxPrice" value={resolvedParams.maxPrice} />
              )}
              <input
                type="text"
                name="search"
                defaultValue={searchQuery}
                placeholder="Search Multani, Swati, Marble..."
                className="w-full px-3 py-2 text-xs bg-sandstone border border-border rounded-l-md focus:outline-none focus:ring-1 focus:ring-brass text-charcoal"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-lapis text-parchment text-xs font-medium rounded-r-md hover:bg-lapis/90 transition-colors flex items-center gap-1"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            {(searchQuery || selectedCategorySlug || inStockOnly || resolvedParams.minPrice || resolvedParams.maxPrice) && (
              <Link
                href="/products"
                className="text-xs text-terracotta hover:underline font-medium flex items-center gap-1 shrink-0"
              >
                <RefreshCw className="w-3 h-3" /> Clear Filters
              </Link>
            )}
          </div>

          {/* Sort & Availability Filter */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end text-xs">
            <Link
              href={`/products?${new URLSearchParams({
                ...(selectedCategorySlug && { category: selectedCategorySlug }),
                ...(searchQuery && { search: searchQuery }),
                inStock: inStockOnly ? 'false' : 'true',
                sort: currentSort,
              }).toString()}`}
              className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-colors ${
                inStockOnly
                  ? 'bg-emerald-950 text-emerald-200 border-emerald-500/40'
                  : 'bg-sandstone text-charcoal border-border hover:bg-chiseled'
              }`}
            >
              {inStockOnly ? '✓ In Stock Only' : 'Show In-Stock Only'}
            </Link>

            <ProductSortSelect
              currentSort={currentSort}
              selectedCategorySlug={selectedCategorySlug}
              searchQuery={searchQuery}
              inStockOnly={inStockOnly}
            />
          </div>
        </div>

        {/* Responsive Catalog Grid with Mobile Density Toggle & Pagination */}
        {products.length === 0 ? (
          <div className="py-20 text-center space-y-4">
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
