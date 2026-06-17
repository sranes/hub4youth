import Stripe from 'stripe'

import type { CheckoutInput, CheckoutResult, PaymentProvider } from './types'

let client: Stripe | null = null

export const getStripe = (): Stripe => {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('Stripe is not configured (missing STRIPE_SECRET_KEY).')
  }
  if (!client) {
    client = new Stripe(key)
  }
  return client
}

export const stripeProvider: PaymentProvider = {
  name: 'stripe',
  async createCheckout(input: CheckoutInput): Promise<CheckoutResult> {
    const stripe = getStripe()

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: input.customer.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: input.currency.toLowerCase(),
            unit_amount: Math.round(input.amount * 100),
            product_data: {
              name: input.courseTitle,
            },
          },
        },
      ],
      success_url: `${input.successUrl}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: input.cancelUrl,
      metadata: {
        enrollmentId: String(input.enrollmentId),
      },
    })

    if (!session.url) {
      throw new Error('Stripe did not return a checkout URL.')
    }

    return {
      type: 'redirect',
      provider: 'stripe',
      url: session.url,
      providerOrderId: session.id,
    }
  },
}
