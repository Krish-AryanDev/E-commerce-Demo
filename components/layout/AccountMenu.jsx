'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { User, Package, LogOut, LogIn } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function AccountMenu() {
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  // Signed out → simple link to login.
  if (!user) {
    return (
      <Link
        href="/login"
        aria-label="Sign in"
        className="flex size-10 items-center justify-center rounded-xl text-zinc-700 transition-all duration-300 hover:bg-zinc-100 hover:text-zinc-900"
      >
        <User className="size-5" />
      </Link>
    )
  }

  const initial = (user.email ?? '?').charAt(0).toUpperCase()

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label="Account menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex size-9 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white transition-all duration-300 hover:bg-brand-700"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-60 overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-xl shadow-brand-900/10">
          <div className="border-b border-zinc-100 px-4 py-3">
            <p className="text-xs text-zinc-400">Signed in as</p>
            <p className="truncate text-sm font-medium text-zinc-900">
              {user.email}
            </p>
          </div>
          <div className="p-1.5">
            <Link
              href="/account/orders"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-zinc-700 transition-colors duration-300 hover:bg-zinc-100"
            >
              <Package className="size-4 text-zinc-400" />
              My orders
            </Link>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                signOut()
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-zinc-700 transition-colors duration-300 hover:bg-zinc-100"
            >
              <LogOut className="size-4 text-zinc-400" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
