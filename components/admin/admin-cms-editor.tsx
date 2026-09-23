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
    type: 'hero' | 'banner' | 'product_grid' | 'category_row' | 'custom_columns'
  ) => {
    const defaultConfig: Record<string, any> = {
      hero: {
        title: 'Authentic Heritage Handicrafts of Pakistan',
        subtitle: 'Hand-carved Swati walnut, Multani glazed ceramics & Rawalpindi truck art.',
        ctaText: 'Explore Catalog',
        ctaUrl: '/products',
        imageUrl: '/images/hero/craft-hero.png',
      },
      banner: {
        title: 'Nationwide Express Cash on Delivery',
        subtitle: 'Fragile crate protection & instant WhatsApp verification included.',
        ctaText: 'Order Now',
        ctaUrl: '/products',
      },
      product_grid: {
        title: 'Curated Masterpiece Collection',
        subtitle: 'Handpicked artisan creations available for nationwide dispatch.',
        showOnlyFeatured: true,
      },
      category_row: {
        title: 'Explore Craft Lineages',
        subtitle: 'Choose by material, region, and artisanal provenance.',
      },
      custom_columns: {
        title: 'The Ghazali Promise',
        columnsCount: '3',
        col1Title: '100% COD Nationwide',
        col1Desc: 'Pay upon delivery at your doorstep across all Pakistan cities.',
        col2Title: 'Fragile Packing',
        col2Desc: 'Heavy wooden crates and shock-absorbing bubble wrap protection.',
        col3Title: 'Artisan Verification',
        col3Desc: 'Direct support to traditional craft lineage masters.',
      },
    }[type];

    const newSec: HomepageSectionRecord = {
      id: `temp_${Date.now()}`,
      section_type: type,
      position: sections.length,
      is_active: true,
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
              config: { ...s.config, [key]: val },
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
            onClick={() => handleAddBlock('product_grid')}
            className="px-3.5 py-2 bg-parchment hover:bg-chiseled border border-border text-charcoal text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-terracotta" /> Highlighted Products Grid
          </button>
          <button
            type="button"
            onClick={() => handleAddBlock('category_row')}
            className="px-3.5 py-2 bg-parchment hover:bg-chiseled border border-border text-charcoal text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Grid className="w-3.5 h-3.5 text-brass" /> Category Carousel
          </button>
          <button
            type="button"
            onClick={() => handleAddBlock('banner')}
            className="px-3.5 py-2 bg-parchment hover:bg-chiseled border border-border text-charcoal text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> Promo Callout Banner
          </button>
          <button
            type="button"
            onClick={() => handleAddBlock('custom_columns')}
            className="px-3.5 py-2 bg-parchment hover:bg-chiseled border border-border text-charcoal text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5 text-lapis" /> Custom Multi-Column Block
          </button>
        </div>
      </div>

      {/* Sections List */}
      {sections.length === 0 ? (
        <div className="p-12 bg-sandstone rounded-xl border border-border text-center space-y-2">
          <p className="font-serif text-lg font-bold text-charcoal">No custom homepage sections added yet</p>
          <p className="text-xs text-muted">
            Click any button above to add modular blocks (Hero, Products Grid, Categories, or Callout Banners).
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((sec, idx) => (
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
                        value={sec.config.title || ''}
                        onChange={(e) => handleUpdateConfig(sec.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 bg-sandstone border border-border rounded-md text-charcoal"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-semibold text-charcoal">Subtitle Description</label>
                      <input
                        type="text"
                        value={sec.config.subtitle || ''}
                        onChange={(e) => handleUpdateConfig(sec.id, 'subtitle', e.target.value)}
                        className="w-full px-3 py-2 bg-sandstone border border-border rounded-md text-charcoal"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-charcoal">CTA Button Text</label>
                      <input
                        type="text"
                        value={sec.config.ctaText || ''}
                        onChange={(e) => handleUpdateConfig(sec.id, 'ctaText', e.target.value)}
                        className="w-full px-3 py-2 bg-sandstone border border-border rounded-md text-charcoal"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-charcoal">Hero Image URL</label>
                      <input
                        type="text"
                        value={sec.config.imageUrl || ''}
                        onChange={(e) => handleUpdateConfig(sec.id, 'imageUrl', e.target.value)}
                        className="w-full px-3 py-2 bg-sandstone border border-border rounded-md text-charcoal font-mono"
                      />
                    </div>
                  </>
                )}

                {sec.section_type === 'product_grid' && (
                  <>
                    <div className="space-y-1">
                      <label className="font-semibold text-charcoal">Grid Section Title</label>
                      <input
                        type="text"
                        value={sec.config.title || ''}
                        onChange={(e) => handleUpdateConfig(sec.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 bg-sandstone border border-border rounded-md text-charcoal"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-charcoal">Subtitle Description</label>
                      <input
                        type="text"
                        value={sec.config.subtitle || ''}
                        onChange={(e) => handleUpdateConfig(sec.id, 'subtitle', e.target.value)}
                        className="w-full px-3 py-2 bg-sandstone border border-border rounded-md text-charcoal"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-2 sm:col-span-2">
                      <input
                        type="checkbox"
                        id={`feat_${sec.id}`}
                        checked={sec.config.showOnlyFeatured ?? true}
                        onChange={(e) =>
                          handleUpdateConfig(sec.id, 'showOnlyFeatured', e.target.checked)
                        }
                        className="w-4 h-4 rounded text-lapis border-border accent-lapis cursor-pointer"
                      />
                      <label htmlFor={`feat_${sec.id}`} className="font-semibold text-charcoal cursor-pointer">
                        Filter and display products marked with Highlight Star (is_featured = true)
                      </label>
                    </div>
                  </>
                )}

                {sec.section_type === 'category_row' && (
                  <>
                    <div className="space-y-1">
                      <label className="font-semibold text-charcoal">Carousel Heading Title</label>
                      <input
                        type="text"
                        value={sec.config.title || ''}
                        onChange={(e) => handleUpdateConfig(sec.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 bg-sandstone border border-border rounded-md text-charcoal"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-charcoal">Subtitle Description</label>
                      <input
                        type="text"
                        value={sec.config.subtitle || ''}
                        onChange={(e) => handleUpdateConfig(sec.id, 'subtitle', e.target.value)}
                        className="w-full px-3 py-2 bg-sandstone border border-border rounded-md text-charcoal"
                      />
                    </div>
                  </>
                )}

                {sec.section_type === 'banner' && (
                  <>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-semibold text-charcoal">Banner Title</label>
                      <input
                        type="text"
                        value={sec.config.title || ''}
                        onChange={(e) => handleUpdateConfig(sec.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 bg-sandstone border border-border rounded-md text-charcoal"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-semibold text-charcoal">Banner Subtitle</label>
                      <input
                        type="text"
                        value={sec.config.subtitle || ''}
                        onChange={(e) => handleUpdateConfig(sec.id, 'subtitle', e.target.value)}
                        className="w-full px-3 py-2 bg-sandstone border border-border rounded-md text-charcoal"
                      />
                    </div>
                  </>
                )}

                {sec.section_type === 'custom_columns' && (
                  <>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-semibold text-charcoal">Multi-Column Block Title</label>
                      <input
                        type="text"
                        value={sec.config.title || ''}
                        onChange={(e) => handleUpdateConfig(sec.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 bg-sandstone border border-border rounded-md text-charcoal"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-charcoal">Column 1 Title</label>
                      <input
                        type="text"
                        value={sec.config.col1Title || ''}
                        onChange={(e) => handleUpdateConfig(sec.id, 'col1Title', e.target.value)}
                        className="w-full px-3 py-2 bg-sandstone border border-border rounded-md text-charcoal"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-charcoal">Column 1 Description</label>
                      <input
                        type="text"
                        value={sec.config.col1Desc || ''}
                        onChange={(e) => handleUpdateConfig(sec.id, 'col1Desc', e.target.value)}
                        className="w-full px-3 py-2 bg-sandstone border border-border rounded-md text-charcoal"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-charcoal">Column 2 Title</label>
                      <input
                        type="text"
                        value={sec.config.col2Title || ''}
                        onChange={(e) => handleUpdateConfig(sec.id, 'col2Title', e.target.value)}
                        className="w-full px-3 py-2 bg-sandstone border border-border rounded-md text-charcoal"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-charcoal">Column 2 Description</label>
                      <input
                        type="text"
                        value={sec.config.col2Desc || ''}
                        onChange={(e) => handleUpdateConfig(sec.id, 'col2Desc', e.target.value)}
                        className="w-full px-3 py-2 bg-sandstone border border-border rounded-md text-charcoal"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
