'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { OrderStatus } from '@/types/order';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus | string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = createAdminClient();

    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      console.error('Update status error:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/orders');
    revalidatePath(`/order-success/${orderId}`);

    return { success: true };
  } catch (err) {
    console.error('updateOrderStatus Exception:', err);
    return { success: false, error: 'Failed to update order status.' };
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
