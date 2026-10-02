import { sendBrevoOrderEmail } from '@/lib/mail/brevo';

function formatItemsList(items: any[]): string {
  return items.map((item) => {
    let breakdownStr = '';
    const unitSelections = item.unitSelections || item.unitBreakdown;
    if (unitSelections && unitSelections.length > 0) {
      breakdownStr = '\n   ' + unitSelections.map((u: any, idx: number) => {
        const parts = [];
        if (u.color) parts.push(`Color: ${u.color}`);
        if (u.design) parts.push(`Design: ${u.design}`);
        return `   • Item ${idx + 1}: ${parts.join(', ') || 'Standard'}`;
      }).join('\n');
    }
    return `• ${item.quantity}x ${item.name} — Rs. ${(item.price * item.quantity).toLocaleString()}${breakdownStr}`;
  }).join('\n\n');
}

export async function sendOrderConfirmationNotifications(order: any) {
  const orderId = order.id || order.orderNumber || '';
  const orderShortId = orderId.slice(0, 8);
  const itemsBreakdown = formatItemsList(order.items || []);
  const totalAmountVal = order.totalAmount || order.total_amount || 0;
  const totalStr = `Rs. ${totalAmountVal.toLocaleString()}`;
  const trackingUrl = `https://www.ghazalihandicrafts.com/order-success/${orderId}`;
  const supportWhatsappUrl = `https://wa.me/923219981625?text=${encodeURIComponent(
    `Salam Ghazali Handicrafts! I placed Order #${orderShortId}. Track link:${trackingUrl}`
  )}`;

  // 1. CUSTOMER NOTIFICATION TEMPLATES
  const customerWhatsApp = 
    `🏛️ *Ghazali Handicrafts — Order Confirmed!*\n\n` +
    `Thank you for ordering with us. Your parcel is being prepared.\n\n` +
    `*Order #:* ${orderShortId}\n` +
    `*Customer:* ${order.customerName || order.customer_name}\n` +
    `*Delivery City:* ${order.city}\n` +
    `*Address:* ${order.shippingAddress || order.address}${order.landmark ? ` (Near: ${order.landmark})` : ''}\n` +
    `*Total (COD):* ${totalStr}\n\n` +
    `*Ordered Items & Selected Variants:*\n${itemsBreakdown}\n\n` +
    `*Track Parcel & Crating Status:* ${trackingUrl}\n` +
    `*Support WhatsApp:* ${supportWhatsappUrl}`;

  const customerSMS = 
    `Assalam-o-Alaikum ${order.customerName || order.customer_name}! Your Ghazali Handicrafts order #${orderShortId} (${totalStr}) has been confirmed.\nTrack your parcel & crating status: ${trackingUrl}\nFor quick queries, WhatsApp us: https://wa.me/923219981625`;

  // 2. ADMIN NOTIFICATION TEMPLATES (Sent to +923219981625)
  const adminAlertWhatsApp = 
    `🚨 *NEW ORDER RECEIVED — GHAZALI STORE* 🚨\n\n` +
    `*Order #:* ${orderShortId}\n` +
    `*Customer Name:* ${order.customerName || order.customer_name}\n` +
    `*Verified Mobile:* ${order.phone || order.customer_phone}\n` +
    `*Email:* ${order.email || order.customer_email || 'N/A'}\n` +
    `*Delivery City:* ${order.city}\n` +
    `*Street Address:* ${order.shippingAddress || order.address}\n` +
    `*Landmark:* ${order.landmark || 'N/A'}\n` +
    `*Total Amount:* ${totalStr} (Cash on Delivery)\n\n` +
    `*Items Breakdown:*\n${itemsBreakdown}`;

  const adminAlertSMS = 
    `New Order #${orderShortId}! Customer: ${order.customerName || order.customer_name} (${order.phone || order.customer_phone}), ${order.city}. Total: ${totalStr}. Address: ${order.shippingAddress || order.address}. Check Admin Panel!`;

  const adminPhone = '+923219981625';

  // --- DISPATCH CALLS ---
  // Channel: WhatsApp (Baileys Tunnel/Worker)
  if (process.env.WHATSAPP_WORKER_URL) {
    // A. Send to Customer
    await fetch(process.env.WHATSAPP_WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: order.phone, message: customerWhatsApp }),
    }).catch(e => console.error('[WhatsApp Customer Error]:', e));

    // B. Send to Shop Admin
    await fetch(process.env.WHATSAPP_WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: adminPhone, message: adminAlertWhatsApp }),
    }).catch(e => console.error('[WhatsApp Admin Error]:', e));
  }

  // Channel: Android SMS Gateway
  if (process.env.ANDROID_SMS_GATEWAY_URL && process.env.ANDROID_SMS_USER && process.env.ANDROID_SMS_PASS) {
    const auth = Buffer.from(`${process.env.ANDROID_SMS_USER}:${process.env.ANDROID_SMS_PASS}`).toString('base64');

    // A. SMS to Customer
    await fetch(process.env.ANDROID_SMS_GATEWAY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Basic ${auth}` },
      body: JSON.stringify({ phoneNumbers: [order.phone], textMessage: { text: customerSMS } }),
    }).catch(e => console.error('[SMS Customer Error]:', e));

    // B. SMS to Shop Admin
    await fetch(process.env.ANDROID_SMS_GATEWAY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Basic ${auth}` },
      body: JSON.stringify({ phoneNumbers: [adminPhone], textMessage: { text: adminAlertSMS } }),
    }).catch(e => console.error('[SMS Admin Error]:', e));
  }

  // Channel: Brevo Mailer
  if (process.env.BREVO_API_KEY && order.email) {
    try {
      await sendBrevoOrderEmail(order);
    } catch (e) {
      console.error('[Brevo Email Error]:', e);
    }
  }
}

export const sendOrderNotifications = sendOrderConfirmationNotifications;
