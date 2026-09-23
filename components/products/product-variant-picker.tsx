'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/cart-store';
import { UnitSelection } from '@/types/order';
import { ShoppingBag, MessageCircle, Minus, Plus, Check, Share2, Layers } from 'lucide-react';

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

  const hasVariants = colorOptions.length > 0 || designOptions.length > 0;

  const [selectedColor, setSelectedColor] = useState<string>(colorOptions[0] || '');
  const [selectedDesign, setSelectedDesign] = useState<string>(designOptions[0] || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);

  // Unit selections state matching current quantity
  const [unitSelections, setUnitSelections] = useState<UnitSelection[]>(() => {
    return Array.from({ length: 1 }, () => ({
      color: colorOptions[0] || undefined,
      design: designOptions[0] || undefined,
    }));
  });

  // Adjust unitSelections length dynamically when quantity changes
  const handleQuantityChange = (newQty: number) => {
    const validQty = Math.max(1, Math.min(99, newQty));
    setQuantity(validQty);
    setUnitSelections((prev) => {
      if (validQty > prev.length) {
        const addedItems: UnitSelection[] = Array.from({ length: validQty - prev.length }, () => ({
          color: selectedColor || colorOptions[0] || undefined,
          design: selectedDesign || designOptions[0] || undefined,
        }));
        return [...prev, ...addedItems];
      } else {
        return prev.slice(0, validQty);
      }
    });
  };

  const handleGlobalColorSelect = (color: string) => {
    setSelectedColor(color);
    setUnitSelections((prev) => prev.map((u) => ({ ...u, color })));
  };

  const handleGlobalDesignSelect = (design: string) => {
    setSelectedDesign(design);
    setUnitSelections((prev) => prev.map((u) => ({ ...u, design })));
  };

  const handleUnitColorChange = (index: number, color: string) => {
    setUnitSelections((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, color } : item))
    );
  };

  const handleUnitDesignChange = (index: number, design: string) => {
    setUnitSelections((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, design } : item))
    );
  };

  const handleAddToCart = () => {
    if (!product.in_stock) return;
    const success = addItem(
      product,
      quantity,
      selectedColor || undefined,
      selectedDesign || undefined,
      hasVariants ? unitSelections : undefined
    );
    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    }
  };

  // Share product function with Web Share API and Clipboard fallback
  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on Ghazali Handicrafts`,
      url: shareUrl,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Share prompt dismissed by user
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (cErr) {
        console.error('Failed to copy link:', cErr);
      }
    }
  };

  // WhatsApp Order Direct Messaging with detailed itemized breakdown
  const handleWhatsAppOrder = () => {
    const phoneNumber = '923004130000'; // Ghazali Official WhatsApp
    let message = `Hello Ghazali Handicrafts! I would like to order:\n\n*Product:* ${product.name}\n*Quantity:* ${quantity}\n*Price:* Rs. ${(product.price * quantity).toLocaleString()} PKR`;

    if (hasVariants && unitSelections.length > 0) {
      const breakdownText = unitSelections
        .map((item, idx) => {
          const parts = [];
          if (item.color) parts.push(item.color);
          if (item.design) parts.push(item.design);
          return `Item ${idx + 1} (${parts.join(' / ') || 'Default'})`;
        })
        .join(', ');
      message += `\n*Breakdown:* ${breakdownText}`;
    } else {
      if (selectedColor) message += `\n*Selected Color:* ${selectedColor}`;
      if (selectedDesign) message += `\n*Selected Design:* ${selectedDesign}`;
    }

    if (product.size) message += `\n*Size:* ${product.size}`;

    message += `\n\nPlease confirm availability for Cash on Delivery.`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="space-y-6 bg-sandstone/40 p-5 rounded-xl border border-border">
      {/* Primary Variant Selection Strip */}
      {hasVariants && (
        <div className="space-y-5 border-b border-border pb-5">
          {/* Color Selector */}
          {colorOptions.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-serif font-bold text-charcoal flex items-center justify-between">
                <span>Primary / Default Color</span>
                {selectedColor && <span className="text-lapis font-sans text-[11px]">{selectedColor}</span>}
              </label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color, idx) => {
                  const isSelected = selectedColor === color;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleGlobalColorSelect(color)}
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
                <span>Primary / Default Design</span>
                {selectedDesign && <span className="text-lapis font-sans text-[11px]">{selectedDesign}</span>}
              </label>
              <div className="flex flex-wrap gap-2">
                {designOptions.map((design, idx) => {
                  const isSelected = selectedDesign === design;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleGlobalDesignSelect(design)}
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

      {/* Quantity Stepper */}
      <div className="space-y-2">
        <label className="text-xs font-serif font-bold text-charcoal block">Quantity</label>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center bg-parchment border border-border rounded-lg overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || !product.in_stock}
              className="p-2.5 text-charcoal hover:bg-sandstone transition-colors disabled:opacity-40 cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <input
              type="number"
              min={1}
              max={99}
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10) || 1)}
              disabled={!product.in_stock}
              className="w-12 text-center text-xs font-bold text-charcoal font-mono bg-transparent border-none focus:outline-none"
            />

            <button
              type="button"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={!product.in_stock}
              className="p-2.5 text-charcoal hover:bg-sandstone transition-colors disabled:opacity-40 cursor-pointer"
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

      {/* Itemized Per-Unit Variant Allocation (When Quantity > 1 or Variants Exist) */}
      {hasVariants && quantity > 1 && (
        <div className="p-4 bg-parchment rounded-lg border border-border space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs font-bold text-charcoal font-serif border-b border-border pb-2">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-lapis" /> Per-Unit Variant Configuration ({quantity} Units)
            </span>
            <span className="text-[10px] text-muted font-sans font-normal">Specify unique color/design per item</span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1 divide-y divide-border/40">
            {unitSelections.map((unit, idx) => (
              <div key={idx} className="pt-2 first:pt-0 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-charcoal/90 font-mono text-[11px] shrink-0">
                  Item {idx + 1}:
                </span>

                <div className="flex items-center gap-2">
                  {colorOptions.length > 0 && (
                    <div className="flex items-center gap-1 bg-sandstone px-2 py-1 rounded border border-border">
                      <span className="text-[10px] text-muted font-medium">Color:</span>
                      <select
                        value={unit.color || colorOptions[0] || ''}
                        onChange={(e) => handleUnitColorChange(idx, e.target.value)}
                        className="bg-transparent text-charcoal text-xs font-semibold focus:outline-none cursor-pointer"
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
                    <div className="flex items-center gap-1 bg-sandstone px-2 py-1 rounded border border-border">
                      <span className="text-[10px] text-muted font-medium">Design:</span>
                      <select
                        value={unit.design || designOptions[0] || ''}
                        onChange={(e) => handleUnitDesignChange(idx, e.target.value)}
                        className="bg-transparent text-charcoal text-xs font-semibold focus:outline-none cursor-pointer"
                      >
                        {designOptions.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share & Side-by-Side Action Buttons Section */}
      <div className="space-y-3 pt-2">
        {/* Share Button Row */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-lapis hover:text-lapis/80 bg-parchment hover:bg-sandstone px-3.5 py-1.5 rounded-lg border border-border transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? '✓ Link copied to clipboard!' : 'Share Product'}</span>
          </button>
        </div>

        {/* Side-by-Side Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.in_stock}
            className={`py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-craft-md cursor-pointer ${
              added
                ? 'bg-emerald-700 text-parchment'
                : product.in_stock
                ? 'bg-lapis hover:bg-lapis/90 text-parchment active:scale-[0.99]'
                : 'bg-muted/40 text-muted cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-brass shrink-0" />
            <span className="truncate">{added ? '✓ Added to Cart!' : product.in_stock ? 'Add to Cart (COD)' : 'Out of Stock'}</span>
          </button>

          <button
            type="button"
            onClick={handleWhatsAppOrder}
            className="py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-parchment font-semibold text-xs rounded-xl shadow-craft-sm transition-all flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-parchment shrink-0" />
            <span className="truncate">Order via WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
