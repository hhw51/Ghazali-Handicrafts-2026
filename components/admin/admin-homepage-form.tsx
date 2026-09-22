'use client';

import { useState } from 'react';
import { SiteSettings } from '@/lib/site-settings';
import { updateSiteSettingsAction } from '@/actions/admin-settings';
import { Sparkles, Save, UploadCloud, CheckCircle2, AlertCircle, RefreshCw, Layout, Megaphone, Image as ImageIcon } from 'lucide-react';

interface AdminHomepageFormProps {
  initialSettings: SiteSettings;
}

export function AdminHomepageForm({ initialSettings }: AdminHomepageFormProps) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Hero state
  const [heroBadge, setHeroBadge] = useState(initialSettings.hero_badge);
  const [heroTitle, setHeroTitle] = useState(initialSettings.hero_title);
  const [heroSubtitle, setHeroSubtitle] = useState(initialSettings.hero_subtitle);
  const [heroPrimaryCtaText, setHeroPrimaryCtaText] = useState(initialSettings.hero_primary_cta_text);
  const [heroPrimaryCtaLink, setHeroPrimaryCtaLink] = useState(initialSettings.hero_primary_cta_link);
  const [heroSecondaryCtaText, setHeroSecondaryCtaText] = useState(initialSettings.hero_secondary_cta_text);
  const [heroSecondaryCtaLink, setHeroSecondaryCtaLink] = useState(initialSettings.hero_secondary_cta_link);
  const [heroImageUrl, setHeroImageUrl] = useState(initialSettings.hero_image_url);
  const [heroImageBase64, setHeroImageBase64] = useState<{ name: string; type: string; base64: string } | undefined>(undefined);

  // Ticker & Announcement state
  const [tickerText, setTickerText] = useState(initialSettings.ticker_text);
  const [announcementBanner, setAnnouncementBanner] = useState(initialSettings.announcement_banner);
  const [announcementActive, setAnnouncementActive] = useState(initialSettings.announcement_active);

  // Artisan Story state
  const [storyHeading, setStoryHeading] = useState(initialSettings.story_heading);
  const [storySubheading, setStorySubheading] = useState(initialSettings.story_subheading);
  const [storyImageBeforeUrl, setStoryImageBeforeUrl] = useState(initialSettings.story_image_before);
  const [storyImageBeforeBase64, setStoryImageBeforeBase64] = useState<{ name: string; type: string; base64: string } | undefined>(undefined);
  const [storyImageAfterUrl, setStoryImageAfterUrl] = useState(initialSettings.story_image_after);
  const [storyImageAfterBase64, setStoryImageAfterBase64] = useState<{ name: string; type: string; base64: string } | undefined>(undefined);

  const compressImage = (file: File, maxWidth = 1400, quality = 0.85): Promise<{ name: string; type: string; base64: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
          }

          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve({
            name: file.name.replace(/\.[^/.]+$/, '') + '.jpg',
            type: 'image/jpeg',
            base64: compressedBase64,
          });
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageFileChange = async (
    file: File | null,
    setter: (obj: { name: string; type: string; base64: string }) => void
  ) => {
    if (!file) return;
    const compressed = await compressImage(file);
    setter(compressed);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    const payload = {
      hero_badge: heroBadge.trim(),
      hero_title: heroTitle.trim(),
      hero_subtitle: heroSubtitle.trim(),
      hero_primary_cta_text: heroPrimaryCtaText.trim(),
      hero_primary_cta_link: heroPrimaryCtaLink.trim(),
      hero_secondary_cta_text: heroSecondaryCtaText.trim(),
      hero_secondary_cta_link: heroSecondaryCtaLink.trim(),
      hero_image_url: heroImageUrl,
      hero_image_base64: heroImageBase64,
      ticker_text: tickerText.trim(),
      announcement_banner: announcementBanner.trim(),
      announcement_active: announcementActive,
      story_heading: storyHeading.trim(),
      story_subheading: storySubheading.trim(),
      story_image_before: storyImageBeforeUrl,
      story_image_before_base64: storyImageBeforeBase64,
      story_image_after: storyImageAfterUrl,
      story_image_after_base64: storyImageAfterBase64,
    };

    const res = await updateSiteSettingsAction(payload);
    setLoading(false);

    if (res.success) {
      setToast({ type: 'success', message: '✓ Home Page CMS content updated and published live!' });
      setTimeout(() => setToast(null), 4000);
    } else {
      setToast({ type: 'error', message: res.error || 'Failed to update Home Page settings.' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`p-4 rounded-xl shadow-craft-md border flex items-center gap-3 animate-in fade-in duration-200 ${
            toast.type === 'error'
              ? 'bg-red-50 text-red-800 border-red-200'
              : 'bg-emerald-50 text-emerald-900 border-emerald-300'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          )}
          <span className="text-xs font-semibold">{toast.message}</span>
        </div>
      )}

      {/* 1. Hero Section CMS Block */}
      <div className="bg-sandstone rounded-2xl border border-border p-6 shadow-craft-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-border/80 pb-4">
          <Layout className="w-5 h-5 text-lapis" />
          <h2 className="font-serif text-lg font-bold text-charcoal">Hero Section CMS</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">Hero Top Badge Text</label>
            <input
              type="text"
              value={heroBadge}
              onChange={(e) => setHeroBadge(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-parchment border border-border rounded-md focus:ring-1 focus:ring-brass text-charcoal font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">Hero Title Heading</label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-parchment border border-border rounded-md focus:ring-1 focus:ring-brass text-charcoal font-serif font-bold"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1">Hero Subtitle Narrative</label>
          <textarea
            rows={2}
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-parchment border border-border rounded-md focus:ring-1 focus:ring-brass text-charcoal"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">Primary CTA Button Text</label>
            <input
              type="text"
              value={heroPrimaryCtaText}
              onChange={(e) => setHeroPrimaryCtaText(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-parchment border border-border rounded-md focus:ring-1 focus:ring-brass text-charcoal"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">Primary CTA Link</label>
            <input
              type="text"
              value={heroPrimaryCtaLink}
              onChange={(e) => setHeroPrimaryCtaLink(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-parchment border border-border rounded-md focus:ring-1 focus:ring-brass text-charcoal font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">Secondary CTA Button Text</label>
            <input
              type="text"
              value={heroSecondaryCtaText}
              onChange={(e) => setHeroSecondaryCtaText(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-parchment border border-border rounded-md focus:ring-1 focus:ring-brass text-charcoal"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">Secondary CTA Link</label>
            <input
              type="text"
              value={heroSecondaryCtaLink}
              onChange={(e) => setHeroSecondaryCtaLink(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-parchment border border-border rounded-md focus:ring-1 focus:ring-brass text-charcoal font-mono"
            />
          </div>
        </div>

        {/* Hero Image Showcase Uploader */}
        <div className="p-4 bg-parchment rounded-xl border border-border space-y-3">
          <label className="block text-xs font-semibold text-charcoal flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-lapis" /> Hero Banner Showcase Image
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-24 h-28 relative bg-sandstone rounded-lg border border-border overflow-hidden shrink-0 shadow-xs">
              <img
                src={heroImageBase64?.base64 || heroImageUrl || '/images/hero/craft-hero.png'}
                alt="Hero preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2 w-full">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageFileChange(e.target.files?.[0] || null, setHeroImageBase64)}
                className="text-xs text-muted cursor-pointer file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-lapis file:text-parchment hover:file:bg-lapis/90"
              />
              <p className="text-[11px] text-muted">
                Recommended: 1200x1500px high-resolution craft photo. Canvas compressed automatically.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Announcement Banner & Scrolling Ticker CMS Block */}
      <div className="bg-sandstone rounded-2xl border border-border p-6 shadow-craft-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-border/80 pb-4">
          <Megaphone className="w-5 h-5 text-terracotta" />
          <h2 className="font-serif text-lg font-bold text-charcoal">Announcements & Ticker CMS</h2>
        </div>

        <div className="flex items-center justify-between p-4 bg-parchment rounded-xl border border-border">
          <div>
            <span className="font-semibold text-xs text-charcoal block">Top Announcement Bar Visibility</span>
            <span className="text-[11px] text-muted">Toggle top site header notification banner on/off.</span>
          </div>
          <button
            type="button"
            onClick={() => setAnnouncementActive(!announcementActive)}
            className={`px-4 py-1.5 rounded-full font-bold text-xs transition-colors ${
              announcementActive
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-terracotta/10 text-terracotta border border-terracotta/30'
            }`}
          >
            {announcementActive ? '✓ Banner Active' : '✕ Banner Hidden'}
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1">Top Announcement Banner Text</label>
          <input
            type="text"
            value={announcementBanner}
            onChange={(e) => setAnnouncementBanner(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-parchment border border-border rounded-md focus:ring-1 focus:ring-brass text-charcoal font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1">Scrolling Marquee Ticker Text</label>
          <input
            type="text"
            value={tickerText}
            onChange={(e) => setTickerText(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-parchment border border-border rounded-md focus:ring-1 focus:ring-brass text-charcoal font-medium"
          />
        </div>
      </div>

      {/* 3. Artisan Story Spotlight CMS Block */}
      <div className="bg-sandstone rounded-2xl border border-border p-6 shadow-craft-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-border/80 pb-4">
          <Sparkles className="w-5 h-5 text-brass" />
          <h2 className="font-serif text-lg font-bold text-charcoal">Artisan Story Spotlight CMS</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">Story Heading</label>
            <input
              type="text"
              value={storyHeading}
              onChange={(e) => setStoryHeading(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-parchment border border-border rounded-md focus:ring-1 focus:ring-brass text-charcoal font-serif font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">Story Subheading / Technique</label>
            <textarea
              rows={2}
              value={storySubheading}
              onChange={(e) => setStorySubheading(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-parchment border border-border rounded-md focus:ring-1 focus:ring-brass text-charcoal"
            />
          </div>
        </div>

        {/* Dual Before / After Image Uploaders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-parchment rounded-xl border border-border space-y-3">
            <label className="block text-xs font-semibold text-charcoal">Workshop / Kiln Image (Before)</label>
            <div className="flex items-center gap-3">
              <div className="w-20 h-24 relative bg-sandstone rounded-lg border border-border overflow-hidden shrink-0">
                <img
                  src={storyImageBeforeBase64?.base64 || storyImageBeforeUrl || '/images/collections/blue-pottery.png'}
                  alt="Story before preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageFileChange(e.target.files?.[0] || null, setStoryImageBeforeBase64)}
                className="text-xs text-muted cursor-pointer file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-sandstone file:text-charcoal"
              />
            </div>
          </div>

          <div className="p-4 bg-parchment rounded-xl border border-border space-y-3">
            <label className="block text-xs font-semibold text-charcoal">Finished Relic Image (After)</label>
            <div className="flex items-center gap-3">
              <div className="w-20 h-24 relative bg-sandstone rounded-lg border border-border overflow-hidden shrink-0">
                <img
                  src={storyImageAfterBase64?.base64 || storyImageAfterUrl || '/images/hero/craft-hero.png'}
                  alt="Story after preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageFileChange(e.target.files?.[0] || null, setStoryImageAfterBase64)}
                className="text-xs text-muted cursor-pointer file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-sandstone file:text-charcoal"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Floating Action Bar */}
      <div className="sticky bottom-6 z-30 flex items-center justify-between p-4 bg-charcoal text-parchment border-2 border-brass/60 rounded-2xl shadow-craft-lg">
        <span className="text-xs font-serif font-bold text-brass">Home Page CMS Settings</span>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-lapis hover:bg-lapis/90 text-parchment text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-craft-sm"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-brass" /> Publishing Live Changes...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-brass" /> Save & Publish Home Page CMS
            </>
          )}
        </button>
      </div>
    </form>
  );
}
