'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Category } from '@/types/product';
import { CraftHubItem, DEFAULT_CRAFT_HUBS } from '@/components/admin/admin-cms-editor';

export interface RegionsSectionProps {
  config?: {
    headline?: string;
    subheadline?: string;
    hubs?: CraftHubItem[];
  };
  dbCategories?: Category[];
}

export function RegionsSection({ config }: RegionsSectionProps) {
  const headline = config?.headline || 'Discover Crafts by Origin';
  const subheadline =
    config?.subheadline ||
    "Centuries of generational mastery across Pakistan's historic artisan valleys, curated with archival reverence.";

  const hubs: CraftHubItem[] =
    config?.hubs && Array.isArray(config.hubs) && config.hubs.length > 0
      ? config.hubs
      : DEFAULT_CRAFT_HUBS;

  const BADGE_STYLES = [
    'bg-[#1E4B3E] text-white',
    'bg-[#00405C] text-white',
    'bg-[#C5A880] text-black',
    'bg-[#141A1F] text-white',
  ];

  return (
    <section className="w-full bg-surface-container-low py-space-xl px-margin-mobile md:px-margin-tablet lg:px-margin border-y border-surface-container-high">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm pb-space-lg">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold block mb-1">
              Authentic Regional Provenance
            </span>
            <h2 className="font-syne text-xl sm:text-2xl lg:text-3xl font-semibold text-on-surface">{headline}</h2>
          </div>
          <p className="font-serif text-xs sm:text-sm text-on-surface-variant max-w-md">
            {subheadline}
          </p>
        </div>

        {/* Dynamic Hub Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {hubs.map((hub, idx) => {
            const fallbackImg = DEFAULT_CRAFT_HUBS[idx % DEFAULT_CRAFT_HUBS.length]?.image || '/images/collections/blue-pottery.png';
            const imgSrc = hub.image && hub.image.trim() !== '' ? hub.image : fallbackImg;
            const linkHref = hub.linkUrl && hub.linkUrl.trim() !== '' ? hub.linkUrl : '/products';
            const badgeStyle = BADGE_STYLES[idx % BADGE_STYLES.length];
            const isExternal = imgSrc.startsWith('http');

            return (
              <Link
                key={hub.id || `hub_${idx}`}
                href={linkHref}
                className="group relative rounded-xl overflow-hidden shadow-md bg-surface-container-high aspect-[3/4] flex flex-col justify-end p-space-md cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-surface-container-highest"
              >
                <Image
                  src={imgSrc}
                  alt={hub.title || 'Regional Craft'}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  unoptimized={isExternal && !imgSrc.includes('supabase.co')}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>

                <div className="relative z-10 space-y-1 text-white">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full font-label-sm text-label-sm uppercase tracking-wider mb-1 font-semibold ${badgeStyle}`}
                  >
                    {hub.regionBadge}
                  </span>
                  <h3 className="font-syne text-base sm:text-lg font-semibold text-white">{hub.title}</h3>
                  <p className="font-serif text-xs sm:text-sm text-white/90 line-clamp-2">
                    {hub.description}
                  </p>
                  <div className="pt-2 flex items-center justify-between text-[#C5A880] font-label-sm text-label-sm uppercase tracking-widest">
                    <span>{hub.catalogCount}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export { RegionsSection as CategoryGridSection };
