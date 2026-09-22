'use client';

import { useState } from 'react';
import { toggleProductStock } from '@/actions/admin-products';
import { RefreshCw } from 'lucide-react';

interface StockToggleProps {
  productId: string;
  initialInStock: boolean;
}

export function StockToggle({ productId, initialInStock }: StockToggleProps) {
  const [inStock, setInStock] = useState(initialInStock);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    const res = await toggleProductStock(productId, inStock);
    setLoading(false);

    if (res.success && res.newStockState !== undefined) {
      setInStock(res.newStockState);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
        inStock
          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
          : 'bg-terracotta/10 text-terracotta border-terracotta/30 hover:bg-terracotta/20'
      }`}
    >
      {loading ? (
        <RefreshCw className="w-3 h-3 animate-spin text-charcoal" />
      ) : inStock ? (
        '✓ In Stock'
      ) : (
        '✕ Out of Stock'
      )}
    </button>
  );
}
