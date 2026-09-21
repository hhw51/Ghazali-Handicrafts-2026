'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface ProductSortSelectProps {
  currentSort: string;
  selectedCategorySlug?: string;
  searchQuery?: string;
  inStockOnly?: boolean;
}

export function ProductSortSelect({
  currentSort,
  selectedCategorySlug,
  searchQuery,
  inStockOnly,
}: ProductSortSelectProps) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const newParams = new URLSearchParams();

    if (selectedCategorySlug) newParams.set('category', selectedCategorySlug);
    if (searchQuery) newParams.set('search', searchQuery);
    if (inStockOnly) newParams.set('inStock', 'true');
    newParams.set('sort', val);

    router.push(`/products?${newParams.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-muted">Sort:</span>
      <select
        value={currentSort}
        onChange={handleChange}
        className="px-3 py-1.5 bg-sandstone border border-border rounded-md text-xs text-charcoal font-medium focus:outline-none focus:ring-1 focus:ring-brass cursor-pointer"
      >
        <option value="newest">Newest Arrivals</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </div>
  );
}
