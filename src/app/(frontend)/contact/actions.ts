'use server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { sendEnquiryEmails } from '@/email'

export type EnquiryState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

export async function submitEnquiry(
  _prev: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const name = String(formData.get('name') || '').trim()
  const email = String(formData.get('email') || '').trim()
  const phone = String(formData.get('phone') || '').trim()
  const course = String(formData.get('course') || '').trim()
  const message = String(formData.get('message') || '').trim()

  if (!name || !email) {
    return { status: 'error', message: 'Please provide your name and email.' }
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  if (!emailOk) {
    return { status: 'error', message: 'Please enter a valid email address.' }
  }

  try {
    const payload = await getPayload({ config: configPromise })
    await payload.create({
      collection: 'enquiries',
      overrideAccess: true,
      data: {
        name,
        email,
        phone: phone || undefined,
        course: course || undefined,
        message: message || undefined,
        status: 'new',
      },
    })

    // Confirmation to the enquirer + notification to staff (no-ops gracefully
    // without a Resend key — emails are logged to the console instead).
    await sendEnquiryEmails(payload, {
      name,
      email,
      phone: phone || undefined,
      course: course || undefined,
      message: message || undefined,
    })

    return {
      status: 'success',
      message: 'Thanks! We have received your enquiry and will be in touch shortly.',
    }
  } catch (err) {
    console.error('Failed to save enquiry:', err)
    return {
      status: 'error',
      message: 'Something went wrong. Please try again or email us directly.',
    }
  }
}
