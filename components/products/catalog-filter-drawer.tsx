'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { SlidersHorizontal, X, RotateCcw, Check, DollarSign, PackageCheck, Scale } from 'lucide-react';

interface CatalogFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeFilterCount: number;
}

export type WeightRangePreset = '100-250' | '300-500' | '550-plus' | '';

export function CatalogFilterDrawer({
  isOpen,
  onClose,
  activeFilterCount,
}: CatalogFilterDrawerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentInStock = searchParams.get('inStock') === 'true';
  const currentWeightRange = (searchParams.get('weightRange') as WeightRangePreset) || '';

  const [minPrice, setMinPrice] = useState(currentMinPrice);
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice);
  const [inStockOnly, setInStockOnly] = useState(currentInStock);
  const [weightRange, setWeightRange] = useState<WeightRangePreset>(currentWeightRange);

  useEffect(() => {
    setMinPrice(currentMinPrice);
    setMaxPrice(currentMaxPrice);
    setInStockOnly(currentInStock);
    setWeightRange(currentWeightRange);
  }, [currentMinPrice, currentMaxPrice, currentInStock, currentWeightRange, isOpen]);

  if (!isOpen) return null;

  const isPricePresetActive = (min: string, max: string) => {
    return minPrice === min && maxPrice === max;
  };

  const handleApplyPricePreset = (min: string, max: string) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const handleApplyWeightPreset = (preset: WeightRangePreset) => {
    setWeightRange(preset);
  };

  const handleApply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (minPrice && minPrice.trim()) {
      params.set('minPrice', minPrice.trim());
    } else {
      params.delete('minPrice');
    }

    if (maxPrice && maxPrice.trim()) {
      params.set('maxPrice', maxPrice.trim());
    } else {
      params.delete('maxPrice');
    }

    if (inStockOnly) {
      params.set('inStock', 'true');
    } else {
      params.delete('inStock');
    }

    if (weightRange) {
      params.set('weightRange', weightRange);
    } else {
      params.delete('weightRange');
    }

    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
    onClose();
  };

  const handleClearAll = () => {
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setWeightRange('');

    const params = new URLSearchParams(searchParams.toString());
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('inStock');
    params.delete('weightRange');
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Slide-Up Bottom Sheet / Centered Modal Container */}
      <div className="relative w-full max-w-lg bg-parchment rounded-t-2xl sm:rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col z-10 max-h-[90vh] animate-in slide-in-from-bottom duration-200">
        {/* Header Strip */}
        <div className="p-4 bg-sandstone border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-lapis" />
            <h3 className="font-serif font-bold text-charcoal text-sm uppercase tracking-wider">
              Catalog Filters
            </h3>
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 bg-[#00405C] text-white rounded-full text-[10px] font-mono font-bold">
                {activeFilterCount}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-muted hover:text-charcoal hover:bg-border/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Form Body */}
        <div className="p-5 space-y-6 overflow-y-auto">
          {/* 1. Price Range Section */}
          <div className="space-y-3">
            <label className="font-semibold text-charcoal text-xs flex items-center gap-1.5 uppercase tracking-wider">
              <DollarSign className="w-3.5 h-3.5 text-brass" /> Price Range (PKR)
            </label>

            {/* Presets */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleApplyPricePreset('', '')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-left flex items-center justify-between ${
                  isPricePresetActive('', '')
                    ? 'bg-lapis text-parchment border-lapis shadow-xs'
                    : 'bg-sandstone text-charcoal border-border hover:border-brass'
                }`}
              >
                <span>All Prices</span>
                {isPricePresetActive('', '') && <Check className="w-3.5 h-3.5 text-parchment" />}
              </button>

              <button
                type="button"
                onClick={() => handleApplyPricePreset('0', '1000')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-left flex items-center justify-between ${
                  isPricePresetActive('0', '1000')
                    ? 'bg-lapis text-parchment border-lapis shadow-xs'
                    : 'bg-sandstone text-charcoal border-border hover:border-brass'
                }`}
              >
                <span>Under Rs. 1,000</span>
                {isPricePresetActive('0', '1000') && <Check className="w-3.5 h-3.5 text-parchment" />}
              </button>

              <button
                type="button"
                onClick={() => handleApplyPricePreset('1000', '3000')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-left flex items-center justify-between ${
                  isPricePresetActive('1000', '3000')
                    ? 'bg-lapis text-parchment border-lapis shadow-xs'
                    : 'bg-sandstone text-charcoal border-border hover:border-brass'
                }`}
              >
                <span>Rs. 1,000 - 3,000</span>
                {isPricePresetActive('1000', '3000') && <Check className="w-3.5 h-3.5 text-parchment" />}
              </button>

              <button
                type="button"
                onClick={() => handleApplyPricePreset('3000', '')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-left flex items-center justify-between ${
                  isPricePresetActive('3000', '')
                    ? 'bg-lapis text-parchment border-lapis shadow-xs'
                    : 'bg-sandstone text-charcoal border-border hover:border-brass'
                }`}
              >
                <span>Rs. 3,000+</span>
                {isPricePresetActive('3000', '') && <Check className="w-3.5 h-3.5 text-parchment" />}
              </button>
            </div>

            {/* Min / Max Custom Inputs */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[11px] font-semibold text-muted block mb-1">Min Price (PKR)</label>
                <input
                  type="number"
                  min={0}
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-sandstone border border-border rounded-xl text-xs text-charcoal font-mono focus:outline-none focus:ring-1 focus:ring-brass"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted block mb-1">Max Price (PKR)</label>
                <input
                  type="number"
                  min={0}
                  placeholder="50000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-sandstone border border-border rounded-xl text-xs text-charcoal font-mono focus:outline-none focus:ring-1 focus:ring-brass"
                />
              </div>
            </div>
          </div>

          {/* 2. Weight Filter Presets (Discrete Ranges) */}
          <div className="pt-4 border-t border-border space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-charcoal text-xs flex items-center gap-1.5 uppercase tracking-wider">
                <Scale className="w-3.5 h-3.5 text-lapis" /> Craft Weight Presets
              </label>
              {weightRange && (
                <button
                  type="button"
                  onClick={() => setWeightRange('')}
                  className="text-[11px] text-terracotta hover:underline font-semibold cursor-pointer"
                >
                  Clear Weight
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleApplyWeightPreset('')}
                className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-left flex items-center justify-between ${
                  weightRange === ''
                    ? 'bg-lapis text-parchment border-lapis shadow-xs'
                    : 'bg-sandstone text-charcoal border-border hover:border-brass'
                }`}
              >
                <div>
                  <div className="font-bold">All Weights</div>
                  <div className="text-[10px] text-muted">Show all item weights</div>
                </div>
                {weightRange === '' && <Check className="w-3.5 h-3.5 text-parchment shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => handleApplyWeightPreset('100-250')}
                className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-left flex items-center justify-between ${
                  weightRange === '100-250'
                    ? 'bg-lapis text-parchment border-lapis shadow-xs'
                    : 'bg-sandstone text-charcoal border-border hover:border-brass'
                }`}
              >
                <div>
                  <div className="font-bold">100g – 250g</div>
                  <div className="text-[10px] text-muted">Lightweight crafts & ornaments</div>
                </div>
                {weightRange === '100-250' && <Check className="w-3.5 h-3.5 text-parchment shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => handleApplyWeightPreset('300-500')}
                className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-left flex items-center justify-between ${
                  weightRange === '300-500'
                    ? 'bg-lapis text-parchment border-lapis shadow-xs'
                    : 'bg-sandstone text-charcoal border-border hover:border-brass'
                }`}
              >
                <div>
                  <div className="font-bold">300g – 500g</div>
                  <div className="text-[10px] text-muted">Medium woodwork & vehicles</div>
                </div>
                {weightRange === '300-500' && <Check className="w-3.5 h-3.5 text-parchment shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => handleApplyWeightPreset('550-plus')}
                className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-left flex items-center justify-between ${
                  weightRange === '550-plus'
                    ? 'bg-lapis text-parchment border-lapis shadow-xs'
                    : 'bg-sandstone text-charcoal border-border hover:border-brass'
                }`}
              >
                <div>
                  <div className="font-bold">550g +</div>
                  <div className="text-[10px] text-muted">Heavy marble, stone & brass</div>
                </div>
                {weightRange === '550-plus' && <Check className="w-3.5 h-3.5 text-parchment shrink-0" />}
              </button>
            </div>
          </div>

          {/* 3. Stock Availability Toggle Switch */}
          <div className="pt-4 border-t border-border space-y-3">
            <label className="font-semibold text-charcoal text-xs flex items-center gap-1.5 uppercase tracking-wider">
              <PackageCheck className="w-3.5 h-3.5 text-emerald-600" /> Availability
            </label>

            <button
              type="button"
              onClick={() => setInStockOnly(!inStockOnly)}
              className={`w-full p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                inStockOnly
                  ? 'bg-emerald-950 text-emerald-100 border-emerald-500/50 shadow-xs'
                  : 'bg-sandstone text-charcoal border-border hover:bg-chiseled'
              }`}
            >
              <span>Show In-Stock Products Only</span>
              <div
                className={`w-10 h-6 rounded-full p-0.5 transition-colors ${
                  inStockOnly ? 'bg-emerald-500' : 'bg-border'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    inStockOnly ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Footer Actions Strip */}
        <div className="p-4 bg-sandstone border-t border-border flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleClearAll}
            className="px-4 py-2.5 text-terracotta hover:bg-terracotta/10 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="px-6 py-2.5 bg-[#00405C] hover:bg-[#003248] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
