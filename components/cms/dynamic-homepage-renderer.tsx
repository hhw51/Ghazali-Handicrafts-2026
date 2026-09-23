import Image from 'next/image';
import Link from 'next/link';
import { HomepageSectionRecord } from '@/actions/admin-cms';
import { Product, Category } from '@/types/product';
import { ProductCard } from '@/components/products/product-card';
import { Sparkles, ArrowRight, Truck, ShieldCheck, Award, MapPin } from 'lucide-react';

interface DynamicHomepageRendererProps {
  sections: HomepageSectionRecord[];
  allProducts: Product[];
  categories: Category[];
}

export function DynamicHomepageRenderer({
  sections,
  allProducts,
  categories,
}: DynamicHomepageRendererProps) {
  const activeSections = sections.filter((s) => s.is_active);

  // Fallback default sections if no active CMS blocks are stored yet
  if (activeSections.length === 0) {
    const featuredProducts = allProducts.filter((p) => p.is_featured).slice(0, 8);
    const displayProducts = featuredProducts.length > 0 ? featuredProducts : allProducts.slice(0, 8);

    return (
      <div className="space-y-16 pb-20">
        {/* Default Hero Section */}
        <section className="relative min-h-[580px] bg-sandstone border-b border-border flex items-center overflow-hidden py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brass/15 text-terracotta rounded-full text-xs font-semibold border border-brass/30">
                <Sparkles className="w-3.5 h-3.5 text-terracotta" />
                <span>100% Authentic Pakistani Craft Heritage</span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal leading-[1.15]">
                Authentic Heritage Handicrafts of Pakistan
              </h1>
              <p className="text-sm sm:text-base text-muted max-w-xl leading-relaxed font-sans">
                Hand-carved Swati walnut woodwork, hand-thrown Multani blue pottery, Rawalpindi truck art tea kettles, and polished Himalayan onyx chessboards delivered nationwide with 100% Cash on Delivery.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/products"
                  className="px-7 py-3.5 bg-lapis hover:bg-lapis/90 text-parchment font-bold text-xs rounded-xl shadow-craft-md transition-all flex items-center gap-2"
                >
                  <span>Explore Heritage Catalog</span>
                  <ArrowRight className="w-4 h-4 text-brass" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-2 border-brass/40">
              <Image
                src="/images/hero/craft-hero.png"
                alt="Pakistani Handicrafts Masterpiece"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Default Categories Strip */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-serif text-3xl font-bold text-charcoal">Explore Craft Categories</h2>
            <p className="text-xs text-muted">Curated by traditional material and regional provenance.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="p-5 bg-sandstone hover:bg-parchment border border-border hover:border-brass rounded-xl text-center space-y-2 transition-all shadow-craft-sm group"
              >
                <div className="w-10 h-10 bg-parchment group-hover:bg-lapis group-hover:text-parchment rounded-full flex items-center justify-center mx-auto border border-border text-lapis transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-charcoal text-xs">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </section>

        {/* Default Products Showcase */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-4">
            <div>
              <h2 className="font-serif text-3xl font-bold text-charcoal">Curated Masterpiece Showcase</h2>
              <p className="text-xs text-muted mt-1">Hand-selected Pakistani craft creations available for dispatch.</p>
            </div>
            <Link href="/products" className="text-xs font-bold text-lapis hover:underline flex items-center gap-1">
              View All Products <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-20">
      {activeSections.map((sec) => {
        const { config } = sec;

        if (sec.section_type === 'hero') {
          return (
            <section
              key={sec.id}
              className="relative min-h-[540px] bg-sandstone border-b border-border flex items-center overflow-hidden py-16"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 space-y-6 text-left">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brass/15 text-terracotta rounded-full text-xs font-semibold border border-brass/30">
                    <Sparkles className="w-3.5 h-3.5 text-terracotta" />
                    <span>100% Authentic Pakistani Craft Lineage</span>
                  </div>
                  <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal leading-[1.15]">
                    {config.title || 'Authentic Heritage Handicrafts'}
                  </h1>
                  <p className="text-sm sm:text-base text-muted max-w-xl leading-relaxed font-sans">
                    {config.subtitle || 'Hand-carved woodwork, blue pottery & truck art.'}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <Link
                      href={config.ctaUrl || '/products'}
                      className="px-7 py-3.5 bg-lapis hover:bg-lapis/90 text-parchment font-bold text-xs rounded-xl shadow-craft-md transition-all flex items-center gap-2"
                    >
                      <span>{config.ctaText || 'Explore Catalog'}</span>
                      <ArrowRight className="w-4 h-4 text-brass" />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-5 relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-2 border-brass/40">
                  <Image
                    src={config.imageUrl || '/images/hero/craft-hero.png'}
                    alt="Hero Showcase"
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              </div>
            </section>
          );
        }

        if (sec.section_type === 'product_grid') {
          const showOnlyFeatured = config.showOnlyFeatured ?? true;
          let gridProducts = showOnlyFeatured
            ? allProducts.filter((p) => p.is_featured)
            : allProducts;

          if (gridProducts.length === 0) gridProducts = allProducts.slice(0, 8);

          return (
            <section key={sec.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-4">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-charcoal">
                    {config.title || 'Curated Masterpiece Showcase'}
                  </h2>
                  {config.subtitle && <p className="text-xs text-muted mt-1">{config.subtitle}</p>}
                </div>
                <Link
                  href="/products"
                  className="text-xs font-bold text-lapis hover:underline flex items-center gap-1"
                >
                  View All ({allProducts.length}) <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {gridProducts.slice(0, 8).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          );
        }

        if (sec.section_type === 'category_row') {
          return (
            <section key={sec.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="text-center space-y-2">
                <h2 className="font-serif text-3xl font-bold text-charcoal">
                  {config.title || 'Explore Craft Lineages'}
                </h2>
                {config.subtitle && <p className="text-xs text-muted">{config.subtitle}</p>}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.slug}`}
                    className="p-5 bg-sandstone hover:bg-parchment border border-border hover:border-brass rounded-xl text-center space-y-2 transition-all shadow-craft-sm group"
                  >
                    <div className="w-10 h-10 bg-parchment group-hover:bg-lapis group-hover:text-parchment rounded-full flex items-center justify-center mx-auto border border-border text-lapis transition-colors">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif font-bold text-charcoal text-xs">{cat.name}</h3>
                  </Link>
                ))}
              </div>
            </section>
          );
        }

        if (sec.section_type === 'banner') {
          return (
            <section key={sec.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="p-8 sm:p-12 bg-gradient-to-r from-lapis via-charcoal to-lapis text-parchment rounded-2xl border-2 border-brass/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide">
                    {config.title || 'Nationwide Express Cash on Delivery'}
                  </h3>
                  <p className="text-xs sm:text-sm text-parchment/80 max-w-xl">
                    {config.subtitle || 'Fragile crate protection & instant WhatsApp verification.'}
                  </p>
                </div>
                <Link
                  href={config.ctaUrl || '/products'}
                  className="px-6 py-3 bg-brass hover:bg-brass/90 text-charcoal font-bold text-xs rounded-xl shadow-craft-md transition-all shrink-0"
                >
                  {config.ctaText || 'Shop Collection'}
                </Link>
              </div>
            </section>
          );
        }

        if (sec.section_type === 'custom_columns') {
          return (
            <section key={sec.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              {config.title && (
                <h2 className="font-serif text-3xl font-bold text-charcoal text-center">
                  {config.title}
                </h2>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-sandstone rounded-xl border border-border space-y-3">
                  <div className="w-10 h-10 bg-parchment rounded-full flex items-center justify-center border border-border text-lapis">
                    <Truck className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif font-bold text-charcoal text-base">
                    {config.col1Title || '100% COD Nationwide'}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed font-sans">
                    {config.col1Desc || 'Pay upon delivery at your doorstep across all Pakistan cities.'}
                  </p>
                </div>

                <div className="p-6 bg-sandstone rounded-xl border border-border space-y-3">
                  <div className="w-10 h-10 bg-parchment rounded-full flex items-center justify-center border border-border text-terracotta">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif font-bold text-charcoal text-base">
                    {config.col2Title || 'Fragile Protection'}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed font-sans">
                    {config.col2Desc || 'Heavy wooden crates and shock-absorbing bubble wrap protection.'}
                  </p>
                </div>

                <div className="p-6 bg-sandstone rounded-xl border border-border space-y-3">
                  <div className="w-10 h-10 bg-parchment rounded-full flex items-center justify-center border border-border text-brass">
                    <Award className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif font-bold text-charcoal text-base">
                    {config.col3Title || 'Artisan Verification'}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed font-sans">
                    {config.col3Desc || 'Direct support to traditional craft lineage masters.'}
                  </p>
                </div>
              </div>
            </section>
          );
        }

        return null;
      })}
    </div>
  );
}
