import { createAdminClient } from '@/lib/supabase/admin';

export interface SiteSettings {
  id?: string;
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  hero_primary_cta_text: string;
  hero_primary_cta_link: string;
  hero_secondary_cta_text: string;
  hero_secondary_cta_link: string;
  hero_image_url: string;
  ticker_text: string;
  story_heading: string;
  story_subheading: string;
  story_image_before: string;
  story_image_after: string;
  announcement_banner: string;
  announcement_active: boolean;
  active_theme_mode?: string;
  updated_at?: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  hero_badge: 'Handcrafted in Pakistan • Est. Tradition',
  hero_title: 'Authentic Artisanal Heritage',
  hero_subtitle: 'Discover centuries-old craft from the artisans of Anarkali Bazaar, Multan, and Swat.',
  hero_primary_cta_text: 'Explore Collections',
  hero_primary_cta_link: '/products',
  hero_secondary_cta_text: 'Visit Store',
  hero_secondary_cta_link: 'https://maps.app.goo.gl/fbt2FunN1MfoD7Px6',
  hero_image_url: '/images/hero/craft-hero.png',
  ticker_text: 'Multani Blue Pottery • Swati Wood Carving • Chinioti Brass Inlay • Authentic Truck Art • Hand-Turned Marble',
  story_heading: 'From Raw Earth to Finished Relic',
  story_subheading: 'Each piece tells a story of patience, kiln-fire, and cultural preservation.',
  story_image_before: '/images/collections/blue-pottery.png',
  story_image_after: '/images/hero/craft-hero.png',
  announcement_banner: 'Free fragile-safe delivery across Pakistan on orders over Rs. 5,000',
  announcement_active: true,
  active_theme_mode: 'auto',
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 'homepage_config')
      .single();

    if (error || !data) {
      // Return default site settings if table/record not created yet
      return DEFAULT_SITE_SETTINGS;
    }

    return {
      hero_badge: data.hero_badge ?? DEFAULT_SITE_SETTINGS.hero_badge,
      hero_title: data.hero_title ?? DEFAULT_SITE_SETTINGS.hero_title,
      hero_subtitle: data.hero_subtitle ?? DEFAULT_SITE_SETTINGS.hero_subtitle,
      hero_primary_cta_text: data.hero_primary_cta_text ?? DEFAULT_SITE_SETTINGS.hero_primary_cta_text,
      hero_primary_cta_link: data.hero_primary_cta_link ?? DEFAULT_SITE_SETTINGS.hero_primary_cta_link,
      hero_secondary_cta_text: data.hero_secondary_cta_text ?? DEFAULT_SITE_SETTINGS.hero_secondary_cta_text,
      hero_secondary_cta_link: data.hero_secondary_cta_link ?? DEFAULT_SITE_SETTINGS.hero_secondary_cta_link,
      hero_image_url: data.hero_image_url || DEFAULT_SITE_SETTINGS.hero_image_url,
      ticker_text: data.ticker_text ?? DEFAULT_SITE_SETTINGS.ticker_text,
      story_heading: data.story_heading ?? DEFAULT_SITE_SETTINGS.story_heading,
      story_subheading: data.story_subheading ?? DEFAULT_SITE_SETTINGS.story_subheading,
      story_image_before: data.story_image_before || DEFAULT_SITE_SETTINGS.story_image_before,
      story_image_after: data.story_image_after || DEFAULT_SITE_SETTINGS.story_image_after,
      announcement_banner: data.announcement_banner ?? DEFAULT_SITE_SETTINGS.announcement_banner,
      announcement_active: data.announcement_active ?? DEFAULT_SITE_SETTINGS.announcement_active,
      active_theme_mode: data.active_theme_mode || DEFAULT_SITE_SETTINGS.active_theme_mode,
    };
  } catch (err) {
    console.error('getSiteSettings exception:', err);
    return DEFAULT_SITE_SETTINGS;
  }
}
