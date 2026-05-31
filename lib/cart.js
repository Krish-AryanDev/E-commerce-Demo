import 'server-only'

/**
 * Server-side cart helpers, shared by /api/cart and /api/checkout.
 * All functions take an authenticated Supabase server client.
 */

/** Get the user's cart row, creating it if it doesn't exist yet. */
export async function getOrCreateCart(supabase, userId) {
  const { data: existing } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  if (existing) return existing

  const { data: created, error } = await supabase
    .from('carts')
    .insert({ user_id: userId })
    .select('id')
    .single()

  if (error) throw error
  return created
}

/** Load the user's cart as UI-ready lines (joined with product info). */
export async function loadCartLines(supabase, userId) {
  const cart = await getOrCreateCart(supabase, userId)

  const { data, error } = await supabase
    .from('cart_items')
    .select(
      `product_id, color, quantity,
       products ( slug, name, price, product_images ( url, position ) )`
    )
    .eq('cart_id', cart.id)

  if (error) throw error

  return (data ?? [])
    .filter((row) => row.products) // skip items whose product was deleted
    .map((row) => {
      const images = (row.products.product_images ?? [])
        .slice()
        .sort((a, b) => a.position - b.position)
      return {
        id: `${row.product_id}-${row.color ?? 'default'}`,
        productId: row.product_id,
        slug: row.products.slug,
        name: row.products.name,
        price: Number(row.products.price),
        image: images[0]?.url ?? null,
        color: row.color,
        quantity: row.quantity,
      }
    })
}

/** Replace the entire cart contents with the provided items. */
export async function replaceCart(supabase, userId, items) {
  const cart = await getOrCreateCart(supabase, userId)

  // Clear, then insert the new set.
  await supabase.from('cart_items').delete().eq('cart_id', cart.id)

  const rows = (items ?? [])
    .filter((i) => i.productId && i.quantity > 0)
    .map((i) => ({
      cart_id: cart.id,
      product_id: i.productId,
      color: i.color ?? null,
      quantity: i.quantity,
    }))

  if (rows.length) {
    const { error } = await supabase.from('cart_items').insert(rows)
    if (error) throw error
  }

  await supabase
    .from('carts')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', cart.id)
}
