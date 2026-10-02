'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { OrderStatus } from '@/types/order';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const validStatuses: OrderStatus[] = [
      'pending',
      'pending_verification',
      'confirmed',
      'verified',
      'crating',
      'booked_with_courier',
      'shipped',
      'dispatched',
      'delivered',
      'cancelled',
      'returned',
    ];

    if (!validStatuses.includes(newStatus)) {
      return { success: false, error: 'Invalid order status transition state.' };
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/orders');
    revalidatePath(`/order-success/${orderId}`);

    return { success: true };
  } catch (err) {
    console.error('updateOrderStatus Exception:', err);
    return { success: false, error: 'Failed to update order status state.' };
  }
}

export async function updateOrderNotes(
  orderId: string,
  notes: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = createAdminClient();

    const { error } = await supabase
      .from('orders')
      .update({ notes })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order notes:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/orders');
    revalidatePath(`/order-success/${orderId}`);

    return { success: true };
  } catch (err) {
    console.error('updateOrderNotes Exception:', err);
    return { success: false, error: 'Failed to update order notes.' };
  }
}
