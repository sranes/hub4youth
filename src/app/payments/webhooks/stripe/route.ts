import type { NextRequest } from 'next/server'
import type Stripe from 'stripe'

import { getStripe } from '@/payments/stripe'
import { markEnrollmentPaid } from '@/payments/recordPayment'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest): Promise<Response> {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  const signature = req.headers.get('stripe-signature')

  if (!secret || !signature) {
    return new Response('Stripe webhook not configured.', { status: 400 })
  }

  const body = await req.text()

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, signature, secret)
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err)
    return new Response('Invalid signature.', { status: 400 })
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const paymentId =
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id
      await markEnrollmentPaid(session.id, paymentId)
    }
  } catch (err) {
    console.error('Stripe webhook handling failed:', err)
    return new Response('Handler error.', { status: 500 })
  }

  return new Response('ok')
}
