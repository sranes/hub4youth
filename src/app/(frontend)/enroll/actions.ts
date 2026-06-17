'use server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { getPaymentProvider, isPaymentEnabled, type CheckoutResult } from '@/payments'
import { getServerSideURL } from '@/utilities/getURL'

type FreeResult = { type: 'free' }

export type CheckoutActionResult =
  | { ok: true; enrollmentId: number; result: CheckoutResult | FreeResult }
  | { ok: false; error: string }

export async function createCheckout(
  _prev: CheckoutActionResult | null,
  formData: FormData,
): Promise<CheckoutActionResult> {
  const courseSlug = String(formData.get('courseSlug') || '').trim()
  const name = String(formData.get('name') || '').trim()
  const email = String(formData.get('email') || '').trim()
  const phone = String(formData.get('phone') || '').trim()

  if (!courseSlug) return { ok: false, error: 'Missing course.' }
  if (!name || !email) return { ok: false, error: 'Please provide your name and email.' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Please enter a valid email address.' }
  }

  const payload = await getPayload({ config: configPromise })

  // Load the course server-side so price/currency are trusted (never from the client).
  const found = await payload.find({
    collection: 'courses',
    where: { slug: { equals: courseSlug } },
    limit: 1,
    overrideAccess: false,
  })
  const course = found.docs[0]
  if (!course) return { ok: false, error: 'Course not found.' }

  const amount = course.price ?? 0
  const currency = course.currency || 'INR'

  // Create a pending enrollment first so we always have a record.
  const enrollment = await payload.create({
    collection: 'enrollments',
    overrideAccess: true,
    data: {
      course: course.id,
      courseTitle: course.title,
      name,
      email,
      phone: phone || undefined,
      amount,
      currency,
      status: 'pending',
    },
  })

  // Free courses skip payment entirely.
  if (amount <= 0) {
    await payload.update({
      collection: 'enrollments',
      id: enrollment.id,
      overrideAccess: true,
      data: { status: 'paid' },
    })
    return { ok: true, enrollmentId: enrollment.id, result: { type: 'free' } }
  }

  if (!isPaymentEnabled()) {
    return {
      ok: false,
      error:
        'Online payment is not available yet. Please use the contact form and we will help you enroll.',
    }
  }

  const provider = getPaymentProvider(currency)
  if (!provider) {
    return { ok: false, error: `No payment provider is configured for ${currency}.` }
  }

  const base = getServerSideURL()

  try {
    const result = await provider.createCheckout({
      enrollmentId: enrollment.id,
      courseTitle: course.title,
      amount,
      currency,
      customer: { name, email, phone: phone || undefined },
      successUrl: `${base}/enroll/success?enrollment=${enrollment.id}`,
      cancelUrl: `${base}/enroll/cancelled?enrollment=${enrollment.id}`,
    })

    await payload.update({
      collection: 'enrollments',
      id: enrollment.id,
      overrideAccess: true,
      data: {
        provider: provider.name,
        providerOrderId: result.providerOrderId,
      },
    })

    return { ok: true, enrollmentId: enrollment.id, result }
  } catch (err) {
    console.error('Checkout creation failed:', err)
    await payload.update({
      collection: 'enrollments',
      id: enrollment.id,
      overrideAccess: true,
      data: { status: 'failed' },
    })
    return { ok: false, error: 'Could not start checkout. Please try again.' }
  }
}
