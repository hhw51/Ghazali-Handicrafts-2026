'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Category } from '@/types/product';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

interface AdminCatalogToolbarProps {
  categories: Category[];
  totalCount: number;
}

export function AdminCatalogToolbar({ categories, totalCount }: AdminCatalogToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [limit, setLimit] = useState(searchParams.get('limit') || '25');
  const [isPending, startTransition] = useTransition();

  // Debounced search update (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentSearch = searchParams.get('search') || '';
      if (searchQuery !== currentSearch) {
        updateUrlParams({
          search: searchQuery,
          category: selectedCategory,
          sort: sortBy,
          limit,
          page: '1',
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const updateUrlParams = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value.trim().length > 0) {
        params.set(key, value.trim());
      } else {
        params.delete(key);
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleCategoryChange = (catSlug: string) => {
    setSelectedCategory(catSlug);
    updateUrlParams({ category: catSlug, page: '1' });
  };

  const handleSortChange = (sortVal: string) => {
    setSortBy(sortVal);
    updateUrlParams({ sort: sortVal, page: '1' });
  };

  const handleLimitChange = (limitVal: string) => {
    setLimit(limitVal);
    updateUrlParams({ limit: limitVal, page: '1' });
  };

  return (
    <div className="p-4 bg-sandstone rounded-xl border border-border space-y-3 shadow-craft-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Instant Debounced Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by title..."
            className="w-full pl-9 pr-3 py-2 bg-parchment border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brass text-charcoal font-sans"
          />
          {isPending && (
            <span className="absolute right-3 top-2.5 text-[10px] font-mono text-lapis animate-pulse font-semibold">
              Syncing...
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Category Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-parchment px-3 py-1.5 rounded-lg border border-border">
            <Filter className="w-3.5 h-3.5 text-lapis shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="bg-transparent text-charcoal font-medium focus:outline-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-parchment px-3 py-1.5 rounded-lg border border-border">
            <ArrowUpDown className="w-3.5 h-3.5 text-terracotta shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-transparent text-charcoal font-medium focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="stock">Stock Availability</option>
            </select>
          </div>

          {/* Page Size Selector */}
          <div className="flex items-center gap-1.5 bg-parchment px-3 py-1.5 rounded-lg border border-border">
            <span className="text-muted font-mono text-[11px]">Rows:</span>
            <select
              value={limit}
              onChange={(e) => handleLimitChange(e.target.value)}
              className="bg-transparent text-charcoal font-bold font-mono focus:outline-none cursor-pointer"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
