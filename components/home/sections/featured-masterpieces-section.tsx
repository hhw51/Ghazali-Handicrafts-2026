'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, Star, CheckCircle } from 'lucide-react';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/cart-store';

export interface FeaturedMasterpiecesSectionProps {
  config?: {
    headline?: string;
    subheadline?: string;
    limit?: number;
  };
  allProducts?: Product[];
}

const FALLBACK_PRODUCTS: Partial<Product>[] = [
  {
    id: 'fb-1',
    name: 'Handcrafted Marble Sailboat Desk Clock',
    slug: 'marble-sailboat-clock',
    price: 1800,
    in_stock: true,
    is_featured: true,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB-ldg8jpKFwoWE3yBgeJIo-lvOxOyDTLElr23Vr7ED7pDc0nNpIl1m7DDWUwSTaB4ldsMrpLpIhjNkur7cursL1UnjUchvRpL4bvzOpuzIavPfZKX7_4Bu5MR0ndGxvXqt_h2JMWV78W13Sgb-Nca-eepUMKXNTpbUdwXF14nhLRkuFD5syv0prV2e2OYEH4XurDPzmOkZPiWoeGB5qvQxU9X98lp_pozBJy3L2XLOZwjE1Ul6pLfF',
    ],
    category: { id: 'c1', name: 'Taxila Marble', slug: 'marble-onyx', created_at: '2026-01-01T00:00:00Z' },
    dimensions: '6 inches',
  },
  {
    id: 'fb-2',
    name: 'Multani Cobalt Floral Fluted Amphora Vase',
    slug: 'multani-cobalt-amphora-vase',
    price: 4600,
    in_stock: true,
    is_featured: true,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDlj4LaQyG6DOtjTc4WGzoHd0jDcrJfLIMe_QU-Al1IwscsXJC7qvrWOIvPk82tN7mw_GquUREhglrjzYGGNJxnEBiqeULFekwNYOs6uBiQgFb7eom9AkKSRIwtgLfrMC2aDwbxVD3Vipj6kHdHvscSotnhmHvsj-h133cJDLo-wPPUV6-MdCLXWB8yMqAjF0GiAuBsfsxY2tNAmJsfXUe5wYVqqCWtk1RBgu050udsfgUH9nRwWUjS',
    ],
    category: { id: 'c2', name: 'Multan Glazes', slug: 'blue-pottery', created_at: '2026-01-01T00:00:00Z' },
    dimensions: '14 inches',
  },
  {
    id: 'fb-3',
    name: 'Swati Relief Carved Walnut Coffee Tray',
    slug: 'swati-carved-coffee-tray',
    price: 5200,
    in_stock: true,
    is_featured: true,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDbP32QrwCLHRVW81bYtfhNaiw9WdQMW8SitwVtiLfDQ5Oj5r3M1YJfSJdjf75v9-D4wSlDuvL3d5fMK6WiFTAXamH00bHOzqTylnlZnoME_fGUCyLHbq7-RdUPcg5THo7lm_IauQiOo_W4gHBcA8qKbZ8MNPE-SEczheZtjrjqBwb4UvZY8h53gBiNgnM4WR12wuEXIa5tClTmwGr3S79FZEleK5y8uyIc-jLg51ef70XK1c2FmRSe',
    ],
    category: { id: 'c3', name: 'Swat Valley', slug: 'swati-woodwork', created_at: '2026-01-01T00:00:00Z' },
    dimensions: '18 x 12 inches',
  },
  {
    id: 'fb-4',
    name: 'Raw Himalayan Amber Salt Lamp with Dimmer',
    slug: 'himalayan-amber-salt-lamp',
    price: 2450,
    in_stock: true,
    is_featured: true,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC3uhLXNTsgdMGww9plo1VLs07o1a2vG4KHcGslCy1XuS3M6RyBS9zqzw5c0zw-0sW__FhwtBsUzdakKALnaplF5hBOLwvLNGrc5Wqh2UBurlkhFLbep0F8Wy7sh_OtgPDqE6hfRBLdSLL2BBsUb3gugHcnUsV1kaDZ5QBicnTwCYv6gMSpUDouXnFgiy_lXfPRCJXUCsr2gj6t-OkE2Ehp5z1vRJLtISWAE3C6-lDBnOoAcqDTkOf0',
    ],
    category: { id: 'c4', name: 'Khewra Range', slug: 'marble-onyx', created_at: '2026-01-01T00:00:00Z' },
    dimensions: '3.5 kg',
  },
];

const CATEGORY_TABS = [
  { key: 'all', label: 'All Crafts' },
  { key: 'multani', label: 'Multani Glazes', matchSlugs: ['blue-pottery', 'multani'] },
  { key: 'swati', label: 'Swati Carvings', matchSlugs: ['swati-woodwork', 'swati'] },
  { key: 'marble', label: 'Marble & Onyx', matchSlugs: ['marble-onyx', 'marble'] },
  { key: 'brass', label: 'Brass & Salt', matchSlugs: ['chiseled-brass', 'truck-art', 'brass', 'salt'] },
];

export function FeaturedMasterpiecesSection({
  config,
  allProducts,
}: FeaturedMasterpiecesSectionProps) {
  const headline = config?.headline || 'Featured Artisanal Masterpieces';
  const addItem = useCartStore((state) => state.addItem);
  const [activeTab, setActiveTab] = useState('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Combine DB products or fallback
  const sourceProducts: Product[] =
    allProducts && allProducts.length > 0
      ? allProducts.filter((p) => p.is_featured || p.in_stock)
      : (FALLBACK_PRODUCTS as Product[]);

  const limit = config?.limit || 8;
  const filteredProducts = sourceProducts
    .filter((p) => {
      if (activeTab === 'all') return true;
      const tabDef = CATEGORY_TABS.find((t) => t.key === activeTab);
      if (!tabDef?.matchSlugs) return true;
      const catSlug = (p.category?.slug || '').toLowerCase();
      const catName = (p.category?.name || p.name || '').toLowerCase();
      return tabDef.matchSlugs.some((s) => catSlug.includes(s) || catName.includes(s));
    })
    .slice(0, limit);

  const handleQuickAdd = (p: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const success = addItem(p, 1);
    if (success) {
      setToastMessage(`Added "${p.name}" to cart (COD)`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <section className="w-full py-space-xl px-margin-mobile md:px-margin-tablet lg:px-margin bg-surface relative">
      {/* Quick Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 right-6 z-50 bg-[#141A1F] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-brass/30 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle className="w-5 h-5 text-[#25D366]" />
          <div>
            <h4 className="font-label-md text-label-md uppercase tracking-wider font-bold text-white">
              Added to Cart
            </h4>
            <p className="font-body-sm text-body-sm text-white/80 text-[12px]">{toastMessage}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-space-lg">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-sm">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold block mb-1">
              Direct From Master Ustads
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">{headline}</h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 font-label-lg text-label-lg text-primary hover:text-primary/80 transition-colors group cursor-pointer"
          >
            <span>View Entire Collection</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Filter Chips Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-full font-label-md text-label-md uppercase tracking-wider transition-colors whitespace-nowrap shadow-xs cursor-pointer ${
                  isActive
                    ? 'bg-[#00405C] text-white'
                    : 'bg-surface-container-high text-on-surface hover:bg-surface-variant'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 4-Column Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {filteredProducts.map((product) => {
            const displayImage =
              product.images && product.images[0]
                ? product.images[0]
                : '/images/hero/craft-hero.png';
            const categoryName = product.category?.name || 'Handcrafted Art';

            return (
              <div
                key={product.id}
                className="group flex flex-col bg-surface-container rounded-xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-surface-container-high"
              >
                <Link
                  href={`/products/${product.slug}`}
                  className="relative w-full aspect-square bg-surface-container-high overflow-hidden p-space-sm flex items-center justify-center block"
                >
                  <Image
                    src={displayImage}
                    alt={product.name}
                    fill
                    className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Badges */}
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-surface/95 font-label-sm text-label-sm uppercase tracking-wider text-on-surface shadow-xs font-semibold border border-surface-container-highest">
                    {categoryName}
                  </span>
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-[#1E4B3E] font-label-sm text-label-sm uppercase tracking-wider text-white shadow-xs font-semibold">
                    In Stock (COD)
                  </span>

                  {/* Quick Add Slide Up Button */}
                  <button
                    type="button"
                    onClick={(e) => handleQuickAdd(product, e)}
                    className="absolute bottom-3 inset-x-3 py-2.5 rounded bg-[#00405C] hover:bg-[#003248] text-white font-label-md text-label-md uppercase tracking-wider shadow-md translate-y-14 group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-1.5 cursor-pointer z-10"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Quick Add to Cart (COD)</span>
                  </button>
                </Link>

                <div className="p-space-md flex flex-col flex-1 justify-between space-y-2">
                  <div>
                    <div className="flex items-center justify-between text-on-surface-variant text-[12px] mb-1 font-mono">
                      <span>{product.dimensions || 'Archival Quality'}</span>
                      <span className="flex items-center text-amber-600 gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> 4.9 (42)
                      </span>
                    </div>
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="font-headline-sm text-[1.125rem] text-on-surface leading-snug group-hover:text-primary transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                  </div>
                  <div className="flex items-baseline justify-between pt-2 border-t border-surface-container-high">
                    <span className="font-headline-sm text-headline-sm text-primary font-bold">
                      Rs. {product.price.toLocaleString()}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                      PKR Nationwide
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export { FeaturedMasterpiecesSection as ProductShowcaseSection };
