'use client';

import React, { useState } from 'react';
import {
  HomepageSectionRecord,
  saveHomepageSection,
  batchUpsertCmsSections,
  uploadCmsImage,
} from '@/actions/admin-cms';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Upload,
  LayoutTemplate,
  Grid,
  ShoppingBag,
  Sparkles,
  BookOpen,
  ShieldCheck,
  Award,
  Eye,
  EyeOff,
  RefreshCw,
  Video,
  Bell,
  Gift,
} from 'lucide-react';

interface AdminCmsEditorProps {
  initialSections: HomepageSectionRecord[];
}

const SECTION_KEYS = [
  { id: 'announcement_bar', label: 'Announcement & Ticker Bar', icon: Bell },
  { id: 'hero', label: 'Hero Magazine Banner', icon: LayoutTemplate },
  { id: 'regions_mastery', label: 'Regional Craft Hubs', icon: Grid },
  { id: 'featured_masterpieces', label: 'Featured Masterpieces Showcase', icon: ShoppingBag },
  { id: 'heritage_50_years', label: '50-Year Heritage & Mini-Doc', icon: BookOpen },
  { id: 'fragile_guarantee', label: 'Fragile Crating Guarantee', icon: ShieldCheck },
  { id: 'lifestyle_gifting', label: 'Lifestyle & Heritage Gifting', icon: Gift },
];

export function AdminCmsEditor({ initialSections }: AdminCmsEditorProps) {
  // Convert list to state map by section_type
  const buildInitialState = () => {
    const map: Record<string, Partial<HomepageSectionRecord>> = {};
    
    // Seed defaults
    SECTION_KEYS.forEach((sk, idx) => {
      map[sk.id] = {
        section_type: sk.id,
        position: idx,
        is_active: true,
        settings: {},
        config: {},
      };
    });

    // Populate from database records
    initialSections.forEach((sec) => {
      const typeKey = sec.section_type;
      const settings = sec.settings || sec.config || {};
      map[typeKey] = {
        ...sec,
        settings: settings,
        config: settings,
      };

      // Handle legacy key aliases
      if (typeKey === 'regions' || typeKey === 'category_grid') {
        map['regions_mastery'] = { ...sec, section_type: 'regions_mastery', settings };
      }
      if (typeKey === 'product_showcase' || typeKey === 'product_grid') {
        map['featured_masterpieces'] = { ...sec, section_type: 'featured_masterpieces', settings };
      }
      if (typeKey === 'heritage_spotlight' || typeKey === 'heritage_story') {
        map['heritage_50_years'] = { ...sec, section_type: 'heritage_50_years', settings };
      }
      if (typeKey === 'trust_bar' || typeKey === 'crating_guarantee') {
        map['fragile_guarantee'] = { ...sec, section_type: 'fragile_guarantee', settings };
      }
      if (typeKey === 'editorial_banner' || typeKey === 'banner') {
        map['lifestyle_gifting'] = { ...sec, section_type: 'lifestyle_gifting', settings };
      }
    });

    return map;
  };

  const [cmsState, setCmsState] = useState(buildInitialState());
  const [activeTab, setActiveTab] = useState('hero');
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [isPublishingAll, setIsPublishingAll] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleUpdateSetting = (sectionType: string, key: string, value: any) => {
    setCmsState((prev) => {
      const existing = prev[sectionType] || {
        section_type: sectionType,
        position: 0,
        is_active: true,
        settings: {},
      };
      const updatedSettings = {
        ...(existing.settings || existing.config || {}),
        [key]: value,
      };
      return {
        ...prev,
        [sectionType]: {
          ...existing,
          settings: updatedSettings,
          config: updatedSettings,
        },
      };
    });
  };

  const handleToggleActive = (sectionType: string) => {
    setCmsState((prev) => {
      const existing = prev[sectionType] || {
        section_type: sectionType,
        position: 0,
        is_active: true,
        settings: {},
      };
      return {
        ...prev,
        [sectionType]: {
          ...existing,
          is_active: !existing.is_active,
        },
      };
    });
  };

  const handleImageFileUpload = async (
    sectionType: string,
    settingKey: string,
    file: File
  ) => {
    const fieldId = `${sectionType}_${settingKey}`;
    setUploadingField(fieldId);
    const formData = new FormData();
    formData.append('file', file);

    const res = await uploadCmsImage(formData);
    setUploadingField(null);

    if (res.success && res.url) {
      handleUpdateSetting(sectionType, settingKey, res.url);
      showToast('✓ Image uploaded to Supabase Storage!');
    } else {
      showToast(res.error || 'Failed to upload image.', 'error');
    }
  };

  const handleSaveSection = async (sectionType: string) => {
    setSavingKey(sectionType);
    const sec = cmsState[sectionType];
    const res = await saveHomepageSection({
      ...sec,
      section_type: sectionType,
    });
    setSavingKey(null);

    if (res.success) {
      showToast(`✓ Published ${sectionType.replace(/_/g, ' ')} configuration!`);
    } else {
      showToast(res.error || 'Failed to save section', 'error');
    }
  };

  const handlePublishAll = async () => {
    setIsPublishingAll(true);
    const payload = Object.values(cmsState).map((sec, idx) => ({
      ...sec,
      position: idx,
    }));
    const res = await batchUpsertCmsSections(payload);
    setIsPublishingAll(false);

    if (res.success) {
      showToast('🚀 All Homepage sections saved and published live to storefront!');
    } else {
      showToast(res.error || 'Failed to publish all sections', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Banner */}
      {toast && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold border flex items-center gap-2 ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-sandstone rounded-xl border border-border shadow-craft-sm">
        <div>
          <h2 className="font-serif font-bold text-charcoal text-lg">Homepage CMS Dashboard</h2>
          <p className="text-xs text-muted">
            Configure headline copy, narrative text, call-to-actions, and storage imagery across every storefront section.
          </p>
        </div>
        <button
          type="button"
          onClick={handlePublishAll}
          disabled={isPublishingAll}
          className="px-5 py-2.5 bg-[#00405C] hover:bg-[#003248] text-white rounded-lg font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
        >
          {isPublishingAll ? (
            <RefreshCw className="w-4 h-4 animate-spin text-[#C5A880]" />
          ) : (
            <Save className="w-4 h-4 text-[#C5A880]" />
          )}
          <span>Publish All Sections Live</span>
        </button>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar Tabs (Cols 1-4) */}
        <div className="lg:col-span-4 space-y-2">
          {SECTION_KEYS.map((sk) => {
            const Icon = sk.icon;
            const isActive = activeTab === sk.id;
            const secData = cmsState[sk.id];
            const isSectionActive = secData?.is_active !== false;

            return (
              <button
                key={sk.id}
                type="button"
                onClick={() => setActiveTab(sk.id)}
                className={`w-full text-left px-4 py-3 rounded-xl font-semibold text-xs transition-all flex items-center justify-between border cursor-pointer ${
                  isActive
                    ? 'bg-[#00405C] text-white border-[#00405C] shadow-sm'
                    : 'bg-parchment text-charcoal hover:bg-sandstone border-border'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#C5A880]' : 'text-lapis'}`} />
                  <span>{sk.label}</span>
                </div>
                <span
                  className={`w-2 h-2 rounded-full ${
                    isSectionActive ? 'bg-[#25D366]' : 'bg-stone-400'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Section Config Panel (Cols 5-12) */}
        <div className="lg:col-span-8 bg-parchment p-6 rounded-2xl border border-border shadow-craft-sm space-y-6">
          {SECTION_KEYS.map((sk) => {
            if (activeTab !== sk.id) return null;

            const sec = cmsState[sk.id] || { settings: {} };
            const settings = sec.settings || sec.config || {};
            const isSectionActive = sec.is_active !== false;

            return (
              <div key={sk.id} className="space-y-6">
                {/* Header & Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
                  <div className="flex items-center gap-2.5">
                    <sk.icon className="w-5 h-5 text-lapis" />
                    <h3 className="font-serif font-bold text-charcoal text-lg">{sk.label}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(sk.id)}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                        isSectionActive
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-sandstone text-muted border-border'
                      }`}
                    >
                      {isSectionActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{isSectionActive ? 'Section Visible' : 'Section Hidden'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSaveSection(sk.id)}
                      disabled={savingKey === sk.id}
                      className="px-4 py-1.5 bg-[#00405C] hover:bg-[#003248] text-white rounded-md text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {savingKey === sk.id ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C5A880]" />
                      ) : (
                        <Save className="w-3.5 h-3.5 text-[#C5A880]" />
                      )}
                      <span>Save Section</span>
                    </button>
                  </div>
                </div>

                {/* FORM FIELDS BASED ON ACTIVE SECTION */}
                
                {/* 1. Announcement Bar */}
                {sk.id === 'announcement_bar' && (
                  <div className="space-y-4 text-xs font-sans">
                    <div className="space-y-1">
                      <label className="font-semibold text-charcoal block">
                        Top Notification Text (Announcement Bar)
                      </label>
                      <input
                        type="text"
                        value={
                          settings.text ||
                          'Nationwide Cash on Delivery | Double-Crated Fragile Protection | Free Shipping Above Rs. 10,000'
                        }
                        onChange={(e) => handleUpdateSetting(sk.id, 'text', e.target.value)}
                        className="w-full px-3 py-2 bg-sandstone border border-border rounded-lg text-charcoal font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-charcoal block">
                        Secondary Marquee / Ticker Message
                      </label>
                      <input
                        type="text"
                        value={settings.ticker || 'Archival Craftsmanship Since 1974'}
                        onChange={(e) => handleUpdateSetting(sk.id, 'ticker', e.target.value)}
                        className="w-full px-3 py-2 bg-sandstone border border-border rounded-lg text-charcoal font-medium"
                      />
                    </div>
                  </div>
                )}

                {/* 2. Hero Section */}
                {sk.id === 'hero' && (
                  <div className="space-y-4 text-xs font-sans">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-charcoal block">Eyebrow Badge Text</label>
                        <input
                          type="text"
                          value={
                            settings.badge ||
                            settings.badgeText ||
                            'Authentic Artisanal Roots — Multan • Swat • Sillanwali • Khewra'
                          }
                          onChange={(e) => handleUpdateSetting(sk.id, 'badge', e.target.value)}
                          className="w-full px-3 py-2 bg-sandstone border border-border rounded-lg text-charcoal"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-charcoal block">Main Title Prefix</label>
                        <input
                          type="text"
                          value={settings.title || 'Timeless Pakistani Heritage,'}
                          onChange={(e) => handleUpdateSetting(sk.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 bg-sandstone border border-border rounded-lg text-charcoal font-semibold"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-charcoal block">Subtitle Narrative Copy</label>
                      <textarea
                        rows={3}
                        value={
                          settings.subtitle ||
                          'Sourced directly from generational Ustads without intermediate dilution. From hand-thrown Multani cobalt glazes and intricate Swati walnut relief panels to hand-turned Taxila marble and antique brassware—safely double-crated and brought straight to your doorstep across Pakistan.'
                        }
                        onChange={(e) => handleUpdateSetting(sk.id, 'subtitle', e.target.value)}
                        className="w-full px-3 py-2 bg-sandstone border border-border rounded-lg text-charcoal leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-charcoal block">Primary CTA Text</label>
                        <input
                          type="text"
                          value={settings.primaryCtaText || settings.primaryCta?.label || 'Explore Masterpiece Catalog'}
                          onChange={(e) => handleUpdateSetting(sk.id, 'primaryCtaText', e.target.value)}
                          className="w-full px-3 py-2 bg-sandstone border border-border rounded-lg text-charcoal"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-charcoal block">Primary CTA Link URL</label>
                        <input
                          type="text"
                          value={settings.primaryCtaLink || settings.primaryCta?.url || '/products'}
                          onChange={(e) => handleUpdateSetting(sk.id, 'primaryCtaLink', e.target.value)}
                          className="w-full px-3 py-2 bg-sandstone border border-border rounded-lg text-charcoal font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-charcoal block">Secondary CTA Text</label>
                        <input
                          type="text"
                          value={settings.secondaryCtaText || settings.secondaryCta?.label || 'Order via WhatsApp Concierge'}
                          onChange={(e) => handleUpdateSetting(sk.id, 'secondaryCtaText', e.target.value)}
                          className="w-full px-3 py-2 bg-sandstone border border-border rounded-lg text-charcoal"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-charcoal block">Secondary CTA WhatsApp Link</label>
                        <input
                          type="text"
                          value={
                            settings.secondaryCtaLink ||
                            settings.secondaryCta?.url ||
                            'https://wa.me/923104755973'
                          }
                          onChange={(e) => handleUpdateSetting(sk.id, 'secondaryCtaLink', e.target.value)}
                          className="w-full px-3 py-2 bg-sandstone border border-border rounded-lg text-charcoal font-mono"
                        />
                      </div>
                    </div>

                    {/* Image Uploader */}
                    <div className="space-y-2 pt-2 border-t border-border">
                      <label className="font-semibold text-charcoal block">Hero Showcase Image (URL or Storage Upload)</label>
                      <div className="flex gap-3 items-center">
                        <input
                          type="text"
                          value={settings.image || ''}
                          onChange={(e) => handleUpdateSetting(sk.id, 'image', e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3 py-2 bg-sandstone border border-border rounded-lg text-charcoal font-mono text-[11px]"
                        />
                        <label className="px-3 py-2 bg-chiseled hover:bg-border border border-border rounded-lg text-charcoal text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0">
                          {uploadingField === 'hero_image' ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-lapis" />
                          ) : (
                            <Upload className="w-3.5 h-3.5 text-lapis" />
                          )}
                          <span>Upload File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageFileUpload(sk.id, 'image', file);
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-charcoal block">Collector Highlight Title</label>
                        <input
                          type="text"
                          value={settings.collectorHighlight || 'Multani Lapis Urn & Walnut Mount'}
                          onChange={(e) => handleUpdateSetting(sk.id, 'collectorHighlight', e.target.value)}
                          className="w-full px-3 py-2 bg-sandstone border border-border rounded-lg text-charcoal"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-charcoal block">Collector Archival Number</label>
                        <input
                          type="text"
                          value={settings.collectorNumber || '№ 1976/08'}
                          onChange={(e) => handleUpdateSetting(sk.id, 'collectorNumber', e.target.value)}
                          className="w-full px-3 py-2 bg-sandstone border border-border rounded-lg text-charcoal font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Regional Craft Hubs */}
                {sk.id === 'regions_mastery' && (
                  <div className="space-y-4 text-xs font-sans">
                    <div className="space-y-1">
                      <label className="font-semibold text-charcoal block">Section Headline</label>
                      <input
                        type="text"
                        value={settings.headline || 'Discover Crafts by Origin'}
                        onChange={(e) => handleUpdateSetting(sk.id, 'headline', e.target.value)}
                        className="w-full px-3 py-2 bg-sandstone border border-border rounded-lg text-charcoal font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-charcoal block">Section Subheadline</label>
                      <input
                        type="text"
                        value={
                          settings.subheadline ||
                          "Centuries of generational mastery across Pakistan's historic artisan valleys, curated with archival reverence."
                        }
                        onChange={(e) => handleUpdateSetting(sk.id, 'subheadline', e.target.value)}
                        className="w-full px-3 py-2 bg-sandstone border border-border rounded-lg text-charcoal"
                      />
                    </div>
                  </div>
                )}

                {/* 4. Featured Masterpieces */}
                {sk.id === 'featured_masterpieces' && (
                  <div className="space-y-4 text-xs font-sans">
                    <div className="space-y-1">
                      <label className="font-semibold text-charcoal block">Section Headline</label>
                      <input
                        type="text"
                        value={settings.headline || 'Featured Artisanal Masterpieces'}
                        onChange={(e) => handleUpdateSetting(sk.id, 'headline', e.target.value)}
                        className="w-full px-3 py-2 bg-sandstone border border-border rounded-lg text-charcoal font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-charcoal block">Display Product Limit</label>
                      <input
                        type="number"
                        value={settings.limit || 8}
                        onChange={(e) => handleUpdateSetting(sk.id, 'limit', parseInt(e.target.value, 10) || 8)}
                        className="w-full px-3 py-2 bg-sandstone border border-border rounded-lg text-charcoal font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* 5. 50-Year Heritage Spotlight */}
                {sk.id === 'heritage_50_years' && (
                  <div className="space-y-4 text-xs font-sans">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-charcoal block">Provenance Badge</label>
                        <input
                          type="text"
                          value={settings.badge || 'ESTABLISHED 1976 • 50 YEARS AT THE SAME HISTORIC SHOP'}
                          onChange={(e) => handleUpdateSetting(sk.id, 'badge', e.target.value)}
                          className="w-full px-3 py-2 bg-sandstone border border-border rounded-lg text-charcoal"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-charcoal block">Section Headline</label>
                        <input
                          type="text"
                          value={settings.title || "Half a Century of Preserving Pakistan's Living Craft"}
                          onChange={(e) => handleUpdateSetting(sk.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 bg-sandstone border border-border rounded-lg text-charcoal font-semibold"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-charcoal block">Subtitle</label>
                      <input
                        type="text"
                        value={
                          settings.subtitle ||
                          'From our original flagship shop in Lahore to master artisan workshops across Swat, Multan, and Sillanwali.'
                        }
                        onChange={(e) => handleUpdateSetting(sk.id, 'subtitle', e.target.value)}
                        className="w-full px-3 py-2 bg-sandstone border border-border rounded-lg text-charcoal"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-charcoal block">150-200 Word Historical Narrative</label>
                      <textarea
                        rows={4}
                        value={
                          settings.narrative ||
                          'In 1976, Ghazali Handicrafts opened its doors with a simple pledge: to provide an enduring sanctuary for master Pakistani Ustads whose craft was being eclipsed by factory reproductions. Fifty uninterrupted years later, operating from the very same historic shop address in Lahore, we continue our lifelong guardianship of genuine Sheesham joinery, Kashigari tile glazes, and hand-beaten Peshawar brassware.'
                        }
                        onChange={(e) => handleUpdateSetting(sk.id, 'narrative', e.target.value)}
                        className="w-full px-3 py-2 bg-sandstone border border-border rounded-lg text-charcoal leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-charcoal block">Founder's Pull Quote</label>
                        <input
                          type="text"
                          value={
                            settings.quote ||
                            '“For 50 years, this shop has not just sold decorative pieces; we have guarded the dignity and generational survival of our country\'s master craftsmen.”'
                          }
                          onChange={(e) => handleUpdateSetting(sk.id, 'quote', e.target.value)}
                          className="w-full px-3 py-2 bg-sandstone border border-border rounded-lg text-charcoal italic"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-charcoal block">Quote Citation Author</label>
                        <input
                          type="text"
                          value={settings.quoteAuthor || 'Founder & Senior Conservator, Ghazali Handicrafts'}
                          onChange={(e) => handleUpdateSetting(sk.id, 'quoteAuthor', e.target.value)}
                          className="w-full px-3 py-2 bg-sandstone border border-border rounded-lg text-charcoal"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-charcoal block">Video Embed Link / URL (YouTube or MP4)</label>
                      <input
                        type="text"
                        value={settings.videoUrl || ''}
                        onChange={(e) => handleUpdateSetting(sk.id, 'videoUrl', e.target.value)}
                        placeholder="https://www.youtube.com/embed/..."
                        className="w-full px-3 py-2 bg-sandstone border border-border rounded-lg text-charcoal font-mono"
                      />
                    </div>

                    <div className="space-y-2 pt-2 border-t border-border">
                      <label className="font-semibold text-charcoal block">Video Poster Image (Storage Uploader)</label>
                      <div className="flex gap-3 items-center">
                        <input
                          type="text"
                          value={settings.videoPoster || ''}
                          onChange={(e) => handleUpdateSetting(sk.id, 'videoPoster', e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3 py-2 bg-sandstone border border-border rounded-lg text-charcoal font-mono text-[11px]"
                        />
                        <label className="px-3 py-2 bg-chiseled hover:bg-border border border-border rounded-lg text-charcoal text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0">
                          {uploadingField === 'heritage_50_years_videoPoster' ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-lapis" />
                          ) : (
                            <Upload className="w-3.5 h-3.5 text-lapis" />
                          )}
                          <span>Upload Poster</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageFileUpload(sk.id, 'videoPoster', file);
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. Fragile Crating Guarantee */}
                {sk.id === 'fragile_guarantee' && (
                  <div className="space-y-4 text-xs font-sans">
                    <p className="text-muted">
                      Transit assurance cards and policy copy rendered natively on storefront.
                    </p>
                  </div>
                )}

                {/* 7. Lifestyle & Heritage Gifting */}
                {sk.id === 'lifestyle_gifting' && (
                  <div className="space-y-4 text-xs font-sans">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-charcoal block">Badge Text</label>
                        <input
                          type="text"
                          value={settings.badge || 'Thoughtful Heritage Gifting'}
                          onChange={(e) => handleUpdateSetting(sk.id, 'badge', e.target.value)}
                          className="w-full px-3 py-2 bg-sandstone border border-border rounded-lg text-charcoal"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-charcoal block">Section Headline</label>
                        <input
                          type="text"
                          value={settings.title || 'Heirloom Accents That Tell a Story.'}
                          onChange={(e) => handleUpdateSetting(sk.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 bg-sandstone border border-border rounded-lg text-charcoal font-semibold"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-charcoal block">Narrative Description</label>
                      <textarea
                        rows={3}
                        value={
                          settings.description ||
                          settings.subtitle ||
                          'Elevate modern living rooms and corporate executive suites with authentic craft. Hand-carved Sheesham wood tissue covers, solid brass chatuwata mortars, and artisanal marble desk clocks—curated specifically for memorable weddings, commemorative milestones, and diplomatic gifting.'
                        }
                        onChange={(e) => handleUpdateSetting(sk.id, 'description', e.target.value)}
                        className="w-full px-3 py-2 bg-sandstone border border-border rounded-lg text-charcoal leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-charcoal block">CTA Button Text</label>
                        <input
                          type="text"
                          value={settings.ctaText || 'Browse Gift Collections'}
                          onChange={(e) => handleUpdateSetting(sk.id, 'ctaText', e.target.value)}
                          className="w-full px-3 py-2 bg-sandstone border border-border rounded-lg text-charcoal"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-charcoal block">CTA Button Link</label>
                        <input
                          type="text"
                          value={settings.ctaLink || '/products'}
                          onChange={(e) => handleUpdateSetting(sk.id, 'ctaLink', e.target.value)}
                          className="w-full px-3 py-2 bg-sandstone border border-border rounded-lg text-charcoal font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-border">
                      <label className="font-semibold text-charcoal block">Editorial Gifting Photo (Storage Uploader)</label>
                      <div className="flex gap-3 items-center">
                        <input
                          type="text"
                          value={settings.image || ''}
                          onChange={(e) => handleUpdateSetting(sk.id, 'image', e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3 py-2 bg-sandstone border border-border rounded-lg text-charcoal font-mono text-[11px]"
                        />
                        <label className="px-3 py-2 bg-chiseled hover:bg-border border border-border rounded-lg text-charcoal text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0">
                          {uploadingField === 'lifestyle_gifting_image' ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-lapis" />
                          ) : (
                            <Upload className="w-3.5 h-3.5 text-lapis" />
                          )}
                          <span>Upload File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageFileUpload(sk.id, 'image', file);
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}