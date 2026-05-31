'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)
const STORAGE_KEY = 'nova-cart'

/** A cart line is keyed by product + color so colors are tracked separately. */
export function lineId(productId, color) {
  return `${productId}-${color ?? 'default'}`
}

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return action.items ?? []

    case 'ADD': {
      const { product, color, quantity } = action
      const id = lineId(product.id, color)
      const existing = state.find((line) => line.id === id)
      if (existing) {
        return state.map((line) =>
          line.id === id ? { ...line, quantity: line.quantity + quantity } : line
        )
      }
      return [
        ...state,
        {
          id,
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.images?.[0] ?? null,
          color: color ?? null,
          quantity,
        },
      ]
    }

    case 'SET_QUANTITY':
      return state
        .map((line) =>
          line.id === action.id
            ? { ...line, quantity: Math.max(1, action.quantity) }
            : line
        )
        .filter((line) => line.quantity > 0)

    case 'REMOVE':
      return state.filter((line) => line.id !== action.id)

    case 'CLEAR':
      return []

    default:
      return state
  }
}

/* ----------------------------- storage helpers ---------------------------- */
function readLocal() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}
function writeLocal(items) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    /* ignore */
  }
}
function clearLocal() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

/* Combine two carts, summing quantities for matching lines. */
function mergeCarts(a, b) {
  const byId = new Map()
  for (const line of [...a, ...b]) {
    const existing = byId.get(line.id)
    byId.set(
      line.id,
      existing
        ? { ...existing, quantity: existing.quantity + line.quantity }
        : { ...line }
    )
  }
  return [...byId.values()]
}

/* --------------------------------- server --------------------------------- */
async function fetchServerCart() {
  try {
    const res = await fetch('/api/cart', { cache: 'no-store' })
    if (!res.ok) return []
    const data = await res.json()
    return data.items ?? []
  } catch {
    return []
  }
}
async function pushServerCart(items) {
  try {
    await fetch('/api/cart', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map((l) => ({
          productId: l.productId,
          color: l.color,
          quantity: l.quantity,
        })),
      }),
    })
  } catch {
    /* offline / unauthenticated — ignore, local state still holds */
  }
}

export function CartProvider({ children }) {
  const { user, loading } = useAuth()
  const [items, dispatch] = useReducer(reducer, [])
  const hydrated = useRef(false)
  const mode = useRef('local') // 'local' | 'server'

  const userId = user?.id ?? null

  // (Re)hydrate whenever the signed-in user changes.
  useEffect(() => {
    if (loading) return
    let cancelled = false
    hydrated.current = false

    async function init() {
      if (userId) {
        const [server, local] = [await fetchServerCart(), readLocal()]
        const merged = local.length ? mergeCarts(server, local) : server
        if (cancelled) return
        dispatch({ type: 'HYDRATE', items: merged })
        mode.current = 'server'
        hydrated.current = true
        if (local.length) {
          clearLocal()
          await pushServerCart(merged)
        }
      } else {
        const local = readLocal()
        if (cancelled) return
        dispatch({ type: 'HYDRATE', items: local })
        mode.current = 'local'
        hydrated.current = true
      }
    }

    init()
    return () => {
      cancelled = true
    }
  }, [userId, loading])

  // Persist on change — to the server when signed in, else to localStorage.
  useEffect(() => {
    if (!hydrated.current) return
    if (mode.current === 'server') {
      const t = setTimeout(() => pushServerCart(items), 400)
      return () => clearTimeout(t)
    }
    writeLocal(items)
  }, [items])

  const value = useMemo(() => {
    const totalItems = items.reduce((sum, l) => sum + l.quantity, 0)
    const subtotal = items.reduce((sum, l) => sum + l.price * l.quantity, 0)
    return {
      items,
      totalItems,
      subtotal,
      addItem: (product, { color = null, quantity = 1 } = {}) =>
        dispatch({ type: 'ADD', product, color, quantity }),
      setQuantity: (id, quantity) =>
        dispatch({ type: 'SET_QUANTITY', id, quantity }),
      removeItem: (id) => dispatch({ type: 'REMOVE', id }),
      clear: () => dispatch({ type: 'CLEAR' }),
    }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
