import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Truck, BadgeCheck, Tag, ShieldCheck } from 'lucide-react'
import {
  getAllCategories,
  getNewArrivals,
  getAllProducts,
} from '@/lib/products'
import Container from '@/components/ui/Container'
import ProductCard from '@/components/product/ProductCard'
import Hero from '@/components/home/Hero'

// Featured slides for the hero carousel, keyed to real products.
const HERO_PICKS = [
  {
    slug: 'apple-watch-series-9',
    title: ['Time,', 'on your wrist.'],
    subtitle:
      'The brightest display yet, advanced health sensors and the magical double tap gesture.',
  },
  {
    slug: 'apple-iphone-15-pro-max',
    title: ['Pro.', 'Beyond pro.'],
    subtitle:
      'Forged in titanium, powered by A17 Pro, with a game-changing 5x telephoto camera.',
  },
  {
    slug: 'samsung-galaxy-s24-ultra',
    title: ['Galaxy AI', 'is here.'],
    subtitle:
      'A 200MP camera, a built-in S Pen and Galaxy AI — all in a sleek titanium frame.',
  },
  {
    slug: 'apple-macbook-air-13-m3',
    title: ['Light.', 'Years ahead.'],
    subtitle:
      'Strikingly thin, silent and supercharged by the M3 chip with up to 18 hours of battery.',
  },
]

const VALUE_PROPS = [
  {
    icon: Truck,
    title: 'Free delivery',
    text: 'Fast, free shipping on every order, every time.',
  },
  {
    icon: BadgeCheck,
    title: 'Quality guarantee',
    text: 'Only genuine products with a 2-year warranty.',
  },
  {
    icon: Tag,
    title: 'Daily offers',
    text: 'Fresh deals and price drops across the store.',
  },
  {
    icon: ShieldCheck,
    title: '100% secure payment',
    text: 'Encrypted, PCI-compliant checkout you can trust.',
  },
]

export default async function HomePage() {
  const [newArrivals, categories, allProducts] = await Promise.all([
    getNewArrivals(8),
    getAllCategories(),
    getAllProducts(),
  ])

  // Build hero slides from the picks that actually exist in the catalog.
  const bySlug = Object.fromEntries(allProducts.map((p) => [p.slug, p]))
  const slides = HERO_PICKS.map((pick) => {
    const product = bySlug[pick.slug]
    if (!product) return null
    return {
      title: pick.title,
      subtitle: pick.subtitle,
      eyebrow: product.brand
        ? `${product.brand} · ${product.name}`
        : product.name,
      image: product.images[0],
      price: product.price,
      href: `/product/${product.slug}`,
    }
  }).filter(Boolean)

  return (
    <>
      {/* ---------- HERO ---------- */}
      <Hero slides={slides} />

      {/* ---------- VALUE PROPS STRIP ---------- */}
      <section className="border-b border-zinc-200 bg-white">
        <Container className="py-8 lg:py-10">
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
            {VALUE_PROPS.map((prop) => (
              <div key={prop.title} className="flex items-start gap-3.5">
                <prop.icon
                  className="mt-0.5 size-6 shrink-0 text-brand-600"
                  strokeWidth={1.75}
                />
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-900">
                    {prop.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-500">
                    {prop.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------- SHOP BY CATEGORY ---------- */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                Shop by category
              </h2>
              <p className="mt-2 text-zinc-500">
                Find the right device for the way you live.
              </p>
            </div>
            <Link
              href="/store"
              className="group hidden items-center gap-1 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700 sm:inline-flex"
            >
              View all
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/store?category=${category.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50 transition-all duration-300 hover:border-zinc-200 hover:shadow-xl hover:shadow-brand-900/5"
              >
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold tracking-tight text-zinc-900">
                    {category.name}
                  </h3>
                  <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500">
                    {category.tagline}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------- LATEST ARRIVALS ---------- */}
      <section className="bg-zinc-50 py-16 lg:py-24">
        <Container>
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                Latest arrivals
              </h2>
              <p className="mt-2 text-zinc-500">
                The newest additions to the lineup.
              </p>
            </div>
            <Link
              href="/store"
              className="group hidden items-center gap-1 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700 sm:inline-flex"
            >
              View all
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {newArrivals.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 4} />
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
