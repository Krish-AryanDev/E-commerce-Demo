import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { loadCartLines, replaceCart } from '@/lib/cart'

const TAX_RATE = 0.08
const SHIPPING = 0

/**
 * POST /api/checkout
 * Turns the signed-in user's server cart into an order, then empties the cart.
 * Totals are computed server-side from the stored cart — never trusted from
 * the client.
 */
export async function POST() {
  const supabase = await createClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const lines = await loadCartLines(supabase, user.id)
    if (lines.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0)
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100
    const total = subtotal + tax + SHIPPING

    // Create the order.
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        status: 'paid',
        subtotal,
        tax,
        shipping: SHIPPING,
        total,
      })
      .select('id')
      .single()
    if (orderErr) throw orderErr

    // Snapshot the line items.
    const { error: itemsErr } = await supabase.from('order_items').insert(
      lines.map((l) => ({
        order_id: order.id,
        product_id: l.productId,
        name: l.name,
        color: l.color,
        price: l.price,
        quantity: l.quantity,
      }))
    )
    if (itemsErr) throw itemsErr

    // Empty the cart.
    await replaceCart(supabase, user.id, [])

    return NextResponse.json({ orderId: order.id })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
