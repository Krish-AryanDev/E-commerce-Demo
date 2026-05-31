import { cn } from '@/lib/utils'

/**
 * Text input with an optional leading icon (a Lucide icon element).
 * Forwards a ref so it can be focused programmatically (e.g. search bar).
 */
export default function Input({ icon: Icon, className, wrapperClassName, ...props }) {
  return (
    <div className={cn('relative', wrapperClassName)}>
      {Icon ? (
        <Icon
          className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-zinc-400"
          aria-hidden="true"
        />
      ) : null}
      <input
        className={cn(
          'h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-zinc-900 placeholder:text-zinc-400',
          'transition-all duration-300 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-600/10',
          Icon ? 'pl-11 pr-4' : 'px-4',
          className
        )}
        {...props}
      />
    </div>
  )
}
