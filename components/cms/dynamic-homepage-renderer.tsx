'use client';

import React from 'react';
import { HomepageSectionRecord } from '@/actions/admin-cms';
import { Product, Category } from '@/types/product';
import { AnnouncementBar } from '@/components/layout/announcement-bar';
import { HeroSection } from '@/components/home/sections/hero-section';
import { RegionsSection } from '@/components/home/sections/regions-section';
import { FeaturedMasterpiecesSection } from '@/components/home/sections/featured-masterpieces-section';
import { HeritageSpotlightSection } from '@/components/home/sections/heritage-spotlight-section';
import { CratingGuaranteeSection } from '@/components/home/sections/crating-guarantee-section';
import { LifestyleGiftSection } from '@/components/home/sections/lifestyle-gift-section';

interface DynamicHomepageRendererProps {
  sectionsList?: HomepageSectionRecord[];
  sectionsMap?: Record<string, any>;
  sections?: HomepageSectionRecord[];
  allProducts: Product[];
  categories: Category[];
}

export function DynamicHomepageRenderer({
  sectionsList = [],
  sectionsMap = {},
  sections = [],
  allProducts,
  categories,
}: DynamicHomepageRendererProps) {
  // Combine sections map lookup
  const activeSectionsList = sectionsList.length > 0 ? sectionsList : sections;
  
  // Extract configuration from O(1) map or settings/config
  const getSectionConfig = (type: string, legacyKey1?: string, legacyKey2?: string) => {
    if (sectionsMap[type]) return sectionsMap[type];
    if (legacyKey1 && sectionsMap[legacyKey1]) return sectionsMap[legacyKey1];
    if (legacyKey2 && sectionsMap[legacyKey2]) return sectionsMap[legacyKey2];

    const match = activeSectionsList.find(
      (s) => s.section_type === type || s.section_type === legacyKey1 || s.section_type === legacyKey2
    );
    return match ? match.settings || match.config || {} : {};
  };

  const announcementConfig = getSectionConfig('announcement_bar');
  const heroConfig = getSectionConfig('hero');
  const regionsConfig = getSectionConfig('regions_mastery', 'regions', 'category_grid');
  const featuredConfig = getSectionConfig('featured_masterpieces', 'product_showcase', 'product_grid');
  const heritageConfig = getSectionConfig('heritage_50_years', 'heritage_spotlight', 'heritage_story');
  const cratingConfig = getSectionConfig('fragile_guarantee', 'crating_guarantee', 'trust_bar');
  const lifestyleConfig = getSectionConfig('lifestyle_gifting', 'editorial_banner', 'banner');

  return (
    <div className="w-full space-y-0">
      <AnnouncementBar config={announcementConfig} />
      <HeroSection config={heroConfig} />
      <RegionsSection config={regionsConfig} dbCategories={categories} />
      <FeaturedMasterpiecesSection config={featuredConfig} allProducts={allProducts} />
      <HeritageSpotlightSection config={heritageConfig} />
      <CratingGuaranteeSection config={cratingConfig} />
      <LifestyleGiftSection config={lifestyleConfig} />
    </div>
  );
}
