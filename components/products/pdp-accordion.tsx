'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown, Sparkles, Ruler, ShieldAlert } from 'lucide-react';
import { Product } from '@/types/product';

interface AccordionSectionProps {
  product: Product;
}

export function AccordionSection({ product }: AccordionSectionProps) {
  return (
    <Accordion.Root type="multiple" defaultValue={['item-1']} className="w-full space-y-2">
      {/* 1. Craft Heritage & Provenance */}
      <Accordion.Item
        value="item-1"
        className="bg-sandstone rounded-lg border border-border overflow-hidden"
      >
        <Accordion.Trigger className="w-full px-5 py-4 flex items-center justify-between font-serif text-base font-semibold text-charcoal hover:bg-chiseled/50 transition-colors group">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-lapis" /> Craft Heritage & Provenance
          </span>
          <ChevronDown className="w-4 h-4 text-muted group-data-[state=open]:rotate-180 transition-transform duration-200" />
        </Accordion.Trigger>
        <Accordion.Content className="px-5 pb-5 pt-1 text-xs text-charcoal/80 leading-relaxed font-sans space-y-2 border-t border-border/40">
          <p>{product.long_description || product.short_description || 'Handcrafted by master Pakistani artisans using centuries-old techniques.'}</p>
          {product.colors && (
            <p className="font-medium text-muted">
              <span className="text-charcoal font-semibold">Artisan Colorways:</span> {product.colors}
            </p>
          )}
          {product.design && (
            <p className="font-medium text-muted">
              <span className="text-charcoal font-semibold">Design / Pattern:</span> {product.design}
            </p>
          )}
        </Accordion.Content>
      </Accordion.Item>

      {/* 2. Dimensions & Weight */}
      <Accordion.Item
        value="item-2"
        className="bg-sandstone rounded-lg border border-border overflow-hidden"
      >
        <Accordion.Trigger className="w-full px-5 py-4 flex items-center justify-between font-serif text-base font-semibold text-charcoal hover:bg-chiseled/50 transition-colors group">
          <span className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-terracotta" /> Dimensions & Courier Weight
          </span>
          <ChevronDown className="w-4 h-4 text-muted group-data-[state=open]:rotate-180 transition-transform duration-200" />
        </Accordion.Trigger>
        <Accordion.Content className="px-5 pb-5 pt-1 text-xs text-charcoal/80 leading-relaxed font-sans space-y-2 border-t border-border/40">
          {product.size && (
            <p>
              <span className="font-semibold text-charcoal">Physical Size:</span> {product.size}
            </p>
          )}
          <p>
            <span className="font-semibold text-charcoal">Volumetric Weight:</span> {product.weight || 1.5} kg (Calculated for courier tariff)
          </p>
        </Accordion.Content>
      </Accordion.Item>

      {/* 3. Fragile Care Instructions */}
      <Accordion.Item
        value="item-3"
        className="bg-sandstone rounded-lg border border-border overflow-hidden"
      >
        <Accordion.Trigger className="w-full px-5 py-4 flex items-center justify-between font-serif text-base font-semibold text-charcoal hover:bg-chiseled/50 transition-colors group">
          <span className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-brass" /> Fragile Handling & Maintenance Care
          </span>
          <ChevronDown className="w-4 h-4 text-muted group-data-[state=open]:rotate-180 transition-transform duration-200" />
        </Accordion.Trigger>
        <Accordion.Content className="px-5 pb-5 pt-1 text-xs text-charcoal/80 leading-relaxed font-sans space-y-2 border-t border-border/40">
          <ul className="list-disc pl-4 space-y-1">
            <li>Hand wash ceramic blue pottery with mild dish soap; avoid abrasive steel wool scouring pads.</li>
            <li>Dust carved Swati walnut woodwork with a dry microfiber cloth and polish with beeswax annually.</li>
            <li>Wipe marble and onyx items with a damp soft cloth to preserve natural translucent sheen.</li>
            <li>Packed securely in customized multi-layer foam and wooden crate buffer for 100% transit safety.</li>
          </ul>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
