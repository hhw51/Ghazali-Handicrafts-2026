'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { SiteSettings, DEFAULT_SITE_SETTINGS } from '@/lib/site-settings';
import { revalidatePath } from 'next/cache';

export async function updateSiteSettingsAction(payload: Partial<SiteSettings> & {
  hero_image_base64?: { name: string; type: string; base64: string };
  story_image_before_base64?: { name: string; type: string; base64: string };
  story_image_after_base64?: { name: string; type: string; base64: string };
}): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = createAdminClient();
    const bucketName = 'pictures';

    // Helper to upload image if base64 provided
    const uploadImageIfPresent = async (imgObj?: { name: string; type: string; base64: string }) => {
      if (!imgObj || !imgObj.base64) return null;

      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.some((b) => b.name === bucketName)) {
        await supabase.storage.createBucket(bucketName, { public: true });
      }

      const buffer = Buffer.from(imgObj.base64.split(',')[1] || imgObj.base64, 'base64');
      const fileName = `cms/${Date.now()}_${imgObj.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

      const { error: uploadErr } = await supabase.storage
        .from(bucketName)
        .upload(fileName, buffer, {
          contentType: imgObj.type || 'image/jpeg',
          upsert: true,
        });

      if (uploadErr) {
        console.error('Error uploading CMS image:', uploadErr);
        return null;
      }

      const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(fileName);
      return publicUrlData?.publicUrl || null;
    };

    let heroImageUrl = payload.hero_image_url;
    if (payload.hero_image_base64) {
      const uploadedHero = await uploadImageIfPresent(payload.hero_image_base64);
      if (uploadedHero) heroImageUrl = uploadedHero;
    }

    let storyBeforeUrl = payload.story_image_before;
    if (payload.story_image_before_base64) {
      const uploadedBefore = await uploadImageIfPresent(payload.story_image_before_base64);
      if (uploadedBefore) storyBeforeUrl = uploadedBefore;
    }

    let storyAfterUrl = payload.story_image_after;
    if (payload.story_image_after_base64) {
      const uploadedAfter = await uploadImageIfPresent(payload.story_image_after_base64);
      if (uploadedAfter) storyAfterUrl = uploadedAfter;
    }

    const recordToUpsert = {
      id: 'homepage_config',
      hero_badge: payload.hero_badge ?? DEFAULT_SITE_SETTINGS.hero_badge,
      hero_title: payload.hero_title ?? DEFAULT_SITE_SETTINGS.hero_title,
      hero_subtitle: payload.hero_subtitle ?? DEFAULT_SITE_SETTINGS.hero_subtitle,
      hero_primary_cta_text: payload.hero_primary_cta_text ?? DEFAULT_SITE_SETTINGS.hero_primary_cta_text,
      hero_primary_cta_link: payload.hero_primary_cta_link ?? DEFAULT_SITE_SETTINGS.hero_primary_cta_link,
      hero_secondary_cta_text: payload.hero_secondary_cta_text ?? DEFAULT_SITE_SETTINGS.hero_secondary_cta_text,
      hero_secondary_cta_link: payload.hero_secondary_cta_link ?? DEFAULT_SITE_SETTINGS.hero_secondary_cta_link,
      hero_image_url: heroImageUrl || DEFAULT_SITE_SETTINGS.hero_image_url,
      ticker_text: payload.ticker_text ?? DEFAULT_SITE_SETTINGS.ticker_text,
      story_heading: payload.story_heading ?? DEFAULT_SITE_SETTINGS.story_heading,
      story_subheading: payload.story_subheading ?? DEFAULT_SITE_SETTINGS.story_subheading,
      story_image_before: storyBeforeUrl || DEFAULT_SITE_SETTINGS.story_image_before,
      story_image_after: storyAfterUrl || DEFAULT_SITE_SETTINGS.story_image_after,
      announcement_banner: payload.announcement_banner ?? DEFAULT_SITE_SETTINGS.announcement_banner,
      announcement_active: payload.announcement_active ?? DEFAULT_SITE_SETTINGS.announcement_active,
      updated_at: new Date().toISOString(),
    };

    const { error: upsertErr } = await supabase
      .from('site_settings')
      .upsert(recordToUpsert, { onConflict: 'id' });

    if (upsertErr) {
      console.error('Error updating site_settings:', upsertErr);
      return { success: false, error: upsertErr.message };
    }

    revalidatePath('/');
    revalidatePath('/admin/homepage');
    revalidatePath('/products');

    return { success: true };
  } catch (err: any) {
    console.error('updateSiteSettingsAction Exception:', err);
    return { success: false, error: err.message || 'Failed to update CMS settings.' };
  }
}
