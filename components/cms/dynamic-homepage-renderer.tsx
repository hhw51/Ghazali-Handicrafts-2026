'use client';

import React from 'react';
import { HomepageSectionRecord } from '@/actions/admin-cms';
import { Product, Category } from '@/types/product';
import { HeroSection } from '@/components/home/sections/hero-section';
import { CategoryGridSection } from '@/components/home/sections/category-grid-section';
import { ProductShowcaseSection } from '@/components/home/sections/product-showcase-section';
import { EditorialBannerSection } from '@/components/home/sections/editorial-banner-section';
import { HeritageStorySection } from '@/components/home/sections/heritage-story-section';
import { TrustBarSection } from '@/components/home/sections/trust-bar-section';
import { ArtisanSpotlightSection } from '@/components/home/sections/artisan-spotlight-section';

interface DynamicHomepageRendererProps {
  sections: HomepageSectionRecord[];
  allProducts: Product[];
  categories: Category[];
}

const SECTION_COMPONENTS: Record<string, React.FC<any>> = {
  hero: HeroSection,
  category_grid: CategoryGridSection,
  product_showcase: ProductShowcaseSection,
  editorial_banner: EditorialBannerSection,
  heritage_story: HeritageStorySection,
  trust_bar: TrustBarSection,
  artisan_spotlight: ArtisanSpotlightSection,

  // Legacy type mappings for backward compatibility
  banner: EditorialBannerSection,
  product_grid: ProductShowcaseSection,
  category_row: CategoryGridSection,
  custom_columns: TrustBarSection,
};

export function DynamicHomepageRenderer({
  sections,
  allProducts,
  categories,
}: DynamicHomepageRendererProps) {
  const activeSections = sections.filter((s) => s.is_active);

  // Default fallback layout if no active CMS sections exist in database
  if (activeSections.length === 0) {
    return (
      <div className="space-y-16 pb-20">
        <HeroSection config={{ title: 'Authentic Heritage Handicrafts of Pakistan' }} />
        <CategoryGridSection config={{ headline: 'Explore Craft Lineages by Region' }} dbCategories={categories} />
        <ProductShowcaseSection config={{ headline: 'Curated Masterpiece Showcase', limit: 8 }} allProducts={allProducts} />
        <TrustBarSection config={{}} />
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-20">
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
