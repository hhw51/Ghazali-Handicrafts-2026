'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/cart-store';
import { ShoppingBag, Check } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';

interface PdpActionsProps {
  product: Product;
}

export function PdpActions({ product }: PdpActionsProps) {
  const [added, setAdded] = useState(false);
  const { addItem, openDrawer } = useCartStore();

  const handleOrderCod = () => {
    if (product.in_stock) {
      const ok = addItem(product, 1);
      if (ok) {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
        openDrawer();
      }
    }
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const whatsappMsg = `Hello Ghazali Handicrafts, I would like to inquire about the item: *${product.name}* (Price: PKR ${product.price}). Link: ${currentUrl}`;
  const whatsappUrl = `https://wa.me/923104755973?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="space-y-3 pt-2">
      {/* Primary COD Trigger */}
      <button
        onClick={handleOrderCod}
        disabled={!product.in_stock}
        className={`w-full py-3.5 px-6 rounded-md font-medium text-sm flex items-center justify-center gap-2 shadow-craft-md transition-all duration-200 ${
          product.in_stock
            ? added
              ? 'bg-emerald-800 text-parchment'
              : 'bg-lapis hover:bg-lapis/90 text-parchment'
            : 'bg-stone/30 text-stone cursor-not-allowed'
        }`}
      >
        {added ? (
          <>
            <Check className="w-4 h-4 text-emerald-300" /> Added to Cart! Opening Drawer...
          </>
        ) : (
          <>
            <ShoppingBag className="w-4 h-4 text-brass" /> Order via Cash on Delivery (COD)
          </>
        )}
      </button>

      {/* Secondary WhatsApp Concierge Trigger */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-3 px-6 bg-sandstone hover:bg-chiseled text-charcoal border border-border rounded-md font-medium text-sm flex items-center justify-center gap-2 transition-colors"
      >
        <WhatsAppIcon className="w-4 h-4 fill-current text-[#25D366]" /> Inquire via WhatsApp Concierge
      </a>
    </div>
  );
}
