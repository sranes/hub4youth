import type { Metadata } from 'next'

import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

import { Button } from '@/components/ui/button'
import { TwoFactorToggle } from '@/components/site/TwoFactorToggle'
import { getCurrentStudent } from '@/students/auth'

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
  const student = await getCurrentStudent()
  if (!student) redirect('/login?redirect=/account')

  return (
    <div className="container max-w-2xl py-12 lg:py-16">
      <h1 className="text-2xl font-medium sm:text-3xl">Account</h1>
      <p className="mt-2 text-muted-foreground">Manage your profile and security settings.</p>

      <section className="mt-8 rounded-xl border border-border p-6">
        <h2 className="text-lg font-medium">Profile</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Name</dt>
            <dd className="font-medium">{student.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-medium">{student.email}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Phone</dt>
            <dd className="font-medium">{student.phone || '—'}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-6 rounded-xl border border-border p-6">
        <h2 className="text-lg font-medium">Security</h2>
        <div className="mt-4">
          <TwoFactorToggle initialEnabled={Boolean(student.twoFactorEnabled)} />
        </div>
      </section>

      <div className="mt-6">
        <Button asChild variant="outline">
          <Link href="/learn">Back to my learning</Link>
        </Button>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Account — hub4youth',
  robots: { index: false },
}
