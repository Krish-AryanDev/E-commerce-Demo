import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from './config'

/**
 * Cookie-less anon client for PUBLIC catalog reads (categories, products).
 *
 * Because it never touches request cookies, it's safe to use anywhere —
 * including `generateStaticParams` and statically-rendered pages, which run at
 * build time without an HTTP request. RLS still applies (catalog tables are
 * world-readable). For anything user-scoped (cart, orders, auth) use the
 * cookie-bound client in `./server` instead.
 */
let publicClient = null

export function createPublicClient() {
  if (!isSupabaseConfigured) return null
  if (publicClient) return publicClient
  publicClient = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return publicClient
}
