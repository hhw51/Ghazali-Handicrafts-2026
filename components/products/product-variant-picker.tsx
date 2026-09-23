'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/cart-store';
import { ShoppingBag, MessageCircle, Minus, Plus, Check } from 'lucide-react';

interface ProductVariantPickerProps {
  product: Product;
}

export function ProductVariantPicker({ product }: ProductVariantPickerProps) {
  const addItem = useCartStore((state) => state.addItem);

  // Parse comma-separated color and design options
  const colorOptions = product.colors
    ? product.colors.split(',').map((c) => c.trim()).filter(Boolean)
    : [];

  const designOptions = product.design
    ? product.design.split(',').map((d) => d.trim()).filter(Boolean)
    : [];

  const [selectedColor, setSelectedColor] = useState<string>(colorOptions[0] || '');
  const [selectedDesign, setSelectedDesign] = useState<string>(designOptions[0] || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState(false);

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => Math.min(99, prev + 1));
  };

  const handleAddToCart = () => {
    if (!product.in_stock) return;
    const success = addItem(product, quantity, selectedColor || undefined, selectedDesign || undefined);
    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    }
  };

  // WhatsApp Order Direct Messaging
  const handleWhatsAppOrder = () => {
    const phoneNumber = '923004130000'; // Ghazali Official WhatsApp
    let message = `Hello Ghazali Handicrafts! I would like to order:\n\n*Product:* ${product.name}\n*Quantity:* ${quantity}\n*Price:* Rs. ${(product.price * quantity).toLocaleString()} PKR`;

    if (selectedColor) message += `\n*Selected Color:* ${selectedColor}`;
    if (selectedDesign) message += `\n*Selected Design:* ${selectedDesign}`;
    if (product.size) message += `\n*Size:* ${product.size}`;

    message += `\n\nPlease confirm availability for Cash on Delivery.`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  const hasVariants = colorOptions.length > 0 || designOptions.length > 0;

  return (
    <div className="space-y-6 bg-sandstone/40 p-5 rounded-xl border border-border">
      {/* Variant Selectors Section */}
      {hasVariants && (
        <div className="space-y-5 border-b border-border pb-5">
          {/* Color Selector */}
          {colorOptions.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-serif font-bold text-charcoal flex items-center justify-between">
                <span>Select Color</span>
                {selectedColor && <span className="text-lapis font-sans text-[11px]">{selectedColor}</span>}
              </label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color, idx) => {
                  const isSelected = selectedColor === color;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-lapis text-parchment shadow-craft-sm ring-1 ring-lapis'
                          : 'bg-parchment text-charcoal border border-border hover:border-brass'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-brass" />}
                      <span>{color}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Design Selector */}
          {designOptions.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-serif font-bold text-charcoal flex items-center justify-between">
                <span>Select Design / Pattern</span>
                {selectedDesign && <span className="text-lapis font-sans text-[11px]">{selectedDesign}</span>}
              </label>
              <div className="flex flex-wrap gap-2">
                {designOptions.map((design, idx) => {
                  const isSelected = selectedDesign === design;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedDesign(design)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-terracotta text-parchment shadow-craft-sm ring-1 ring-terracotta'
                          : 'bg-parchment text-charcoal border border-border hover:border-brass'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-parchment" />}
                      <span>{design}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quantity Selector */}
      <div className="space-y-2">
        <label className="text-xs font-serif font-bold text-charcoal block">Quantity</label>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center bg-parchment border border-border rounded-lg overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={handleDecreaseQuantity}
              disabled={quantity <= 1 || !product.in_stock}
              className="p-2.5 text-charcoal hover:bg-sandstone transition-colors disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <input
              type="number"
              min={1}
              max={99}
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val >= 1) setQuantity(Math.min(99, val));
              }}
              disabled={!product.in_stock}
              className="w-12 text-center text-xs font-bold text-charcoal font-mono bg-transparent border-none focus:outline-none"
            />

            <button
              type="button"
              onClick={handleIncreaseQuantity}
              disabled={!product.in_stock}
              className="p-2.5 text-charcoal hover:bg-sandstone transition-colors disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="text-xs text-muted font-sans font-medium">
            Total: <strong className="text-terracotta font-serif">Rs. {(product.price * quantity).toLocaleString()} PKR</strong>
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-1">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!product.in_stock}
          className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-craft-md cursor-pointer ${
            added
              ? 'bg-emerald-700 text-parchment'
              : product.in_stock
              ? 'bg-lapis hover:bg-lapis/90 text-parchment active:scale-[0.99]'
              : 'bg-muted/40 text-muted cursor-not-allowed'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-brass" />
          <span>{added ? '✓ Added to Cart!' : product.in_stock ? 'Add to Cart (COD)' : 'Out of Stock'}</span>
        </button>

        <button
          type="button"
          onClick={handleWhatsAppOrder}
          className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-parchment font-semibold text-xs rounded-xl shadow-craft-sm transition-all flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 fill-parchment" />
          <span>Order Directly via WhatsApp</span>
        </button>
      </div>
    </div>
  );
}
