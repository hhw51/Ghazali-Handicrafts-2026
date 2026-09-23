'use client';

import Image from 'next/image';
import { MapPin, Quote } from 'lucide-react';

export interface HeritageStoryConfig {
  regionName?: string;
  title?: string;
  storyText?: string;
  quote?: string;
  artisanImage?: string;
  videoUrl?: string;
}

export function HeritageStorySection({ config }: { config: HeritageStoryConfig }) {
  const regionName = config.regionName || 'Multan & Swat Valley';
  const title = config.title || 'Generational Lineage of Master Artisans';
  const storyText =
    config.storyText ||
    'In the historic workshops of Multan and Swat, master artisans pass down centuries-old secrets of glaze mixing and walnut carving. Each creation is a living artifact forged by patient hands.';
  const quote =
    config.quote ||
    'Clay and walnut wood are not merely raw materials; they carry the soul and memory of our ancestral heritage.';
  const artisanImage = config.artisanImage || '/images/collections/blue-pottery.png';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-sandstone rounded-2xl border border-border p-8 sm:p-12 shadow-craft-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Editorial Media */}
        <div className="lg:col-span-5 relative aspect-[4/5] rounded-xl overflow-hidden border-2 border-brass/40 shadow-xl">
          <Image
            src={artisanImage}
            alt={title}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1 bg-lapis/90 text-parchment text-[11px] font-sans font-semibold rounded-full flex items-center gap-1 border border-brass/30">
              <MapPin className="w-3.5 h-3.5 text-brass" /> {regionName}
            </span>
          </div>
        </div>

        {/* Right Story Rail */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-terracotta uppercase tracking-widest font-sans">
              Artisanal Provenance & Heritage
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal leading-tight">
              {title}
            </h2>
          </div>

          <p className="text-sm text-muted font-sans leading-relaxed">
            {storyText}
          </p>

          {quote && (
            <div className="p-5 bg-parchment rounded-xl border-l-4 border-brass space-y-2">
              <Quote className="w-6 h-6 text-brass/60" />
              <p className="font-serif italic text-sm text-charcoal/90 leading-relaxed">
                "{quote}"
              </p>
              <span className="text-[11px] font-sans font-bold text-muted block">
                — Ustad Master Craftsperson
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
