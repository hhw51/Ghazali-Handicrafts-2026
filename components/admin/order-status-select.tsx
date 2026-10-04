'use client';

import { useState, useTransition } from 'react';
import { updateOrderStatus } from '@/actions/admin-orders';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_OPTIONS = [
  { value: 'pending_verification', label: 'Pending Verification' },
  { value: 'verified', label: 'Verified' },
  { value: 'booked_with_courier', label: 'Booked with Courier' },
  { value: 'dispatched', label: 'Dispatched' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'returned', label: 'Returned' },
];

const STATUS_COLORS: Record<string, string> = {
  pending_verification: 'bg-amber-100 text-amber-900 border-amber-300',
  verified: 'bg-lapis/10 text-lapis border-lapis/30',
  booked_with_courier: 'bg-indigo-100 text-indigo-900 border-indigo-300',
  dispatched: 'bg-sky-100 text-sky-900 border-sky-300',
  delivered: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  cancelled: 'bg-red-100 text-red-900 border-red-300',
  returned: 'bg-terracotta/10 text-terracotta border-terracotta/30',
};

export function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: string) => {
    const prevStatus = status;
    setStatus(newStatus);

    startTransition(async () => {
      const res = await updateOrderStatus(orderId, newStatus);
      if (!res?.success) {
        setStatus(prevStatus);
        toast.error(res?.error || 'Failed to update status');
      } else {
        toast.success('Order status updated');
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
        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border focus:outline-none cursor-pointer disabled:opacity-50 transition-colors ${
          STATUS_COLORS[status] || 'bg-sandstone text-charcoal border-border'
        }`}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
