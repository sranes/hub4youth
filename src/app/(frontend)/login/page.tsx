import type { Metadata } from 'next'

import { redirect } from 'next/navigation'
import React from 'react'

import { LoginForm } from '@/components/site/AuthForms'
import { getCurrentStudent } from '@/students/auth'

export const dynamic = 'force-dynamic'

type Args = { searchParams: Promise<{ redirect?: string }> }

// Only allow internal redirect targets (avoid open-redirect via ?redirect=).
function safeRedirect(value?: string): string {
  if (value && value.startsWith('/') && !value.startsWith('//')) return value
  return '/learn'
}

export default async function LoginPage({ searchParams }: Args) {
  const { redirect: rawRedirect } = await searchParams
  const redirectTo = safeRedirect(rawRedirect)

  const student = await getCurrentStudent()
  if (student) redirect(redirectTo)

  return (
    <div className="container max-w-md py-16 lg:py-24">
      <h1 className="text-2xl font-medium">Welcome back</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Log in to access your courses and continue learning.
      </p>
      <div className="mt-8 rounded-xl border border-border p-6">
        <LoginForm redirectTo={redirectTo} />
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Log in — hub4youth',
  robots: { index: false },
}
