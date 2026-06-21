import type { Metadata } from 'next'

import Link from 'next/link'
import React from 'react'

import { ResetPasswordForm } from '@/components/site/AuthForms'

export const dynamic = 'force-dynamic'

type Args = { searchParams: Promise<{ token?: string }> }

export default async function ResetPasswordPage({ searchParams }: Args) {
  const { token } = await searchParams

  return (
    <div className="container max-w-md py-16 lg:py-24">
      <h1 className="text-2xl font-medium">Choose a new password</h1>
      {token ? (
        <>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter and confirm your new password below.
          </p>
          <div className="mt-8 rounded-xl border border-border p-6">
            <ResetPasswordForm token={token} redirectTo="/learn" />
          </div>
        </>
      ) : (
        <div className="mt-8 rounded-xl border border-border p-6 text-sm text-muted-foreground">
          This reset link is missing its token. Please{' '}
          <Link href="/forgot-password" className="text-primary hover:underline">
            request a new reset link
          </Link>
          .
        </div>
      )}
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Reset password — hub4youth',
  robots: { index: false },
}
