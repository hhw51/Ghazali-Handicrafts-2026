'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Banknote, Award } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';

export interface HeroSectionConfig {
  title?: string;
  subtitle?: string;
  badgeText?: string;
  primaryCta?: { label: string; url: string };
  secondaryCta?: { label: string; url: string };
  image?: string;
}

export function HeroSection({ config }: { config?: HeroSectionConfig }) {
  const badgeText =
    config?.badgeText || 'Authentic Artisanal Roots — Multan • Swat • Sillanwali • Khewra';
  const mainTitle = config?.title || 'Timeless Pakistani Heritage,';
  const subtitle =
    config?.subtitle ||
    'Sourced directly from generational Ustads without intermediate dilution. From hand-thrown Multani cobalt glazes and intricate Swati walnut relief panels to hand-turned Taxila marble and antique brassware—safely double-crated and brought straight to your doorstep across Pakistan.';
  const primaryCta = config?.primaryCta || { label: 'Explore Masterpiece Catalog', url: '/products' };
  const imageUrl =
    config?.image ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBULERIYP1iPVOnmmAD_IkDmEpdUYlVKFT33WKFA0whp7gkZt7_IEytTCkyBjiw3Pf5gSzSvxA9zJfINHQrKTnf2ZyTfKdVxER4GsWbsCDJ6M_6BiKJ4mOzZLV_D45b3_kwI9I4My6FtxuuXl1H-1kMGspje9ha9WYV8Je9-gc2unC2LSccXH64zhRltv37kpygVmmoAeYezVvH82uLuW-PPR4UkuM6W6BMXZNYcbg4OAD5TN4knGJ_';

  return (
    <section className="relative w-full overflow-hidden px-margin-mobile md:px-margin-tablet lg:px-margin py-space-lg lg:py-space-xl bg-surface">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
        {/* Left Narrative Column (Cols 1-7) */}
        <div className="lg:col-span-7 flex flex-col items-start space-y-space-md z-10">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm uppercase tracking-widest shadow-xs border border-surface-container-highest">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span>{badgeText}</span>
          </div>

          {/* Expressive Editorial Headline */}
          <h1 className="font-headline-lg text-headline-lg lg:text-display-xl text-on-surface leading-[1.08] tracking-tight">
            {mainTitle}{' '}
            <span className="italic font-serif text-primary block sm:inline font-normal">
              Hand-Chiseled
            </span>{' '}
            for the Modern Home.
          </h1>

          {/* Poetic Body Copy */}
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
            {subtitle}
          </p>

          {/* CTA Row */}
          <div className="flex flex-wrap items-center gap-space-sm pt-space-xs w-full sm:w-auto">
            <Link
              href={primaryCta.url}
              className="inline-flex items-center justify-center gap-space-xs px-space-lg py-3.5 rounded-lg bg-[#00405C] hover:bg-[#003248] text-white transition-all duration-300 font-label-lg text-label-lg shadow-md group cursor-pointer"
            >
              <span>{primaryCta.label}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="https://wa.me/923104755973?text=Hello%20Ghazali%20Handicrafts%2C%20I%20would%20like%20to%20inquire%20about%20your%20artisanal%20masterpieces."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-space-xs px-space-lg py-3.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-variant transition-all duration-200 font-label-lg text-label-lg shadow-xs border border-surface-container-highest cursor-pointer"
            >
              <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
              <span>Order via WhatsApp Concierge</span>
            </a>
          </div>

          {/* Trust Badges directly under CTAs */}
          <div className="pt-space-sm flex flex-col sm:flex-row items-start sm:items-center gap-space-md text-on-surface-variant">
            <div className="flex items-center gap-2">
              <Banknote className="w-5 h-5 text-[#00405C]" />
              <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                100% Cash on Delivery Nationwide
              </span>
            </div>
            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-outline-variant"></div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#1E4B3E]" />
              <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                Zero-Breakage Guarantee (Double Crated)
              </span>
            </div>
          </div>
        </div>

        {/* Right Visual Column (Cols 8-12) */}
        <div className="lg:col-span-5 relative mt-space-md lg:mt-0">
          {/* Magazine Style Asymmetric Frame */}
          <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-xl bg-surface-container-high group border border-surface-container-highest">
            <Image
              src={imageUrl}
              alt="Curated Pakistani artisanal still-life arrangement featuring Multani blue pottery urn and Swati carved walnut panel"
              fill
              priority
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-surface/90 backdrop-blur-md p-space-sm rounded-lg shadow-md flex items-center justify-between border border-white/20">
              <div>
                <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest block font-bold">
                  Collector Highlight
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface">
                  Multani Lapis Urn & Walnut Mount
                </span>
              </div>
              <span className="font-label-md text-label-md text-on-surface-variant font-mono">
                № 1976/08
              </span>
            </div>

            {/* Floating Gold Provenance Seal */}
            <div className="absolute -top-3 -right-3 w-28 h-28 rounded-full bg-surface/95 backdrop-blur-md p-1.5 shadow-xl flex items-center justify-center pointer-events-none rotate-6 border border-brass/40">
              <div className="w-full h-full rounded-full bg-surface-container-high flex flex-col items-center justify-center text-center p-2 border border-brass/30">
                <Award className="w-4 h-4 text-brass mb-0.5" />
                <span className="font-label-sm text-[9px] uppercase tracking-widest text-primary font-bold leading-tight">
                  Est. 1976
                </span>
                <span className="font-label-sm text-[8px] uppercase tracking-wider text-on-surface-variant">
                  Lahore Registry
                </span>
              </div>
            </div>
          </div>

          {/* Subtle Ambient Background Glow */}
          <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
}
