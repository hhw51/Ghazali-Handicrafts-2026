'use client';

import Image from 'next/image';
import { CartItem } from '@/types/order';
import { ShoppingBag, ShieldCheck, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  isSubmitting: boolean;
  onSubmitOrder: () => void;
}

export function CheckoutOrderSummary({
  items,
  subtotal,
  shippingFee,
  total,
  isSubmitting,
  onSubmitOrder,
}: CheckoutOrderSummaryProps) {
  return (
    <div className="bg-sandstone rounded-xl border border-border p-6 space-y-6 shadow-craft-md lg:sticky lg:top-24">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h3 className="font-serif text-xl font-bold text-charcoal flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-lapis" /> Order Summary
        </h3>
        <span className="text-xs font-semibold px-2.5 py-0.5 bg-brass/20 text-terracotta rounded-full font-mono">
          {items.reduce((sum, i) => sum + i.quantity, 0)} Items
        </span>
      </div>

      {/* Item Breakdown List */}
      <div className="max-h-80 overflow-y-auto space-y-4 pr-1 divide-y divide-border/60">
        {items.map((item) => {
          const prodName = item.name || item.product?.name || 'Craft Item';
          const prodPrice = item.price || item.product?.price || 0;
          const prodImg = item.image || item.product?.images?.[0] || '/images/hero/craft-hero.png';
          const itemId = item.id || item.productId || item.product?.id || Math.random().toString();
          const categoryName = item.product?.category?.name || 'Artisanal Craft';

          return (
            <div key={itemId} className="pt-3 first:pt-0 flex gap-3 items-center">
              <div className="w-14 h-16 relative bg-parchment rounded-md overflow-hidden border border-border shrink-0 aspect-[4/5]">
                <Image
                  src={prodImg}
                  alt={prodName}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-serif text-xs font-semibold text-charcoal truncate">
                  {prodName}
                </h4>
                <p className="text-[11px] text-muted truncate">
                  {categoryName}
                </p>
                <div className="flex justify-between items-center mt-1 text-[11px]">
                  <span className="text-muted font-mono">Qty: {item.quantity}</span>
                  <span className="font-bold text-terracotta font-mono">
                    Rs. {(prodPrice * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Price Calculation Box */}
      <div className="p-4 bg-parchment rounded-lg border border-border space-y-2 text-xs">
        <div className="flex justify-between text-muted">
          <span>Items Subtotal</span>
          <span className="font-mono text-charcoal font-medium">Rs. {subtotal.toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-muted">
          <span>Nationwide Delivery</span>
          <span className="font-mono text-charcoal font-medium">
            {shippingFee === 0 ? (
              <span className="text-lapis font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-brass" /> FREE
              </span>
            ) : (
              `Rs. ${shippingFee.toLocaleString()}`
            )}
          </span>
        </div>

        <div className="pt-2 border-t border-border flex justify-between text-sm font-bold text-charcoal">
          <span>Total Payable (COD)</span>
          <span className="font-mono text-terracotta text-base">Rs. {total.toLocaleString()} PKR</span>
        </div>
      </div>

      {/* Primary Action Button */}
      <button
        type="button"
        onClick={onSubmitOrder}
        disabled={isSubmitting || items.length === 0}
        className={`w-full py-4 px-6 rounded-md font-medium text-xs flex items-center justify-center gap-2 shadow-craft-md transition-all duration-200 uppercase tracking-wider font-sans ${
          items.length > 0 && !isSubmitting
            ? 'bg-lapis hover:bg-lapis/90 text-parchment'
            : 'bg-stone/30 text-stone cursor-not-allowed'
        }`}
      >
        {isSubmitting ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin text-brass" /> Processing Order...
          </>
        ) : (
          <>
            Place Order (Cash on Delivery) <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <div className="text-center text-[11px] text-muted space-y-1 pt-1">
        <p className="flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-brass" /> Flagship Store: 27 New Anarkali, Lahore
        </p>
        <p>Doorstep inspection & fragile wooden crate packaging</p>
      </div>
    </div>
  );
}
