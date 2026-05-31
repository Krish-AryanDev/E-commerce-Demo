import { NextResponse } from 'next/server'
import { getProductBySlug } from '@/lib/products'

/** GET /api/products/:slug → a single product (404 if missing). */
export async function GET(_request, { params }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }
  return NextResponse.json({ product })
}
