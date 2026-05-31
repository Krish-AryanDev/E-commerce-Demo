import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Container from '@/components/ui/Container'
import { buttonVariants } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center justify-center py-32 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
        404
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-zinc-500">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link href="/" className={`group mt-8 ${buttonVariants({ size: 'lg' })}`}>
        <ArrowLeft className="size-4.5 transition-transform duration-300 group-hover:-translate-x-1" />
        Back home
      </Link>
    </Container>
  )
}
