import 'server-only'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from './config'

/**
 * Server-side Supabase client bound to the request cookies. Use inside Server
 * Components, Route Handlers and Server Actions.
 *
 * Returns null when Supabase isn't configured so the catalog data layer can
 * fall back to seed data. Cookie writes are wrapped in try/catch because
 * Server Components can read cookies but not set them (that happens in
 * middleware / route handlers / server actions).
 */
export async function createClient() {
  if (!isSupabaseConfigured) return null

  const cookieStore = await cookies()

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          /* called from a Server Component — safe to ignore */
        }
      },
    },
  })
}

/** Convenience: the current authenticated user (or null). */
export async function getCurrentUser() {
  const supabase = await createClient()
  if (!supabase) return null
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}
