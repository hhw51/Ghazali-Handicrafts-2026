import Image from 'next/image';
import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { Product, Category } from '@/types/product';
import { StockToggle } from '@/components/admin/stock-toggle';
import { Package, Plus, FileSpreadsheet, Search } from 'lucide-react';

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
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal">
            Product Catalog & Stock Control
          </h1>
          <p className="text-xs text-muted mt-1">
            Real-time stock status updates & pricing override panel ({products.length} products listed)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/import"
            className="px-4 py-2 bg-sandstone hover:bg-chiseled border border-border text-charcoal text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 shadow-craft-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-brass" /> Bulk Excel Import
          </Link>
        </div>
      </div>

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

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-muted">Filter Craft:</span>
          <select
            defaultValue={resolvedParams.category || ''}
            onChange={(e) => {
              const val = e.target.value;
              window.location.href = val ? `/admin/products?category=${val}` : '/admin/products';
            }}
            className="px-3 py-1.5 bg-parchment border border-border rounded-md text-xs text-charcoal font-medium"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Data Table */}
      <div className="bg-sandstone rounded-xl border border-border overflow-hidden shadow-craft-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-parchment border-b border-border font-serif font-bold text-charcoal">
              <tr>
                <th className="p-4">Thumbnail</th>
                <th className="p-4">Product Name & Slug</th>
                <th className="p-4">Craft Category</th>
                <th className="p-4">Price (PKR)</th>
                <th className="p-4">Weight</th>
                <th className="p-4">Stock Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted">
                    No products found in catalog. Use "Bulk Excel Import" to add products.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-parchment/60 transition-colors">
                    <td className="p-4">
                      <div className="w-12 h-14 relative bg-parchment rounded border border-border overflow-hidden shrink-0 aspect-[4/5]">
                        <Image
                          src={product.images[0] || '/images/hero/craft-hero.png'}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <Link
                        href={`/products/${product.slug}`}
                        target="_blank"
                        className="font-serif font-bold text-charcoal hover:text-lapis text-sm line-clamp-1"
                      >
                        {product.name}
                      </Link>
                      <span className="text-[11px] font-mono text-muted block mt-0.5">
                        /{product.slug}
                      </span>
                    </td>
                    <td className="p-4 font-medium">
                      <span className="px-2.5 py-1 bg-lapis/10 text-lapis rounded-full text-[11px]">
                        {product.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-terracotta text-sm">
                      Rs. {product.price.toLocaleString()}
                    </td>
                    <td className="p-4 font-mono text-muted">
                      {product.weight || 0} kg
                    </td>
                    <td className="p-4">
                      <StockToggle productId={product.id} initialInStock={product.in_stock} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
