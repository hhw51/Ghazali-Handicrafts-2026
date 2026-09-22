import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { OrderWithItems } from '@/types/order';
import { CheckCircle2, ShieldCheck, MapPin, PackageCheck, MessageCircle, ArrowRight, Truck } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: `Order Confirmed #${resolvedParams.orderId.slice(0, 8)} | Ghazali Handicrafts`,
  };
}

async function getOrderDetails(orderId: string): Promise<OrderWithItems | null> {
  try {
    const supabase = createAdminClient();

    const { data: order, error } = await supabase
      .from('orders')
      .select('*, order_items(*, product:products(*, category:categories(*)))')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      console.error('Error fetching confirmed order:', error);
      return null;
    }

    return order as OrderWithItems;
  } catch (err) {
    console.error('Exception fetching order details:', err);
    return null;
  }
}

export default async function OrderSuccessPage({ params }: PageProps) {
  const resolvedParams = await params;
  const order = await getOrderDetails(resolvedParams.orderId);

  if (!order) {
    notFound();
  }

  const whatsappMessage = `Hello Ghazali Handicrafts, I would like to inquire about my order status.\n*Order Ref:* #${order.id}\n*Customer Name:* ${order.customer_name}\n*City:* ${order.city}\n*Total Payable:* PKR ${order.total_amount}`;
  const whatsappUrl = `https://wa.me/923001234567?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="py-12 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Success Hero Banner */}
      <div className="bg-sandstone rounded-2xl border-2 border-brass p-8 text-center space-y-4 shadow-craft-md">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-300">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="inline-block px-3 py-1 bg-lapis/10 text-lapis font-bold text-xs rounded-full uppercase tracking-wider">
          Cash on Delivery Order Confirmed
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">
          Shukriya, {order.customer_name}!
        </h1>

        <p className="text-xs sm:text-sm text-muted max-w-lg mx-auto leading-relaxed">
          Your order <strong className="font-mono text-charcoal">#{order.id}</strong> has been verified. Our master artisans and packaging team in Lahore are preparing your fragile wooden crate parcel.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-parchment font-medium text-xs rounded-md shadow-craft-sm transition-colors flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-emerald-200" /> Track & Inquire via WhatsApp
          </a>

          <Link
            href="/products"
            className="px-6 py-3 bg-lapis hover:bg-lapis/90 text-parchment font-medium text-xs rounded-md transition-colors flex items-center gap-1.5"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recipient & Shipping Information */}
        <div className="bg-sandstone rounded-xl border border-border p-6 space-y-4 shadow-craft-sm">
          <h3 className="font-serif text-lg font-bold text-charcoal flex items-center gap-2 border-b border-border pb-3">
            <MapPin className="w-4 h-4 text-terracotta" /> Delivery Address & Contact
          </h3>

          <div className="space-y-2 text-xs text-charcoal/90 leading-relaxed font-sans">
            <p>
              <span className="font-semibold text-charcoal">Customer Name:</span> {order.customer_name}
            </p>
            <p>
              <span className="font-semibold text-charcoal">Verified Mobile:</span> {order.customer_phone}
            </p>
            {order.customer_email && (
              <p>
                <span className="font-semibold text-charcoal">Email:</span> {order.customer_email}
              </p>
            )}
            <p>
              <span className="font-semibold text-charcoal">Delivery City:</span> {order.city}, Pakistan
            </p>
            <p>
              <span className="font-semibold text-charcoal">Street Address:</span> {order.address}
            </p>
            {order.landmark && (
              <p>
                <span className="font-semibold text-charcoal">Landmark:</span> {order.landmark}
              </p>
            )}
            <div className="pt-2 border-t border-border flex items-center gap-2 text-muted">
              <Truck className="w-4 h-4 text-lapis shrink-0" />
              <span>Dispatch Timeline: 24-48 business hours via courier</span>
            </div>
          </div>
        </div>

        {/* Flagship Store & Guarantee */}
        <div className="bg-sandstone rounded-xl border border-border p-6 space-y-4 shadow-craft-sm">
          <h3 className="font-serif text-lg font-bold text-charcoal flex items-center gap-2 border-b border-border pb-3">
            <ShieldCheck className="w-4 h-4 text-brass" /> Flagship Store Provenance
          </h3>

          <div className="space-y-2 text-xs text-charcoal/90 leading-relaxed">
            <p>
              <span className="font-semibold text-charcoal">Dispatched From:</span> Ghazali Handicrafts Flagship Store
            </p>
            <p className="text-muted">27 New Anarkali, Lahore, Punjab, Pakistan</p>
            <div className="pt-2 space-y-2 border-t border-border">
              <div className="flex items-center gap-2 text-xs">
                <PackageCheck className="w-4 h-4 text-terracotta shrink-0" />
                <span>Custom shock-absorbent wooden crate packaging</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-brass shrink-0" />
                <span>100% Cash on Delivery — Inspect upon arrival</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Itemized Order Breakdown */}
      <div className="bg-sandstone rounded-xl border border-border p-6 space-y-4 shadow-craft-sm">
        <h3 className="font-serif text-lg font-bold text-charcoal border-b border-border pb-3">
          Itemized Craft Breakdown
        </h3>

        <div className="divide-y divide-border/60">
          {order.order_items.map((item) => (
            <div key={item.id} className="py-4 flex gap-4 items-center">
              <div className="w-16 h-20 relative bg-parchment rounded-md overflow-hidden border border-border shrink-0 aspect-[4/5]">
                <Image
                  src={item.product?.images?.[0] || '/images/hero/craft-hero.png'}
                  alt={item.product?.name || 'Craft item'}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-0.5">
                <h4 className="font-serif text-sm font-semibold text-charcoal">
                  {item.product?.name}
                </h4>
                <p className="text-xs text-muted">
                  Category: {item.product?.category?.name || 'Pakistani Craft'}
                </p>
                <p className="text-xs font-mono text-terracotta">
                  Rs. {item.unit_price.toLocaleString()} PKR x {item.quantity}
                </p>
              </div>

              <div className="text-right">
                <span className="font-serif text-sm font-bold text-charcoal font-mono">
                  Rs. {(item.unit_price * item.quantity).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-border space-y-2 text-xs">
          <div className="flex justify-between text-muted">
            <span>Subtotal</span>
            <span className="font-mono text-charcoal font-medium">Rs. {Number(order.subtotal).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Courier Delivery Fee</span>
            <span className="font-mono text-charcoal font-medium">
              {Number(order.shipping_fee) === 0 ? <span className="text-lapis font-bold">FREE</span> : `Rs. ${Number(order.shipping_fee).toLocaleString()}`}
            </span>
          </div>
          <div className="pt-2 border-t border-border flex justify-between text-base font-bold text-charcoal">
            <span>Total Payable Amount (COD)</span>
            <span className="font-mono text-terracotta text-lg">Rs. {Number(order.total_amount).toLocaleString()} PKR</span>
          </div>
        </div>
      </div>
    </div>
  );
}
