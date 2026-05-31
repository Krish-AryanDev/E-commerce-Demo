'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Lock,
  Tag,
  AlertCircle,
} from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { formatPrice } from '@/lib/utils'
import Container from '@/components/ui/Container'
import Button, { buttonVariants } from '@/components/ui/Button'

const SHIPPING = 0 // free shipping
const TAX_RATE = 0.08

export default function CartView() {
  const { items, subtotal, totalItems, setQuantity, removeItem, clear } = useCart()
  const { user, isConfigured } = useAuth()
  const router = useRouter()
  const [checkingOut, setCheckingOut] = useState(false)
  const [error, setError] = useState('')

  async function handleCheckout() {
    setError('')

    // Need an account to place an order — send guests to sign in first.
    if (!isConfigured || !user) {
      router.push('/login?redirect=/cart')
      return
    }

    setCheckingOut(true)
    try {
      const res = await fetch('/api/checkout', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Checkout failed')
      clear()
      router.push(`/account/orders?success=${data.orderId}`)
    } catch (err) {
      setError(err.message)
      setCheckingOut(false)
    }
  }

  if (items.length === 0) {
    return (
      <Container className="py-20">
        <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 px-8 py-20 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
            <ShoppingBag className="size-7" />
          </div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-zinc-900">
            Your bag is empty
          </h1>
          <p className="mt-2 text-zinc-500">
            Looks like you haven't added anything yet.
          </p>
          <Link
            href="/store"
            className={`group mt-8 ${buttonVariants({ size: 'lg' })}`}
          >
            Start shopping
            <ArrowRight className="size-4.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </Container>
    )
  }

  const tax = subtotal * TAX_RATE
  const total = subtotal + SHIPPING + tax

  return (
    <Container className="py-10 lg:py-14">
      <div className="flex items-end justify-between gap-4 border-b border-zinc-200 pb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Your bag
          </h1>
          <p className="mt-2 text-zinc-500">
            {totalItems} item{totalItems !== 1 && 's'} in your bag
          </p>
        </div>
        <button
          type="button"
          onClick={clear}
          className="text-sm font-medium text-zinc-500 transition-colors duration-300 hover:text-red-600"
        >
          Clear all
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* ---------- Items ---------- */}
        <ul className="divide-y divide-zinc-100 lg:col-span-8">
          {items.map((line) => (
            <li key={line.id} className="flex gap-4 py-6 first:pt-0 sm:gap-6">
              <Link
                href={`/product/${line.slug}`}
                className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-zinc-100 sm:size-28"
              >
                {line.image && (
                  <Image
                    src={line.image}
                    alt={line.name}
                    fill
                    sizes="120px"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                )}
              </Link>

              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-4">
                  <div>
                    <Link
                      href={`/product/${line.slug}`}
                      className="text-base font-semibold tracking-tight text-zinc-900 transition-colors hover:text-brand-600"
                    >
                      {line.name}
                    </Link>
                    {line.color && (
                      <p className="mt-1 text-sm text-zinc-500">{line.color}</p>
                    )}
                  </div>
                  <p className="text-base font-semibold text-zinc-900">
                    {formatPrice(line.price * line.quantity)}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4">
                  {/* Quantity stepper */}
                  <div className="flex items-center rounded-lg border border-zinc-200">
                    <button
                      type="button"
                      onClick={() => setQuantity(line.id, line.quantity - 1)}
                      aria-label="Decrease quantity"
                      className="flex size-9 items-center justify-center rounded-l-lg text-zinc-700 transition-colors duration-300 hover:bg-zinc-100"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="w-9 text-center text-sm font-semibold text-zinc-900">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(line.id, line.quantity + 1)}
                      aria-label="Increase quantity"
                      className="flex size-9 items-center justify-center rounded-r-lg text-zinc-700 transition-colors duration-300 hover:bg-zinc-100"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(line.id)}
                    className="flex items-center gap-1.5 text-sm font-medium text-zinc-400 transition-colors duration-300 hover:text-red-600"
                  >
                    <Trash2 className="size-4" />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* ---------- Order summary ---------- */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24 rounded-2xl border border-zinc-100 bg-zinc-50 p-6 shadow-sm">
            <h2 className="text-lg font-bold tracking-tight text-zinc-900">
              Order summary
            </h2>

            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-zinc-500">Subtotal</dt>
                <dd className="font-medium text-zinc-900">
                  {formatPrice(subtotal)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-zinc-500">Shipping</dt>
                <dd className="font-medium text-emerald-600">Free</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-zinc-500">Estimated tax</dt>
                <dd className="font-medium text-zinc-900">{formatPrice(tax)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-zinc-200 pt-4">
                <dt className="text-base font-semibold text-zinc-900">Total</dt>
                <dd className="text-xl font-bold tracking-tight text-zinc-900">
                  {formatPrice(total)}
                </dd>
              </div>
            </dl>

            {/* Promo */}
            <div className="mt-6 flex gap-2">
              <div className="relative flex-1">
                <Tag className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Promo code"
                  className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 transition-all duration-300 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-600/10"
                />
              </div>
              <Button variant="secondary">Apply</Button>
            </div>

            {error && (
              <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 size-4.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              size="lg"
              fullWidth
              className="group mt-6"
              onClick={handleCheckout}
              disabled={checkingOut}
            >
              {checkingOut ? (
                'Placing order…'
              ) : (
                <>
                  {user ? 'Checkout' : 'Sign in to checkout'}
                  <ArrowRight className="size-4.5 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </Button>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-zinc-400">
              <Lock className="size-3.5" />
              Secure checkout · encrypted payment
            </p>

            <Link
              href="/store"
              className="mt-4 block text-center text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
            >
              Continue shopping
            </Link>
          </div>
        </aside>
      </div>
    </Container>
  )
}
