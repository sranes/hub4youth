import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/button'
import { isPaymentEnabled } from '@/payments'
import { formatPrice } from '@/utilities/formatPrice'
import { CheckoutForm } from './CheckoutForm'

export const dynamic = 'force-dynamic'

type Args = { searchParams: Promise<{ course?: string }> }

export default async function EnrollPage({ searchParams }: Args) {
  const { course: slug } = await searchParams
  if (!slug) notFound()

  const payload = await getPayload({ config: configPromise })
  const found = await payload.find({
    collection: 'courses',
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: false,
  })
  const course = found.docs[0]
  if (!course) notFound()

  const amount = course.price ?? 0
  const currency = course.currency || 'INR'
  const amountLabel = formatPrice(amount, currency)
  const paymentReady = amount <= 0 || isPaymentEnabled()

  return (
    <div className="container max-w-4xl py-12 lg:py-16">
      <div className="grid gap-10 lg:grid-cols-5">
        {/* Order summary */}
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-medium">Enroll</h1>
          <div className="mt-5 rounded-xl border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">You&apos;re enrolling in</p>
            <h2 className="mt-1 text-lg font-medium">{course.title}</h2>
            {course.duration && (
              <p className="mt-1 text-sm text-muted-foreground">{course.duration}</p>
            )}
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-xl font-medium">{amountLabel}</span>
            </div>
          </div>
          <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
            {['Secure payment', 'Email confirmation', 'Advisor support before you start'].map(
              (item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary" /> {item}
                </li>
              ),
            )}
          </ul>
        </div>

        {/* Checkout */}
        <div className="lg:col-span-3">
          <div className="rounded-xl border border-border p-6">
            {paymentReady ? (
              <CheckoutForm
                courseSlug={slug}
                courseTitle={course.title}
                amountLabel={amountLabel}
              />
            ) : (
              <div className="space-y-4">
                <h2 className="text-lg font-medium">Online payment coming soon</h2>
                <p className="text-sm text-muted-foreground">
                  We&apos;re finalising online payments. In the meantime, send an enquiry and an
                  advisor will help you enroll for{' '}
                  <span className="text-foreground">{course.title}</span>.
                </p>
                <Button asChild className="w-full">
                  <Link href={`/contact?course=${encodeURIComponent(course.title)}`}>
                    Enquire to enroll
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Enroll — hub4youth',
  robots: { index: false },
}
