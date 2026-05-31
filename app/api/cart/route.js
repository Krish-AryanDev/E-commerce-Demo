import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { loadCartLines, replaceCart } from '@/lib/cart'

/** GET /api/cart → the signed-in user's cart lines (empty if signed out). */
export async function GET() {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ items: [] })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ items: [] })

  try {
    const items = await loadCartLines(supabase, user.id)
    return NextResponse.json({ items })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

/** PUT /api/cart → replace the cart with the provided items. */
export async function PUT(request) {
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
    const body = await request.json()
    await replaceCart(supabase, user.id, body.items ?? [])
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
