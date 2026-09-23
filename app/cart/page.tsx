'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cart-store';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Sparkles, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const {
    items,
    removeItem,
    updateQuantity,
    updateVariant,
    getSubtotal,
    getShippingFee,
    getTotal,
    getAmountForFreeShipping,
    getFreeShippingProgress,
  } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="py-20 max-w-7xl mx-auto px-4" />;
  }

  const subtotal = getSubtotal();
  const shippingFee = getShippingFee();
  const total = getTotal();
  const amountForFreeShipping = getAmountForFreeShipping();
  const freeShippingProgress = getFreeShippingProgress();

  return (
    <div className="py-12 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header & Back Link */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <Link href="/products" className="text-xs text-muted hover:text-lapis flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">
            Your Shopping Bag
          </h1>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-brass/20 text-terracotta rounded-full">
          {items.reduce((sum, i) => sum + i.quantity, 0)} Items Selected
        </span>
      </div>

      {items.length === 0 ? (
        <div className="py-20 bg-sandstone rounded-2xl border border-border text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-parchment rounded-full flex items-center justify-center mx-auto border border-border text-muted">
            <ShoppingBag className="w-8 h-8 text-muted" />
          </div>
          <h3 className="font-serif text-xl font-bold text-charcoal">Your bag is currently empty</h3>
          <p className="text-xs text-muted leading-relaxed">
            Discover our authentic Pakistani cultural heritage crafts from Multan, Swat, Karachi, and Rawalpindi.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-lapis text-parchment text-xs font-medium rounded-md hover:bg-lapis/90 transition-colors shadow-craft-sm"
          >
            Explore Artisanal Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Items Table */}
          <div className="lg:col-span-8 space-y-6">
            {/* Free Shipping Indicator */}
            <div className="p-4 bg-sandstone rounded-xl border border-border space-y-2">
              <div className="flex items-center justify-between text-xs font-medium">
                {amountForFreeShipping > 0 ? (
                  <span className="text-charcoal flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-brass" /> Add{' '}
                    <span className="font-bold text-terracotta">Rs. {amountForFreeShipping.toLocaleString()}</span>{' '}
                    more for <span className="text-lapis font-bold">Free Nationwide Shipping</span>
                  </span>
                ) : (
                  <span className="text-lapis font-bold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-brass animate-pulse" /> You unlocked Free Shipping!
                  </span>
                )}
                <span className="text-muted font-mono">{Math.round(freeShippingProgress)}%</span>
              </div>
              <div className="w-full h-2 bg-parchment rounded-full overflow-hidden border border-border/40">
                <div
                  className="h-full bg-gradient-to-r from-brass to-lapis transition-all duration-500 rounded-full"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            <div className="bg-sandstone rounded-xl border border-border overflow-hidden divide-y divide-border">
              {items.map(({ product, quantity, selectedColor, selectedDesign }) => {
                const colorOptions = product.colors
                  ? product.colors.split(',').map((c) => c.trim()).filter(Boolean)
                  : [];
                const designOptions = product.design
                  ? product.design.split(',').map((d) => d.trim()).filter(Boolean)
                  : [];

                const currentColor = selectedColor || colorOptions[0] || '';
                const currentDesign = selectedDesign || designOptions[0] || '';

                const sizeText = product.size
                  ? /^\d+(\.\d+)?$/.test(product.size.trim())
                    ? `${product.size.trim()} inches`
                    : product.size
                  : null;

                return (
                  <div
                    key={product.id}
                    className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-24 relative bg-parchment rounded-md overflow-hidden border border-border shrink-0 aspect-[4/5]">
                        <Image
                          src={product.images[0] || '/images/hero/craft-hero.png'}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <Link
                          href={`/products/${product.slug}`}
                          className="font-serif text-base font-semibold text-charcoal hover:text-lapis transition-colors line-clamp-1"
                        >
                          {product.name}
                        </Link>

                        {/* Dynamic Inline Variant Dropdowns */}
                        {(colorOptions.length > 0 || designOptions.length > 0 || sizeText) && (
                          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                            {colorOptions.length > 0 && (
                              <div className="flex items-center gap-1.5 bg-parchment border border-border rounded-md px-2 py-1">
                                <span className="text-muted font-medium">Color:</span>
                                <select
                                  value={currentColor}
                                  onChange={(e) => updateVariant(product.id, e.target.value, currentDesign)}
                                  className="bg-transparent text-charcoal font-semibold focus:outline-none cursor-pointer text-xs"
                                >
                                  {colorOptions.map((c) => (
                                    <option key={c} value={c}>
                                      {c}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}

                            {designOptions.length > 0 && (
                              <div className="flex items-center gap-1.5 bg-parchment border border-border rounded-md px-2 py-1">
                                <span className="text-muted font-medium">Design:</span>
                                <select
                                  value={currentDesign}
                                  onChange={(e) => updateVariant(product.id, currentColor, e.target.value)}
                                  className="bg-transparent text-charcoal font-semibold focus:outline-none cursor-pointer text-xs"
                                >
                                  {designOptions.map((d) => (
                                    <option key={d} value={d}>
                                      {d}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}

                            {sizeText && (
                              <span className="text-muted bg-parchment px-2 py-1 rounded-md border border-border text-xs">
                                Size: {sizeText}
                              </span>
                            )}
                          </div>
                        )}

                        <p className="font-serif text-sm font-bold text-terracotta mt-1">
                          Rs. {product.price.toLocaleString()} PKR
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                      {/* Quantity Selector Stepper */}
                      <div className="flex items-center border border-border rounded-md bg-parchment overflow-hidden shadow-xs">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="px-3 py-1.5 text-charcoal hover:bg-sandstone text-xs transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 py-1.5 text-xs font-semibold font-mono text-charcoal min-w-[32px] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          disabled={!product.in_stock}
                          className="px-3 py-1.5 text-charcoal hover:bg-sandstone text-xs transition-colors disabled:opacity-40 cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right font-mono">
                        <p className="text-sm font-bold text-charcoal">
                          Rs. {(product.price * quantity).toLocaleString()}
                        </p>
                      </div>

                      <button
                        onClick={() => removeItem(product.id)}
                        className="text-muted hover:text-terracotta p-2 transition-colors cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Summary Box */}
          <div className="lg:col-span-4 bg-sandstone rounded-xl border border-border p-6 space-y-6 shadow-craft-sm">
            <h3 className="font-serif text-xl font-bold text-charcoal border-b border-border pb-4">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span className="font-mono text-charcoal font-medium">Rs. {subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-muted">
                <span>Delivery Tariff</span>
                <span className="font-mono text-charcoal font-medium">
                  {shippingFee === 0 ? <span className="text-lapis font-bold">FREE</span> : `Rs. ${shippingFee.toLocaleString()}`}
                </span>
              </div>

              <div className="pt-3 border-t border-border flex justify-between text-base font-bold text-charcoal">
                <span>Total Payable (COD)</span>
                <span className="font-mono text-terracotta text-lg">Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full py-3.5 bg-lapis text-parchment font-medium text-xs rounded-md hover:bg-lapis/90 transition-all duration-200 shadow-craft-sm flex items-center justify-center gap-2"
            >
              Proceed to Cash on Delivery Checkout <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="pt-2 text-center text-[11px] text-muted space-y-1">
              <p className="flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-brass" /> 100% Cash on Delivery Guarantee
              </p>
              <p>Fragile crate packaging for safe arrival</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
