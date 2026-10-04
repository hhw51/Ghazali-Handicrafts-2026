'use client';

import React, { useState, useTransition } from 'react';
import { OrderWithItems, OrderStatus } from '@/types/order';
import { updateOrderStatus, updateOrderNotes } from '@/actions/admin-orders';
import {
  X,
  Copy,
  Check,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Printer,
  ShieldCheck,
  Save,
  RefreshCw,
  ShoppingBag,
  Building2,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';
import { toast } from 'sonner';

interface OrderDetailsModalProps {
  order: OrderWithItems;
  onClose: () => void;
  onOrderUpdated?: () => void;
}

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'pending_verification', label: 'Pending Verification' },
  { value: 'verified', label: 'Verified' },
  { value: 'booked_with_courier', label: 'Booked with Courier' },
  { value: 'dispatched', label: 'Dispatched' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'returned', label: 'Returned' },
];

export function OrderDetailsModal({ order, onClose, onOrderUpdated }: OrderDetailsModalProps) {
  const [status, setStatus] = useState<OrderStatus | string>(order.status);
  const [isUpdatingStatus, startStatusTransition] = useTransition();
  const [notes, setNotes] = useState(order.notes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const cleanPhone = order.customer_phone.replace(/\D/g, '');
  const formattedWaPhone = cleanPhone.startsWith('92') ? cleanPhone : `92${cleanPhone.replace(/^0/, '')}`;
  const whatsappUrl = `https://wa.me/${formattedWaPhone}?text=${encodeURIComponent(
    `Salam ${order.customer_name}! This is Ghazali Handicrafts regarding your Order #${order.id.slice(0, 8)} (${order.city}).`
  )}`;
  const callUrl = `tel:${order.customer_phone}`;

  const handleCopyId = () => {
    navigator.clipboard.writeText(order.id);
    setCopiedId(true);
    toast.success('Order ID copied to clipboard');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleStatusChange = (newStatusStr: string) => {
    const newStatus = newStatusStr as OrderStatus;
    const prevStatus = status;
    setStatus(newStatus); // 0ms Instant UI update

    startStatusTransition(async () => {
      const res = await updateOrderStatus(order.id, newStatus);
      if (!res?.success) {
        setStatus(prevStatus); // Revert on error
        toast.error(res?.error || 'Failed to update order status');
      } else {
        toast.success(`Order status updated to ${newStatus}`);
        if (onOrderUpdated) onOrderUpdated();
      }
    });
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    const res = await updateOrderNotes(order.id, notes);
    setIsSavingNotes(false);

    if (res.success) {
      toast.success('Internal admin notes saved');
      if (onOrderUpdated) onOrderUpdated();
    } else {
      toast.error(res.error || 'Failed to save notes');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 print:p-0 print:bg-white print:static print:overflow-visible no-print">
      {/* Main Modal Card */}
      <div className="bg-sandstone w-full max-w-4xl rounded-2xl border border-border shadow-craft-lg overflow-hidden flex flex-col max-h-[90vh] print:hidden no-print">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-parchment border-b border-border flex flex-wrap items-center justify-between gap-4 no-print">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-lapis/10 text-lapis rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl font-bold text-charcoal font-mono">
                  #{order.id.slice(0, 8)}...
                </h2>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="p-1 text-muted hover:text-charcoal transition-colors cursor-pointer rounded hover:bg-sandstone no-print"
                  title="Copy Full Order ID"
                >
                  {copiedId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>

                {/* Verification Badge */}
                {order.phone_verified ? (
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[11px] rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Customer
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 font-bold text-[11px] rounded-full flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Unverified Phone
                  </span>
                )}
              </div>
              <span className="text-xs text-muted flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(order.created_at).toLocaleString('en-PK', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 no-print">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-lapis hover:bg-lapis/90 text-parchment text-xs font-bold rounded-lg shadow-craft-sm transition-colors flex items-center gap-2 cursor-pointer no-print"
            >
              <Printer className="w-4 h-4" /> Print Invoice
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-muted hover:text-charcoal hover:bg-sandstone rounded-full transition-colors cursor-pointer no-print"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 no-print">
          {/* Status Bar & Actions Row (no-print) */}
          <div className="bg-parchment p-4 rounded-xl border border-border flex flex-wrap items-center justify-between gap-4 no-print">
            <div className="flex items-center gap-3">
              <span className="font-serif text-sm font-bold text-charcoal">Live Order Status:</span>
              <div className="relative inline-flex items-center gap-2">
                {isUpdatingStatus && <RefreshCw className="w-3.5 h-3.5 animate-spin text-lapis" />}
                <select
                  value={status}
                  disabled={isUpdatingStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-lg border border-border bg-sandstone text-charcoal focus:outline-none focus:ring-2 focus:ring-lapis cursor-pointer disabled:opacity-50"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                  {/* Fallback for unmapped status strings */}
                  {!STATUS_OPTIONS.some((o) => o.value === status) && (
                    <option value={status}>{status}</option>
                  )}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 no-print">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-lg shadow-craft-sm transition-colors flex items-center gap-1.5 no-print"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current text-white" /> Chat on WhatsApp
              </a>
              <a
                href={callUrl}
                className="px-3.5 py-1.5 bg-sandstone hover:bg-chiseled border border-border text-charcoal text-xs font-bold rounded-lg shadow-craft-sm transition-colors flex items-center gap-1.5 no-print"
              >
                <Phone className="w-3.5 h-3.5 text-lapis" /> Call Customer
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 no-print">
            {/* Customer & Delivery Block */}
            <div className="bg-parchment p-5 rounded-xl border border-border space-y-3">
              <h3 className="font-serif text-sm font-bold text-charcoal border-b border-border pb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-terracotta" /> Customer & Delivery Details
              </h3>
              <div className="space-y-1.5 text-xs font-sans text-charcoal">
                <p><strong className="text-muted">Customer Name:</strong> {order.customer_name}</p>
                <p><strong className="text-muted">Phone Number:</strong> <span className="font-mono">{order.customer_phone}</span></p>
                <p><strong className="text-muted">Email:</strong> {order.customer_email || 'N/A'}</p>
                <p className="pt-1"><strong className="text-muted">Destination City:</strong> <span className="font-bold text-terracotta text-sm uppercase">{order.city}</span></p>
                <p><strong className="text-muted">Complete Address:</strong> {order.address}</p>
                <p><strong className="text-muted">Landmark:</strong> <span className="font-semibold text-lapis">{order.landmark || 'N/A'}</span></p>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-parchment p-5 rounded-xl border border-border space-y-3">
              <h3 className="font-serif text-sm font-bold text-charcoal border-b border-border pb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-brass" /> Financial Summary
              </h3>
              <div className="space-y-2 text-xs font-sans text-charcoal">
                <div className="flex justify-between text-muted">
                  <span>Subtotal:</span>
                  <span className="font-mono text-charcoal font-medium">Rs. {Number(order.subtotal).toLocaleString()} PKR</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Shipping Fee:</span>
                  <span className="font-mono text-charcoal font-medium">
                    {Number(order.shipping_fee) === 0 ? <span className="text-lapis font-bold">FREE</span> : `Rs. ${Number(order.shipping_fee).toLocaleString()} PKR`}
                  </span>
                </div>
                <div className="pt-2 border-t border-border flex justify-between text-sm font-bold text-charcoal">
                  <span>Total Amount (PKR):</span>
                  <span className="font-mono text-terracotta text-base">Rs. {Number(order.total_amount).toLocaleString()}</span>
                </div>
                <div className="pt-1 flex justify-between text-xs text-muted">
                  <span>Payment Method:</span>
                  <span className="font-bold text-charcoal bg-brass/20 px-2 py-0.5 rounded font-mono">{order.payment_method || 'COD'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Products Table (no-print) */}
          <div className="bg-parchment rounded-xl border border-border overflow-hidden no-print">
            <div className="px-5 py-3 border-b border-border font-serif text-sm font-bold text-charcoal">
              Ordered Craft Products ({order.order_items?.length || 0})
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-sandstone border-b border-border font-bold text-charcoal">
                  <tr>
                    <th className="p-3">Item Name</th>
                    <th className="p-3">Unit Price</th>
                    <th className="p-3">Qty</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {order.order_items?.map((item) => (
                    <tr key={item.id}>
                      <td className="p-3 font-semibold text-charcoal">
                        {item.product?.name || 'Artisan Craft Item'}
                      </td>
                      <td className="p-3 font-mono text-muted">
                        Rs. {Number(item.unit_price).toLocaleString()}
                      </td>
                      <td className="p-3 font-mono font-bold text-charcoal">
                        {item.quantity}
                      </td>
                      <td className="p-3 font-mono font-bold text-terracotta text-right">
                        Rs. {(Number(item.unit_price) * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Internal Admin Notes (no-print) */}
          <div className="bg-parchment p-5 rounded-xl border border-border space-y-3 no-print">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="font-serif text-sm font-bold text-charcoal flex items-center gap-2">
                <FileText className="w-4 h-4 text-lapis" /> Internal Admin Notes
              </h3>
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={isSavingNotes}
                className="px-3 py-1 bg-lapis hover:bg-lapis/90 text-parchment text-xs font-bold rounded-md transition-colors flex items-center gap-1 cursor-pointer no-print"
              >
                {isSavingNotes ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                Save Notes
              </button>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Customer requested double bubble wrap on Multani vase, Called on 02/10..."
              className="w-full h-24 p-3 bg-sandstone border border-border rounded-lg text-xs font-sans text-charcoal focus:outline-none focus:ring-2 focus:ring-lapis resize-none"
            />
          </div>
        </div>
      </div>

      {/* Dedicated Printable Archival Packing Slip / Invoice Container */}
      <div id="printable-invoice" className="printable-slip border-2 border-black p-6 bg-white text-black font-sans">
        {/* Packing Slip Header */}
        <div className="border-b-2 border-black pb-4 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold font-serif uppercase tracking-tight">Ghazali Handicrafts</h1>
            <p className="text-xs font-medium">Archival Crafts & Fragile Export Packaging</p>
            <p className="text-xs text-gray-700 mt-1">
              27 New Anarkali Road, Anarkali Bazaar, Lahore | Helpline: +92 321 9981625
            </p>
          </div>
          <div className="text-right">
            <div className="inline-block border-2 border-black px-3 py-1 text-sm font-mono font-bold uppercase">
              ARCHIVAL PACKING SLIP
            </div>
            <p className="text-xs font-mono font-bold mt-1">Order Ref: #{order.id.slice(0, 8)}</p>
            <p className="text-[11px] text-gray-600">Date: {new Date(order.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Courier & Shipping Label Section */}
        <div className="my-6 border-2 border-black p-4 bg-gray-50">
          <div className="text-xs font-bold uppercase tracking-widest text-gray-700 border-b border-black pb-1 mb-3">
            COURIER DELIVERY LABEL (TRAX / TCS / CALL COURIER)
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-600">RECIPIENT NAME:</p>
              <p className="text-lg font-bold uppercase">{order.customer_name}</p>
              <p className="text-sm font-mono font-bold mt-1">PHONE: {order.customer_phone}</p>
              <p className="text-xs mt-2 text-gray-700"><strong>STREET ADDRESS:</strong> {order.address}</p>
            </div>
            <div className="border-l-2 border-black pl-4">
              <p className="text-xs text-gray-600 font-bold">DESTINATION CITY:</p>
              <p className="text-3xl font-black uppercase text-black font-mono leading-none my-1">
                {order.city}
              </p>
              {order.landmark && (
                <div className="mt-3 p-2 border border-black bg-white">
                  <p className="text-[10px] font-bold text-gray-500 uppercase">COURIER LANDMARK MARKER:</p>
                  <p className="text-xs font-bold text-black uppercase">{order.landmark}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Itemized Slip Table */}
        <table className="w-full text-left text-xs border-collapse border border-black my-4">
          <thead>
            <tr className="bg-gray-200 border-b border-black font-bold uppercase">
              <th className="border border-black p-2">Item Description</th>
              <th className="border border-black p-2 text-center">Qty</th>
              <th className="border border-black p-2 text-right">Unit Price</th>
              <th className="border border-black p-2 text-right">Line Total</th>
            </tr>
          </thead>
          <tbody>
            {order.order_items?.map((item) => (
              <tr key={item.id} className="border-b border-black">
                <td className="border border-black p-2 font-medium">{item.product?.name}</td>
                <td className="border border-black p-2 text-center font-mono font-bold">{item.quantity}</td>
                <td className="border border-black p-2 text-right font-mono">Rs. {Number(item.unit_price).toLocaleString()}</td>
                <td className="border border-black p-2 text-right font-mono font-bold">Rs. {(Number(item.unit_price) * item.quantity).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Financial Totals */}
        <div className="flex justify-between items-end pt-2 border-t-2 border-black">
          <div className="text-xs space-y-1">
            <p><strong>Payment Method:</strong> {order.payment_method || 'Cash on Delivery'}</p>
            <p><strong>Inspection Rule:</strong> Fragile Wooden Crated Parcel — Open Box Allowed</p>
            {notes && <p className="text-[11px] text-gray-700 italic"><strong>Packaging Note:</strong> {notes}</p>}
          </div>
          <div className="text-right text-xs font-mono space-y-1">
            <p>Subtotal: Rs. {Number(order.subtotal).toLocaleString()} PKR</p>
            <p>Shipping Fee: {Number(order.shipping_fee) === 0 ? 'FREE' : `Rs. ${Number(order.shipping_fee).toLocaleString()} PKR`}</p>
            <p className="text-base font-bold font-sans border-t border-black pt-1">
              TOTAL AMOUNT (COD): PKR {Number(order.total_amount).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Footer stamp */}
        <div className="mt-8 pt-4 border-t border-dashed border-gray-400 text-center text-[10px] text-gray-500 uppercase tracking-widest">
          Ghazali Handicrafts • 27 New Anarkali Road, Lahore • Helpline: +92 321 9981625
        </div>
      </div>
    </div>
  );
}
