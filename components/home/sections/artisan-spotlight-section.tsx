'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Award, ArrowRight } from 'lucide-react';

export interface ArtisanSpotlightConfig {
  artisanName?: string;
  craftType?: string;
  region?: string;
  bio?: string;
  image?: string;
  featuredProductSlug?: string;
}

export function ArtisanSpotlightSection({ config }: { config: ArtisanSpotlightConfig }) {
  const artisanName = config.artisanName || 'Ustad Ghulam Mohammad';
  const craftType = config.craftType || 'Swati Walnut Wood Carver';
  const region = config.region || 'Swat Valley, Khyber Pakhtunkhwa';
  const bio =
    config.bio ||
    'With over 40 years of dedication to ancestral relief carving, Ustad Ghulam shapes solid walnut wood using hand-forged steel chisels without electrical machinery.';
  const image = config.image || '/images/collections/swati-woodwork.png';
  const featuredProductSlug = config.featuredProductSlug || 'swati-woodwork';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-sandstone rounded-2xl border border-border p-8 sm:p-12 shadow-craft-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5 relative aspect-square rounded-2xl overflow-hidden border-2 border-brass/40 shadow-xl">
          <Image src={image} alt={artisanName} fill className="object-cover" />
        </div>

        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brass/20 text-terracotta rounded-full text-xs font-semibold">
            <Award className="w-3.5 h-3.5 text-brass" />
            <span>Master Artisan Spotlight</span>
          </div>

          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">{artisanName}</h2>
            <p className="text-xs text-lapis font-bold uppercase tracking-wider font-sans mt-1">
              {craftType} • {region}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-muted leading-relaxed font-sans">{bio}</p>

          <div className="pt-2">
            <Link
              href={`/products?category=${featuredProductSlug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-lapis hover:bg-lapis/90 text-parchment text-xs font-bold rounded-xl shadow-craft-sm transition-all"
            >
              <span>Explore Masterpiece Creations</span>
              <ArrowRight className="w-4 h-4 text-brass" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
