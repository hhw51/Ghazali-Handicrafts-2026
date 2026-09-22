'use client';

import { useState } from 'react';
import { OrderStatus } from '@/types/order';
import { updateOrderStatus } from '@/actions/admin-orders';
import { RefreshCw } from 'lucide-react';

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: OrderStatus;
}

export function OrderStatusSelect({ orderId, currentStatus }: OrderStatusSelectProps) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [loading, setLoading] = useState(false);

  const statusColors: Record<OrderStatus, string> = {
    pending_verification: 'bg-amber-100 text-amber-900 border-amber-300',
    verified: 'bg-lapis/10 text-lapis border-lapis/30',
    booked_with_courier: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    dispatched: 'bg-sky-100 text-sky-900 border-sky-300',
    delivered: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    cancelled: 'bg-stone/20 text-stone border-stone/30',
    returned: 'bg-terracotta/10 text-terracotta border-terracotta/30',
  };

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStat = e.target.value as OrderStatus;
    setLoading(true);

    const res = await updateOrderStatus(orderId, newStat);
    setLoading(false);

    if (res.success) {
      setStatus(newStat);
    }
  };

  return (
    <div className="relative inline-flex items-center gap-1.5">
      {loading && <RefreshCw className="w-3 h-3 animate-spin text-muted" />}
      <select
        value={status}
        onChange={handleChange}
        disabled={loading}
        className={`px-3 py-1 text-xs font-semibold rounded-md border focus:outline-none cursor-pointer ${statusColors[status]}`}
      >
        <option value="pending_verification">Pending Verification</option>
        <option value="verified">Verified (Ready)</option>
        <option value="booked_with_courier">Booked with Courier</option>
        <option value="dispatched">Dispatched</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
        <option value="returned">Returned</option>
      </select>
    </div>
  );
}
