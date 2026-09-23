'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  inStock?: boolean;
}

export function ProductImageGallery({
  images,
  productName,
  inStock = true,
}: ProductImageGalleryProps) {
  const fallback = '/images/hero/craft-hero.png';
  const validImages = images && images.length > 0 ? images : [fallback];
  const [selectedImage, setSelectedImage] = useState(validImages[0]);

  return (
    <div className="space-y-4 lg:sticky lg:top-24">
      {/* Main Image Container */}
      <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-sandstone border-2 border-border shadow-craft-md transition-all duration-300">
        <Image
          src={selectedImage}
          alt={productName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 hover:scale-105"
          onError={() => setSelectedImage(fallback)}
        />
        {!inStock && (
          <div className="absolute top-4 right-4 bg-terracotta text-parchment px-3.5 py-1 text-xs font-bold rounded-full shadow">
            Sold Out
          </div>
        )}
      </div>

      {/* Gallery Thumbnails List */}
      {validImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
          {validImages.map((img, idx) => {
            const isSelected = selectedImage === img;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(img)}
                onMouseEnter={() => setSelectedImage(img)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 bg-sandstone transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-lapis border-lapis shadow-md scale-105'
                    : 'border-border opacity-70 hover:opacity-100 hover:border-brass'
                }`}
                aria-label={`Select product image preview ${idx + 1}`}
              >
                <Image
                  src={img}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, 15vw"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
