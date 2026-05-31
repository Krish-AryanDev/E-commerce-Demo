import { notFound } from 'next/navigation'
import {
  getProductBySlug,
  getRelatedProducts,
  getAllProducts,
} from '@/lib/products'
import Container from '@/components/ui/Container'
import ProductView from '@/components/product/ProductView'
import ProductCard from '@/components/product/ProductCard'

export async function generateStaticParams() {
  const products = await getAllProducts()
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Product not found' }

  return {
    title: product.name,
    description: product.tagline,
  }
}

export default async function ProductPage({ params }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  const related = await getRelatedProducts(product, 4)

  return (
    <Container className="py-10 lg:py-14">
      <ProductView product={product} />

      {related.length > 0 && (
        <section className="mt-20 border-t border-zinc-200 pt-16">
          <h2 className="mb-8 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            You might also like
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </Container>
  )
}
