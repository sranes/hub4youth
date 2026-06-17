import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { CheckCircle2, Clock } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

type Args = { searchParams: Promise<{ enrollment?: string }> }

export default async function EnrollSuccessPage({ searchParams }: Args) {
  const { enrollment: id } = await searchParams

  let paid = false
  let courseTitle = ''

  if (id) {
    const payload = await getPayload({ config: configPromise })
    try {
      const doc = await payload.findByID({
        collection: 'enrollments',
        id: Number(id),
        overrideAccess: true,
      })
      paid = doc?.status === 'paid'
      courseTitle = doc?.courseTitle || ''
    } catch {
      // ignore — show the generic processing state
    }
  }

  return (
    <div className="container max-w-xl py-20 text-center lg:py-28">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        {paid ? <CheckCircle2 className="size-7" /> : <Clock className="size-7" />}
      </div>

      {paid ? (
        <>
          <h1 className="mt-6 text-3xl font-medium">You&apos;re enrolled!</h1>
          <p className="mt-3 text-muted-foreground">
            Thank you for enrolling{courseTitle ? ` in ${courseTitle}` : ''}. We&apos;ve emailed your
            confirmation and our team will be in touch with the next steps.
          </p>
        </>
      ) : (
        <>
          <h1 className="mt-6 text-3xl font-medium">Payment received — confirming</h1>
          <p className="mt-3 text-muted-foreground">
            Thanks! We&apos;re confirming your payment with the provider. This usually takes a few
            moments, and you&apos;ll get a confirmation email shortly. You can safely close this
            page.
          </p>
        </>
      )}

      <div className="mt-8 flex justify-center gap-3">
        <Button asChild>
          <Link href="/courses">Browse more courses</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Enrollment confirmed — hub4youth',
  robots: { index: false },
}
