import { updateSession } from '@/lib/supabase/middleware'

// Next.js 16 renamed the "middleware" convention to "proxy".
export async function proxy(request) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Run on all routes except static assets, images and favicon, so the auth
     * session stays fresh as the user navigates.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
