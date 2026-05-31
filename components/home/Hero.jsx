'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import Container from '@/components/ui/Container'

/**
 * Full-width hero carousel: large uppercase headline + dark CTA on the left,
 * a big product shot on the right, side arrows and slide dots. Auto-advances,
 * pauses on hover.
 */
export default function Hero({ slides = [] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = slides.length

  const goTo = useCallback((i) => setIndex(((i % count) + count) % count), [count])
  const next = useCallback(() => goTo(index + 1), [goTo, index])
  const prev = useCallback(() => goTo(index - 1), [goTo, index])

  useEffect(() => {
    if (count <= 1 || paused) return
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 6000)
    return () => clearInterval(t)
  }, [count, paused])

  if (count === 0) return null

  return (
    <section
      className="relative overflow-hidden bg-linear-to-b from-zinc-100 to-zinc-50"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {/* Soft accent glow */}
      <div className="pointer-events-none absolute -right-40 top-1/3 size-136 rounded-full bg-brand-600/5 blur-3xl" />

      {/* Arrows */}
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-2 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full p-2 text-zinc-300 transition-all duration-300 hover:text-zinc-600 sm:flex lg:left-6"
          >
            <ChevronLeft className="size-10 lg:size-14" strokeWidth={1.25} />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="absolute right-2 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full p-2 text-zinc-300 transition-all duration-300 hover:text-zinc-600 sm:flex lg:right-6"
          >
            <ChevronRight className="size-10 lg:size-14" strokeWidth={1.25} />
          </button>
        </>
      )}

      <Container className="relative">
        <div className="relative grid items-center gap-8 py-10 sm:py-12 lg:min-h-160 lg:grid-cols-2 lg:gap-12">
          {/* ---- Text (stacked slides, crossfade) ---- */}
          <div className="relative order-2 z-10 lg:order-1">
            {slides.map((slide, i) => (
              <div
                key={slide.href}
                aria-hidden={i !== index}
                className={cn(
                  'transition-all duration-700 ease-out',
                  i === index
                    ? 'relative opacity-100 blur-0'
                    : 'pointer-events-none absolute inset-0 translate-y-3 opacity-0 blur-[1px]'
                )}
              >
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
                  {slide.eyebrow}
                </p>
                <h1 className="mt-4 text-4xl font-semibold uppercase leading-[0.95] tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl xl:text-7xl">
                  {slide.title.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h1>
                {slide.subtitle && (
                  <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-500 sm:text-lg">
                    {slide.subtitle}
                  </p>
                )}

                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <Link
                    href={slide.href}
                    className="group inline-flex items-center gap-2 rounded-md bg-zinc-900 px-7 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-white shadow-lg shadow-zinc-900/10 transition-all duration-300 hover:bg-zinc-800 hover:shadow-xl active:scale-[0.98]"
                  >
                    Shop product
                    <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  {slide.price != null && (
                    <span className="text-sm text-zinc-500">
                      from{' '}
                      <span className="text-base font-semibold text-zinc-900">
                        {formatPrice(slide.price)}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ---- Image (stacked slides, crossfade) — framed in a clean card ---- */}
          <div className="relative order-1 h-72 w-full overflow-hidden rounded-3xl bg-white shadow-xl shadow-zinc-900/5 ring-1 ring-zinc-100 sm:h-96 lg:order-2 lg:h-136">
            {slides.map((slide, i) => (
              <Image
                key={slide.href}
                src={slide.image}
                alt={slide.eyebrow}
                fill
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={cn(
                  'object-cover transition-all duration-700 ease-out',
                  i === index ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
                )}
              />
            ))}
          </div>
        </div>

        {/* Dots */}
        {count > 1 && (
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.href}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === index
                    ? 'w-7 bg-zinc-900'
                    : 'w-1.5 bg-zinc-300 hover:bg-zinc-400'
                )}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}
