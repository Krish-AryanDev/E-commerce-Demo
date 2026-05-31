'use client'

import { createBrowserClient } from '@supabase/ssr'
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from './config'

/**
 * Browser-side Supabase client (singleton). Used by client components for auth
 * and any direct reads. Returns null when Supabase isn't configured yet so
 * callers can degrade gracefully.
 */
let browserClient = null

export function createClient() {
  if (!isSupabaseConfigured) return null
  if (browserClient) return browserClient
  browserClient = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  return browserClient
}
