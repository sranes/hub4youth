import type { Metadata } from 'next'

import React from 'react'

import { ForgotPasswordForm } from '@/components/site/AuthForms'

export const dynamic = 'force-dynamic'

export default function ForgotPasswordPage() {
  return (
    <div className="container max-w-md py-16 lg:py-24">
      <h1 className="text-2xl font-medium">Forgot your password?</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Enter your email and we&apos;ll send you a link to reset it.
      </p>
      <div className="mt-8 rounded-xl border border-border p-6">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Forgot password — hub4youth',
  robots: { index: false },
}
