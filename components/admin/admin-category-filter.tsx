'use client';

import { useRouter } from 'next/navigation';
import { Category } from '@/types/product';

interface AdminCategoryFilterProps {
  categories: Category[];
  selectedCategorySlug?: string;
}

export function AdminCategoryFilter({
  categories,
  selectedCategorySlug = '',
}: AdminCategoryFilterProps) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val) {
      router.push(`/admin/products?category=${val}`);
    } else {
      router.push('/admin/products');
    }
  };

  return (
    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
      <span className="text-muted">Filter Craft:</span>
      <select
        value={selectedCategorySlug}
        onChange={handleChange}
        className="px-3 py-1.5 bg-parchment border border-border rounded-md text-xs text-charcoal font-medium focus:outline-none focus:ring-1 focus:ring-brass cursor-pointer"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
}
