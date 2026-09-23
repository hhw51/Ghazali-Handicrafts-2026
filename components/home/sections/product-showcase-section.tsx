'use client';

import Link from 'next/link';
import { Product } from '@/types/product';
import { ProductCard } from '@/components/products/product-card';
import { ArrowRight } from 'lucide-react';

export interface ProductShowcaseConfig {
  headline?: string;
  viewAllUrl?: string;
  filterMode?: 'featured' | 'category' | 'new_arrivals';
  categorySlug?: string;
  limit?: number;
}

interface ProductShowcaseSectionProps {
  config: ProductShowcaseConfig;
  allProducts: Product[];
}

export function ProductShowcaseSection({ config, allProducts }: ProductShowcaseSectionProps) {
  const headline = config.headline || 'Curated Masterpiece Showcase';
  const viewAllUrl = config.viewAllUrl || '/products';
  const filterMode = config.filterMode || 'featured';
  const limit = config.limit || 8;

  let displayProducts = [...allProducts];

  if (filterMode === 'featured') {
    const featured = allProducts.filter((p) => p.is_featured);
    if (featured.length > 0) displayProducts = featured;
  } else if (filterMode === 'category' && config.categorySlug) {
    const catProds = allProducts.filter((p) => p.category?.slug === config.categorySlug);
    if (catProds.length > 0) displayProducts = catProds;
  }

  // Fallback to top products if empty
  if (displayProducts.length === 0) {
    displayProducts = allProducts;
  }

  const finalItems = displayProducts.slice(0, limit);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-charcoal">{headline}</h2>
          <p className="text-xs text-muted mt-1 font-sans">
            Hand-selected Pakistani craft creations available for instant nationwide delivery.
          </p>
        </div>
        <Link
          href={viewAllUrl}
          className="text-xs font-bold text-lapis hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
        >
          View All Crafts ({allProducts.length}) <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {finalItems.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
