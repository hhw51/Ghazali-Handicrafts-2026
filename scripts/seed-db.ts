import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Read .env.local directly
const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig: Record<string, string> = {};

if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf-8');
  envFile.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.substring(0, idx).trim();
      const val = trimmed.substring(idx + 1).trim();
      envConfig[key] = val;
    }
  });
}

const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = envConfig.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceKey) {
  throw new Error('Supabase URL and Key are required for seeding.');
}

const supabase = createClient(supabaseUrl, serviceKey);

async function seed() {
  console.log('🌱 Starting Ghazali Handicrafts database seed...');

  // 1. Categories
  const categoriesData = [
    { name: 'Multani Blue Pottery', slug: 'blue-pottery' },
    { name: 'Swati Hand-Carved Woodwork', slug: 'swati-woodwork' },
    { name: 'Marble & Onyx Crafts', slug: 'marble-onyx' },
    { name: 'Authentic Truck Art', slug: 'truck-art' },
    { name: 'Chiseled Antiqued Brass', slug: 'chiseled-brass' },
  ];

  const categoryMap: Record<string, string> = {};

  for (const cat of categoriesData) {
    const { data, error } = await supabase
      .from('categories')
      .upsert(cat, { onConflict: 'slug' })
      .select()
      .single();

    if (error) {
      console.error(`Error upserting category ${cat.name}:`, error.message);
    } else if (data) {
      categoryMap[cat.slug] = data.id;
      console.log(`✓ Category ready: ${cat.name} (${data.id})`);
    }
  }

  // 2. Products
  const productsData = [
    {
      name: 'Multani Cobalt Blue Glazed Ceramic Vase',
      slug: 'multani-cobalt-blue-glazed-ceramic-vase',
      short_description: 'Hand-thrown terracotta vase adorned with traditional Multani lapis blue glaze and cobalt floral foliage.',
      long_description: 'Crafted in the historic artisan kilns of Multan, Pakistan, this signature ceramic vase represents centuries of blue pottery heritage. Made from refined riverbed clay and hand-painted with organic lapis cobalt and copper oxide pigments before high-temperature firing. Ideal as a focal centerpiece for luxury living spaces.',
      price: 8500,
      size: '12 x 7 inches (Height x Diameter)',
      in_stock: true,
      images: ['/images/products/multani-blue-pottery-vase-1.png', '/images/collections/blue-pottery.png'],
      colors: 'Multani Blue, Lapis Cobalt, Parchment White',
      category_id: categoryMap['blue-pottery'],
      weight: 1.85,
      tags: ['pottery', 'ceramics', 'multan', 'blue glaze', 'handcrafted', 'vase'],
    },
    {
      name: 'Swati Hand-Carved Solid Walnut Heritage Chest',
      slug: 'swati-hand-carved-solid-walnut-heritage-chest',
      short_description: 'Masterwork heirloom chest hand-carved from seasoned Swat valley walnut wood with antique brass latching.',
      long_description: 'Sourced from aged walnut timber in the valleys of Swat, northern Pakistan. Every floral panel is relief-carved by hand using traditional chisels passed down through generations. Features hand-wrought antiqued brass hinges, secret interior trinket compartment, and a rich beeswax polish.',
      price: 34500,
      size: '24 x 14 x 16 inches',
      in_stock: true,
      images: ['/images/products/swati-carved-walnut-chest-1.jpg', '/images/collections/swati-wood.png'],
      colors: 'Aged Walnut Brown, Antiqued Brass',
      category_id: categoryMap['swati-woodwork'],
      weight: 6.5,
      tags: ['woodwork', 'swat', 'walnut', 'hand carved', 'heritage', 'chest'],
    },
    {
      name: 'Hand-Turned Pakistani White Onyx Chess Set',
      slug: 'hand-turned-pakistani-white-onyx-chess-set',
      short_description: 'Exquisite 15-inch heavy chess board with hand-turned white onyx and teak marble chessmen.',
      long_description: 'Mined from natural translucent onyx veins in Balochistan and hand-turned by master stone carvers in Karachi. The set includes a solid 15x15 inch dual-toned board with felt-bottomed chess pieces, showcasing natural green and ivory veining. Each piece is individually polished to a mirror sheen.',
      price: 18900,
      size: '15 x 15 inches board',
      in_stock: true,
      images: ['/images/products/onyx-marble-chess-set-1.jpg', '/images/collections/marble-crafts.jpg'],
      colors: 'Veined Ivory White, Teak Onyx Green',
      category_id: categoryMap['marble-onyx'],
      weight: 4.2,
      tags: ['onyx', 'marble', 'chess set', 'hand turned', 'luxury', 'tableware'],
    },
    {
      name: 'Authentic Hand-Painted Truck Art Stainless Teapot',
      slug: 'authentic-hand-painted-truck-art-stainless-teapot',
      short_description: 'Vibrant Rawalpindi truck art tea kettle adorned with metallic pigments, peacock art, and floral border work.',
      long_description: 'An iconic symbol of Pakistani folk culture, this high-grade stainless steel kettle is hand-painted by authentic Ustad truck painters using oil enamels and reflective alloy pigments. Sealed with heat-resistant clear lacquer suitable for serving hot chai or decorative display.',
      price: 6200,
      size: '2.5 Litres capacity',
      in_stock: true,
      images: ['/images/products/hand-painted-truck-art-teapot-1.jpg', '/images/collections/truck-art.jpg'],
      colors: 'Lapis Blue, Terracotta Red, Antiqued Gold',
      category_id: categoryMap['truck-art'],
      weight: 1.1,
      tags: ['truck art', 'teapot', 'hand painted', 'rawalpindi', 'kettle', 'chai'],
    },
    {
      name: 'Chiseled Antiqued Brass Water Goblet Set of 6',
      slug: 'chiseled-antiqued-brass-water-goblet-set',
      short_description: 'Hand-chiseled brass goblets crafted in Chiniot with intricate botanical engravings and tin lining.',
      long_description: 'Handcrafted by Chinioti brass smiths, these goblets feature dense hand-punched floral scrollwork and traditional tin lining for safe beverage enjoyment. The heavy antiqued brass retains cold temperatures, making every drink a royal heritage ritual.',
      price: 12500,
      size: 'Set of 6 (6 inches height each)',
      in_stock: true,
      images: ['/images/hero/craft-hero.png', '/images/products/multani-blue-pottery-vase-1.png'],
      colors: 'Antiqued Chiseled Gold',
      category_id: categoryMap['chiseled-brass'],
      weight: 2.4,
      tags: ['brass', 'goblets', 'chiniot', 'chiseled', 'dining', 'tableware'],
    }
  ];

  for (const prod of productsData) {
    const { data, error } = await supabase
      .from('products')
      .upsert(prod, { onConflict: 'slug' })
      .select()
      .single();

    if (error) {
      console.error(`Error upserting product ${prod.name}:`, error.message);
    } else if (data) {
      console.log(`✓ Product ready: ${prod.name} (PKR ${prod.price})`);
    }
  }

  // 3. Initial Sample Review
  const sampleReview = {
    product_id: (await supabase.from('products').select('id').eq('slug', 'multani-cobalt-blue-glazed-ceramic-vase').single()).data?.id,
    customer_name: 'Tariq Mehmood',
    customer_city: 'Lahore',
    rating: 5,
    comment: 'The Multani glaze on this vase is breathtaking! Safe wooden crate packaging delivered to Lahore without a single scratch. Truly authentic Pakistani craft.',
    photo_urls: ['/images/products/multani-blue-pottery-vase-1.png'],
    is_verified: true,
  };

  if (sampleReview.product_id) {
    const { error } = await supabase.from('reviews').upsert(sampleReview);
    if (!error) {
      console.log('✓ Sample review seeded successfully');
    }
  }

  console.log('✨ Ghazali DB seeding completed successfully!');
}

seed().catch(console.error);
