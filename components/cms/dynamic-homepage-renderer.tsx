'use client';

import React from 'react';
import { HomepageSectionRecord } from '@/actions/admin-cms';
import { Product, Category } from '@/types/product';
import { HeroSection } from '@/components/home/sections/hero-section';
import { RegionsSection } from '@/components/home/sections/regions-section';
import { FeaturedMasterpiecesSection } from '@/components/home/sections/featured-masterpieces-section';
import { HeritageSpotlightSection } from '@/components/home/sections/heritage-spotlight-section';
import { CratingGuaranteeSection } from '@/components/home/sections/crating-guarantee-section';
import { LifestyleGiftSection } from '@/components/home/sections/lifestyle-gift-section';

interface DynamicHomepageRendererProps {
  sections: HomepageSectionRecord[];
  allProducts: Product[];
  categories: Category[];
}

const SECTION_COMPONENTS: Record<string, React.FC<any>> = {
  hero: HeroSection,
  category_grid: RegionsSection,
  regions: RegionsSection,
  product_showcase: FeaturedMasterpiecesSection,
  featured_masterpieces: FeaturedMasterpiecesSection,
  editorial_banner: LifestyleGiftSection,
  lifestyle_gifting: LifestyleGiftSection,
  heritage_story: HeritageSpotlightSection,
  heritage_spotlight: HeritageSpotlightSection,
  trust_bar: CratingGuaranteeSection,
  crating_guarantee: CratingGuaranteeSection,

  // Legacy type mappings for backward compatibility
  banner: LifestyleGiftSection,
  product_grid: FeaturedMasterpiecesSection,
  category_row: RegionsSection,
  custom_columns: CratingGuaranteeSection,
};

export function DynamicHomepageRenderer({
  sections,
  allProducts,
  categories,
}: DynamicHomepageRendererProps) {
  const activeSections = sections.filter((s) => s.is_active);

  // Full high-end artisan layout sequence from code.html if no active CMS overrides are set in DB
  if (activeSections.length === 0) {
    return (
      <div className="w-full space-y-0">
        <HeroSection />
        <RegionsSection dbCategories={categories} />
        <FeaturedMasterpiecesSection allProducts={allProducts} />
        <HeritageSpotlightSection />
        <CratingGuaranteeSection />
        <LifestyleGiftSection />
      </div>
    );
  }

  return (
    <div className="w-full space-y-0">
      {activeSections.map((sec) => {
        const Component = SECTION_COMPONENTS[sec.section_type];
        if (!Component) return null;

        const config = sec.settings || sec.config || {};

        return (
          <React.Fragment key={sec.id}>
            <Component
              config={config}
              allProducts={allProducts}
              categories={categories}
              dbCategories={categories}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
}
