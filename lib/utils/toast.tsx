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
      <div className="w-[340px] max-w-[calc(100vw-32px)] bg-[#FAF8F5] border border-[#DDD5C9] shadow-2xl rounded-2xl p-3 flex items-center gap-3 pointer-events-auto z-[9999]">
        {/* Thumbnail */}
        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#ECE6DC] flex-shrink-0 border border-[#D5CCC0]">
          {product.image ? (
            <Image alt={product.name} className="object-cover" fill sizes="48px" src={product.image} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#8C8275]">
              <ShoppingBag className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#8B4513] tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B4513]" />
            <span>Added to Bag</span>
          </div>
          <p className="font-serif text-xs font-semibold text-[#1A1410] truncate mt-0.5">
            {product.name}
          </p>
          <p className="text-xs font-semibold text-[#00405C] mt-0.5">
            Rs. {Number(product.price).toLocaleString()}
          </p>
        </div>

        {/* Action */}
        <button
          onClick={() => {
            toast.dismiss(t);
            openDrawer();
          }}
          className="flex-shrink-0 inline-flex items-center gap-1 bg-[#00405C] hover:bg-[#002D42] text-[#FAF8F5] text-xs font-medium px-3 py-2 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <span>Bag</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    ),
    {
      duration: 3500,
    }
  );
}
