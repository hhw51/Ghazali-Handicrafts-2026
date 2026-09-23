'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Product } from '@/types/product';
import { ProductCard } from '@/components/products/product-card';
import { LayoutGrid, Grid2X2, Columns, ChevronLeft, ChevronRight } from 'lucide-react';

interface StorefrontCatalogWrapperProps {
  products: Product[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

type MobileGridDensity = '1' | '2' | '4';

export function StorefrontCatalogWrapper({
  products,
  totalCount,
  currentPage,
  pageSize,
}: StorefrontCatalogWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [mobileDensity, setMobileDensity] = useState<MobileGridDensity>('2');

  // Load density preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ghazali_mobile_grid_density');
      if (saved === '1' || saved === '2' || saved === '4') {
        setMobileDensity(saved);
      }
    } catch {
      // ignore SSR/localStorage access error
    }
  }, []);

  const handleDensityChange = (density: MobileGridDensity) => {
    setMobileDensity(density);
    try {
      localStorage.setItem('ghazali_mobile_grid_density', density);
    } catch {
      // ignore
    }
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageSizeChange = (newSize: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('limit', newSize);
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  // Responsive Grid Class mapping for mobile vs desktop
  let mobileGridClass = 'grid-cols-2 gap-2.5';
  if (mobileDensity === '1') mobileGridClass = 'grid-cols-1 gap-4';
  if (mobileDensity === '4') mobileGridClass = 'grid-cols-4 gap-1.5 text-[10px]';

  return (
    <div className="space-y-6">
      {/* Mobile Grid Density Toggle Strip (Visible on phones < 640px only) */}
      <div className="flex sm:hidden items-center justify-between p-2.5 bg-sandstone rounded-xl border border-border text-xs">
        <span className="font-serif font-bold text-charcoal text-[11px]">View Density:</span>
        <div className="flex items-center gap-1 bg-parchment p-1 rounded-lg border border-border">
          <button
            type="button"
            onClick={() => handleDensityChange('1')}
            className={`px-2.5 py-1 rounded font-bold text-[10px] transition-all flex items-center gap-1 ${
              mobileDensity === '1'
                ? 'bg-lapis text-parchment shadow-xs'
                : 'text-muted hover:text-charcoal'
            }`}
          >
            <Columns className="w-3 h-3" /> 1 Col
          </button>
          <button
            type="button"
            onClick={() => handleDensityChange('2')}
            className={`px-2.5 py-1 rounded font-bold text-[10px] transition-all flex items-center gap-1 ${
              mobileDensity === '2'
                ? 'bg-lapis text-parchment shadow-xs'
                : 'text-muted hover:text-charcoal'
            }`}
          >
            <Grid2X2 className="w-3 h-3" /> 2 Col
          </button>
          <button
            type="button"
            onClick={() => handleDensityChange('4')}
            className={`px-2.5 py-1 rounded font-bold text-[10px] transition-all flex items-center gap-1 ${
              mobileDensity === '4'
                ? 'bg-lapis text-parchment shadow-xs'
                : 'text-muted hover:text-charcoal'
            }`}
          >
            <LayoutGrid className="w-3 h-3" /> 4 Col
          </button>
        </div>
      </div>

      {/* Catalog Grid */}
      <div
        className={`grid ${mobileGridClass} sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6 py-4`}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Storefront Pagination Controls */}
      <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="text-muted font-sans">
            Showing <strong className="text-charcoal font-mono">{products.length}</strong> of{' '}
            <strong className="text-charcoal font-mono">{totalCount}</strong> products
          </span>

          <div className="flex items-center gap-1 bg-sandstone px-2.5 py-1 rounded-lg border border-border">
            <span className="text-muted text-[11px] font-mono">Per Page:</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(e.target.value)}
              className="bg-transparent font-mono font-bold text-charcoal focus:outline-none cursor-pointer"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-3 py-1.5 bg-sandstone border border-border rounded-lg text-charcoal font-semibold disabled:opacity-40 flex items-center gap-1 hover:border-brass transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>

            <span className="font-mono text-xs text-charcoal px-2 font-bold">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-3 py-1.5 bg-sandstone border border-border rounded-lg text-charcoal font-semibold disabled:opacity-40 flex items-center gap-1 hover:border-brass transition-colors cursor-pointer"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
