'use server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { getPaymentProvider, isPaymentEnabled, type CheckoutResult } from '@/payments'
import { getServerSideURL } from '@/utilities/getURL'
import { getCurrentStudent } from '@/students/auth'
import { createAndLoginStudent, findStudentByEmail } from '@/students/session'

type FreeResult = { type: 'free' }

export type CheckoutActionResult =
  | { ok: true; enrollmentId: number; courseSlug: string; result: CheckoutResult | FreeResult }
  | { ok: false; error: string; code?: 'ACCOUNT_EXISTS' }

export async function createCheckout(
  _prev: CheckoutActionResult | null,
  formData: FormData,
): Promise<CheckoutActionResult> {
  const courseSlug = String(formData.get('courseSlug') || '').trim()
  const formName = String(formData.get('name') || '').trim()
  const formEmail = String(formData.get('email') || '')
    .trim()
    .toLowerCase()
  const phone = String(formData.get('phone') || '').trim()
  const password = String(formData.get('password') || '')

  if (!courseSlug) return { ok: false, error: 'Missing course.' }

  // A learning account is required so the student can take the course on-site.
  // Use the logged-in student if present, otherwise create the account now.
  let student = await getCurrentStudent()

  if (!student) {
    if (!formName || !formEmail) {
      return { ok: false, error: 'Please provide your name and email.' }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail)) {
      return { ok: false, error: 'Please enter a valid email address.' }
    }
    if (password.length < 8) {
      return {
        ok: false,
        error: 'Choose a password (at least 8 characters) to create your learning account.',
      }
    }
    if (await findStudentByEmail(formEmail)) {
      return {
        ok: false,
        error: 'An account with this email already exists. Please log in to continue.',
        code: 'ACCOUNT_EXISTS',
      }
    }
    try {
      student = await createAndLoginStudent({ name: formName, email: formEmail, password })
    } catch {
      return { ok: false, error: 'Could not create your account. Please try again.' }
    }
  }

  const name = student.name || formName
  const email = student.email

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
      student: student.id,
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
    return { ok: true, enrollmentId: enrollment.id, courseSlug, result: { type: 'free' } }
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

    return { ok: true, enrollmentId: enrollment.id, courseSlug, result }
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
