'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Minus,
  Plus,
  Check,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
} from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { cn, formatPrice } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Rating from '@/components/ui/Rating'

const VALUE_PROPS = [
  { icon: Truck, label: 'Free shipping', sub: 'Delivered in 2–4 days' },
  { icon: ShieldCheck, label: '2-year warranty', sub: 'Full coverage included' },
  { icon: RotateCcw, label: '30-day returns', sub: 'Hassle-free, no questions' },
]

export default function ProductView({ product }) {
  const { addItem } = useCart()
  const [activeImage, setActiveImage] = useState(0)
  const [color, setColor] = useState(product.colors?.[0]?.name ?? null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem(product, { color, quantity })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <>
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-sm text-zinc-500"
      >
        <Link href="/" className="transition-colors hover:text-zinc-900">
          Home
        </Link>
        <ChevronRight className="size-3.5 text-zinc-300" />
        <Link href="/store" className="transition-colors hover:text-zinc-900">
          Store
        </Link>
        <ChevronRight className="size-3.5 text-zinc-300" />
        <span className="font-medium text-zinc-900">{product.name}</span>
      </nav>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        {/* ---------- Gallery ---------- */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-100">
            <Image
              src={product.images[activeImage]}
              alt={`${product.name} — view ${activeImage + 1}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {product.isNew && (
              <div className="absolute left-4 top-4">
                <Badge variant="brand">New Arrival</Badge>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-3">
            {product.images.map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={() => setActiveImage(i)}
                aria-label={`View image ${i + 1}`}
                className={cn(
                  'relative aspect-square overflow-hidden rounded-xl bg-zinc-100 transition-all duration-300',
                  activeImage === i
                    ? 'ring-2 ring-brand-600 ring-offset-2'
                    : 'opacity-70 hover:opacity-100'
                )}
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* ---------- Details ---------- */}
        <div>
          <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider">
            {product.brand && (
              <span className="text-zinc-900">{product.brand}</span>
            )}
            {product.brand && <span className="text-zinc-300">·</span>}
            <Link
              href={`/store?category=${product.category}`}
              className="text-brand-600 transition-colors hover:text-brand-700"
            >
              {product.category}
            </Link>
          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            {product.name}
          </h1>

          <p className="mt-3 text-lg leading-relaxed text-zinc-500">
            {product.tagline}
          </p>

          <div className="mt-4">
            <Rating value={product.rating} reviews={product.reviews} size="md" />
          </div>

          {/* Price */}
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-bold tracking-tight text-zinc-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-zinc-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <Badge variant="sale">
                  Save {formatPrice(product.originalPrice - product.price)}
                </Badge>
              </>
            )}
          </div>

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-zinc-900">Color</h3>
                <span className="text-sm text-zinc-500">{color}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setColor(c.name)}
                    aria-label={c.name}
                    aria-pressed={color === c.name}
                    className={cn(
                      'relative flex size-9 items-center justify-center rounded-full transition-all duration-300',
                      color === c.name
                        ? 'ring-2 ring-brand-600 ring-offset-2'
                        : 'ring-1 ring-zinc-200 ring-offset-1 hover:ring-zinc-300'
                    )}
                    style={{ backgroundColor: c.hex }}
                  >
                    {color === c.name && (
                      <Check
                        className={cn(
                          'size-4',
                          isLight(c.hex) ? 'text-zinc-900' : 'text-white'
                        )}
                        strokeWidth={3}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Add to bag */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-13 w-36 items-center justify-between rounded-xl border border-zinc-200 bg-white px-2">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
                className="flex size-9 items-center justify-center rounded-lg text-zinc-700 transition-colors duration-300 hover:bg-zinc-100 disabled:opacity-40"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-8 text-center text-base font-semibold text-zinc-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
                className="flex size-9 items-center justify-center rounded-lg text-zinc-700 transition-colors duration-300 hover:bg-zinc-100"
              >
                <Plus className="size-4" />
              </button>
            </div>

            <Button
              size="lg"
              fullWidth
              onClick={handleAdd}
              className="flex-1"
            >
              {added ? (
                <>
                  <Check className="size-5" strokeWidth={2.5} />
                  Added to bag
                </>
              ) : (
                <>
                  <ShoppingBag className="size-5" />
                  Add to bag · {formatPrice(product.price * quantity)}
                </>
              )}
            </Button>
          </div>

          {/* Value props */}
          <div className="mt-8 grid grid-cols-1 gap-3 rounded-2xl border border-zinc-100 bg-zinc-50 p-5 sm:grid-cols-3 sm:gap-2">
            {VALUE_PROPS.map((prop) => (
              <div key={prop.label} className="flex items-start gap-3">
                <prop.icon className="mt-0.5 size-5 shrink-0 text-brand-600" />
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    {prop.label}
                  </p>
                  <p className="text-xs text-zinc-500">{prop.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Description + highlights */}
          <div className="mt-10 border-t border-zinc-200 pt-8">
            <h3 className="text-lg font-semibold tracking-tight text-zinc-900">
              Overview
            </h3>
            <p className="mt-3 leading-relaxed text-zinc-600">
              {product.description}
            </p>

            {product.highlights?.length > 0 && (
              <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {product.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2.5 text-sm text-zinc-700">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

/* Decide whether a swatch needs a dark or light checkmark for contrast. */
function isLight(hex) {
  const c = hex.replace('#', '')
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  // Perceived luminance
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.7
}
