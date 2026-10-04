import { createAdminClient } from '@/lib/supabase/admin';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function PrintOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*, product:products(*))')
    .eq('id', id)
    .single();

  if (!order) notFound();

  return (
    <html lang="en">
      <head>
        <title>Invoice - #{order.id.slice(0, 8)} | Ghazali Handicrafts</title>
        <style>{`
          @page { size: A4 portrait; margin: 10mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, serif; margin: 0; padding: 0; color: #000; background: #fff; }
          .invoice-box { width: 100%; max-width: 190mm; margin: 0 auto; border: 2px solid #000; padding: 16px; box-sizing: border-box; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th, td { border: 1px solid #000; padding: 6px 8px; text-align: left; font-size: 12px; }
          th { background: #f0f0f0; }
          .no-print { display: flex; gap: 8px; margin-bottom: 16px; }
          @media screen { aside { display: none !important; } main { padding: 0 !important; background: transparent !important; } }
          @media print { aside { display: none !important; } .no-print { display: none !important; } }
        `}</style>
      </head>
      <body>
        <div className="no-print" style={{ padding: '12px', background: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
          <button
            onClick={() => window.print()}
            style={{ padding: '8px 16px', background: '#00405C', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            🖨️ Print Packing Slip
          </button>
          <button
            onClick={() => window.close()}
            style={{ padding: '8px 16px', background: '#eee', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer' }}
          >
            Close
          </button>
        </div>

        <div className="invoice-box">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #000', paddingBottom: '10px' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '20px', letterSpacing: '1px' }}>GHAZALI HANDICRAFTS</h1>
              <p style={{ margin: '4px 0 0', fontSize: '11px' }}>Archival Crafts & Fragile Export Packaging</p>
              <p style={{ margin: 0, fontSize: '10px' }}>27 New Anarkali Road, Lahore | Helpline: +92 321 9981625</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ border: '2px solid #000', padding: '4px 8px', fontWeight: 'bold', fontSize: '12px' }}>
                ARCHIVAL PACKING SLIP
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '11px' }}>Order: #{order.id.slice(0, 8)}</p>
              <p style={{ margin: 0, fontSize: '11px' }}>Date: {new Date(order.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Courier Box */}
          <div style={{ border: '2px solid #000', margin: '14px 0', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: '60%' }}>
              <p style={{ margin: 0, fontSize: '10px', fontWeight: 'bold', color: '#555' }}>RECIPIENT / DELIVERY DETAILS</p>
              <p style={{ margin: '4px 0', fontSize: '15px', fontWeight: 'bold' }}>{order.customer_name?.toUpperCase()}</p>
              <p style={{ margin: '2px 0', fontSize: '12px' }}>Phone: {order.customer_phone}</p>
              <p style={{ margin: '2px 0', fontSize: '12px' }}>Address: {order.address} {order.landmark ? `(Near ${order.landmark})` : ''}</p>
            </div>
            <div style={{ width: '35%', textAlign: 'right', borderLeft: '2px solid #000', paddingLeft: '12px' }}>
              <p style={{ margin: 0, fontSize: '10px', fontWeight: 'bold', color: '#555' }}>DESTINATION CITY</p>
              <p style={{ margin: '6px 0', fontSize: '20px', fontWeight: '900' }}>{order.city?.toUpperCase()}</p>
              <p style={{ margin: 0, fontSize: '11px', fontWeight: 'bold' }}>PAYMENT: {order.payment_method?.toUpperCase() || 'COD'}</p>
            </div>
          </div>

          {/* Order Details / Line Items */}
          <table>
            <thead>
              <tr>
                <th>Item Description</th>
                <th style={{ width: '50px', textAlign: 'center' }}>Qty</th>
                <th style={{ width: '90px', textAlign: 'right' }}>Price (PKR)</th>
              </tr>
            </thead>
            <tbody>
              {order.order_items && order.order_items.length > 0 ? (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                order.order_items.map((item: any) => (
                  <tr key={item.id}>
                    <td>{item.product?.name || `Handcrafted Artisanal Selection (Order #${order.id.slice(0, 8)})`}</td>
                    <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ textAlign: 'right' }}>Rs. {Number(item.unit_price).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>Handcrafted Artisanal Selection (Order #{order.id.slice(0, 8)})</td>
                  <td style={{ textAlign: 'center' }}>1</td>
                  <td style={{ textAlign: 'right' }}>Rs. {Number(order.subtotal || order.total_amount).toLocaleString()}</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ marginTop: '12px', textAlign: 'right', fontSize: '12px' }}>
            <p style={{ margin: '2px 0' }}>Subtotal: Rs. {Number(order.subtotal || order.total_amount).toLocaleString()}</p>
            <p style={{ margin: '2px 0' }}>Shipping: {Number(order.shipping_fee) > 0 ? `Rs. ${order.shipping_fee}` : 'FREE'}</p>
            <p style={{ margin: '6px 0 0', fontSize: '16px', fontWeight: 'bold' }}>
              TOTAL PAYABLE (COD): PKR {Number(order.total_amount).toLocaleString()}
            </p>
          </div>

          <div style={{ marginTop: '16px', borderTop: '1px dashed #000', paddingTop: '8px', fontSize: '10px', textAlign: 'center' }}>
            Inspection Rule: Fragile Wooden Crated Parcel — Open Box Allowed | Support: +92 321 9981625
          </div>
        </div>

        <script dangerouslySetInnerHTML={{ __html: `window.addEventListener('load', () => window.print());` }} />
      </body>
    </html>
  );
}
