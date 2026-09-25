'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { SlidersHorizontal, Columns, Grid2X2, RefreshCw, X } from 'lucide-react';
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
  weightRange?: string;
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
  weightRange,
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
  if (weightRange) activeFilterCount++;

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', val);
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const removeFilterParam = (key: string | string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (Array.isArray(key)) {
      key.forEach((k) => params.delete(k));
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClearAll = () => {
    const params = new URLSearchParams();
    if (selectedCategorySlug) params.set('category', selectedCategorySlug);
    router.push(`${pathname}?${params.toString()}`);
  };

  // Helper text for price summary
  const getPriceSummary = () => {
    if (minPrice && maxPrice) return `Rs. ${minPrice}–${maxPrice}`;
    if (minPrice && !maxPrice) return `Rs. ${minPrice}+`;
    if (!minPrice && maxPrice) return `Under Rs. ${maxPrice}`;
    return null;
  };

  // Helper text for weight summary
  const getWeightSummary = () => {
    if (weightRange === '100-250') return '100g–250g';
    if (weightRange === '300-500') return '300g–500g';
    if (weightRange === '550-plus') return '550g+';
    return null;
  };

  const priceSummary = getPriceSummary();
  const weightSummary = getWeightSummary();

  return (
    <div className="space-y-4">
      {/* 1. Horizontal Category Scroll Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-border/60">
        <Link
          href={`/products${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}`}
          className={`px-4 py-2 text-xs font-medium rounded-full whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
            !selectedCategorySlug
              ? 'bg-[#00405C] text-white shadow-craft-sm font-semibold'
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
                ? 'bg-[#00405C] text-white shadow-craft-sm font-semibold'
                : 'bg-sandstone text-charcoal/80 hover:bg-chiseled border border-border'
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* 2. Tightened Toolbar Container (Desktop & Mobile) */}
      <div className="flex items-center justify-between py-3 px-4 bg-sandstone/60 border border-border rounded-xl">
        {/* Left Action Group: Filter Button & Summary Pills */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-parchment hover:bg-sandstone border border-border rounded-lg text-xs font-semibold text-charcoal shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-lapis" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#00405C] text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Active Filter Summary Pills */}
          <div className="hidden sm:flex items-center gap-2 text-xs">
            {priceSummary && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-parchment border border-border rounded-lg text-charcoal text-[11px] font-medium shadow-2xs">
                <span>Price: {priceSummary}</span>
                <button
                  type="button"
                  onClick={() => removeFilterParam(['minPrice', 'maxPrice'])}
                  className="hover:text-terracotta cursor-pointer"
                  title="Remove price filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {weightSummary && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-parchment border border-border rounded-lg text-charcoal text-[11px] font-medium shadow-2xs">
                <span>Weight: {weightSummary}</span>
                <button
                  type="button"
                  onClick={() => removeFilterParam('weightRange')}
                  className="hover:text-terracotta cursor-pointer"
                  title="Remove weight filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {inStockOnly && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950 text-emerald-200 border border-emerald-500/40 rounded-lg text-[11px] font-medium shadow-2xs">
                <span>In-Stock Only</span>
                <button
                  type="button"
                  onClick={() => removeFilterParam('inStock')}
                  className="hover:text-white cursor-pointer"
                  title="Remove stock filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brass/15 text-terracotta border border-brass/30 rounded-lg text-[11px] font-medium shadow-2xs">
                <span>"{searchQuery}"</span>
                <button
                  type="button"
                  onClick={() => removeFilterParam('search')}
                  className="hover:text-terracotta cursor-pointer"
                  title="Clear search query"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {(activeFilterCount > 0 || searchQuery) && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-terracotta hover:underline text-[11px] font-semibold ml-1 cursor-pointer flex items-center gap-0.5"
              >
                <RefreshCw className="w-2.5 h-2.5" /> Clear All
              </button>
            )}
          </div>
        </div>

        {/* Right Controls Group: Sort & Density */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted font-medium hidden sm:inline">Sort:</span>
            <select
              value={currentSort}
              onChange={handleSortChange}
              className="px-3 py-2 bg-parchment border border-border rounded-lg text-xs font-semibold text-charcoal cursor-pointer focus:outline-none"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {/* View Density (Phone/Tablet) */}
          {onDensityChange && (
            <div className="flex sm:hidden items-center border border-border rounded-lg overflow-hidden bg-parchment p-0.5 shrink-0">
              <button
                type="button"
                onClick={() => onDensityChange('1')}
                title="1 Column"
                className={`p-1.5 transition-colors cursor-pointer ${
                  mobileDensity === '1' ? 'bg-[#00405C] text-white' : 'text-muted'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDensityChange('2')}
                title="2 Columns"
                className={`p-1.5 transition-colors cursor-pointer ${
                  mobileDensity === '2' ? 'bg-[#00405C] text-white' : 'text-muted'
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
