/**
 * Seeds the Supabase catalog (categories + products + colors + images) from
 * lib/seed-data.js using the service-role key.
 *
 * Usage:
 *   1. Run the SQL in supabase/migrations/0001_init.sql in your project.
 *   2. Fill .env.local with NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 *   3. npm run seed
 *
 * Safe to re-run: it upserts categories/products by slug and replaces each
 * product's colors + images.
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Minimal .env.local loader (avoids an extra dependency).
function loadEnv() {
  try {
    const raw = readFileSync(join(__dirname, '..', '.env.local'), 'utf8')
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/)
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
      }
    }
  } catch {
    /* no .env.local — rely on real env */
  }
}
loadEnv()

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey || /your-project-ref|your-service/i.test(`${url}${serviceKey}`)) {
  console.error(
    '\n✗ Missing Supabase credentials.\n  Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local first.\n'
  )
  process.exit(1)
}

const { CATEGORIES, PRODUCTS } = await import('../lib/seed-data.js')
const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function main() {
  console.log('→ Seeding categories…')
  const categoryRows = CATEGORIES.map((c, i) => ({ ...c, position: i }))
  const { data: cats, error: catErr } = await supabase
    .from('categories')
    .upsert(categoryRows, { onConflict: 'slug' })
    .select('id, slug')
  if (catErr) throw catErr

  const categoryIdBySlug = Object.fromEntries(cats.map((c) => [c.slug, c.id]))
  console.log(`  ✓ ${cats.length} categories`)

  console.log('→ Seeding products…')
  for (const p of PRODUCTS) {
    const { data: product, error: prodErr } = await supabase
      .from('products')
      .upsert(
        {
          slug: p.slug,
          name: p.name,
          brand: p.brand ?? null,
          category_id: categoryIdBySlug[p.category] ?? null,
          tagline: p.tagline,
          description: p.description,
          price: p.price,
          original_price: p.originalPrice ?? null,
          rating: p.rating,
          reviews: p.reviews,
          is_new: p.isNew,
          highlights: p.highlights,
        },
        { onConflict: 'slug' }
      )
      .select('id')
      .single()
    if (prodErr) throw prodErr

    // Replace colors + images for this product.
    await supabase.from('product_colors').delete().eq('product_id', product.id)
    await supabase.from('product_images').delete().eq('product_id', product.id)

    if (p.colors?.length) {
      const { error } = await supabase.from('product_colors').insert(
        p.colors.map((c, i) => ({
          product_id: product.id,
          name: c.name,
          hex: c.hex,
          position: i,
        }))
      )
      if (error) throw error
    }
    if (p.images?.length) {
      const { error } = await supabase.from('product_images').insert(
        p.images.map((url, i) => ({ product_id: product.id, url, position: i }))
      )
      if (error) throw error
    }
    console.log(`  ✓ ${p.name}`)
  }

  // Prune any products in the DB that are no longer part of the seed catalog
  // (e.g. the original NOVA demo items). order_items keep their snapshot via
  // ON DELETE SET NULL, so historical orders are unaffected.
  const keepSlugs = PRODUCTS.map((p) => p.slug)
  const { data: removed, error: pruneErr } = await supabase
    .from('products')
    .delete()
    .not('slug', 'in', `(${keepSlugs.map((s) => `"${s}"`).join(',')})`)
    .select('slug')
  if (pruneErr) throw pruneErr
  if (removed?.length) {
    console.log(`→ Pruned ${removed.length} stale product(s).`)
  }

  console.log('\n✓ Seed complete.\n')
}

main().catch((err) => {
  console.error('\n✗ Seed failed:', err.message ?? err)
  process.exit(1)
})
