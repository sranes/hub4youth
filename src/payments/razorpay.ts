import Razorpay from 'razorpay'

import type { CheckoutInput, CheckoutResult, PaymentProvider } from './types'

let client: Razorpay | null = null

export const getRazorpay = (): Razorpay => {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !keySecret) {
    throw new Error('Razorpay is not configured (missing RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET).')
  }
  if (!client) {
    client = new Razorpay({ key_id: keyId, key_secret: keySecret })
  }
  return client
}

export const razorpayProvider: PaymentProvider = {
  name: 'razorpay',
  async createCheckout(input: CheckoutInput): Promise<CheckoutResult> {
    const rzp = getRazorpay()

    const order = await rzp.orders.create({
      amount: Math.round(input.amount * 100),
      currency: input.currency,
      receipt: `enr_${input.enrollmentId}`,
      notes: {
        enrollmentId: String(input.enrollmentId),
        courseTitle: input.courseTitle,
      },
    })

    return {
      type: 'razorpay',
      provider: 'razorpay',
      orderId: order.id,
      keyId: process.env.RAZORPAY_KEY_ID as string,
      amount: Number(order.amount),
      currency: String(order.currency),
      providerOrderId: order.id,
    }
  },
}
