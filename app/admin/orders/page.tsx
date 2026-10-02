import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { OrderWithItems } from '@/types/order';
import { AdminOrdersTable } from '@/components/admin/admin-orders-table';

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
            Order Operations Pipeline & Management
          </h1>
          <p className="text-xs text-muted mt-1">
            Click any row to inspect customer details, update notes, change status, and print archival packing slips ({orders.length} orders total)
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border text-xs font-medium">
        <Link
          href="/admin/orders"
          className={`px-3.5 py-1.5 rounded-full transition-colors ${
            !resolvedParams.status
              ? 'bg-lapis text-parchment font-bold shadow-craft-sm'
              : 'bg-sandstone text-charcoal hover:bg-chiseled border border-border'
          }`}
        >
          All Orders
        </Link>
        <Link
          href="/admin/orders?status=pending"
          className={`px-3.5 py-1.5 rounded-full transition-colors ${
            resolvedParams.status === 'pending' || resolvedParams.status === 'pending_verification'
              ? 'bg-amber-800 text-amber-100 font-bold shadow-craft-sm'
              : 'bg-sandstone text-charcoal hover:bg-chiseled border border-border'
          }`}
        >
          Pending
        </Link>
        <Link
          href="/admin/orders?status=confirmed"
          className={`px-3.5 py-1.5 rounded-full transition-colors ${
            resolvedParams.status === 'confirmed' || resolvedParams.status === 'verified'
              ? 'bg-lapis text-parchment font-bold shadow-craft-sm'
              : 'bg-sandstone text-charcoal hover:bg-chiseled border border-border'
          }`}
        >
          Confirmed
        </Link>
        <Link
          href="/admin/orders?status=crating"
          className={`px-3.5 py-1.5 rounded-full transition-colors ${
            resolvedParams.status === 'crating'
              ? 'bg-brass/90 text-charcoal font-bold shadow-craft-sm'
              : 'bg-sandstone text-charcoal hover:bg-chiseled border border-border'
          }`}
        >
          Artisan Crating
        </Link>
        <Link
          href="/admin/orders?status=shipped"
          className={`px-3.5 py-1.5 rounded-full transition-colors ${
            resolvedParams.status === 'shipped' || resolvedParams.status === 'dispatched' || resolvedParams.status === 'booked_with_courier'
              ? 'bg-sky-800 text-sky-100 font-bold shadow-craft-sm'
              : 'bg-sandstone text-charcoal hover:bg-chiseled border border-border'
          }`}
        >
          Shipped / Dispatched
        </Link>
        <Link
          href="/admin/orders?status=delivered"
          className={`px-3.5 py-1.5 rounded-full transition-colors ${
            resolvedParams.status === 'delivered'
              ? 'bg-emerald-800 text-emerald-100 font-bold shadow-craft-sm'
              : 'bg-sandstone text-charcoal hover:bg-chiseled border border-border'
          }`}
        >
          Delivered
        </Link>
        <Link
          href="/admin/orders?status=cancelled"
          className={`px-3.5 py-1.5 rounded-full transition-colors ${
            resolvedParams.status === 'cancelled'
              ? 'bg-red-900 text-red-100 font-bold shadow-craft-sm'
              : 'bg-sandstone text-charcoal hover:bg-chiseled border border-border'
          }`}
        >
          Cancelled
        </Link>
      </div>

      {/* Interactive Orders Table with Modal Trigger */}
      <AdminOrdersTable orders={orders} />
    </div>
  );
}
