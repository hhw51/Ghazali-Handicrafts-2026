'use client';

import Image from 'next/image';
import Link from 'next/link';

export interface EditorialBannerConfig {
  headline?: string;
  description?: string;
  bannerImage?: string;
  ctaText?: string;
  ctaLink?: string;
  alignment?: 'left' | 'center' | 'right';
}

export function EditorialBannerSection({ config }: { config: EditorialBannerConfig }) {
  const headline = config.headline || 'Nationwide Express Cash on Delivery';
  const description =
    config.description ||
    'Fragile crate protection & instant WhatsApp verification for every handcrafted treasure.';
  const bannerImage = config.bannerImage || '/images/hero/craft-hero.png';
  const ctaText = config.ctaText || 'Shop Heritage Collection';
  const ctaLink = config.ctaLink || '/products';
  const alignment = config.alignment || 'left';

  let alignClass = 'text-left items-start';
  if (alignment === 'center') alignClass = 'text-center items-center';
  if (alignment === 'right') alignClass = 'text-right items-end';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-2xl overflow-hidden border-2 border-brass/40 shadow-2xl min-h-[360px] flex items-center bg-charcoal">
        {/* Background Banner Image */}
        <Image
          src={bannerImage}
          alt={headline}
          fill
          className="object-cover opacity-35"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/75 to-transparent z-10" />

        {/* Editorial Content */}
        <div className={`relative z-20 p-8 sm:p-12 max-w-2xl flex flex-col space-y-4 ${alignClass}`}>
          <span className="px-3 py-1 bg-brass/20 text-brass text-[11px] font-sans font-semibold tracking-wider uppercase rounded-full border border-brass/30">
            Exclusive Heritage Showcase
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-parchment leading-tight">
            {headline}
          </h3>
          <p className="text-xs sm:text-sm text-parchment/80 font-sans leading-relaxed">
            {description}
          </p>
          <div className="pt-2">
            <Link
              href={ctaLink}
              className="inline-block px-7 py-3.5 bg-brass hover:bg-brass/90 text-charcoal font-bold text-xs rounded-xl shadow-craft-md transition-all cursor-pointer"
            >
              {ctaText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
