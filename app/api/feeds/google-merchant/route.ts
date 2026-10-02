import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export async function GET() {
  const baseUrl = 'https://www.ghazalihandicrafts.com';
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: products } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      description,
      price,
      images,
      in_stock,
      category:categories(name)
    `)
    .eq('in_stock', true);

  const xmlItems = (products || []).map((p) => {
    const title = p.name?.replace(/[<>&'"]/g, '');
    const desc = (p.description || `Authentic handcrafted ${p.name} from Ghazali Handicrafts Lahore.`).replace(/[<>&'"]/g, '');
    const imageUrl = Array.isArray(p.images) && p.images[0] ? p.images[0] : `${baseUrl}/og-image.jpg`;
    const categoryName = typeof p.category === 'object' && p.category ? (p.category as any).name : 'Handicrafts';

    return `
    <item>
      <g:id>${p.id}</g:id>
      <g:title>${title}</g:title>
      <g:description>${desc}</g:description>
      <g:link>${baseUrl}/products/${p.slug}</g:link>
      <g:image_link>${imageUrl}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>in_stock</g:availability>
      <g:price>${p.price} PKR</g:price>
      <g:brand>Ghazali Handicrafts</g:brand>
      <g:google_product_category>Home &amp; Garden &gt; Decor</g:google_product_category>
      <g:product_type>${categoryName}</g:product_type>
    </item>`;
  }).join('');

  const feedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Ghazali Handicrafts Product Feed</title>
    <link>${baseUrl}</link>
    <description>Authentic Pakistani Heritage Crafts and Decor</description>
    ${xmlItems}
  </channel>
</rss>`;

  return new NextResponse(feedXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  });
}
