'use client'

import { useMemo, useState } from 'react'
import { SlidersHorizontal, X, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import Container from '@/components/ui/Container'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import ProductCard from '@/components/product/ProductCard'

const PRICE_RANGES = [
  { id: 'all', label: 'Any price', min: 0, max: Infinity },
  { id: 'under-500', label: 'Under $500', min: 0, max: 500 },
  { id: '500-1000', label: '$500 – $1,000', min: 500, max: 1000 },
  { id: '1000-2000', label: '$1,000 – $2,000', min: 1000, max: 2000 },
  { id: 'over-2000', label: 'Over $2,000', min: 2000, max: Infinity },
]

const SORT_OPTIONS = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Top rated' },
]

export default function StoreView({
  products,
  categories = [],
  initialCategory = null,
}) {
  const [activeCategories, setActiveCategories] = useState(
    initialCategory ? [initialCategory] : []
  )
  const [activeBrands, setActiveBrands] = useState([])
  const [priceRange, setPriceRange] = useState('all')
  const [sort, setSort] = useState('featured')
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Unique brands present in the catalog, alphabetised.
  const brands = useMemo(
    () =>
      [...new Set(products.map((p) => p.brand).filter(Boolean))].sort((a, b) =>
        a.localeCompare(b)
      ),
    [products]
  )

  function toggleCategory(slug) {
    setActiveCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    )
  }

  function toggleBrand(brand) {
    setActiveBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    )
  }

  function clearAll() {
    setActiveCategories([])
    setActiveBrands([])
    setPriceRange('all')
  }

  const filtered = useMemo(() => {
    const range = PRICE_RANGES.find((r) => r.id === priceRange)
    let list = products.filter((p) => {
      const catOk =
        activeCategories.length === 0 || activeCategories.includes(p.category)
      const brandOk = activeBrands.length === 0 || activeBrands.includes(p.brand)
      const priceOk = p.price >= range.min && p.price < range.max
      return catOk && brandOk && priceOk
    })

    switch (sort) {
      case 'price-asc':
        list = [...list].sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        list = [...list].sort((a, b) => b.price - a.price)
        break
      case 'rating':
        list = [...list].sort((a, b) => b.rating - a.rating)
        break
      default:
        break
    }
    return list
  }, [products, activeCategories, activeBrands, priceRange, sort])

  const activeFilterCount =
    activeCategories.length + activeBrands.length + (priceRange !== 'all' ? 1 : 0)
  const hasActiveFilters = activeFilterCount > 0

  /* Shared filter body — rendered in both the desktop sidebar and mobile sheet */
  const filterBody = (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-tight text-zinc-900">
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-medium text-brand-600 transition-colors hover:text-brand-700"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Category
        </h3>
        <div className="space-y-1">
          {categories.map((cat) => {
            const checked = activeCategories.includes(cat.slug)
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => toggleCategory(cat.slug)}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition-colors duration-300 hover:bg-zinc-100"
              >
                <span
                  className={cn(
                    'flex size-5 items-center justify-center rounded-md border transition-all duration-300',
                    checked
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : 'border-zinc-300 bg-white'
                  )}
                >
                  {checked && <Check className="size-3.5" strokeWidth={3} />}
                </span>
                <span
                  className={cn(
                    checked ? 'font-medium text-zinc-900' : 'text-zinc-600'
                  )}
                >
                  {cat.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Brand
          </h3>
          <div className="space-y-1">
            {brands.map((brand) => {
              const checked = activeBrands.includes(brand)
              return (
                <button
                  key={brand}
                  type="button"
                  onClick={() => toggleBrand(brand)}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition-colors duration-300 hover:bg-zinc-100"
                >
                  <span
                    className={cn(
                      'flex size-5 items-center justify-center rounded-md border transition-all duration-300',
                      checked
                        ? 'border-brand-600 bg-brand-600 text-white'
                        : 'border-zinc-300 bg-white'
                    )}
                  >
                    {checked && <Check className="size-3.5" strokeWidth={3} />}
                  </span>
                  <span
                    className={cn(
                      checked ? 'font-medium text-zinc-900' : 'text-zinc-600'
                    )}
                  >
                    {brand}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Price */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Price
        </h3>
        <div className="space-y-1">
          {PRICE_RANGES.map((range) => {
            const checked = priceRange === range.id
            return (
              <button
                key={range.id}
                type="button"
                onClick={() => setPriceRange(range.id)}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition-colors duration-300 hover:bg-zinc-100"
              >
                <span
                  className={cn(
                    'flex size-5 items-center justify-center rounded-full border transition-all duration-300',
                    checked ? 'border-brand-600' : 'border-zinc-300'
                  )}
                >
                  {checked && (
                    <span className="size-2.5 rounded-full bg-brand-600" />
                  )}
                </span>
                <span
                  className={cn(
                    checked ? 'font-medium text-zinc-900' : 'text-zinc-600'
                  )}
                >
                  {range.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )

  return (
    <Container className="py-10 lg:py-14">
      {/* Page heading */}
      <div className="mb-8 border-b border-zinc-200 pb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          The Store
        </h1>
        <p className="mt-2 text-zinc-500">
          Explore the full NOVA lineup — {products.length} products.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Sticky sidebar (desktop) */}
        <aside className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-24">{filterBody}</div>
        </aside>

        {/* Product area */}
        <div className="lg:col-span-9">
          {/* Toolbar */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="size-4" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-1 flex size-5 items-center justify-center rounded-full bg-brand-600 text-[11px] text-white">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
              <p className="hidden text-sm text-zinc-500 sm:block">
                {filtered.length} result{filtered.length !== 1 && 's'}
              </p>
            </div>

            {/* Sort */}
            <label className="flex items-center gap-2 text-sm text-zinc-500">
              <span className="hidden sm:inline">Sort by</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-10 cursor-pointer rounded-xl border border-zinc-200 bg-white px-3 pr-8 text-sm font-medium text-zinc-900 transition-all duration-300 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-600/10"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="mb-6 flex flex-wrap gap-2">
              {activeCategories.map((slug) => {
                const cat = categories.find((c) => c.slug === slug)
                return (
                  <button
                    key={slug}
                    type="button"
                    onClick={() => toggleCategory(slug)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-200"
                  >
                    {cat?.name}
                    <X className="size-3.5" />
                  </button>
                )
              })}
              {activeBrands.map((brand) => (
                <button
                  key={brand}
                  type="button"
                  onClick={() => toggleBrand(brand)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-200"
                >
                  {brand}
                  <X className="size-3.5" />
                </button>
              ))}
              {priceRange !== 'all' && (
                <button
                  type="button"
                  onClick={() => setPriceRange('all')}
                  className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-200"
                >
                  {PRICE_RANGES.find((r) => r.id === priceRange)?.label}
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 py-24 text-center">
              <p className="text-lg font-semibold text-zinc-900">
                No products match
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                Try adjusting your filters.
              </p>
              <Button variant="secondary" size="sm" onClick={clearAll} className="mt-5">
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter sheet */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm overflow-y-auto bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold tracking-tight text-zinc-900">
                Filters
              </h2>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
                className="flex size-10 items-center justify-center rounded-xl text-zinc-700 transition-colors hover:bg-zinc-100"
              >
                <X className="size-5" />
              </button>
            </div>
            {filterBody}
            <Button
              fullWidth
              className="mt-8"
              onClick={() => setFiltersOpen(false)}
            >
              Show {filtered.length} result{filtered.length !== 1 && 's'}
            </Button>
          </div>
        </div>
      )}
    </Container>
  )
}
