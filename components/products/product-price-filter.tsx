'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Filter, DollarSign, Check } from 'lucide-react';

interface ProductPriceFilterProps {
  currentMinPrice?: string;
  currentMaxPrice?: string;
}

export function ProductPriceFilter({
  currentMinPrice = '',
  currentMaxPrice = '',
}: ProductPriceFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [minPrice, setMinPrice] = useState(currentMinPrice);
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice);

  useEffect(() => {
    setMinPrice(currentMinPrice);
    setMaxPrice(currentMaxPrice);
  }, [currentMinPrice, currentMaxPrice]);

  const applyPriceFilter = (min: string, max: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (min && min.trim()) {
      params.set('minPrice', min.trim());
    } else {
      params.delete('minPrice');
    }

    if (max && max.trim()) {
      params.set('maxPrice', max.trim());
    } else {
      params.delete('maxPrice');
    }

    params.set('page', '1'); // reset to page 1 on filter update
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyPriceFilter(minPrice, maxPrice);
  };

  const isPresetActive = (min: string, max: string) => {
    return (currentMinPrice || '') === min && (currentMaxPrice || '') === max;
  };

  return (
    <div className="bg-sandstone p-4 rounded-xl border border-border space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-2.5">
        <h4 className="font-serif font-bold text-charcoal text-xs uppercase tracking-wider flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-lapis" /> Price Range (PKR)
        </h4>
        {(currentMinPrice || currentMaxPrice) && (
          <button
            type="button"
            onClick={() => applyPriceFilter('', '')}
            className="text-[11px] text-terracotta hover:underline font-semibold cursor-pointer"
          >
            Clear Price
          </button>
        )}
      </div>

      {/* Quick Preset Pills */}
      <div className="flex flex-wrap gap-1.5 text-xs">
        <button
          type="button"
          onClick={() => applyPriceFilter('', '')}
          className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
            isPresetActive('', '')
              ? 'bg-lapis text-parchment shadow-xs'
              : 'bg-parchment text-charcoal border border-border hover:border-brass'
          }`}
        >
          All Prices
        </button>

        <button
          type="button"
          onClick={() => applyPriceFilter('0', '1000')}
          className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
            isPresetActive('0', '1000')
              ? 'bg-lapis text-parchment shadow-xs'
              : 'bg-parchment text-charcoal border border-border hover:border-brass'
          }`}
        >
          Under Rs. 1,000
        </button>

        <button
          type="button"
          onClick={() => applyPriceFilter('1000', '3000')}
          className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
            isPresetActive('1000', '3000')
              ? 'bg-lapis text-parchment shadow-xs'
              : 'bg-parchment text-charcoal border border-border hover:border-brass'
          }`}
        >
          Rs. 1,000 - 3,000
        </button>

        <button
          type="button"
          onClick={() => applyPriceFilter('3000', '')}
          className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
            isPresetActive('3000', '')
              ? 'bg-lapis text-parchment shadow-xs'
              : 'bg-parchment text-charcoal border border-border hover:border-brass'
          }`}
        >
          Rs. 3,000+
        </button>
      </div>

      {/* Min & Max Inputs Form */}
      <form onSubmit={handleCustomSubmit} className="flex items-center gap-2 pt-1">
        <div className="flex-1 min-w-0">
          <label className="text-[10px] font-semibold text-muted block mb-0.5">Min PKR</label>
          <input
            type="number"
            min={0}
            placeholder="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs bg-parchment border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-brass text-charcoal font-mono"
          />
        </div>

        <span className="text-muted text-xs pt-4">-</span>

        <div className="flex-1 min-w-0">
          <label className="text-[10px] font-semibold text-muted block mb-0.5">Max PKR</label>
          <input
            type="number"
            min={0}
            placeholder="50000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs bg-parchment border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-brass text-charcoal font-mono"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="px-3.5 py-1.5 bg-lapis hover:bg-lapis/90 text-parchment text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
          >
            Apply
          </button>
        </div>
      </form>
    </div>
  );
}
