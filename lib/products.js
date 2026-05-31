import 'server-only'
import { createPublicClient } from './supabase/public'
import { isSupabaseConfigured } from './supabase/config'
import { CATEGORIES as SEED_CATEGORIES, PRODUCTS as SEED_PRODUCTS } from './seed-data'

/*
 * Data-access layer for the catalog.
 *
 * Every function is async and prefers Supabase. When Supabase isn't configured
 * yet it transparently falls back to the local seed catalog so the whole app
 * keeps working before any keys are added. Both paths return the exact same
 * product shape the UI components expect.
 */

const PRODUCT_SELECT = `
  id, slug, name, brand, tagline, description, price, original_price, rating, reviews, is_new, highlights,
  categories ( slug, name ),
  product_colors ( name, hex, position ),
  product_images ( url, position )
`

function mapProductRow(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand ?? null,
    category: row.categories?.slug ?? null,
    tagline: row.tagline,
    description: row.description,
    price: Number(row.price),
    originalPrice: row.original_price != null ? Number(row.original_price) : null,
    rating: Number(row.rating),
    reviews: row.reviews ?? 0,
    isNew: row.is_new ?? false,
    highlights: row.highlights ?? [],
    colors: (row.product_colors ?? [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((c) => ({ name: c.name, hex: c.hex })),
    images: (row.product_images ?? [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((i) => i.url),
  }
}

/* Seed products carry their slug as a stable id in fallback mode. */
function seedProducts() {
  return SEED_PRODUCTS.map((p) => ({ id: p.slug, ...p }))
}

/* ------------------------------- Categories ------------------------------- */

export async function getAllCategories() {
  if (!isSupabaseConfigured) return SEED_CATEGORIES

  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('categories')
    .select('slug, name, tagline, image, position')
    .order('position', { ascending: true })

  if (error || !data?.length) return SEED_CATEGORIES
  return data
}

export async function getCategory(slug) {
  const categories = await getAllCategories()
  return categories.find((c) => c.slug === slug) ?? null
}

/* -------------------------------- Products -------------------------------- */

export async function getAllProducts() {
  if (!isSupabaseConfigured) return seedProducts()

  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .order('created_at', { ascending: false })

  if (error || !data?.length) return seedProducts()
  return data.map(mapProductRow)
}

export async function getProductBySlug(slug) {
  if (!isSupabaseConfigured) {
    return seedProducts().find((p) => p.slug === slug) ?? null
  }

  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('slug', slug)
    .maybeSingle()

  if (error || !data) {
    // Fall back to seed only if Supabase genuinely has nothing for this slug.
    return seedProducts().find((p) => p.slug === slug) ?? null
  }
  return mapProductRow(data)
}

export async function getProductsByCategory(categorySlug) {
  const products = await getAllProducts()
  return products.filter((p) => p.category === categorySlug)
}

export async function getNewArrivals(limit = 8) {
  const products = await getAllProducts()
  return products.filter((p) => p.isNew).slice(0, limit)
}

export async function getRelatedProducts(product, limit = 4) {
  const products = await getAllProducts()
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit)
}
