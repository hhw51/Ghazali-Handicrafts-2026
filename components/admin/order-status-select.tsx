'use client';

import { useState, useTransition } from 'react';
import { OrderStatus } from '@/types/order';
import { updateOrderStatus } from '@/actions/admin-orders';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: OrderStatus | string;
}

export function OrderStatusSelect({ orderId, currentStatus }: OrderStatusSelectProps) {
  const [status, setStatus] = useState<string>(currentStatus);
  const [isPending, startTransition] = useTransition();

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-900 border-amber-300',
    pending_verification: 'bg-amber-100 text-amber-900 border-amber-300',
    confirmed: 'bg-lapis/10 text-lapis border-lapis/30',
    verified: 'bg-lapis/10 text-lapis border-lapis/30',
    crating: 'bg-brass/20 text-charcoal border-brass/40',
    booked_with_courier: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    shipped: 'bg-sky-100 text-sky-900 border-sky-300',
    dispatched: 'bg-sky-100 text-sky-900 border-sky-300',
    delivered: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    cancelled: 'bg-red-100 text-red-900 border-red-300',
    returned: 'bg-terracotta/10 text-terracotta border-terracotta/30',
  };

  const handleStatusChange = (newStatus: string) => {
    const prevStatus = status;
    setStatus(newStatus); // 0ms Instant UI update

    startTransition(async () => {
      const res = await updateOrderStatus(orderId, newStatus as OrderStatus);
      if (!res?.success) {
        setStatus(prevStatus); // Revert on error
        toast.error('Failed to update status');
      } else {
        toast.success(`Order status updated to ${newStatus}`);
      }
    });
  };

  return (
    <div className="relative inline-flex items-center gap-1.5 font-sans" onClick={(e) => e.stopPropagation()}>
      {isPending && <RefreshCw className="w-3 h-3 animate-spin text-lapis shrink-0" />}
      <select
        value={status}
        disabled={isPending}
        onChange={(e) => handleStatusChange(e.target.value)}
        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border focus:outline-none cursor-pointer disabled:opacity-50 transition-colors ${statusColors[status] || 'bg-sandstone text-charcoal border-border'}`}
      >
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="crating">Artisan Crating</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
        {/* Legacy status fallbacks */}
        <option value="pending_verification">Pending Verification (Legacy)</option>
        <option value="verified">Verified (Legacy)</option>
        <option value="booked_with_courier">Booked Courier (Legacy)</option>
        <option value="dispatched">Dispatched (Legacy)</option>
        <option value="returned">Returned (Legacy)</option>
      </select>
    </div>
  );
}
