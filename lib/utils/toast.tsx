import React from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';

export function showAddToCartToast(product: {
  name: string;
  price: number;
  size?: string | null;
  image?: string;
}) {
  const openDrawer = useCartStore.getState().openDrawer;

  toast.custom(
    (t) => (
      <div className="w-full max-w-sm bg-[#FAF8F5] border border-[#E7DFD5] shadow-[0_10px_30px_rgba(26,20,16,0.12)] rounded-2xl p-3.5 flex items-center gap-3.5 pointer-events-auto transition-all duration-300">
        {/* Product Thumbnail */}
        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#F0EBE1] flex-shrink-0 border border-[#E2D9CC]">
          {product.image ? (
            <Image alt={product.name} className="object-cover" fill sizes="48px" src={product.image} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#8C8275]">
              <ShoppingBag className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8B4513] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B4513]" />
            Added to Bag
          </div>
          <p className="font-serif text-[13px] font-medium text-[#1A1410] truncate mt-0.5">
            {product.name}
          </p>
          <div className="flex items-center gap-2 text-xs text-[#6B6359] mt-0.5">
            <span className="font-semibold text-[#00405C]">
              Rs. {Number(product.price).toLocaleString()}
            </span>
            {product.size && (
              <>
                <span className="text-[#C5BCAD]">•</span>
                <span className="text-[11px] bg-[#EFE9DF] px-1.5 py-0.5 rounded text-[#5A5248]">
                  {product.size}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Quick View Cart Button */}
        <button
          onClick={() => {
            toast.dismiss(t);
            openDrawer();
          }}
          className="flex-shrink-0 inline-flex items-center gap-1 bg-[#00405C] hover:bg-[#002B3D] text-[#FAF8F5] text-xs font-medium px-3 py-2 rounded-xl transition-colors shadow-sm cursor-pointer"
        >
          <span>Bag</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    ),
    {
      duration: 3500,
    }
  );
}
