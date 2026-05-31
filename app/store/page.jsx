import { getAllProducts, getAllCategories } from '@/lib/products'
import StoreView from '@/components/store/StoreView'

export const metadata = {
  title: 'Store',
  description: 'Explore the full NOVA lineup of premium tech.',
}

export default async function StorePage({ searchParams }) {
  // In Next.js 16 searchParams is async.
  const params = await searchParams
  const categorySlug = params?.category ?? null

  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ])

  const validCategory =
    categorySlug && categories.some((c) => c.slug === categorySlug)
      ? categorySlug
      : null

  return (
    <StoreView
      products={products}
      categories={categories}
      initialCategory={validCategory}
    />
  )
}
