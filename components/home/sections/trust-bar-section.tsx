'use client';

import { Truck, ShieldCheck, Award, HeartHandshake } from 'lucide-react';

export interface TrustBarItem {
  icon?: string;
  title: string;
  subtitle: string;
}

export interface TrustBarConfig {
  items?: TrustBarItem[];
}

const DEFAULT_TRUST_ITEMS: TrustBarItem[] = [
  {
    icon: 'truck',
    title: '100% Cash on Delivery',
    subtitle: 'Inspect & pay at your doorstep across all Pakistan cities.',
  },
  {
    icon: 'shield',
    title: 'Fragile-Crate Protection',
    subtitle: 'Custom shock-absorbing wooden packaging for safe arrival.',
  },
  {
    icon: 'award',
    title: 'Authentic Craft Lineage',
    subtitle: 'Directly sourced from master artisans in Multan, Swat & Chiniot.',
  },
  {
    icon: 'heart',
    title: 'Fair Artisan Sourcing',
    subtitle: 'Empowering traditional craft families with direct fair wages.',
  },
];

export function TrustBarSection({ config }: { config: TrustBarConfig }) {
  const items = config.items && config.items.length > 0 ? config.items : DEFAULT_TRUST_ITEMS;

  const renderIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case 'truck':
        return <Truck className="w-6 h-6 text-lapis" />;
      case 'shield':
        return <ShieldCheck className="w-6 h-6 text-terracotta" />;
      case 'award':
        return <Award className="w-6 h-6 text-brass" />;
      case 'heart':
      default:
        return <HeartHandshake className="w-6 h-6 text-emerald-800" />;
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-sandstone rounded-2xl border border-border p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 shadow-craft-sm">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-4 p-2">
            <div className="p-3 bg-parchment rounded-xl border border-border shadow-xs shrink-0">
              {renderIcon(item.icon)}
            </div>
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-charcoal text-base">{item.title}</h4>
              <p className="text-xs text-muted font-sans leading-relaxed">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
