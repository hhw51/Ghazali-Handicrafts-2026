'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export type SectionType =
  | 'announcement_bar'
  | 'hero'
  | 'regions_mastery'
  | 'regions'
  | 'category_grid'
  | 'featured_masterpieces'
  | 'product_showcase'
  | 'lifestyle_gifting'
  | 'editorial_banner'
  | 'heritage_50_years'
  | 'heritage_spotlight'
  | 'heritage_story'
  | 'fragile_guarantee'
  | 'crating_guarantee'
  | 'trust_bar'
  | 'artisan_spotlight'
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
      ...(section.id && !section.id.startsWith('temp_') ? { id: section.id } : {}),
    };

    const { data, error } = await supabase
      .from('homepage_sections')
      .upsert(payload, { onConflict: 'section_type' })
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

export async function batchUpsertCmsSections(
  sectionsList: Partial<HomepageSectionRecord>[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient();
    const payloads = sectionsList.map((sec, idx) => ({
      section_type: sec.section_type || 'hero',
      position: sec.position ?? idx,
      is_active: sec.is_active ?? true,
      title: sec.title || sec.settings?.title || `${sec.section_type} Section`,
      settings: sec.settings || sec.config || {},
      config: sec.config || sec.settings || {},
      ...(sec.id && !sec.id.startsWith('temp_') ? { id: sec.id } : {}),
    }));

    const { error } = await supabase
      .from('homepage_sections')
      .upsert(payloads, { onConflict: 'section_type' });

    if (error) {
      console.error('Error in batchUpsertCmsSections:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/');
    revalidatePath('/admin/cms');

    return { success: true };
  } catch (err: any) {
    console.error('batchUpsertCmsSections Exception:', err);
    return { success: false, error: err.message || 'Failed batch save.' };
  }
}

export async function uploadCmsImage(
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, error: 'No file provided.' };
    }

    const supabase = createAdminClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `cms/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadErr } = await supabase.storage
      .from('pictures')
      .upload(fileName, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: true,
      });

    if (uploadErr) {
      console.error('Supabase storage upload error:', uploadErr);
      return { success: false, error: uploadErr.message };
    }

    const { data: publicUrlData } = supabase.storage.from('pictures').getPublicUrl(fileName);

    return { success: true, url: publicUrlData.publicUrl };
  } catch (err: any) {
    console.error('uploadCmsImage Exception:', err);
    return { success: false, error: err.message || 'Failed to upload image.' };
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
