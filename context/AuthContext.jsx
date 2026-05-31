'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const router = useRouter()
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // No client → Supabase not configured. Stop loading and stay signed out.
    if (!supabase) {
      setLoading(false)
      return
    }

    let active = true

    supabase.auth.getUser().then(({ data }) => {
      if (active) {
        setUser(data.user ?? null)
        setLoading(false)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      active = false
      subscription?.unsubscribe()
    }
  }, [supabase])

  const value = useMemo(
    () => ({
      user,
      loading,
      isConfigured: Boolean(supabase),
      supabase,
      async signOut() {
        if (!supabase) return
        await supabase.auth.signOut()
        setUser(null)
        router.refresh()
      },
    }),
    [user, loading, supabase, router]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
