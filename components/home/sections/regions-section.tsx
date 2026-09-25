'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Category } from '@/types/product';

export interface RegionsSectionProps {
  config?: {
    headline?: string;
    subheadline?: string;
  };
  dbCategories?: Category[];
}

const REGION_CARDS = [
  {
    slug: 'blue-pottery',
    title: 'Multani Kashigari',
    origin: 'South Punjab • 800-Yr Tradition',
    description: 'Cobalt & turquoise glazed urns, hanging architectural plates, and hand-painted tea sets.',
    pieceCount: '38 Cataloged Pieces',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA84W7YHyhir_Xypq6cKnyaPk1H4C-GA9lKe1hy1hgJGycBNmEnVQ6HZU-9-dIYzFQTQ9K8Y_sxwY7eyTcIWSsh5wfH09K-pYkd8av60agneFhH3uctpgxK_aPF2VhfzSndkz7gH3zyn2CY9E8-vBiSLHDWJT50X5RDMLzdag8W0JLjeBXeY0YceyGHYvfjMR8Ps9Eni31WUAkJoHFQJdtYK4XPCJFonFYzKZZBSlDg5nTjgZaV6z55',
    fallbackImage: '/images/collections/blue-pottery.png',
    badgeBg: 'bg-[#1E4B3E] text-white',
  },
  {
    slug: 'swati-woodwork',
    title: 'Swati Walnut Wood',
    origin: 'Khyber Pakhtunkhwa • Ustad Relief',
    description: 'Deep-chiseled art trays, heritage coffee tables, bridal chest panels, and jewelry coffers.',
    pieceCount: '24 Cataloged Pieces',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAnUK6NtEMlTaS0qGpUi4TPwm3YNw6PHqlDpnYilnc59eAecrPE7D1jjE1ktCiBSHuPmQmITv8Z6dXyIOrndFob0mO9Gb--qli_HhC45ShGb4zlxRpPgMrDRpSaIUp0eSzh_8f1S0RIApx13GSsLH5blzhRmSydUY_DRk00AiiFFi_U55aIkqLsc5WaofZQ8W5CrswwWUXjFvRIYf5cw1_5CgrTayVLTt46aV_0KDbh46GS43YhLhrg',
    fallbackImage: '/images/collections/swati-woodwork.png',
    badgeBg: 'bg-[#00405C] text-white',
  },
  {
    slug: 'truck-art',
    title: 'Pakistani Truck Art',
    origin: 'Chamka & Enamel Phool Patti',
    description: 'Hand-painted brass kettles, vibrant serving platters, and wooden nostalgic truck miniatures.',
    pieceCount: '19 Cataloged Pieces',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDwQTlyAWvY7Cl0CJgvByB8QtRiO4L-A2RZxOyMhG3_0HoZ4HLlpnJYB_f79Pp_2cLVprhJuy-WFfZxNwJbARevgi6Jn3_a3v2TBic29ZltBJzZ2Z_Z-mocFfMvxdFu2s0AhWbYEaa2PbnRehTjgdtqrG6qO6xgoJBU0aYdoq4yyIcrOcuDK-PYWpZlVIva8E0Fwnv_buVFtVG1imiPdkxncpMyE4EUyLe94SYryWqXigIn-DtAFgux',
    fallbackImage: '/images/collections/truck-art.png',
    badgeBg: 'bg-[#C5A880] text-black',
  },
  {
    slug: 'marble-onyx',
    title: 'Amber Salt & Brass',
    origin: 'Salt Range & Punjab Woodcarvers',
    description: 'Pure Khewra Himalayan rock lamps, heavy brass chatuwata, and lacquer-turned spice vessels.',
    pieceCount: '29 Cataloged Pieces',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAtAZBGENrQfRtsoWLrB3C_-rR1tjYhGnHmxKFUTCcOmhttTlSZqOToQP3XggVFMGAtSEX4BGK1cVXAe4xeG1iLizf7PRE_DzZYajnY7-Z1TDDOKjAZ5HKPyU2T5PN4SF0QgI7WOB81OiWPwPEq1SI7YA3rGx0QPMfdo7pxpvuzZ-q_JnahstJ89fZs6NqYrbBvoHgCcFwhUe4nSLiLpCz3tbZc3p-UNvFEUZZ-E5juDr_k6jn3-KWt',
    fallbackImage: '/images/collections/onyx-marble.png',
    badgeBg: 'bg-[#141A1F] text-white',
  },
];

export function RegionsSection({ config }: RegionsSectionProps) {
  const headline = config?.headline || 'Discover Crafts by Origin';
  const subheadline =
    config?.subheadline ||
    "Centuries of generational mastery across Pakistan's historic artisan valleys, curated with archival reverence.";

  return (
    <section className="w-full bg-surface-container-low py-space-xl px-margin-mobile md:px-margin-tablet lg:px-margin border-y border-surface-container-high">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm pb-space-lg">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold block mb-1">
              Authentic Regional Provenance
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">{headline}</h2>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
            {subheadline}
          </p>
        </div>

        {/* 4-Column Visual Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {REGION_CARDS.map((card) => (
            <Link
              key={card.slug}
              href={`/products?category=${card.slug}`}
              className="group relative rounded-xl overflow-hidden shadow-md bg-surface-container-high aspect-[3/4] flex flex-col justify-end p-space-md cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-surface-container-highest"
            >
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>

              <div className="relative z-10 space-y-1 text-white">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full font-label-sm text-label-sm uppercase tracking-wider mb-1 font-semibold ${card.badgeBg}`}
                >
                  {card.origin}
                </span>
                <h3 className="font-headline-sm text-headline-sm text-white">{card.title}</h3>
                <p className="font-body-sm text-body-sm text-white/90 line-clamp-2">
                  {card.description}
                </p>
                <div className="pt-2 flex items-center justify-between text-[#C5A880] font-label-sm text-label-sm uppercase tracking-widest">
                  <span>{card.pieceCount}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export { RegionsSection as CategoryGridSection };
