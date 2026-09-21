'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';

export function CartDrawer() {
  const [mounted, setMounted] = useState(false);
  const {
    items,
    isOpen,
    closeDrawer,
    removeItem,
    updateQuantity,
    getSubtotal,
    getShippingFee,
    getTotal,
    getAmountForFreeShipping,
    getFreeShippingProgress,
  } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const shippingFee = getShippingFee();
  const total = getTotal();
  const amountForFreeShipping = getAmountForFreeShipping();
  const freeShippingProgress = getFreeShippingProgress();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-parchment shadow-craft-lg flex flex-col border-l border-border animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="px-6 py-5 bg-sandstone border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-lapis" />
              <h3 className="font-serif text-xl font-bold text-charcoal">
                Your Artisanal Cart
              </h3>
              <span className="text-xs font-sans font-medium px-2 py-0.5 bg-brass/20 text-terracotta rounded-full">
                {items.reduce((count, i) => count + i.quantity, 0)} {items.reduce((count, i) => count + i.quantity, 0) === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 rounded-full text-muted hover:text-charcoal hover:bg-parchment transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dynamic Free Shipping Threshold Progress Bar */}
          <div className="bg-lapis/5 px-6 py-3 border-b border-border">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              {amountForFreeShipping > 0 ? (
                <span className="text-charcoal flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brass" />
                  Add <span className="font-bold text-terracotta">Rs. {amountForFreeShipping.toLocaleString()}</span> more for <span className="text-lapis font-bold">Free Shipping</span>
                </span>
              ) : (
                <span className="text-lapis font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brass animate-spin" />
                  Congratulations! You unlocked <span className="underline">Free Nationwide Shipping</span>
                </span>
              )}
              <span className="text-muted text-[11px] font-mono">
                {Math.round(freeShippingProgress)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-sandstone rounded-full overflow-hidden border border-border/40">
              <div
                className="h-full bg-gradient-to-r from-brass to-lapis transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item Listing */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-border/60">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-sandstone rounded-full flex items-center justify-center text-muted border border-border">
                  <ShoppingBag className="w-8 h-8 text-muted" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-semibold text-charcoal">Your cart is empty</h4>
                  <p className="text-xs text-muted mt-1 max-w-xs leading-relaxed">
                    Explore our authentic Pakistani artisan heritage collection from Multan, Swat, and Chiniot.
                  </p>
                </div>
                <Link
                  href="/products"
                  onClick={closeDrawer}
                  className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-lapis text-parchment text-xs font-medium rounded-md hover:bg-lapis/90 transition-colors shadow-craft-sm"
                >
                  Explore Artisanal Catalog <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div key={product.id} className="py-4 flex gap-4 items-start group">
                  {/* Thumbnail */}
                  <div className="w-20 h-24 relative bg-sandstone rounded-md overflow-hidden border border-border shrink-0 aspect-[4/5]">
                    <Image
                      src={product.images[0] || '/images/hero/craft-hero.png'}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={closeDrawer}
                        className="font-serif text-sm font-semibold text-charcoal hover:text-lapis line-clamp-2 leading-snug"
                      >
                        {product.name}
                      </Link>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="text-muted hover:text-terracotta p-1 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {product.size && (
                      <p className="text-[11px] text-muted mt-0.5">Size: {product.size}</p>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      {/* Quantity Adjuster */}
                      <div className="flex items-center border border-border rounded-md bg-sandstone overflow-hidden">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="px-2 py-1 text-charcoal hover:bg-parchment text-xs transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-1 text-xs font-semibold font-mono text-charcoal min-w-[24px] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          disabled={!product.in_stock}
                          className="px-2 py-1 text-charcoal hover:bg-parchment text-xs transition-colors disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-xs font-bold text-terracotta">
                          Rs. {(product.price * quantity).toLocaleString()}
                        </p>
                        {quantity > 1 && (
                          <p className="text-[10px] text-muted">
                            Rs. {product.price.toLocaleString()} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Trigger */}
          {items.length > 0 && (
            <div className="p-6 bg-sandstone border-t border-border space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span className="font-mono text-charcoal font-medium">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Estimated Shipping</span>
                  <span className="font-mono text-charcoal font-medium">
                    {shippingFee === 0 ? (
                      <span className="text-lapis font-bold">FREE</span>
                    ) : (
                      `Rs. ${shippingFee.toLocaleString()}`
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-border flex justify-between text-sm font-bold text-charcoal">
                  <span>Total Payable</span>
                  <span className="font-mono text-terracotta text-base">Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-1">
                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-lapis text-parchment font-medium text-xs rounded-md hover:bg-lapis/90 transition-all duration-200 shadow-craft-sm"
                >
                  Proceed to Cash on Delivery Checkout <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-muted text-center pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-brass" />
                <span>Fragile-Safe Packaging & 100% COD Guarantee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
