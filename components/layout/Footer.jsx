import Link from 'next/link'
import Container from '@/components/ui/Container'

const STATIC_COLUMNS = [
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Newsroom', href: '#' },
      { label: 'Sustainability', href: '#' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '#' },
      { label: 'Shipping', href: '#' },
      { label: 'Returns', href: '#' },
      { label: 'Warranty', href: '#' },
    ],
  },
]

export default function Footer({ categories = [] }) {
  const columns = [
    {
      title: 'Shop',
      links: categories.map((c) => ({
        label: c.name,
        href: `/store?category=${c.slug}`,
      })),
    },
    ...STATIC_COLUMNS,
  ]

  return (
    <footer className="mt-24 border-t border-zinc-200 bg-zinc-50">
      <Container className="py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-12">
          <div className="col-span-2 md:col-span-4">
            <Link
              href="/"
              className="text-xl font-extrabold tracking-tight text-zinc-900"
            >
              NOVA<span className="text-brand-600">.</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-500">
              Premium tech, reimagined. Designed in California, engineered for
              the future.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="md:col-span-2">
              <h3 className="text-sm font-semibold text-zinc-900">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-500 transition-colors duration-300 hover:text-zinc-900"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 md:col-span-2">
            <h3 className="text-sm font-semibold text-zinc-900">Stay in loop</h3>
            <p className="mt-4 text-sm text-zinc-500">
              New drops, no spam.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-zinc-200 pt-8 text-sm text-zinc-500 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} NOVA Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="transition-colors duration-300 hover:text-zinc-900">
              Privacy
            </Link>
            <Link href="#" className="transition-colors duration-300 hover:text-zinc-900">
              Terms
            </Link>
            <Link href="#" className="transition-colors duration-300 hover:text-zinc-900">
              Cookies
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
