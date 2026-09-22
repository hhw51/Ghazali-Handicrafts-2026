import { sendBrevoOrderEmail } from '@/lib/mail/brevo';

export interface OrderSummary {
  orderNumber: string;
  customerName: string;
  phone: string;
  email?: string;
  city: string;
  shippingAddress: string;
  totalAmount: number;
  items: Array<{ name: string; quantity: number; price: number }>;
}

export type OrderNotificationPayload = OrderSummary;

export async function sendOrderConfirmationNotifications(order: OrderSummary) {
  // Normalize phone to pure digits for Baileys JID (e.g. 923219981625)
  // and E.164 with + for SMS (e.g. +923219981625)
  let cleanDigits = order.phone.replace(/\D/g, '');
  if (cleanDigits.startsWith('0')) cleanDigits = '92' + cleanDigits.slice(1);
  if (!cleanDigits.startsWith('92')) cleanDigits = '92' + cleanDigits;

  const plusPhone = `+${cleanDigits}`;

  const itemsList = order.items
    .map((item) => `• ${item.quantity}x ${item.name} (Rs. ${(item.price * item.quantity).toLocaleString()})`)
    .join('\n');

  // --- CHANNEL 1: WhatsApp (Baileys Tunnel / Local Worker) ---
  if (process.env.WHATSAPP_WORKER_URL) {
    const waMessage =
      `🏛️ *Ghazali Handicrafts — Order Confirmed!*\n\n` +
      `*Order #:* ${order.orderNumber}\n` +
      `*Customer:* ${order.customerName}\n` +
      `*Delivery City:* ${order.city}\n` +
      `*Address:* ${order.shippingAddress}\n` +
      `*Total (COD):* Rs. ${order.totalAmount.toLocaleString()}\n\n` +
      `*Items Ordered:*\n${itemsList}\n\n` +
      `Your parcel is being packed with fragile-safe artisanal packaging. For updates or changes, reply directly to this chat!`;

    try {
      console.log(`[Notification] Dispatching WhatsApp to ${plusPhone}...`);
      const res = await fetch(process.env.WHATSAPP_WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: plusPhone, message: waMessage }),
      });
      console.log(`[Notification] WhatsApp response status: ${res.status}`);
    } catch (err) {
      console.error('[Notification] WhatsApp dispatch failed:', err);
    }
  }

  // --- CHANNEL 2: SMS Gateway (Cloud Mode via Android) ---
  const smsUrl = process.env.ANDROID_SMS_GATEWAY_URL;
  const smsUser = process.env.ANDROID_SMS_USER || process.env.ANDROID_SMS_GATEWAY_USER;
  const smsPass = process.env.ANDROID_SMS_PASS || process.env.ANDROID_SMS_GATEWAY_PASSWORD;

  if (smsUrl && smsUser && smsPass) {
    const smsMessage = `Ghazali Handicrafts: Order #${order.orderNumber} confirmed! Total: Rs. ${order.totalAmount.toLocaleString()} (COD) to ${order.city}. We will dispatch your items shortly.`;

    try {
      const auth = Buffer.from(`${smsUser}:${smsPass}`).toString('base64');

      console.log(`[Notification] Dispatching SMS to ${plusPhone}...`);
      const res = await fetch(smsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({
          phoneNumbers: [plusPhone],
          textMessage: { text: smsMessage },
        }),
      });
      console.log(`[Notification] SMS response status: ${res.status}`);
    } catch (err) {
      console.error('[Notification] SMS dispatch failed:', err);
    }
  }

  // --- CHANNEL 3: Brevo Mailer (Scaffolded for future use) ---
  if (process.env.BREVO_API_KEY && order.email) {
    try {
      await sendBrevoOrderEmail(order);
      console.log(`[Notification] Brevo email confirmation dispatched to ${order.email}`);
    } catch (emailErr) {
      console.error('[Notification] Brevo email dispatch failed:', emailErr);
    }
  }
}

// Backward compatibility export
export const sendOrderNotifications = sendOrderConfirmationNotifications;
