import { Suspense } from 'react'
import AuthForm from '@/components/auth/AuthForm'
import Container from '@/components/ui/Container'

export const metadata = { title: 'Sign in' }

export default function LoginPage() {
  return (
    <Container className="flex items-center justify-center py-20">
      <Suspense fallback={null}>
        <AuthForm mode="login" />
      </Suspense>
    </Container>
  )
}
