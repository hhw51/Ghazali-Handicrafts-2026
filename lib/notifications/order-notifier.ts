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
  const itemsBreakdown = formatItemsList(order.items || []);
  const totalStr = `Rs. ${(order.totalAmount || 0).toLocaleString()}`;

  // 1. CUSTOMER NOTIFICATION TEMPLATES
  const customerWhatsApp = 
    `🏛️ *Ghazali Handicrafts — Order Confirmed!*\n\n` +
    `Thank you for ordering with us. Your parcel is being prepared.\n\n` +
    `*Order #:* ${order.orderNumber}\n` +
    `*Customer:* ${order.customerName}\n` +
    `*Delivery City:* ${order.city}\n` +
    `*Address:* ${order.shippingAddress}${order.landmark ? ` (Near: ${order.landmark})` : ''}\n` +
    `*Total (COD):* ${totalStr}\n\n` +
    `*Ordered Items & Selected Variants:*\n${itemsBreakdown}\n\n` +
    `We will notify you once dispatched. For any inquiries, reply directly to this WhatsApp!`;

  const customerSMS = 
    `Ghazali Handicrafts: Order #${order.orderNumber} confirmed! Total: ${totalStr} (COD) to ${order.city}. Items: ${(order.items || []).length} product(s). Track via WhatsApp +923104755973.`;

  // 2. ADMIN NOTIFICATION TEMPLATES (Sent to +923104755973)
  const adminAlertWhatsApp = 
    `🚨 *NEW ORDER RECEIVED — GHAZALI STORE* 🚨\n\n` +
    `*Order #:* ${order.orderNumber}\n` +
    `*Customer Name:* ${order.customerName}\n` +
    `*Verified Mobile:* ${order.phone}\n` +
    `*Email:* ${order.email || 'N/A'}\n` +
    `*Delivery City:* ${order.city}\n` +
    `*Street Address:* ${order.shippingAddress}\n` +
    `*Landmark:* ${order.landmark || 'N/A'}\n` +
    `*Total Amount:* ${totalStr} (Cash on Delivery)\n\n` +
    `*Items Breakdown:*\n${itemsBreakdown}`;

  const adminAlertSMS = 
    `New Order #${order.orderNumber}! Customer: ${order.customerName} (${order.phone}), ${order.city}. Total: ${totalStr}. Address: ${order.shippingAddress}. Check Admin Panel!`;

  const adminPhone = '+923104755973';

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
