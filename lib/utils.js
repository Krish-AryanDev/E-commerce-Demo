/** Join class names, dropping falsy values. A tiny `clsx` stand-in. */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

/** Format a number as USD currency. */
export function formatPrice(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}
