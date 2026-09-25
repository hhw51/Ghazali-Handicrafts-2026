import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export const runtime = 'edge';

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const supabase = getSupabaseClient();
  const pattern = `%${q.toLowerCase()}%`;

  // 1. Try high-performance RPC function with GIN index backing if deployed
  const { data: rpcData, error: rpcErr } = await supabase.rpc('fast_search_products', {
    search_term: q,
    match_limit: 8,
  });

  if (!rpcErr && rpcData && rpcData.length > 0) {
    const formattedRpcResults = rpcData.map((prod: any) => ({
      id: prod.id,
      name: prod.name,
      slug: prod.slug,
      price: prod.price,
      image: Array.isArray(prod.images) ? prod.images[0] : prod.image || prod.images || null,
      size: prod.size || null,
      weight: prod.weight || null,
      tags: prod.tags || [],
    }));

    return NextResponse.json(
      { results: formattedRpcResults },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } }
    );
  }

  // 2. Query categories first for category matches (e.g., "Truck Art", "Blue Pottery")
  const { data: matchedCats } = await supabase
    .from('categories')
    .select('id, name, slug')
    .or(`name.ilike.${pattern},slug.ilike.${pattern}`);

  const matchedCatIds = (matchedCats || []).map((c) => c.id);

  // 3. Fallback to indexed column query
  let productQuery = supabase
    .from('products')
    .select('id, name, slug, price, images, size, weight, tags, short_description')
    .limit(8);

  if (matchedCatIds.length > 0) {
    productQuery = productQuery.or(
      `name.ilike.${pattern},short_description.ilike.${pattern},design.ilike.${pattern},category_id.in.(${matchedCatIds.join(',')})`
    );
  } else {
    productQuery = productQuery.or(
      `name.ilike.${pattern},short_description.ilike.${pattern},design.ilike.${pattern}`
    );
  }

  const { data: fallbackData } = await productQuery;

  // Lightweight response payload with first image only
  const results = (fallbackData || []).map((prod: any) => ({
    id: prod.id,
    name: prod.name,
    slug: prod.slug,
    price: prod.price,
    image: Array.isArray(prod.images) ? prod.images[0] : prod.images || null,
    size: prod.size || null,
    weight: prod.weight || null,
    tags: prod.tags || [],
  }));

  return NextResponse.json(
    { results },
    { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } }
  );
}
