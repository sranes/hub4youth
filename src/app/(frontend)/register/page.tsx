import type { Metadata } from 'next'

import { redirect } from 'next/navigation'
import React from 'react'

import { RegisterForm } from '@/components/site/AuthForms'
import { getCurrentStudent } from '@/students/auth'

export const dynamic = 'force-dynamic'

type Args = { searchParams: Promise<{ redirect?: string }> }

function safeRedirect(value?: string): string {
  if (value && value.startsWith('/') && !value.startsWith('//')) return value
  return '/learn'
}

export default async function RegisterPage({ searchParams }: Args) {
  const { redirect: rawRedirect } = await searchParams
  const redirectTo = safeRedirect(rawRedirect)

  const student = await getCurrentStudent()
  if (student) redirect(redirectTo)

  return (
    <div className="container max-w-md py-16 lg:py-24">
      <h1 className="text-2xl font-medium">Create your account</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Sign up to enroll and take self-paced courses online.
      </p>
      <div className="mt-8 rounded-xl border border-border p-6">
        <RegisterForm redirectTo={redirectTo} />
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Create account — hub4youth',
  robots: { index: false },
}
