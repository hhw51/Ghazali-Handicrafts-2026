import * as fs from 'fs';
import * as path from 'path';

// Read .env.local directly before loading Supabase/Drive modules
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf-8');
  envFile.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.substring(0, idx).trim();
      let val = trimmed.substring(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  });
}

import { createAdminClient } from '../lib/supabase/admin';
import { processAndUploadImage } from '../lib/services/google-drive';

async function fixHeicProducts() {
  console.log('--- Starting Supabase Storage HEIC -> WebP Repair Utility ---');
  const supabase = createAdminClient();

  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, slug, images');

  if (error || !products) {
    console.error('Failed to fetch products:', error);
    process.exit(1);
  }

  console.log(`Found ${products.length} total products in database.`);

  let updatedCount = 0;

  for (const product of products) {
    if (!product.images || !Array.isArray(product.images) || product.images.length === 0) {
      continue;
    }

    let needsUpdate = false;
    const fixedImageUrls: string[] = [];

    for (const imgUrl of product.images) {
      const lower = imgUrl.toLowerCase();
      if (lower.includes('.heic') || lower.includes('.heif')) {
        console.log(`[Repairing HEIC] Product "${product.name}" (${product.slug}): ${imgUrl}`);
        needsUpdate = true;

        try {
          // Extract storage path inside 'pictures' bucket
          // Format: .../storage/v1/object/public/pictures/products/...
          const matchPath = imgUrl.match(/\/pictures\/(.+)$/);
          if (matchPath && matchPath[1]) {
            const storagePath = decodeURIComponent(matchPath[1]);
            console.log(`Downloading ${storagePath} from Supabase storage...`);
            
            const { data: fileBlob, error: dlError } = await supabase.storage
              .from('pictures')
              .download(storagePath);

            if (dlError || !fileBlob) {
              console.error(`Failed to download ${storagePath}:`, dlError);
              fixedImageUrls.push('/images/hero/craft-hero.png');
              continue;
            }

            const buffer = Buffer.from(await fileBlob.arrayBuffer());
            const fileName = storagePath.split('/').pop() || 'image.heic';

            const newWebpUrl = await processAndUploadImage(
              buffer,
              fileName,
              'image/heic',
              product.slug,
              supabase
            );

            if (newWebpUrl) {
              console.log(`✓ Repaired & Converted: ${newWebpUrl}`);
              fixedImageUrls.push(newWebpUrl);
            } else {
              fixedImageUrls.push('/images/hero/craft-hero.png');
            }
          } else {
            fixedImageUrls.push('/images/hero/craft-hero.png');
          }
        } catch (repErr) {
          console.error(`Error repairing ${imgUrl}:`, repErr);
          fixedImageUrls.push('/images/hero/craft-hero.png');
        }
      } else {
        fixedImageUrls.push(imgUrl);
      }
    }

    if (needsUpdate) {
      const { error: updateErr } = await supabase
        .from('products')
        .update({
          images: fixedImageUrls,
          updated_at: new Date().toISOString(),
        })
        .eq('id', product.id);

      if (updateErr) {
        console.error(`Failed updating product ${product.id}:`, updateErr);
      } else {
        updatedCount++;
        console.log(`✓ Database record updated for product: "${product.name}"`);
      }
    }
  }

  console.log(`\n==================================================`);
  console.log(`Repair completed successfully! Fixed ${updatedCount} products.`);
  console.log(`==================================================`);
}

fixHeicProducts().catch((err) => {
  console.error('Fatal repair error:', err);
  process.exit(1);
});
