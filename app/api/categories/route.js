import { NextResponse } from 'next/server'
import { getAllCategories } from '@/lib/products'

/** GET /api/categories → all categories */
export async function GET() {
  const categories = await getAllCategories()
  return NextResponse.json({ categories })
}
