'use client';

import { useState } from 'react';
import {
  HomepageSectionRecord,
  saveHomepageSection,
  deleteHomepageSection,
  updateSectionsOrder,
} from '@/actions/admin-cms';
import {
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  LayoutTemplate,
  Grid,
  ShoppingBag,
  Image as ImageIcon,
  Eye,
  EyeOff,
  RefreshCw,
  BookOpen,
  Award,
  ShieldCheck,
  Layers,
} from 'lucide-react';

interface AdminCmsEditorProps {
  initialSections: HomepageSectionRecord[];
}

export function AdminCmsEditor({ initialSections }: AdminCmsEditorProps) {
  const [sections, setSections] = useState<HomepageSectionRecord[]>(initialSections);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleAddBlock = (
    type:
      | 'hero'
      | 'category_grid'
      | 'product_showcase'
      | 'editorial_banner'
      | 'heritage_story'
      | 'trust_bar'
      | 'artisan_spotlight'
  ) => {
    const defaultConfig: Record<string, any> = {
      hero: {
        title: 'Authentic Heritage Handicrafts of Pakistan',
        subtitle: 'Hand-carved Swati walnut, Multani glazed ceramics & Rawalpindi truck art.',
        badgeText: '100% Authentic Pakistani Craft Lineage',
        primaryCta: { label: 'Explore Heritage Catalog', url: '/products' },
        secondaryCta: { label: 'Explore Collections', url: '/products' },
        images: ['/images/hero/craft-hero.png', '/images/collections/blue-pottery.png'],
        layoutStyle: 'split',
      },
      category_grid: {
        headline: 'Explore Craft Lineages by Region',
        subheadline: 'Discover centuries of master craftsmanship, from Multan kilns to Swati carving benches.',
        categories: [
          { name: 'Multani Blue Pottery', slug: 'blue-pottery', image: '/images/collections/blue-pottery.png', itemCount: 14, badge: 'Multan' },
          { name: 'Swati Carved Woodwork', slug: 'swati-woodwork', image: '/images/collections/swati-woodwork.png', itemCount: 9, badge: 'Swat Valley' },
          { name: 'Himalayan Marble & Onyx', slug: 'marble-onyx', image: '/images/hero/craft-hero.png', itemCount: 12, badge: 'Balochistan' },
        ],
      },
      product_showcase: {
        headline: 'Curated Masterpiece Showcase',
        viewAllUrl: '/products',
        filterMode: 'featured',
        limit: 8,
      },
      editorial_banner: {
        headline: 'Nationwide Express Cash on Delivery',
        description: 'Fragile crate protection & instant WhatsApp verification included.',
        bannerImage: '/images/hero/craft-hero.png',
        ctaText: 'Shop Heritage Collection',
        ctaLink: '/products',
        alignment: 'left',
      },
      heritage_story: {
        regionName: 'Multan & Swat Valley',
        title: 'Generational Lineage of Master Artisans',
        storyText: 'In the historic workshops of Multan and Swat, master artisans pass down centuries-old secrets of glaze mixing and walnut carving.',
        quote: 'Clay and walnut wood are not merely raw materials; they carry the soul of our ancestral heritage.',
        artisanImage: '/images/collections/blue-pottery.png',
      },
      trust_bar: {
        items: [
          { icon: 'truck', title: '100% Cash on Delivery', subtitle: 'Pay upon delivery at your doorstep across all Pakistan cities.' },
          { icon: 'shield', title: 'Fragile-Crate Protection', subtitle: 'Custom shock-absorbing wooden packaging for safe arrival.' },
          { icon: 'award', title: 'Authentic Craft Lineage', subtitle: 'Directly sourced from master artisans in Multan, Swat & Chiniot.' },
          { icon: 'heart', title: 'Fair Artisan Sourcing', subtitle: 'Empowering traditional craft families with direct fair wages.' },
        ],
      },
      artisan_spotlight: {
        artisanName: 'Ustad Ghulam Mohammad',
        craftType: 'Swati Walnut Wood Carver',
        region: 'Swat Valley, KP',
        bio: 'With over 40 years of dedication to ancestral relief carving, Ustad Ghulam shapes solid walnut wood using hand-forged steel chisels.',
        image: '/images/collections/swati-woodwork.png',
        featuredProductSlug: 'swati-woodwork',
      },
    }[type];

    const newSec: HomepageSectionRecord = {
      id: `temp_${Date.now()}`,
      section_type: type,
      position: sections.length,
      is_active: true,
      settings: defaultConfig,
      config: defaultConfig,
    };

    setSections((prev) => [...prev, newSec]);
  };

  const handleUpdateConfig = (id: string, key: string, val: any) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              settings: { ...(s.settings || s.config || {}), [key]: val },
              config: { ...(s.config || s.settings || {}), [key]: val },
            }
          : s
      )
    );
  };

  const handleToggleActive = async (sec: HomepageSectionRecord) => {
    const updatedState = !sec.is_active;
    setSections((prev) =>
      prev.map((s) => (s.id === sec.id ? { ...s, is_active: updatedState } : s))
    );

    if (!sec.id.startsWith('temp_')) {
      await saveHomepageSection({ ...sec, is_active: updatedState });
      showToast(
        `✓ Section ${updatedState ? 'activated' : 'hidden'} on storefront homepage.`
      );
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const copy = [...sections];
    const temp = copy[index];
    copy[index] = copy[newIndex];
    copy[newIndex] = temp;

    const reordered = copy.map((item, idx) => ({ ...item, position: idx }));
    setSections(reordered);

    const serverPayload = reordered
      .filter((s) => !s.id.startsWith('temp_'))
      .map((s) => ({ id: s.id, position: s.position }));

    if (serverPayload.length > 0) {
      await updateSectionsOrder(serverPayload);
    }
  };

  const handleSaveSection = async (sec: HomepageSectionRecord) => {
    setLoadingId(sec.id);
    const res = await saveHomepageSection(sec);
    setLoadingId(null);

    if (res.success) {
      if (res.id && sec.id.startsWith('temp_')) {
        setSections((prev) =>
          prev.map((s) => (s.id === sec.id ? { ...s, id: res.id! } : s))
        );
      }
      showToast('✓ Homepage section saved and published!');
    } else {
      showToast(res.error || 'Failed to save section', 'error');
    }
  };

  const handleDelete = async (sec: HomepageSectionRecord) => {
    if (!confirm('Are you sure you want to remove this homepage block?')) return;

    setSections((prev) => prev.filter((s) => s.id !== sec.id));
    if (!sec.id.startsWith('temp_')) {
      await deleteHomepageSection(sec.id);
      showToast('Section removed from homepage.');
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

      {/* Add Block Toolbar */}
      <div className="p-5 bg-sandstone rounded-xl border border-border space-y-3 shadow-craft-sm">
        <label className="font-serif font-bold text-charcoal text-sm flex items-center gap-2">
          <Plus className="w-4 h-4 text-lapis" /> Add Homepage Section Block
        </label>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => handleAddBlock('hero')}
            className="px-3.5 py-2 bg-parchment hover:bg-chiseled border border-border text-charcoal text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <LayoutTemplate className="w-3.5 h-3.5 text-lapis" /> Hero Banner
          </button>
          <button
            type="button"
            onClick={() => handleAddBlock('category_grid')}
            className="px-3.5 py-2 bg-parchment hover:bg-chiseled border border-border text-charcoal text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Grid className="w-3.5 h-3.5 text-brass" /> Category Visual Grid
          </button>
          <button
            type="button"
            onClick={() => handleAddBlock('product_showcase')}
            className="px-3.5 py-2 bg-parchment hover:bg-chiseled border border-border text-charcoal text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-terracotta" /> Product Showcase Grid
          </button>
          <button
            type="button"
            onClick={() => handleAddBlock('editorial_banner')}
            className="px-3.5 py-2 bg-parchment hover:bg-chiseled border border-border text-charcoal text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> Editorial Banner
          </button>
          <button
            type="button"
            onClick={() => handleAddBlock('heritage_story')}
            className="px-3.5 py-2 bg-parchment hover:bg-chiseled border border-border text-charcoal text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-lapis" /> Heritage Story Editorial
          </button>
          <button
            type="button"
            onClick={() => handleAddBlock('trust_bar')}
            className="px-3.5 py-2 bg-parchment hover:bg-chiseled border border-border text-charcoal text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" /> Trust Bar
          </button>
          <button
            type="button"
            onClick={() => handleAddBlock('artisan_spotlight')}
            className="px-3.5 py-2 bg-parchment hover:bg-chiseled border border-border text-charcoal text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-brass" /> Artisan Spotlight
          </button>
        </div>
      </div>

      {/* Sections List */}
      {sections.length === 0 ? (
        <div className="p-12 bg-sandstone rounded-xl border border-border text-center space-y-2">
          <p className="font-serif text-lg font-bold text-charcoal">No custom homepage sections added yet</p>
          <p className="text-xs text-muted">
            Click any button above to add modular blocks (Hero, Category Grid, Product Showcase, Editorial Banners, etc.).
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((sec, idx) => {
            const config = sec.settings || sec.config || {};

            return (
              <div
                key={sec.id}
                className={`p-6 rounded-2xl border-2 transition-all space-y-4 ${
                  sec.is_active
                    ? 'bg-parchment border-border shadow-craft-sm'
                    : 'bg-sandstone/50 border-border/60 opacity-60'
                }`}
              >
                {/* Header Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-lapis text-parchment font-mono text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <h3 className="font-serif font-bold text-charcoal text-base capitalize flex items-center gap-2">
                        {sec.section_type.replace('_', ' ')} Block
                        {sec.id.startsWith('temp_') && (
                          <span className="text-[10px] bg-brass/20 text-terracotta px-2 py-0.5 rounded font-mono">
                            New Draft
                          </span>
                        )}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Re-order Up/Down */}
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 bg-sandstone hover:bg-chiseled border border-border rounded-md text-charcoal disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'down')}
                      disabled={idx === sections.length - 1}
                      className="p-1.5 bg-sandstone hover:bg-chiseled border border-border rounded-md text-charcoal disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Active Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(sec)}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        sec.is_active
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-sandstone text-muted border border-border'
                      }`}
                    >
                      {sec.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{sec.is_active ? 'Active' : 'Hidden'}</span>
                    </button>

                    {/* Save Button */}
                    <button
                      type="button"
                      onClick={() => handleSaveSection(sec)}
                      disabled={loadingId === sec.id}
                      className="px-3.5 py-1.5 bg-lapis hover:bg-lapis/90 text-parchment rounded-md text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {loadingId === sec.id ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-brass" />
                      ) : (
                        <Save className="w-3.5 h-3.5 text-brass" />
                      )}
                      <span>Save</span>
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleDelete(sec)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-md transition-colors cursor-pointer"
                      title="Delete Block"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Config Form Fields based on section_type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                  {sec.section_type === 'hero' && (
                    <>
                      <div className="space-y-1 sm:col-span-2">
                        <label className="font-semibold text-charcoal">Hero Heading Title</label>
                        <input
                          type="text"
                          value={config.title || ''}
                          onChange={(e) => handleUpdateConfig(sec.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 bg-sandstone border border-border rounded-md text-charcoal"
                        />
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <label className="font-semibold text-charcoal">Subtitle Description</label>
                        <input
                          type="text"
                          value={config.subtitle || ''}
                          onChange={(e) => handleUpdateConfig(sec.id, 'subtitle', e.target.value)}
                          className="w-full px-3 py-2 bg-sandstone border border-border rounded-md text-charcoal"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-charcoal">Badge Text</label>
                        <input
                          type="text"
                          value={config.badgeText || ''}
                          onChange={(e) => handleUpdateConfig(sec.id, 'badgeText', e.target.value)}
                          className="w-full px-3 py-2 bg-sandstone border border-border rounded-md text-charcoal"
                        />
                      </div>
                    </>
                  )}

                  {sec.section_type === 'category_grid' && (
                    <>
                      <div className="space-y-1">
                        <label className="font-semibold text-charcoal">Headline</label>
                        <input
                          type="text"
                          value={config.headline || ''}
                          onChange={(e) => handleUpdateConfig(sec.id, 'headline', e.target.value)}
                          className="w-full px-3 py-2 bg-sandstone border border-border rounded-md text-charcoal"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-charcoal">Subheadline</label>
                        <input
                          type="text"
                          value={config.subheadline || ''}
                          onChange={(e) => handleUpdateConfig(sec.id, 'subheadline', e.target.value)}
                          className="w-full px-3 py-2 bg-sandstone border border-border rounded-md text-charcoal"
                        />
                      </div>
                    </>
                  )}

                  {sec.section_type === 'product_showcase' && (
                    <>
                      <div className="space-y-1">
                        <label className="font-semibold text-charcoal">Showcase Headline</label>
                        <input
                          type="text"
                          value={config.headline || ''}
                          onChange={(e) => handleUpdateConfig(sec.id, 'headline', e.target.value)}
                          className="w-full px-3 py-2 bg-sandstone border border-border rounded-md text-charcoal"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-charcoal">Filter Mode</label>
                        <select
                          value={config.filterMode || 'featured'}
                          onChange={(e) => handleUpdateConfig(sec.id, 'filterMode', e.target.value)}
                          className="w-full px-3 py-2 bg-sandstone border border-border rounded-md text-charcoal cursor-pointer"
                        >
                          <option value="featured">Featured Products Only</option>
                          <option value="category">Category Specific</option>
                          <option value="new_arrivals">New Arrivals</option>
                        </select>
                      </div>
                    </>
                  )}

                  {sec.section_type === 'editorial_banner' && (
                    <>
                      <div className="space-y-1 sm:col-span-2">
                        <label className="font-semibold text-charcoal">Banner Headline</label>
                        <input
                          type="text"
                          value={config.headline || ''}
                          onChange={(e) => handleUpdateConfig(sec.id, 'headline', e.target.value)}
                          className="w-full px-3 py-2 bg-sandstone border border-border rounded-md text-charcoal"
                        />
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <label className="font-semibold text-charcoal">Description</label>
                        <input
                          type="text"
                          value={config.description || ''}
                          onChange={(e) => handleUpdateConfig(sec.id, 'description', e.target.value)}
                          className="w-full px-3 py-2 bg-sandstone border border-border rounded-md text-charcoal"
                        />
                      </div>
                    </>
                  )}

                  {sec.section_type === 'heritage_story' && (
                    <>
                      <div className="space-y-1">
                        <label className="font-semibold text-charcoal">Region Name</label>
                        <input
                          type="text"
                          value={config.regionName || ''}
                          onChange={(e) => handleUpdateConfig(sec.id, 'regionName', e.target.value)}
                          className="w-full px-3 py-2 bg-sandstone border border-border rounded-md text-charcoal"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-charcoal">Story Title</label>
                        <input
                          type="text"
                          value={config.title || ''}
                          onChange={(e) => handleUpdateConfig(sec.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 bg-sandstone border border-border rounded-md text-charcoal"
                        />
                      </div>
                    </>
                  )}

                  {sec.section_type === 'artisan_spotlight' && (
                    <>
                      <div className="space-y-1">
                        <label className="font-semibold text-charcoal">Artisan Name</label>
                        <input
                          type="text"
                          value={config.artisanName || ''}
                          onChange={(e) => handleUpdateConfig(sec.id, 'artisanName', e.target.value)}
                          className="w-full px-3 py-2 bg-sandstone border border-border rounded-md text-charcoal"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-charcoal">Craft Type & Region</label>
                        <input
                          type="text"
                          value={config.craftType || ''}
                          onChange={(e) => handleUpdateConfig(sec.id, 'craftType', e.target.value)}
                          className="w-full px-3 py-2 bg-sandstone border border-border rounded-md text-charcoal"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
