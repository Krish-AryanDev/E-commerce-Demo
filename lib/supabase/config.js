/**
 * Central place to read Supabase env + decide whether it's actually wired up.
 *
 * While the env still holds the placeholder values from `.env.example`, the
 * app treats Supabase as "not configured" and the data layer falls back to the
 * local seed catalog — so the project runs end-to-end before you add keys.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

const PLACEHOLDER = /your-project-ref|your-anon|your-service/i

export const isSupabaseConfigured =
  Boolean(SUPABASE_URL && SUPABASE_ANON_KEY) &&
  !PLACEHOLDER.test(SUPABASE_URL) &&
  !PLACEHOLDER.test(SUPABASE_ANON_KEY)
