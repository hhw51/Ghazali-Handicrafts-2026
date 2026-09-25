'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { SlidersHorizontal, ArrowUpDown, Columns, Grid2X2, RefreshCw, Check } from 'lucide-react';
import { Category } from '@/types/product';
import { CatalogFilterDrawer } from '@/components/products/catalog-filter-drawer';

interface CatalogToolbarProps {
  categories: Category[];
  selectedCategorySlug: string;
  totalCount: number;
  currentSort: string;
  inStockOnly: boolean;
  minPrice?: string;
  maxPrice?: string;
  searchQuery?: string;
  mobileDensity?: '1' | '2';
  onDensityChange?: (density: '1' | '2') => void;
}

export function CatalogToolbar({
  categories,
  selectedCategorySlug,
  totalCount,
  currentSort,
  inStockOnly,
  minPrice,
  maxPrice,
  searchQuery,
  mobileDensity = '2',
  onDensityChange,
}: CatalogToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [drawerOpen, setDrawerOpen] = useState(false);

  // Calculate active filter count
  let activeFilterCount = 0;
  if (minPrice) activeFilterCount++;
  if (maxPrice) activeFilterCount++;
  if (inStockOnly) activeFilterCount++;

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', val);
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClearFilters = () => {
    const params = new URLSearchParams();
    if (selectedCategorySlug) params.set('category', selectedCategorySlug);
    if (searchQuery) params.set('search', searchQuery);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      {/* 1. Horizontal Category Scroll Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-border/60">
        <Link
          href={`/products${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}`}
          className={`px-4 py-2 text-xs font-medium rounded-full whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
            !selectedCategorySlug
              ? 'bg-lapis text-parchment shadow-craft-sm font-semibold'
              : 'bg-sandstone text-charcoal/80 hover:bg-chiseled border border-border'
          }`}
        >
          All Collections ({totalCount})
        </Link>

        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`}
            className={`px-4 py-2 text-xs font-medium rounded-full whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
              selectedCategorySlug === cat.slug
                ? 'bg-lapis text-parchment shadow-craft-sm font-semibold'
                : 'bg-sandstone text-charcoal/80 hover:bg-chiseled border border-border'
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* 2. Compact Action Strip */}
      <div className="flex items-center justify-between gap-3 p-3 bg-sandstone rounded-xl border border-border">
        {/* Left Side: Filter Button & Active Indicators */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
              activeFilterCount > 0
                ? 'bg-lapis text-parchment border-lapis shadow-xs'
                : 'bg-parchment text-charcoal border-border hover:bg-chiseled'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-brass" />
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-brass text-charcoal text-[10px] font-mono flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Search Query indicator if active */}
          {searchQuery && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-brass/15 text-terracotta rounded-lg text-[11px] font-semibold">
              <span>Query: "{searchQuery}"</span>
            </div>
          )}

          {/* Reset Filters Link */}
          {(activeFilterCount > 0 || searchQuery) && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-[11px] text-terracotta hover:underline font-semibold flex items-center gap-1 cursor-pointer ml-1"
            >
              <RefreshCw className="w-3 h-3" /> Clear
            </button>
          )}
        </div>

        {/* Right Side: Sort & Density Toggle */}
        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-muted hidden sm:inline">Sort:</span>
            <select
              value={currentSort}
              onChange={handleSortChange}
              className="px-2.5 py-1.5 bg-parchment border border-border rounded-lg text-xs text-charcoal font-semibold focus:outline-none focus:ring-1 focus:ring-brass cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {/* Mobile Density Toggle (Visible on mobile screens) */}
          {onDensityChange && (
            <div className="flex sm:hidden items-center gap-0.5 bg-parchment p-1 rounded-lg border border-border shrink-0">
              <button
                type="button"
                onClick={() => onDensityChange('1')}
                title="1 Column"
                className={`p-1 rounded font-bold text-[10px] transition-all cursor-pointer ${
                  mobileDensity === '1'
                    ? 'bg-lapis text-parchment shadow-xs'
                    : 'text-muted hover:text-charcoal'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDensityChange('2')}
                title="2 Columns"
                className={`p-1 rounded font-bold text-[10px] transition-all cursor-pointer ${
                  mobileDensity === '2'
                    ? 'bg-lapis text-parchment shadow-xs'
                    : 'text-muted hover:text-charcoal'
                }`}
              >
                <Grid2X2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Slide-Up Bottom Sheet Filter Drawer */}
      <CatalogFilterDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeFilterCount={activeFilterCount}
      />
    </div>
  );
}
