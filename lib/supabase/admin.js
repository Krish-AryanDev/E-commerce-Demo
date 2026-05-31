import 'server-only'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { SUPABASE_URL } from './config'

/**
 * Service-role client. Bypasses Row Level Security — server only, NEVER import
 * this into a client component. Used by the seed script and trusted server
 * operations. Returns null if the service role key isn't present.
 */
export function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!SUPABASE_URL || !serviceKey || /your-service/i.test(serviceKey)) {
    return null
  }
  return createSupabaseClient(SUPABASE_URL, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
