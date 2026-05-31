'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import Rating from '@/components/ui/Rating'

export default function ProductCard({ product, priority = false }) {
  const { addItem } = useCart()

  function handleQuickAdd(e) {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, { color: product.colors?.[0]?.name ?? null, quantity: 1 })
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col rounded-2xl border border-zinc-100 bg-white p-3 transition-all duration-300 hover:border-zinc-200 hover:shadow-xl hover:shadow-brand-900/5"
    >
      {/* Image container */}
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-zinc-100">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Badges — New on the left, Sale on the right so they never collide */}
        <div className="pointer-events-none absolute inset-x-2.5 top-2.5 flex items-start justify-between gap-2">
          <span>{product.isNew && <Badge variant="brand">New Arrival</Badge>}</span>
          {product.originalPrice && <Badge variant="sale">Sale</Badge>}
        </div>

        {/* Quick add — always visible on touch screens, hover-reveal on desktop */}
        <button
          type="button"
          onClick={handleQuickAdd}
          aria-label={`Add ${product.name} to bag`}
          className="absolute bottom-3 right-3 flex size-10 items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow-lg shadow-zinc-900/10 backdrop-blur-sm transition-all duration-300 hover:bg-brand-600 hover:text-white lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
        >
          <Plus className="size-5" />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col px-1 pb-1 pt-4">
        <Rating value={product.rating} reviews={product.reviews} />

        {product.brand && (
          <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            {product.brand}
          </p>
        )}
        <h3 className="mt-0.5 text-base font-semibold tracking-tight text-zinc-900">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-1 text-sm text-zinc-500">
          {product.tagline}
        </p>

        <div className="mt-4 flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight text-zinc-900">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-zinc-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
