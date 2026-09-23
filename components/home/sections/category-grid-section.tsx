'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Category } from '@/types/product';

export interface CategoryGridConfig {
  headline?: string;
  subheadline?: string;
  categories?: Array<{
    name: string;
    slug: string;
    image?: string;
    itemCount?: number;
    badge?: string;
  }>;
}

interface CategoryGridSectionProps {
  config: CategoryGridConfig;
  dbCategories?: Category[];
}

const DEFAULT_CATEGORIES = [
  {
    name: 'Multani Blue Pottery',
    slug: 'blue-pottery',
    image: '/images/collections/blue-pottery.png',
    itemCount: 14,
    badge: 'Multan',
  },
  {
    name: 'Swati Carved Woodwork',
    slug: 'swati-woodwork',
    image: '/images/collections/swati-woodwork.png',
    itemCount: 9,
    badge: 'Swat Valley',
  },
  {
    name: 'Himalayan Marble & Onyx',
    slug: 'marble-onyx',
    image: '/images/hero/craft-hero.png',
    itemCount: 12,
    badge: 'Balochistan',
  },
  {
    name: 'Authentic Truck Art',
    slug: 'truck-art',
    image: '/images/hero/craft-hero.png',
    itemCount: 8,
    badge: 'Rawalpindi',
  },
  {
    name: 'Chiseled Antiqued Brass',
    slug: 'chiseled-brass',
    image: '/images/hero/craft-hero.png',
    itemCount: 7,
    badge: 'Sillanwali',
  },
  {
    name: 'Peshawari Chappal Craft',
    slug: 'leather-crafts',
    image: '/images/hero/craft-hero.png',
    itemCount: 6,
    badge: 'Peshawar',
  },
];

export function CategoryGridSection({ config, dbCategories = [] }: CategoryGridSectionProps) {
  const headline = config.headline || 'Explore Craft Lineages by Region';
  const subheadline =
    config.subheadline || 'Discover centuries of master craftsmanship, from Multan kilns to Swati carving benches.';

  // Prefer configured categories list; fallback to DEFAULT_CATEGORIES or mapped dbCategories
  let displayCategories = config.categories && config.categories.length > 0 ? config.categories : [];

  if (displayCategories.length === 0) {
    if (dbCategories.length > 0) {
      displayCategories = dbCategories.map((cat, idx) => ({
        name: cat.name,
        slug: cat.slug,
        image: DEFAULT_CATEGORIES[idx % DEFAULT_CATEGORIES.length]?.image || '/images/hero/craft-hero.png',
        itemCount: 10 + idx * 2,
        badge: DEFAULT_CATEGORIES[idx % DEFAULT_CATEGORIES.length]?.badge || 'Pakistan',
      }));
    } else {
      displayCategories = DEFAULT_CATEGORIES;
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">{headline}</h2>
        <p className="text-xs sm:text-sm text-muted font-sans leading-relaxed">{subheadline}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayCategories.map((cat, idx) => (
          <Link
            key={idx}
            href={`/products?category=${cat.slug}`}
            className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden border border-border shadow-craft-sm hover:shadow-craft-lg transition-all duration-300 block bg-parchment"
          >
            {/* Background Craft Image */}
            <Image
              src={cat.image || '/images/hero/craft-hero.png'}
              alt={cat.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Dark Gradient Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent transition-opacity duration-300 group-hover:from-charcoal/95" />

            {/* Regional Provenance Badge */}
            {cat.badge && (
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 bg-lapis/90 text-parchment text-[11px] font-sans font-semibold tracking-wider uppercase rounded-full backdrop-blur-md shadow-xs border border-brass/30">
                  {cat.badge}
                </span>
              </div>
            )}

            {/* Category Content Overlay */}
            <div className="absolute bottom-0 inset-x-0 p-6 z-10 space-y-1 text-parchment">
              <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight group-hover:text-brass transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-parchment/80 font-sans font-medium flex items-center justify-between">
                <span>Explore Lineage Catalog</span>
                {cat.itemCount && (
                  <span className="font-mono text-[11px] bg-parchment/20 px-2 py-0.5 rounded-full text-parchment">
                    {cat.itemCount} Items
                  </span>
                )}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
