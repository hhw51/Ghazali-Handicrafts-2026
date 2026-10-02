'use client';

import { useState } from 'react';
import Link from 'next/link';
import { OrderWithItems } from '@/types/order';
import { OrderStatusSelect } from '@/components/admin/order-status-select';
import { OrderDetailsModal } from '@/components/admin/order-details-modal';
import { Calendar, MapPin, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';

interface AdminOrdersTableProps {
  orders: OrderWithItems[];
}

export function AdminOrdersTable({ orders }: AdminOrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);

  return (
    <>
      <div className="bg-sandstone rounded-xl border border-border overflow-hidden shadow-craft-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans border-collapse">
            <thead className="bg-parchment border-b border-border font-serif font-bold text-charcoal select-none">
              <tr>
                <th className="p-4">Order Ref & Date</th>
                <th className="p-4">Customer & City</th>
                <th className="p-4">Verification</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total Amount (COD)</th>
                <th className="p-4">Pipeline Status State</th>
                <th className="p-4">WhatsApp Direct</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted">
                    No orders found matching status filter.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const cleanedPhone = order.customer_phone.replace(/\D/g, '');
                  const formattedPhone = cleanedPhone.startsWith('92') ? cleanedPhone : `92${cleanedPhone.replace(/^0/, '')}`;
                  const waMessage = `Hello ${order.customer_name}, this is Ghazali Handicrafts regarding your Order #${order.id.slice(0, 8)} (${order.city}).`;
                  const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(waMessage)}`;

                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="hover:bg-parchment/80 transition-colors cursor-pointer group"
                      title="Click row to view full order details & print packing slip"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <span className="font-mono font-bold text-lapis group-hover:underline">
                            #{order.id.slice(0, 8)}...
                          </span>
                          <Link
                            href={`/order-success/${order.id}`}
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                            className="text-muted hover:text-lapis p-0.5"
                            title="View public tracking page"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
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
                          <strong className="text-charcoal">{order.city}</strong>, PK
                        </div>
                        <div className="text-[11px] font-mono text-muted">{order.customer_phone}</div>
                      </td>

                      <td className="p-4">
                        {order.phone_verified ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[10px] rounded-full inline-flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Verified
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 font-bold text-[10px] rounded-full inline-flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Unverified
                          </span>
                        )}
                      </td>

                      <td className="p-4 font-mono font-medium">
                        {order.order_items?.length || 0} items
                      </td>

                      <td className="p-4 font-mono font-bold text-terracotta text-sm">
                        Rs. {Number(order.total_amount).toLocaleString()} PKR
                      </td>

                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                      </td>

                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium text-[11px] rounded-md transition-colors shadow-craft-sm"
                        >
                          <WhatsAppIcon className="w-3.5 h-3.5 fill-current text-white" /> WhatsApp
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

      {/* Render Modal Dialog when row clicked */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
}
