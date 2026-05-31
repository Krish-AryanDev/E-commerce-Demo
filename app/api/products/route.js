import { NextResponse } from 'next/server'
import { getAllProducts, getProductsByCategory } from '@/lib/products'

/**
 * GET /api/products            → all products
 * GET /api/products?category=… → products in a category
 */
export async function GET(request) {
  const category = request.nextUrl.searchParams.get('category')
  const products = category
    ? await getProductsByCategory(category)
    : await getAllProducts()

  return NextResponse.json({ products })
}
