export type FestivalThemeId =
  | 'none'
  | 'independence_day'
  | 'defence_day'
  | 'eid_milad'
  | 'quaid_day'
  | 'new_year';

export interface FestivalThemeConfig {
  id: FestivalThemeId;
  name: string;
  badgeText: string;
  bannerMessage: string;
  bannerBg: string;
  textColor: string;
  accentColor: string;
  iconSymbol?: string;
}

export const FESTIVAL_THEMES: Record<FestivalThemeId, FestivalThemeConfig> = {
  none: {
    id: 'none',
    name: 'Standard Heritage Theme',
    badgeText: '',
    bannerMessage: '',
    bannerBg: 'bg-lapis',
    textColor: 'text-parchment',
    accentColor: 'text-brass',
  },
  independence_day: {
    id: 'independence_day',
    name: 'Independence Day (14 August)',
    badgeText: 'Azadi Edition 🇵🇰',
    bannerMessage: 'Celebrate Azadi with Heritage Craft — 100% Authentic Pakistani Artisanal Legacy',
    bannerBg: 'bg-emerald-900 border-b border-emerald-700',
    textColor: 'text-emerald-100',
    accentColor: 'text-amber-300',
    iconSymbol: '🇵🇰',
  },
  defence_day: {
    id: 'defence_day',
    name: 'Defence Day (6 September)',
    badgeText: 'Defence Day Tribute 🛡️',
    bannerMessage: 'Defence Day Special — Honoring Pakistan’s Heritage, Craftsmanship & Unity',
    bannerBg: 'bg-stone-900 border-b border-amber-600/40',
    textColor: 'text-amber-100',
    accentColor: 'text-amber-400',
    iconSymbol: '🛡️',
  },
  eid_milad: {
    id: 'eid_milad',
    name: 'Eid Milad-un-Nabi',
    badgeText: 'Festive Season 🌙',
    bannerMessage: 'Blessed Festive Season — Authentic Spiritual & Cultural Craftsmanship',
    bannerBg: 'bg-emerald-950 border-b border-amber-500/30',
    textColor: 'text-amber-100',
    accentColor: 'text-amber-300',
    iconSymbol: '🌙',
  },
  quaid_day: {
    id: 'quaid_day',
    name: 'Quaid-e-Azam Day (25 December)',
    badgeText: 'Quaid Day Tribute ⭐',
    bannerMessage: 'Quaid-e-Azam Day Tribute — Preserving Pakistan’s Rich Cultural Lineage',
    bannerBg: 'bg-lapis/95 border-b border-brass/50',
    textColor: 'text-parchment',
    accentColor: 'text-brass',
    iconSymbol: '⭐',
  },
  new_year: {
    id: 'new_year',
    name: 'New Year Celebration',
    badgeText: 'New Year Special ✨',
    bannerMessage: 'Happy New Year — Explore Our Luxury Artisanal Gifting Collection',
    bannerBg: 'bg-charcoal border-b border-amber-500/40',
    textColor: 'text-parchment',
    accentColor: 'text-brass',
    iconSymbol: '✨',
  },
};

export function getAutomatedFestivalTheme(overrideId?: string | null): FestivalThemeConfig {
  if (overrideId && overrideId !== 'auto' && overrideId in FESTIVAL_THEMES) {
    return FESTIVAL_THEMES[overrideId as FestivalThemeId];
  }

  const now = new Date();
  const month = now.getMonth() + 1; // 1 - 12
  const day = now.getDate();

  // 1. Independence Day (14 August): Aug 10 – Aug 16
  if (month === 8 && day >= 10 && day <= 16) {
    return FESTIVAL_THEMES.independence_day;
  }

  // 2. Defence Day (6 September): Sep 5 – Sep 7
  if (month === 9 && day >= 5 && day <= 7) {
    return FESTIVAL_THEMES.defence_day;
  }

  // 3. Quaid Day (25 December): Dec 24 – Dec 26
  if (month === 12 && day >= 24 && day <= 26) {
    return FESTIVAL_THEMES.quaid_day;
  }

  // 4. New Year: Dec 31 – Jan 2
  if ((month === 12 && day === 31) || (month === 1 && day <= 2)) {
    return FESTIVAL_THEMES.new_year;
  }

  return FESTIVAL_THEMES.none;
}
