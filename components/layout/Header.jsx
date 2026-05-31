'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, ShoppingBag, Menu, X } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { cn } from '@/lib/utils'
import Container from '@/components/ui/Container'
import Input from '@/components/ui/Input'
import AccountMenu from './AccountMenu'

export default function Header({ categories = [] }) {
  const pathname = usePathname()
  const { totalItems } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const navLinks = [
    { label: 'Store', href: '/store' },
    ...categories.slice(0, 4).map((c) => ({
      label: c.name,
      href: `/store?category=${c.slug}`,
    })),
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl backdrop-saturate-150">
      <Container className="flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-extrabold tracking-tight text-zinc-900 transition-opacity duration-300 hover:opacity-70"
          onClick={() => setMobileOpen(false)}
        >
          NOVA<span className="text-brand-600">.</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active = link.href === '/store' && pathname === '/store'
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-300',
                  active
                    ? 'text-brand-600'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Search"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((v) => !v)}
            className="flex size-10 items-center justify-center rounded-xl text-zinc-700 transition-all duration-300 hover:bg-zinc-100 hover:text-zinc-900"
          >
            <Search className="size-5" />
          </button>

          <Link
            href="/cart"
            aria-label={`Cart, ${totalItems} items`}
            className="relative flex size-10 items-center justify-center rounded-xl text-zinc-700 transition-all duration-300 hover:bg-zinc-100 hover:text-zinc-900"
          >
            <ShoppingBag className="size-5" />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[11px] font-semibold text-white shadow-sm shadow-brand-900/30">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>

          <AccountMenu />

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex size-10 items-center justify-center rounded-xl text-zinc-700 transition-all duration-300 hover:bg-zinc-100 hover:text-zinc-900 lg:hidden"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </Container>

      {/* Expandable search bar */}
      {searchOpen && (
        <div className="border-t border-zinc-200/60 bg-white/80 backdrop-blur-xl">
          <Container className="py-3">
            <Input
              icon={Search}
              autoFocus
              placeholder="Search for phones, laptops, audio…"
              aria-label="Search products"
            />
          </Container>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-zinc-200/60 bg-white/95 backdrop-blur-xl lg:hidden">
          <Container as="nav" className="flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-medium text-zinc-700 transition-all duration-300 hover:bg-zinc-100 hover:text-zinc-900"
              >
                {link.label}
              </Link>
            ))}
          </Container>
        </div>
      )}
    </header>
  )
}
