'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function AuthForm({ mode }) {
  const isSignup = mode === 'signup'
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  const { supabase, isConfigured } = useAuth()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState({ type: null, message: '' })
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus({ type: null, message: '' })

    if (!isConfigured || !supabase) {
      setStatus({
        type: 'error',
        message:
          'Supabase isn’t configured yet. Add your keys to .env.local to enable accounts.',
      })
      return
    }

    setSubmitting(true)
    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        })
        if (error) throw error

        // If email confirmation is on, there's no session yet.
        if (!data.session) {
          setStatus({
            type: 'success',
            message: 'Check your inbox to confirm your email, then sign in.',
          })
          setSubmitting(false)
          return
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      }

      router.push(redirect)
      router.refresh()
    } catch (err) {
      setStatus({ type: 'error', message: err.message ?? 'Something went wrong.' })
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="text-center">
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight text-zinc-900"
        >
          NOVA<span className="text-brand-600">.</span>
        </Link>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-zinc-900">
          {isSignup ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          {isSignup
            ? 'Join NOVA to track orders and sync your bag.'
            : 'Sign in to continue to your account.'}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm sm:p-8"
      >
        {status.type && (
          <div
            className={`mb-5 flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm ${
              status.type === 'error'
                ? 'bg-red-50 text-red-700'
                : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            {status.type === 'error' ? (
              <AlertCircle className="mt-0.5 size-4.5 shrink-0" />
            ) : (
              <CheckCircle2 className="mt-0.5 size-4.5 shrink-0" />
            )}
            <span>{status.message}</span>
          </div>
        )}

        <div className="space-y-4">
          {isSignup && (
            <div>
              <label
                htmlFor="fullName"
                className="mb-1.5 block text-sm font-medium text-zinc-700"
              >
                Full name
              </label>
              <Input
                id="fullName"
                icon={User}
                type="text"
                autoComplete="name"
                placeholder="Ada Lovelace"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-zinc-700"
            >
              Email
            </label>
            <Input
              id="email"
              icon={Mail}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-zinc-700"
            >
              Password
            </label>
            <Input
              id="password"
              icon={Lock}
              type="password"
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          fullWidth
          disabled={submitting}
          className="mt-6"
        >
          {submitting
            ? 'Please wait…'
            : isSignup
              ? 'Create account'
              : 'Sign in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        {isSignup ? 'Already have an account? ' : "Don't have an account? "}
        <Link
          href={isSignup ? '/login' : '/signup'}
          className="font-medium text-brand-600 transition-colors hover:text-brand-700"
        >
          {isSignup ? 'Sign in' : 'Create one'}
        </Link>
      </p>
    </div>
  )
}
