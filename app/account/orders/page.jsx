import Link from 'next/link'
import { CheckCircle2, Package, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import Container from '@/components/ui/Container'
import Badge from '@/components/ui/Badge'
import { buttonVariants } from '@/components/ui/Button'

export const metadata = { title: 'My Orders' }

export default async function OrdersPage({ searchParams }) {
  const params = await searchParams
  const justOrdered = params?.success
  const supabase = await createClient()

  // Supabase not configured — explain rather than crash.
  if (!supabase) {
    return (
      <Container className="py-20">
        <Notice
          title="Accounts aren't enabled yet"
          body="Add your Supabase keys to .env.local to enable sign-in and order history."
        />
      </Container>
    )
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <Container className="py-20">
        <Notice
          title="Please sign in"
          body="You need to be signed in to view your orders."
          cta={{ href: '/login?redirect=/account/orders', label: 'Sign in' }}
        />
      </Container>
    )
  }

  const { data: orders } = await supabase
    .from('orders')
    .select(
      'id, status, subtotal, tax, shipping, total, created_at, order_items ( name, color, price, quantity )'
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <Container className="py-10 lg:py-14">
      <div className="border-b border-zinc-200 pb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          My orders
        </h1>
        <p className="mt-2 text-zinc-500">{user.email}</p>
      </div>

      {justOrdered && (
        <div className="mt-8 flex items-start gap-3 rounded-2xl bg-emerald-50 px-5 py-4 text-emerald-800">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
          <div>
            <p className="font-semibold">Order placed successfully</p>
            <p className="text-sm text-emerald-700">
              Thanks for your order — a confirmation is on its way.
            </p>
          </div>
        </div>
      )}

      {!orders || orders.length === 0 ? (
        <div className="mt-8">
          <Notice
            title="No orders yet"
            body="When you place an order it'll show up here."
            cta={{ href: '/store', label: 'Start shopping' }}
          />
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500">
                    <Package className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="soft" className="capitalize">
                    {order.status}
                  </Badge>
                  <span className="text-lg font-bold tracking-tight text-zinc-900">
                    {formatPrice(Number(order.total))}
                  </span>
                </div>
              </div>

              <ul className="mt-4 space-y-2">
                {order.order_items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-zinc-700">
                      {item.quantity} × {item.name}
                      {item.color && (
                        <span className="text-zinc-400"> · {item.color}</span>
                      )}
                    </span>
                    <span className="font-medium text-zinc-900">
                      {formatPrice(Number(item.price) * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}

function Notice({ title, body, cta }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 px-8 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
        <AlertCircle className="size-6" />
      </div>
      <h2 className="mt-5 text-xl font-bold tracking-tight text-zinc-900">
        {title}
      </h2>
      <p className="mt-2 text-sm text-zinc-500">{body}</p>
      {cta && (
        <Link href={cta.href} className={`mt-6 ${buttonVariants({})}`}>
          {cta.label}
        </Link>
      )}
    </div>
  )
}
