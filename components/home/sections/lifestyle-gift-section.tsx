'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Gift, BookOpen, Briefcase, Truck, ArrowRight } from 'lucide-react';

export interface LifestyleGiftSectionConfig {
  badge?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  image?: string;
}

export function LifestyleGiftSection({ config }: { config?: LifestyleGiftSectionConfig }) {
  const badgeText = config?.badge || 'Thoughtful Heritage Gifting';
  const mainTitle = config?.title || 'Heirloom Accents That Tell a Story.';
  const description =
    config?.description ||
    config?.subtitle ||
    'Elevate modern living rooms and corporate executive suites with authentic craft. Hand-carved Sheesham wood tissue covers, solid brass chatuwata mortars, and artisanal marble desk clocks—curated specifically for memorable weddings, commemorative milestones, and diplomatic gifting.';
  const ctaText = config?.ctaText || 'Browse Gift Collections';
  const ctaLink = config?.ctaLink || '/products';
  const imageUrl =
    config?.image ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAZqddVpS7aWXHUpN_eePUDEnIQoSfos2Zm4HQp0QH7u7YJmWjLKNFSVy7xLsYVTrW-Ka5fTz09IMQqDzG89lT90kx5hKHd8HqILODpHB8LfXCPcl0ARgkqE0AUA0ldguqhpcKAodg_TjLrvwCx0P66PEdLLMhCpgH6jc9GbsYd-c7D89osONvVJc1g7oXnj9Gn46v6jANl99qDYtPO29JqU__-iLfOqJCRct_iGfnHtZ4DHdmuV4eK';

  return (
    <section className="w-full bg-surface-container-low py-space-xl px-margin-mobile md:px-margin-tablet lg:px-margin border-t border-surface-container-high">
      <div className="max-w-7xl mx-auto rounded-2xl overflow-hidden bg-surface-container shadow-md border border-surface-container-high">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Left: Warm Ambient Photo (Cols 1-6) */}
          <div className="lg:col-span-6 relative aspect-square sm:aspect-[4/3] lg:aspect-auto lg:h-[480px]">
            <Image
              src={imageUrl}
              alt="Warm editorial living room setting"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-surface-container/30 hidden lg:block"></div>
          </div>

          {/* Right: Editorial Narrative & Gifting Callouts (Cols 7-12) */}
          <div className="lg:col-span-6 p-space-lg md:p-space-xl space-y-space-md">
            <div className="space-y-1">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                {badgeText}
              </span>
              <h2 className="font-syne text-xl sm:text-2xl lg:text-3xl font-semibold text-on-surface leading-tight">
                {mainTitle}
              </h2>
            </div>

            <p className="font-serif text-sm sm:text-base text-on-surface-variant leading-relaxed">
              {description}
            </p>

            {/* Quick Gifting Bullet Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs font-serif text-xs sm:text-sm text-on-surface">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-primary shrink-0" />
                <span>Bespoke Brass Inscribed Plaques</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#1E4B3E] shrink-0" />
                <span>Provenance Certificate Included</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-brass shrink-0" />
                <span>Corporate Bulk Crating Options</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary shrink-0" />
                <span>Direct-to-Recipient Delivery</span>
              </div>
            </div>

            <div className="pt-space-xs">
              <Link
                href={ctaLink}
                className="inline-flex items-center gap-space-xs px-space-lg py-3 rounded-lg bg-[#00405C] hover:bg-[#003248] text-white transition-all font-label-lg text-label-lg shadow-xs group cursor-pointer"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { LifestyleGiftSection as EditorialBannerSection };
