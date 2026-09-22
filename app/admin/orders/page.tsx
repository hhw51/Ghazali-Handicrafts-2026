import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { OrderWithItems, OrderStatus } from '@/types/order';
import { OrderStatusSelect } from '@/components/admin/order-status-select';
import { ShoppingCart, MessageCircle, ExternalLink, Calendar, MapPin, Truck } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    status?: string;
  }>;
}

async function getAdminOrders(statusFilter?: string) {
  try {
    const supabase = createAdminClient();
    let query = supabase
      .from('orders')
      .select('*, order_items(*, product:products(*))')
      .order('created_at', { ascending: false });

    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }

    const { data: orders } = await query;
    return (orders as OrderWithItems[]) || [];
  } catch (err) {
    console.error('Error fetching admin orders:', err);
    return [];
  }
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const orders = await getAdminOrders(resolvedParams.status);

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal">
            Order Operations Pipeline
          </h1>
          <p className="text-xs text-muted mt-1">
            Status state machine control, WhatsApp customer pings, and courier booking ({orders.length} orders total)
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border text-xs font-medium">
        <Link
          href="/admin/orders"
          className={`px-3 py-1.5 rounded-full transition-colors ${
            !resolvedParams.status
              ? 'bg-lapis text-parchment font-bold'
              : 'bg-sandstone text-charcoal hover:bg-chiseled border border-border'
          }`}
        >
          All Orders
        </Link>
        <Link
          href="/admin/orders?status=pending_verification"
          className={`px-3 py-1.5 rounded-full transition-colors ${
            resolvedParams.status === 'pending_verification'
              ? 'bg-amber-800 text-amber-100 font-bold'
              : 'bg-sandstone text-charcoal hover:bg-chiseled border border-border'
          }`}
        >
          Pending Verification
        </Link>
        <Link
          href="/admin/orders?status=verified"
          className={`px-3 py-1.5 rounded-full transition-colors ${
            resolvedParams.status === 'verified'
              ? 'bg-lapis text-parchment font-bold'
              : 'bg-sandstone text-charcoal hover:bg-chiseled border border-border'
          }`}
        >
          Verified (Ready)
        </Link>
        <Link
          href="/admin/orders?status=booked_with_courier"
          className={`px-3 py-1.5 rounded-full transition-colors ${
            resolvedParams.status === 'booked_with_courier'
              ? 'bg-indigo-800 text-indigo-100 font-bold'
              : 'bg-sandstone text-charcoal hover:bg-chiseled border border-border'
          }`}
        >
          Booked Courier
        </Link>
        <Link
          href="/admin/orders?status=dispatched"
          className={`px-3 py-1.5 rounded-full transition-colors ${
            resolvedParams.status === 'dispatched'
              ? 'bg-sky-800 text-sky-100 font-bold'
              : 'bg-sandstone text-charcoal hover:bg-chiseled border border-border'
          }`}
        >
          Dispatched
        </Link>
        <Link
          href="/admin/orders?status=delivered"
          className={`px-3 py-1.5 rounded-full transition-colors ${
            resolvedParams.status === 'delivered'
              ? 'bg-emerald-800 text-emerald-100 font-bold'
              : 'bg-sandstone text-charcoal hover:bg-chiseled border border-border'
          }`}
        >
          Delivered
        </Link>
      </div>

      {/* Orders Table */}
      <div className="bg-sandstone rounded-xl border border-border overflow-hidden shadow-craft-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-parchment border-b border-border font-serif font-bold text-charcoal">
              <tr>
                <th className="p-4">Order Ref & Date</th>
                <th className="p-4">Customer & City</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total Amount (COD)</th>
                <th className="p-4">Pipeline Status State</th>
                <th className="p-4">WhatsApp Direct Ping</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted">
                    No orders found matching status filter.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const cleanedPhone = order.customer_phone.replace(/\D/g, '');
                  const formattedPhone = cleanedPhone.startsWith('92') ? cleanedPhone : `92${cleanedPhone.replace(/^0/, '')}`;
                  const waMessage = `Hello ${order.customer_name}, this is Ghazali Handicrafts regarding your Order #${order.id} (${order.city}).`;
                  const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(waMessage)}`;

                  return (
                    <tr key={order.id} className="hover:bg-parchment/60 transition-colors">
                      <td className="p-4">
                        <Link
                          href={`/order-success/${order.id}`}
                          target="_blank"
                          className="font-mono font-bold text-lapis hover:underline block"
                        >
                          #{order.id.slice(0, 8)}...
                        </Link>
                        <span className="text-[11px] text-muted flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-muted" />
                          {new Date(order.created_at).toLocaleDateString('en-PK', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="font-semibold text-charcoal text-sm">{order.customer_name}</div>
                        <div className="text-[11px] text-muted flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-terracotta" />
                          {order.city}, PK
                        </div>
                        <div className="text-[11px] font-mono text-muted">{order.customer_phone}</div>
                      </td>

                      <td className="p-4 font-mono font-medium">
                        {order.order_items?.length || 0} items
                      </td>

                      <td className="p-4 font-mono font-bold text-terracotta text-sm">
                        Rs. {Number(order.total_amount).toLocaleString()} PKR
                      </td>

                      <td className="p-4">
                        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                      </td>

                      <td className="p-4">
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-parchment font-medium text-[11px] rounded-md transition-colors shadow-craft-sm"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-200" /> WhatsApp Customer
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
