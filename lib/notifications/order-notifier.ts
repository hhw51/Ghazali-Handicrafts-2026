import { sendBrevoOrderEmail } from '@/lib/mail/brevo';

export interface OrderNotificationPayload {
  orderNumber: string;
  customerName: string;
  phone: string;
  email?: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
  shippingAddress: string;
  city: string;
}

export async function sendOrderNotifications(order: OrderNotificationPayload) {
  const itemsSummary = order.items
    .map((item) => `• ${item.quantity}x ${item.name} (Rs. ${(item.price * item.quantity).toLocaleString()})`)
    .join('\n');

  const messageText =
    `🏛️ *Ghazali Handicrafts — Order Confirmed!*\n\n` +
    `*Order #:* ${order.orderNumber}\n` +
    `*Customer:* ${order.customerName}\n` +
    `*Delivery City:* ${order.city}\n` +
    `*Shipping Address:* ${order.shippingAddress}\n` +
    `*Total (COD):* Rs. ${order.totalAmount.toLocaleString()}\n\n` +
    `*Items:*\n${itemsSummary}\n\n` +
    `We will prepare and package your parcel with fragile-safe protection. For inquiries, reply directly to this message.`;

  // 1. Dispatch WhatsApp Confirmation (Local Baileys Worker via Tunnel/Localhost)
  try {
    if (process.env.WHATSAPP_WORKER_URL) {
      await fetch(process.env.WHATSAPP_WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: order.phone,
          message: messageText,
        }),
      });
      console.log(`[Notification] WhatsApp confirmation dispatched to ${order.phone}`);
    }
  } catch (waErr) {
    console.error('[Notification] WhatsApp dispatch failed:', waErr);
  }

  // 2. Dispatch SMS Confirmation (Cloud SMS Gateway)
  try {
    const smsUrl = process.env.ANDROID_SMS_GATEWAY_URL;
    const smsUser = process.env.ANDROID_SMS_USER || process.env.ANDROID_SMS_GATEWAY_USER;
    const smsPass = process.env.ANDROID_SMS_PASS || process.env.ANDROID_SMS_GATEWAY_PASSWORD;

    if (smsUrl && smsUser && smsPass) {
      const auth = Buffer.from(`${smsUser}:${smsPass}`).toString('base64');

      // Compact SMS format suitable for single text segment
      const smsText = `Ghazali Handicrafts: Order #${order.orderNumber} confirmed! Total: Rs. ${order.totalAmount.toLocaleString()} (COD) to ${order.city}. Thank you for choosing authentic Pakistani crafts.`;

      await fetch(smsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({
          phoneNumbers: [order.phone],
          textMessage: { text: smsText },
        }),
      });
      console.log(`[Notification] SMS confirmation dispatched to ${order.phone}`);
    }
  } catch (smsErr) {
    console.error('[Notification] SMS dispatch failed:', smsErr);
  }

  // 3. Brevo Email Integration (Inactive / Ready for activation when BREVO_API_KEY is configured)
  if (process.env.BREVO_API_KEY && order.email) {
    try {
      await sendBrevoOrderEmail(order);
      console.log(`[Notification] Brevo email confirmation dispatched to ${order.email}`);
    } catch (emailErr) {
      console.error('[Notification] Brevo email dispatch failed:', emailErr);
    }
  }
}
