import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Compact 5-star rating display with optional review count. */
export default function Rating({ value = 0, reviews, size = 'sm', className }) {
  const full = Math.round(value)
  const starSize = size === 'sm' ? 'size-3.5' : 'size-4'

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              starSize,
              i < full
                ? 'fill-amber-400 text-amber-400'
                : 'fill-zinc-200 text-zinc-200'
            )}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-zinc-500">
        {value.toFixed(1)}
        {reviews != null && (
          <span className="text-zinc-400"> ({reviews.toLocaleString()})</span>
        )}
      </span>
    </div>
  )
}
