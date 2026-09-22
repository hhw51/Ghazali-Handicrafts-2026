import Image from 'next/image';
import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSiteSettings } from '@/lib/site-settings';
import { ProductCard } from '@/components/products/product-card';
import { Product } from '@/types/product';
import { ArrowRight, ShieldCheck, PackageCheck, Truck, Sparkles, Award } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('in_stock', true)
      .limit(6);

    if (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
    return (data as Product[]) || [];
  } catch (err) {
    console.error('Supabase query failed:', err);
    return [];
  }
}

export default async function HomePage() {
  const [featuredProducts, settings] = await Promise.all([
    getFeaturedProducts(),
    getSiteSettings(),
  ]);

  const collections = [
    {
      title: 'Multani Blue Pottery',
      slug: 'blue-pottery',
      region: 'Multan, Punjab',
      image: '/images/collections/blue-pottery.png',
      description: 'Hand-thrown terracotta ceramics glazed in centuries-old lapis cobalt and turquoise oxides.',
      span: 'col-span-1 md:col-span-2 row-span-2',
    },
    {
      title: 'Swati Hand-Carved Wood',
      slug: 'swati-woodwork',
      region: 'Swat Valley, KP',
      image: '/images/collections/swati-wood.png',
      description: 'Seasoned solid walnut wood carved with intricate floral geometric reliefs.',
      span: 'col-span-1 md:col-span-1 row-span-1',
    },
    {
      title: 'Pakistani White Onyx & Marble',
      slug: 'marble-onyx',
      region: 'Karachi & Quetta',
      image: '/images/collections/marble-crafts.jpg',
      description: 'Hand-turned natural translucent onyx and marble chessboards & tableware.',
      span: 'col-span-1 md:col-span-1 row-span-1',
    },
    {
      title: 'Authentic Truck Art',
      slug: 'truck-art',
      region: 'Rawalpindi & Peshawar',
      image: '/images/collections/truck-art.jpg',
      description: 'High-grade stainless tea kettles hand-painted with vibrant oil pigments by master Ustad painters.',
      span: 'col-span-1 md:col-span-2 row-span-1',
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Dynamic Asymmetric Hero Section */}
      <section className="relative pt-8 pb-16 md:pt-16 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Editorial Copy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brass/15 border border-brass/40 text-terracotta text-xs font-medium">
              <Award className="w-3.5 h-3.5 text-terracotta" />
              <span>{settings.hero_badge}</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-charcoal leading-[1.1]">
              {settings.hero_title}
            </h1>

            <p className="text-sm sm:text-base text-muted max-w-xl leading-relaxed font-sans">
              {settings.hero_subtitle}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href={settings.hero_primary_cta_link}
                className="px-6 py-3.5 bg-lapis hover:bg-lapis/90 text-parchment font-medium text-sm rounded-md shadow-craft-md transition-all duration-200 flex items-center gap-2 group"
              >
                {settings.hero_primary_cta_text}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href={settings.hero_secondary_cta_link}
                target={settings.hero_secondary_cta_link.startsWith('http') ? '_blank' : '_self'}
                rel="noreferrer"
                className="px-6 py-3.5 bg-sandstone hover:bg-chiseled text-charcoal font-medium text-sm rounded-md border border-border transition-all duration-200"
              >
                {settings.hero_secondary_cta_text}
              </a>
            </div>

            {/* Quick Stats Rail */}
            <div className="pt-6 border-t border-border grid grid-cols-3 gap-4 text-center sm:text-left">
              <div>
                <p className="font-serif text-2xl font-bold text-terracotta">100%</p>
                <p className="text-xs text-muted">Artisan Handcrafted</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-lapis">COD</p>
                <p className="text-xs text-muted">Nationwide Delivery</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-brass">Crate</p>
                <p className="text-xs text-muted">Fragile Protection</p>
              </div>
            </div>
          </div>

          {/* Right Parallax Media Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-xl overflow-hidden shadow-craft-lg border-2 border-border/80 group">
              <Image
                src={settings.hero_image_url || '/images/hero/craft-hero.png'}
                alt="Pakistani Luxury Craft Showcase"
                fill
                priority
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-80" />

              <div className="absolute bottom-6 left-6 right-6 p-4 bg-sandstone/90 backdrop-blur-md rounded-lg border border-border/80 text-charcoal space-y-1 shadow-craft-md">
                <span className="text-[10px] uppercase font-bold tracking-wider text-terracotta">
                  Featured Masterpiece
                </span>
                <h3 className="font-serif text-lg font-bold text-charcoal">
                  Hand-Chiseled Antiqued Brass Goblets & Multani Ceramics
                </h3>
                <p className="text-xs text-muted">
                  Hand-engraved botanical scrollwork crafted in Chiniot & Multan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Artisan Heritage Craft Region Ticker */}
      <section className="bg-lapis py-4 border-y border-brass/30 overflow-hidden shadow-craft-sm">
        <div className="flex whitespace-nowrap animate-ticker-slide">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 text-parchment/90 font-serif text-sm tracking-widest uppercase">
              {settings.ticker_text.split('•').map((item, idx) => (
                <span key={idx} className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brass" /> {item.trim()}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Collections Asymmetric Grid */}
      <section id="collections" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-terracotta">
            Curated Provenance
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">
            Explore Heritage Craft Collections
          </h2>
          <p className="text-sm text-muted">
            Each collection represents centuries of unbroken artisan lineage across historic Pakistani craft guilds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map((col) => (
            <Link
              key={col.slug}
              href={`/products?category=${col.slug}`}
              className={`group relative overflow-hidden rounded-xl bg-sandstone border border-border aspect-[4/3] md:aspect-auto ${col.span} min-h-[280px] shadow-craft-sm hover:shadow-craft-md transition-all duration-300`}
            >
              <Image
                src={col.image}
                alt={col.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent opacity-85 group-hover:opacity-90 transition-opacity" />

              <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col justify-end text-parchment space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-brass font-semibold">
                  {col.region}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-parchment group-hover:text-brass transition-colors">
                  {col.title}
                </h3>
                <p className="text-xs text-parchment/80 line-clamp-2 max-w-md font-sans">
                  {col.description}
                </p>
                <div className="pt-2 flex items-center text-xs font-semibold text-brass gap-1">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Live Featured Products Catalog */}
      <section className="bg-sandstone/60 py-16 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 space-y-4 sm:space-y-0">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-lapis">
                Direct From Kiln & Workbench
              </span>
              <h2 className="font-serif text-3xl font-bold text-charcoal mt-1">
                Featured Artisanal Masterpieces
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-lapis hover:text-terracotta transition-colors"
            >
              View Full Catalog ({featuredProducts.length} Items Available) <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Dynamic Heritage Story Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-parchment rounded-2xl border-2 border-border p-8 md:p-12 shadow-craft-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 relative aspect-[4/5] rounded-xl overflow-hidden shadow-craft-sm border border-border">
              <Image
                src={settings.story_image_before || '/images/collections/blue-pottery.png'}
                alt="Multani Blue Pottery Artisan Process"
                fill
                className="object-cover"
              />
            </div>
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-terracotta">
                Artisanal Provenance & Technique
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal leading-snug">
                {settings.story_heading}
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                {settings.story_subheading}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-sandstone rounded-lg border border-border">
                  <h4 className="font-serif font-semibold text-charcoal text-base">Hand-Painted Pigments</h4>
                  <p className="text-xs text-muted mt-1">Natural mineral oxides that transform into deep lapis cobalt at 1200°C.</p>
                </div>
                <div className="p-4 bg-sandstone rounded-lg border border-border">
                  <h4 className="font-serif font-semibold text-charcoal text-base">Crate Fragile Packaging</h4>
                  <p className="text-xs text-muted mt-1">Wrapped in shock-absorbent cellulose & wooden reinforcement.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Trust Anchors Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 bg-sandstone rounded-xl border border-border space-y-3">
            <div className="w-12 h-12 bg-lapis/10 text-lapis rounded-full flex items-center justify-center mx-auto">
              <PackageCheck className="w-6 h-6 text-lapis" />
            </div>
            <h4 className="font-serif text-lg font-bold text-charcoal">Fragile Crate Guarantee</h4>
            <p className="text-xs text-muted leading-relaxed">
              If your delicate ceramics or marble arrive damaged, we dispatch an immediate replacement free of cost.
            </p>
          </div>

          <div className="p-6 bg-sandstone rounded-xl border border-border space-y-3">
            <div className="w-12 h-12 bg-terracotta/10 text-terracotta rounded-full flex items-center justify-center mx-auto">
              <Truck className="w-6 h-6 text-terracotta" />
            </div>
            <h4 className="font-serif text-lg font-bold text-charcoal">100% Cash on Delivery</h4>
            <p className="text-xs text-muted leading-relaxed">
              No online card needed. Inspect your package at your doorstep anywhere in Pakistan before paying.
            </p>
          </div>

          <div className="p-6 bg-sandstone rounded-xl border border-border space-y-3">
            <div className="w-12 h-12 bg-brass/20 text-terracotta rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6 text-terracotta" />
            </div>
            <h4 className="font-serif text-lg font-bold text-charcoal">Direct Guild Artisans</h4>
            <p className="text-xs text-muted leading-relaxed">
              We directly empower heritage artisan families in Multan, Swat, Chiniot, and Rawalpindi.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
