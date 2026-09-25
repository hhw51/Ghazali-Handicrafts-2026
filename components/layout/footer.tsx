'use client';

import React from 'react';
import Link from 'next/link';
import {
  PackageCheck,
  ShieldCheck,
  Truck,
  MapPin,
  MessageCircle,
  Building2,
  Award,
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';

export function Footer() {
  return (
    <>
      <footer className="w-full bg-[#141618] text-[#D5CCC0] pt-space-xl pb-margin border-t border-[#2A2E33]">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin">
          {/* Top Trust & Value Anchors Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg pb-space-xl border-b border-[#2A2E33]">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#00405C]/40 border border-[#C5A880]/30 rounded-lg text-[#C5A880] shrink-0">
                <PackageCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-semibold text-[#FAF8F5]">
                  Fragile-Safe Packaging
                </h4>
                <p className="text-xs text-[#D5CCC0]/70 mt-1 leading-relaxed">
                  Custom wooden crate buffering & multi-layer bubble wrapping engineered specifically for delicate ceramics and marble.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#00405C]/40 border border-[#C5A880]/30 rounded-lg text-[#C5A880] shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-semibold text-[#FAF8F5]">
                  Nationwide Cash on Delivery
                </h4>
                <p className="text-xs text-[#D5CCC0]/70 mt-1 leading-relaxed">
                  Pay safely upon parcel arrival anywhere in Pakistan. Standard dispatch within 24-48 business hours.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#00405C]/40 border border-[#C5A880]/30 rounded-lg text-[#C5A880] shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-semibold text-[#FAF8F5]">
                  Direct Artisan Fair Trade
                </h4>
                <p className="text-xs text-[#D5CCC0]/70 mt-1 leading-relaxed">
                  100% authentic hand-carved, thrown, and painted crafts commissioned directly from heritage master artisans.
                </p>
              </div>
            </div>
          </div>

          {/* Main Footer Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-lg py-space-xl border-b border-[#2A2E33]">
            {/* Column 1 & 2: Brand Info */}
            <div className="lg:col-span-2 space-y-space-md">
              <div className="flex items-center gap-space-sm">
                <Building2 className="w-6 h-6 text-[#C5A880]" />
                <span className="font-headline-sm text-headline-sm text-[#FAF8F5] tracking-tight">
                  Ghazali Handicrafts
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-[#D5CCC0]/80 max-w-md">
                Preserving fifty years of master Pakistani craftsmanship. Each artifact is cataloged with provenance documentation, kiln marks, and archival timber registration.
              </p>
              <div className="pt-space-xs space-y-1.5">
                <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-[#FAF8F5]/90">
                  <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                  <span>Artisan Hotline & Bespoke Inquiries:</span>
                </div>
                <a
                  href="https://wa.me/923104755973"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-headline-sm text-headline-sm text-[#C5A880] hover:underline tracking-wide block"
                >
                  +92 310 4755973
                </a>
              </div>
            </div>

            {/* Column 3: Craft Hubs */}
            <div>
              <h4 className="font-label-lg text-label-lg uppercase tracking-wider text-[#FAF8F5] mb-space-sm font-bold">
                Craft Hubs
              </h4>
              <ul className="space-y-2 font-body-sm text-body-sm text-[#D5CCC0]/80">
                <li>
                  <Link href="/products?category=blue-pottery" className="hover:text-[#FAF8F5] transition-colors">
                    Multan (Kashigari Blue Pottery)
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=swati-woodwork" className="hover:text-[#FAF8F5] transition-colors">
                    Swat Valley (Walnut Carvings)
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=chiseled-brass" className="hover:text-[#FAF8F5] transition-colors">
                    Peshawar (Hand-Beaten Brass)
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=marble-onyx" className="hover:text-[#FAF8F5] transition-colors">
                    Khewra (Natural Rock Salt)
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-[#FAF8F5] transition-colors">
                    Sillanwali (Lacquered Woodwork)
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Fragile Assurance */}
            <div>
              <h4 className="font-label-lg text-label-lg uppercase tracking-wider text-[#FAF8F5] mb-space-sm font-bold">
                Fragile Assurance
              </h4>
              <ul className="space-y-2 font-body-sm text-body-sm text-[#D5CCC0]/80">
                <li>
                  <span className="block text-[#FAF8F5]">Double-Crated Wooden Boxing</span>
                </li>
                <li>
                  <span className="block">Zero-Breakage Transit Guarantee</span>
                </li>
                <li>
                  <span className="block">Doorstep Inspection on Delivery</span>
                </li>
                <li>
                  <Link href="/products" className="hover:text-[#FAF8F5] transition-colors">
                    Artisan Provenance Certificate
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-[#FAF8F5] transition-colors">
                    International Crating Rates
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 5: Lahore Dispatch Address */}
            <div>
              <h4 className="font-label-lg text-label-lg uppercase tracking-wider text-[#FAF8F5] mb-space-sm font-bold">
                Lahore Dispatch
              </h4>
              <address className="not-italic font-body-sm text-body-sm text-[#D5CCC0]/80 space-y-1.5">
                <p className="text-[#FAF8F5] font-semibold">Flagship Studio & Dispatch Archive</p>
                <p>94-B/II Gulberg III, Lahore, Punjab</p>
                <p>Islamic Republic of Pakistan</p>
                <p className="text-[#C5A880] pt-1 text-xs">Mon - Sat: 10:00 AM - 08:00 PM PKT</p>
              </address>
            </div>
          </div>

          {/* Bottom Strip */}
          <div className="pt-space-md flex flex-col md:flex-row items-center justify-between gap-space-sm font-label-sm text-label-sm text-[#D5CCC0]/60">
            <p>© 1974–2026 Ghazali Handicrafts. Curated under the Pakistan Artisanal Preservation Trust.</p>
            <div className="flex items-center gap-space-md">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#25D366]" /> Nationwide White-Glove Transit
              </span>
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-[#25D366]" /> 100% Genuine Provenance
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Fixed Floating Bottom-Right Official WhatsApp Trigger Button */}
      <a
        href="https://wa.me/923104755973?text=Hello%20Ghazali%20Handicrafts%2C%20I%20have%20an%20artisan%20query."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Artisan Concierge"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-transform group cursor-pointer border-2 border-white/20"
      >
        <WhatsAppIcon className="w-7 h-7 text-white fill-current" />
        <span className="pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-[#141618] text-[#FAF8F5] font-label-sm text-label-sm uppercase tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md border border-[#2A2E33]">
          Chat with Artisan Concierge
        </span>
      </a>
    </>
  );
}
