'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export type SectionType =
  | 'hero'
  | 'category_grid'
  | 'product_showcase'
  | 'editorial_banner'
  | 'heritage_story'
  | 'trust_bar'
  | 'artisan_spotlight'
  | 'banner'
  | 'product_grid'
  | 'category_row'
  | 'custom_columns'
  | (string & {});

export interface HomepageSectionRecord {
  id: string;
  title?: string;
  section_type: SectionType;
  position: number;
  is_active: boolean;
  settings?: Record<string, any>;
  config?: Record<string, any>;
  created_at?: string;
}

export async function getHomepageSections(): Promise<HomepageSectionRecord[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('homepage_sections')
      .select('*')
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching homepage sections:', error);
      return [];
    }

    return (data as HomepageSectionRecord[]) || [];
  } catch (err) {
    console.error('getHomepageSections Exception:', err);
    return [];
  }
}

export async function saveHomepageSection(
  section: Partial<HomepageSectionRecord>
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const supabase = createAdminClient();
    const payload = {
      section_type: section.section_type || 'hero',
      position: section.position ?? 0,
      is_active: section.is_active ?? true,
      title: section.title || section.settings?.title || section.config?.title || `${section.section_type} Section`,
      settings: section.settings || section.config || {},
      config: section.config || section.settings || {},
      ...(section.id ? { id: section.id } : {}),
    };

    const { data, error } = await supabase
      .from('homepage_sections')
      .upsert(payload)
      .select('id')
      .single();

    if (error) {
      console.error('Error saving homepage section:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/');
    revalidatePath('/admin/cms');

    return { success: true, id: data?.id };
  } catch (err: any) {
    console.error('saveHomepageSection Exception:', err);
    return { success: false, error: err.message || 'Failed to save section.' };
  }
}

export async function deleteHomepageSection(
  sectionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from('homepage_sections')
      .delete()
      .eq('id', sectionId);

    if (error) {
      console.error('Error deleting section:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/');
    revalidatePath('/admin/cms');

    return { success: true };
  } catch (err: any) {
    console.error('deleteHomepageSection Exception:', err);
    return { success: false, error: err.message || 'Failed to delete section.' };
  }
}

export async function updateSectionsOrder(
  sections: { id: string; position: number }[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient();
    for (const sec of sections) {
      await supabase
        .from('homepage_sections')
        .update({ position: sec.position })
        .eq('id', sec.id);
    }

    revalidatePath('/');
    revalidatePath('/admin/cms');

    return { success: true };
  } catch (err: any) {
    console.error('updateSectionsOrder Exception:', err);
    return { success: false, error: err.message || 'Failed to reorder sections.' };
  }
}
