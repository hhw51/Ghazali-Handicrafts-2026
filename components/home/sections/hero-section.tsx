'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export interface HeroSectionConfig {
  title?: string;
  subtitle?: string;
  badgeText?: string;
  primaryCta?: { label: string; url: string };
  secondaryCta?: { label: string; url: string };
  images?: string[];
  layoutStyle?: 'split' | 'full_carousel' | 'editorial';
}

export function HeroSection({ config }: { config: HeroSectionConfig }) {
  const title = config.title || 'Authentic Heritage Handicrafts of Pakistan';
  const subtitle =
    config.subtitle ||
    'Hand-carved Swati walnut woodwork, Multani blue pottery, Rawalpindi truck art tea kettles, and Himalayan onyx chessboards.';
  const badgeText = config.badgeText || '100% Authentic Pakistani Craft Lineage';
  const primaryCta = config.primaryCta || { label: 'Explore Heritage Catalog', url: '/products' };
  const secondaryCta = config.secondaryCta || { label: 'Explore Collections', url: '/products' };
  const images =
    config.images && config.images.length > 0
      ? config.images
      : ['/images/hero/craft-hero.png', '/images/collections/blue-pottery.png', '/images/collections/swati-woodwork.png'];
  const layoutStyle = config.layoutStyle || 'split';

  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setActiveImageIdx((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (layoutStyle === 'editorial') {
    return (
      <section className="relative bg-sandstone py-20 border-b border-border overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brass/20 text-terracotta rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{badgeText}</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-charcoal max-w-4xl mx-auto leading-tight">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-muted max-w-2xl mx-auto font-sans leading-relaxed">
            {subtitle}
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link
              href={primaryCta.url}
              className="px-8 py-3.5 bg-lapis hover:bg-lapis/90 text-parchment font-bold text-xs rounded-xl shadow-craft-md transition-all flex items-center gap-2"
            >
              <span>{primaryCta.label}</span>
              <ArrowRight className="w-4 h-4 text-brass" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[580px] bg-sandstone border-b border-border flex items-center overflow-hidden py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Content Rail */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brass/15 text-terracotta rounded-full text-xs font-semibold border border-brass/30">
            <Sparkles className="w-3.5 h-3.5 text-terracotta" />
            <span>{badgeText}</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal leading-[1.15]">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-muted max-w-xl leading-relaxed font-sans">
            {subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href={primaryCta.url}
              className="px-7 py-3.5 bg-lapis hover:bg-lapis/90 text-parchment font-bold text-xs rounded-xl shadow-craft-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{primaryCta.label}</span>
              <ArrowRight className="w-4 h-4 text-brass" />
            </Link>

            {secondaryCta.label && (
              <Link
                href={secondaryCta.url}
                className="px-6 py-3.5 bg-parchment hover:bg-chiseled text-charcoal border border-border font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        </div>

        {/* Carousel / Image Showcase Rail */}
        <div className="lg:col-span-5 relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-2 border-brass/40 group">
          {images.map((imgUrl, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                idx === activeImageIdx ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <Image
                src={imgUrl}
                alt={`${title} Image ${idx + 1}`}
                fill
                priority={idx === 0}
                className="object-cover"
              />
            </div>
          ))}

          {/* Carousel Control Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-charcoal/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-parchment/20">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                    idx === activeImageIdx ? 'bg-brass w-5' : 'bg-parchment/60'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
