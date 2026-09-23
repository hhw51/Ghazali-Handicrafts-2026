'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function toggleProductFeatured(
  productId: string,
  currentIsFeatured: boolean
): Promise<{
  success: boolean;
  newFeaturedState?: boolean;
  error?: string;
}> {
  try {
    const supabase = createAdminClient();
    const nextState = !currentIsFeatured;

    const { error } = await supabase
      .from('products')
      .update({ is_featured: nextState, updated_at: new Date().toISOString() })
      .eq('id', productId);

    if (error) {
      console.error('Error toggling product featured status:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/products');
    revalidatePath('/admin/products');
    revalidatePath('/');

    return {
      success: true,
      newFeaturedState: nextState,
    };
  } catch (err) {
    console.error('toggleProductFeatured Exception:', err);
    return { success: false, error: 'Failed to update feature status.' };
  }
}
