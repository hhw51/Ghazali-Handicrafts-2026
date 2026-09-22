'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { checkoutFormSchema, CheckoutFormValues } from '@/lib/validations/checkout';
import { sendOrderNotifications } from '@/lib/notifications/order-notifier';

interface CartItemPayload {
  productId: string;
  quantity: number;
}

interface CreateOrderPayload {
  items: CartItemPayload[];
  customer: CheckoutFormValues;
}

export async function createOrder(payload: CreateOrderPayload): Promise<{
  success: boolean;
  orderId?: string;
  error?: string;
}> {
  try {
    // 1. Validate customer details against Zod schema
    const validationResult = checkoutFormSchema.safeParse(payload.customer);
    if (!validationResult.success) {
      const firstErr = validationResult.error.errors[0]?.message || 'Invalid checkout form submission';
      return { success: false, error: firstErr };
    }

    if (!payload.items || payload.items.length === 0) {
      return { success: false, error: 'Your cart is empty. Please add craft items before checkout.' };
    }

    const supabase = createAdminClient();
    const productIds = payload.items.map((i) => i.productId);

    // 2. Fetch authoritative live product data from Supabase
    const { data: dbProducts, error: fetchErr } = await supabase
      .from('products')
      .select('id, name, price, in_stock, category:categories(name)')
      .in('id', productIds);

    if (fetchErr || !dbProducts) {
      console.error('Error fetching database products for checkout:', fetchErr);
      return { success: false, error: 'Unable to verify catalog items. Please try again.' };
    }

    const dbProductMap = new Map(dbProducts.map((p) => [p.id, p]));

    // 3. Stock guard & price calculation
    let subtotal = 0;
    const orderItemsToInsert: {
      order_id?: string;
      product_id: string;
      quantity: number;
      unit_price: number;
    }[] = [];

    for (const item of payload.items) {
      const liveProd = dbProductMap.get(item.productId);

      if (!liveProd) {
        return {
          success: false,
          error: `Item with ID ${item.productId} was not found in our catalog.`,
        };
      }

      if (!liveProd.in_stock) {
        return {
          success: false,
          error: `Apologies, "${liveProd.name}" is currently sold out. Please remove it from your bag to proceed.`,
        };
      }

      if (item.quantity <= 0) {
        return { success: false, error: 'Invalid item quantity.' };
      }

      const linePrice = Number(liveProd.price) * item.quantity;
      subtotal += linePrice;

      orderItemsToInsert.push({
        product_id: liveProd.id,
        quantity: item.quantity,
        unit_price: Number(liveProd.price),
      });
    }

    // 4. Calculate dynamic shipping fee (Free above 10,000 PKR, else 350 PKR)
    const shippingFee = subtotal >= 10000 ? 0 : 350;
    const totalAmount = subtotal + shippingFee;

    const customer = validationResult.data;

    // 5. Insert Order record into Supabase `orders` table
    const { data: newOrder, error: orderErr } = await supabase
      .from('orders')
      .insert({
        customer_name: customer.customer_name,
        customer_phone: customer.customer_phone.replace(/\s+/g, ''),
        customer_email: customer.customer_email || null,
        city: customer.city,
        address: customer.address,
        landmark: customer.landmark || null,
        subtotal: subtotal,
        shipping_fee: shippingFee,
        total_amount: totalAmount,
        payment_method: 'COD',
        status: 'verified',
        phone_verified: true,
        notes: customer.notes || null,
      })
      .select('id')
      .single();

    if (orderErr || !newOrder) {
      console.error('Error creating order record:', orderErr);
      return { success: false, error: 'Failed to record your order. Please try again.' };
    }

    // 6. Insert Order Items into Supabase `order_items` table
    const orderItems = orderItemsToInsert.map((item) => ({
      ...item,
      order_id: newOrder.id,
    }));

    const { error: itemsErr } = await supabase.from('order_items').insert(orderItems);

    if (itemsErr) {
      console.error('Error creating order items:', itemsErr);
      return { success: false, error: 'Order created, but items failed to record. Contact support.' };
    }

    // 7. Trigger Post-Checkout Order Notifications (WhatsApp, SMS, Brevo Email)
    const notificationItems = payload.items.map((item) => {
      const prod = dbProductMap.get(item.productId);
      return {
        name: prod?.name || 'Craft Item',
        quantity: item.quantity,
        price: Number(prod?.price || 0),
      };
    });

    const orderNumber = newOrder.id.slice(0, 8).toUpperCase();

    sendOrderNotifications({
      orderNumber,
      customerName: customer.customer_name,
      phone: customer.customer_phone.replace(/\s+/g, ''),
      email: customer.customer_email || undefined,
      items: notificationItems,
      totalAmount,
      shippingAddress: customer.address,
      city: customer.city,
    }).catch((notifErr) => console.error('Asynchronous order notification error:', notifErr));

    return {
      success: true,
      orderId: newOrder.id,
    };
  } catch (err) {
    console.error('createOrder Exception:', err);
    return {
      success: false,
      error: 'An unexpected checkout error occurred. Please try again.',
    };
  }
}
