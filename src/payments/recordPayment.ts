import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { sendEnrollmentConfirmation } from '@/email'

/**
 * Mark the enrollment matching a provider order id as paid (idempotent).
 * Returns true if a record was found and updated.
 */
export async function markEnrollmentPaid(
  providerOrderId: string,
  providerPaymentId?: string,
): Promise<boolean> {
  if (!providerOrderId) return false

  const payload = await getPayload({ config: configPromise })

  const found = await payload.find({
    collection: 'enrollments',
    where: { providerOrderId: { equals: providerOrderId } },
    limit: 1,
    overrideAccess: true,
  })

  const enrollment = found.docs[0]
  if (!enrollment) return false

  if (enrollment.status === 'paid') return true

  await payload.update({
    collection: 'enrollments',
    id: enrollment.id,
    overrideAccess: true,
    data: {
      status: 'paid',
      providerPaymentId: providerPaymentId || enrollment.providerPaymentId,
    },
  })

  // Confirmation to the customer + notification to staff.
  await sendEnrollmentConfirmation(payload, {
    name: enrollment.name,
    email: enrollment.email,
    courseTitle: enrollment.courseTitle || 'your course',
    amount: enrollment.amount,
    currency: enrollment.currency || 'INR',
  })

  return true
}
