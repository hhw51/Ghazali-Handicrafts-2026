'use client';

import React from 'react';
import { Truck, ShieldCheck, Sparkles } from 'lucide-react';

export interface AnnouncementBarConfig {
  visible?: boolean;
  is_active?: boolean;
  text?: string;
  ticker?: string;
}

export function AnnouncementBar({ config }: { config?: AnnouncementBarConfig }) {
  const isVisible = config?.visible !== false && config?.is_active !== false;

  if (!isVisible) {
    return null;
  }

  const announcementText =
    config?.text ||
    'Nationwide Cash on Delivery | Double-Crated Fragile Protection | Free Shipping Above Rs. 10,000';
  const tickerText = config?.ticker || 'Archival Craftsmanship Since 1974';

  return (
    <div className="bg-[#1E4B3E] text-white px-margin-mobile md:px-margin-tablet lg:px-margin h-8 flex items-center justify-between overflow-hidden text-xs font-sans">
      <div className="flex items-center gap-space-sm mx-auto md:mx-0 text-center">
        <Sparkles className="w-3.5 h-3.5 text-[#25D366] animate-pulse" />
        <span className="font-label-sm text-label-sm tracking-widest uppercase text-white/90">
          {announcementText}
        </span>
      </div>

      <div className="hidden lg:flex items-center gap-space-xs font-label-sm text-label-sm text-white/80">
        <ShieldCheck className="w-3.5 h-3.5 text-[#25D366]" />
        <span>{tickerText}</span>
      </div>
    </div>
  );
}
