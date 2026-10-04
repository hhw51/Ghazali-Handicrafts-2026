import { createAdminClient } from '@/lib/supabase/admin';
import { notFound } from 'next/navigation';
import { PrintControls } from '@/components/admin/print-controls';

export const dynamic = 'force-dynamic';

export default async function PrintOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: order, error } = await supabase
    .from('orders')
    .select('*, order_items(*, product:products(*))')
    .eq('id', id)
    .single();

  if (error || !order) {
    notFound();
  }

  // Parse items if stored in JSON or order_items table fallback
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items = Array.isArray(order.items) && order.items.length > 0
    ? order.items
    : Array.isArray(order.order_items) && order.order_items.length > 0
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? order.order_items.map((oi: any) => ({
        name: oi.product?.name || 'Artisanal Handicraft Selection',
        quantity: oi.quantity,
        price: oi.unit_price,
      }))
    : [];

  return (
    <div className="min-h-screen bg-white text-black p-4 sm:p-8 font-sans">
      {/* On-screen control bar (Hidden during printing) */}
      <PrintControls orderId={order.id} />

      {/* Standalone Physical A4 Slip */}
      <div
        id="printable-slip"
        className="max-w-[190mm] mx-auto border-2 border-black p-5 box-border"
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-black pb-3">
          <div>
            <h1 className="font-serif text-xl font-bold tracking-tight m-0">GHAZALI HANDICRAFTS</h1>
            <p className="text-[11px] font-medium text-stone-600 m-0 mt-0.5">
              Archival Crafts & Fragile Export Crating
            </p>
            <p className="text-[10px] text-stone-500 m-0">
              27 New Anarkali Road, Lahore | Helpline: +92 321 9981625
            </p>
          </div>
          <div className="text-right">
            <div className="inline-block border-2 border-black px-2 py-0.5 font-bold text-xs">
              ARCHIVAL PACKING SLIP
            </div>
            <p className="text-[11px] font-mono mt-1 m-0">Ref: #{order.id.slice(0, 8)}</p>
            <p className="text-[10px] text-stone-500 m-0">
              {new Date(order.created_at).toLocaleDateString('en-PK', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Courier / Recipient Details Box */}
        <div className="grid grid-cols-3 border-2 border-black my-3">
          <div className="col-span-2 p-2.5 border-r-2 border-black space-y-1">
            <p className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">
              Recipient & Delivery Details
            </p>
            <p className="text-sm font-bold">{order.customer_name?.toUpperCase()}</p>
            <p className="text-xs font-medium font-mono">{order.customer_phone}</p>
            <p className="text-xs text-stone-800 leading-snug">
              {order.address} {order.landmark ? `(Near: ${order.landmark})` : ''}
            </p>
          </div>
          <div className="p-2.5 flex flex-col justify-between text-right bg-stone-50">
            <div>
              <p className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">
                Destination City
              </p>
              <p className="text-lg font-black tracking-tight">{order.city?.toUpperCase()}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold">
                PAYMENT: {order.payment_method?.toUpperCase() || 'COD'}
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary Table */}
        <table className="w-full border-collapse border border-black text-xs my-3">
          <thead>
            <tr className="bg-stone-100">
              <th className="border border-black p-1.5 text-left font-bold">Item Description</th>
              <th className="border border-black p-1.5 text-center font-bold w-12">Qty</th>
              <th className="border border-black p-1.5 text-right font-bold w-28">Total (PKR)</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              items.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td className="border border-black p-1.5">
                    {item.name} {item.size ? `(${item.size}″)` : ''}
                  </td>
                  <td className="border border-black p-1.5 text-center font-mono">{item.quantity}</td>
                  <td className="border border-black p-1.5 text-right font-mono font-medium">
                    Rs. {Number(item.price * item.quantity).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border border-black p-1.5">
                  Artisanal Handicraft Selection (Order #{order.id.slice(0, 8)})
                </td>
                <td className="border border-black p-1.5 text-center font-mono">1</td>
                <td className="border border-black p-1.5 text-right font-mono font-medium">
                  Rs. {Number(order.subtotal || order.total_amount).toLocaleString()}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pricing Totals */}
        <div className="flex justify-end pt-2">
          <div className="w-64 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-stone-600">Subtotal:</span>
              <span className="font-mono font-medium">
                Rs. {Number(order.subtotal || order.total_amount).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">Shipping Fee:</span>
              <span className="font-mono">
                {Number(order.shipping_fee) > 0 ? `Rs. ${order.shipping_fee}` : 'FREE'}
              </span>
            </div>
            <div className="flex justify-between border-t border-black pt-1.5 text-sm font-bold">
              <span>TOTAL PAYABLE (COD):</span>
              <span className="font-mono">PKR {Number(order.total_amount).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Packing & Courier Instructions Footer */}
        <div className="mt-4 pt-2 border-t border-dashed border-black text-center text-[9px] text-stone-700">
          Inspection Rule: Fragile Wooden Crated Parcel — Open Box Allowed Upon Delivery | Ghazali Support: +92 321 9981625
        </div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `window.addEventListener('load', () => window.print());` }} />
    </div>
  );
}
