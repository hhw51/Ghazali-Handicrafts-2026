'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Sparkles, Check } from 'lucide-react';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/cart-store';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const primaryImage = product.images[0] || '/images/hero/craft-hero.png';
  const secondaryImage = product.images[1] || primaryImage;

  const tagsList = Array.isArray(product.tags)
    ? product.tags
    : typeof product.tags === 'string'
    ? (product.tags as string).split(',').map((t) => t.trim())
    : [];

  // Extract provenance region tag from tags or default
  const regionTag =
    tagsList.find((t) =>
      ['multan', 'swat', 'karachi', 'rawalpindi', 'chiniot', 'balochistan', 'peshawar'].includes(
        t.toLowerCase()
      )
    ) || 'Pakistan';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.in_stock) {
      const success = addItem(product, 1);
      if (success) {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      }
    }
  };

  return (
    <div
      className="group relative flex flex-col bg-sandstone rounded-lg overflow-hidden border border-border hover:border-brass/50 transition-all duration-300 hover:shadow-craft-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* High Aspect Ratio Media Card */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-parchment">
        <Image
          src={isHovered ? secondaryImage : primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Badges Overlays */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {/* Provenance Region Badge */}
          <span className="px-2.5 py-1 text-[10px] font-sans font-semibold tracking-wider uppercase bg-lapis/90 text-parchment rounded-full backdrop-blur-md shadow-sm">
            {regionTag}
          </span>
        </div>

        <div className="absolute top-3 right-3 z-10">
          {/* Stock Badge */}
          {product.in_stock ? (
            <span className="px-2 py-0.5 text-[10px] font-medium bg-emerald-950/80 text-emerald-200 border border-emerald-500/30 rounded-full backdrop-blur-md">
              In Stock
            </span>
          ) : (
            <span className="px-2 py-0.5 text-[10px] font-medium bg-terracotta/90 text-parchment rounded-full">
              Sold Out
            </span>
          )}
        </div>

        {/* Quick Add Hover Overlay Button */}
        {product.in_stock && (
          <div className="absolute inset-x-3 bottom-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
            <button
              onClick={handleQuickAdd}
              className={`w-full py-2.5 px-4 text-xs font-semibold rounded-md flex items-center justify-center gap-2 transition-all duration-200 shadow-craft-md cursor-pointer ${
                added
                  ? 'bg-emerald-800 text-parchment'
                  : 'bg-lapis text-parchment hover:bg-lapis/90'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" /> Added to Cart
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-brass" /> Quick Add to Cart
                </>
              )}
            </button>
          </div>
        )}
      </Link>

      {/* Product Content Rail */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2 bg-sandstone">
        <div>
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-serif font-medium text-stone-900 line-clamp-2 hover:text-lapis transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Size Details */}
        <div className="pt-2 border-t border-border/50 flex items-center justify-between">
          <div>
            <span className="text-xs text-muted font-sans font-medium">Price</span>
            <p className="font-serif text-base font-bold text-terracotta">
              Rs. {product.price.toLocaleString()}
            </p>
          </div>

          {product.size && (
            <span className="text-[11px] text-muted bg-parchment px-2 py-0.5 rounded border border-border">
              {/^\d+(\.\d+)?$/.test(product.size.trim()) ? `${product.size.trim()} inches` : product.size}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
