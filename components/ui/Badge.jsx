import { cn } from '@/lib/utils'

/** Small pill indicator for "New Arrival", category tags, status, etc. */
export default function Badge({ variant = 'neutral', className, children, ...props }) {
  const variants = {
    neutral: 'bg-zinc-100 text-zinc-600',
    brand: 'bg-brand-600 text-white shadow-sm shadow-brand-900/20',
    soft: 'bg-brand-50 text-brand-700',
    outline: 'border border-zinc-200 text-zinc-600 bg-white/70',
    sale: 'bg-zinc-900 text-white',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium tracking-wide',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
