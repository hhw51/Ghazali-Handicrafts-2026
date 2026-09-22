export async function sendBrevoOrderEmail(order: any) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey || !order.email) return;

  const url = 'https://api.brevo.com/v3/smtp/email';
  
  const payload = {
    sender: {
      name: 'Ghazali Handicrafts',
      email: process.env.BREVO_SENDER_EMAIL || 'orders@ghazalihandicrafts.com',
    },
    to: [{ email: order.email, name: order.customerName }],
    subject: `Order Confirmation #${order.orderNumber} — Ghazali Handicrafts`,
    htmlContent: `
      <div style="font-family: serif; color: #1F1D1A; background-color: #FAF7F2; padding: 24px; border-radius: 8px;">
        <h2 style="color: #1A4268; margin-bottom: 8px;">Thank You for Your Order</h2>
        <p>Dear ${order.customerName},</p>
        <p>Your order <strong>#${order.orderNumber}</strong> has been received and verified for Cash on Delivery.</p>
        <hr style="border: 1px solid #E6DFD5; margin: 16px 0;" />
        <h3>Delivery Details</h3>
        <p><strong>Shipping Address:</strong> ${order.shippingAddress}, ${order.city}</p>
        <p><strong>Total Amount:</strong> Rs. ${order.totalAmount.toLocaleString()}</p>
        <hr style="border: 1px solid #E6DFD5; margin: 16px 0;" />
        <p style="font-size: 12px; color: #6E675F;">Ghazali Handicrafts • 27 New Anarkali, Lahore • Artisanal Heritage of Pakistan</p>
      </div>
    `,
  };

  await fetch(url, {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });
}