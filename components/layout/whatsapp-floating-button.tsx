'use client';

import React from 'react';
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';

export function WhatsAppFloatingButton() {
  const whatsappUrl = 'https://wa.me/923219981625?text=Hello%20Ghazali%20Handicrafts%2C%20I%20have%20an%20artisan%20query.';

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Artisan Concierge on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-transform group cursor-pointer border-2 border-white/20"
    >
      <WhatsAppIcon className="w-7 h-7 text-white fill-current" />
      <span className="pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-[#141618] text-[#FAF8F5] font-label-sm text-label-sm uppercase tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md border border-[#2A2E33]">
        Chat with Artisan Concierge
      </span>
    </a>
  );
}
