'use client';

import { getAutomatedFestivalTheme, FestivalThemeId } from '@/lib/theme/festival-mode';
import { Sparkles, Truck, ShieldCheck } from 'lucide-react';

interface FestiveBannerProps {
  overrideThemeId?: string | null;
}

export function FestiveBanner({ overrideThemeId }: FestiveBannerProps) {
  const theme = getAutomatedFestivalTheme(overrideThemeId);

  if (theme.id === 'none') {
    return (
      <div className="bg-lapis text-parchment py-1.5 px-4 text-xs font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-center sm:text-left">
          <div className="hidden md:flex items-center gap-4 text-[11px] opacity-90">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-brass" /> 100% Cash on Delivery Nationwide
            </span>
            <span className="text-brass/40">|</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-brass" /> Fragile Crate Protection Guarantee
            </span>
          </div>
          <div className="mx-auto md:mx-0 flex items-center gap-1.5 text-brass font-medium">
            <Sparkles className="w-3.5 h-3.5 text-brass animate-pulse" />
            <span>Free Shipping on Orders Above Rs. 10,000 PKR</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${theme.bannerBg} ${theme.textColor} py-2 px-4 text-xs font-medium tracking-wide shadow-sm`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center text-center sm:text-left">
        <div className="hidden md:flex items-center gap-3 text-[11px] opacity-90">
          <span className="px-2 py-0.5 bg-black/30 rounded-full font-serif font-bold text-amber-300 border border-amber-400/30">
            {theme.badgeText}
          </span>
          <span className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-brass" /> 100% Cash on Delivery Nationwide
          </span>
        </div>

        <div className="mx-auto md:mx-0 flex items-center gap-2 font-serif font-semibold text-xs sm:text-sm">
          <span className="text-base">{theme.iconSymbol || '✨'}</span>
          <span>{theme.bannerMessage}</span>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 text-brass text-[11px] font-medium">
          <Sparkles className="w-3.5 h-3.5 text-brass animate-pulse" />
          <span>Free Nationwide Delivery</span>
        </div>
      </div>
    </div>
  );
}
