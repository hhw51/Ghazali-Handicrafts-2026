import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Product, Review } from '@/types/product';
import { AccordionSection } from '@/components/products/pdp-accordion';
import { PdpActions } from '@/components/products/pdp-actions';
import { ShieldCheck, Truck, MapPin, PackageCheck, Star, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProductAndReviews(slug: string) {
  try {
    const supabase = await createClient();

    const { data: product, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('slug', slug)
      .single();

    if (error || !product) {
      return { product: null, reviews: [] };
    }

    const { data: reviews } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', product.id)
      .order('created_at', { ascending: false });

    return {
      product: product as Product,
      reviews: (reviews as Review[]) || [],
    };
  } catch (err) {
    console.error('Error loading PDP:', err);
    return { product: null, reviews: [] };
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { product } = await getProductAndReviews(resolvedParams.slug);

  if (!product) {
    return {
      title: 'Product Not Found | Ghazali Handicrafts',
    };
  }

  return {
    title: `${product.name} | Ghazali Handicrafts`,
    description: product.short_description || product.long_description?.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.short_description || undefined,
      images: [{ url: product.images[0] || '/images/hero/craft-hero.png' }],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { product, reviews } = await getProductAndReviews(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  // JSON-LD Structured Data for Google Shopping
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.short_description || product.long_description,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'PKR',
      availability: product.in_stock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    ...(reviews.length > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1),
        reviewCount: reviews.length,
      },
    }),
  };

  const primaryImage = product.images[0] || '/images/hero/craft-hero.png';

  return (
    <div className="pb-24 pt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* JSON-LD Script Embed */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Rail */}
      <div className="flex items-center gap-2 text-xs text-muted mb-6">
        <Link href="/products" className="hover:text-lapis flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
        </Link>
        <span>/</span>
        {product.category && (
          <>
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-lapis"
            >
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-charcoal font-medium truncate max-w-xs">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Sticky Media Gallery */}
        <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-24">
          <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-sandstone border-2 border-border shadow-craft-md">
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {!product.in_stock && (
              <div className="absolute top-4 right-4 bg-terracotta text-parchment px-3 py-1 text-xs font-bold rounded-full">
                Sold Out
              </div>
            )}
          </div>

          {/* Gallery Thumbnails */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-lg overflow-hidden border border-border bg-sandstone hover:border-brass cursor-pointer"
                >
                  <Image src={img} alt={`${product.name} preview ${idx + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Commerce Rail */}
        <div className="lg:col-span-5 space-y-6">
          {/* Provenance Tag & Category */}
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 bg-lapis/10 text-lapis font-semibold text-xs rounded-full border border-lapis/20 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Authentic Pakistani Craft
            </span>

            {product.in_stock ? (
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                ✓ In Stock
              </span>
            ) : (
              <span className="text-xs font-semibold text-terracotta bg-terracotta/10 px-2.5 py-0.5 rounded-full">
                Out of Stock
              </span>
            )}
          </div>

          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal leading-tight">
              {product.name}
            </h1>
            <p className="font-serif text-2xl font-bold text-terracotta mt-2">
              Rs. {product.price.toLocaleString()}{' '}
              <span className="text-xs font-sans text-muted font-normal">PKR (Taxes included)</span>
            </p>
          </div>

          {product.short_description && (
            <div className="p-4 bg-sandstone rounded-lg border border-border text-xs text-charcoal/90 leading-relaxed font-sans">
              {product.short_description}
            </div>
          )}

          {/* Interactive Actions (COD & WhatsApp deep-link) */}
          <PdpActions product={product} />

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-sandstone/80 rounded-md border border-border flex items-center gap-2 text-xs">
              <Truck className="w-4 h-4 text-lapis shrink-0" />
              <span>100% COD Nationwide</span>
            </div>
            <div className="p-3 bg-sandstone/80 rounded-md border border-border flex items-center gap-2 text-xs">
              <PackageCheck className="w-4 h-4 text-terracotta shrink-0" />
              <span>Fragile Crate Protection</span>
            </div>
          </div>

          {/* Radix Accordions */}
          <div className="pt-4">
            <AccordionSection product={product} />
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="mt-20 pt-12 border-t border-border">
        <h2 className="font-serif text-2xl font-bold text-charcoal mb-8">
          Customer Verification & Provenance Reviews
        </h2>

        {reviews.length === 0 ? (
          <div className="p-8 bg-sandstone rounded-xl border border-border text-center space-y-2">
            <p className="font-serif text-lg text-charcoal font-semibold">Be the first to review this craft masterpiece</p>
            <p className="text-xs text-muted">Verified customer reviews are submitted after nationwide parcel delivery.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-6 bg-sandstone rounded-xl border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-charcoal text-base">{rev.customer_name}</h4>
                    {rev.customer_city && (
                      <span className="text-[11px] text-muted">{rev.customer_city}, Pakistan</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-brass">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-brass text-brass" />
                    ))}
                  </div>
                </div>

                {rev.comment && (
                  <p className="text-xs text-charcoal/90 leading-relaxed font-sans italic">
                    "{rev.comment}"
                  </p>
                )}

                {rev.is_verified && (
                  <div className="inline-flex items-center gap-1 text-[10px] text-emerald-800 font-semibold bg-emerald-100 px-2 py-0.5 rounded">
                    <ShieldCheck className="w-3 h-3" /> Verified Purchase
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
