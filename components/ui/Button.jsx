import { cn } from '@/lib/utils'

/**
 * Button styling is exported as a function so links (next/link <Link>) and
 * native <button>s can share the exact same visual language.
 */
export function buttonVariants({ variant = 'primary', size = 'md', fullWidth = false } = {}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-xl whitespace-nowrap select-none transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/40 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]'

  const variants = {
    primary:
      'bg-brand-600 text-white shadow-lg shadow-brand-900/10 hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-900/15',
    secondary:
      'bg-zinc-100 text-zinc-900 hover:bg-zinc-200/80 border border-zinc-200/70',
    outline:
      'border border-zinc-300 text-zinc-900 bg-white hover:bg-zinc-50 hover:border-zinc-400',
    ghost: 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900',
    dark: 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-900/10',
  }

  const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-5 text-sm',
    lg: 'h-13 px-7 text-base py-3.5',
  }

  return cn(base, variants[variant], sizes[size], fullWidth && 'w-full')
}

export default function Button({
  variant,
  size,
  fullWidth,
  className,
  children,
  ...props
}) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    >
      {children}
    </button>
  )
}
