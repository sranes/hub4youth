export type PaymentProviderName = 'razorpay' | 'stripe'

export interface CheckoutInput {
  enrollmentId: string | number
  courseTitle: string
  /** Amount in the major currency unit (e.g. rupees / dollars, not paise / cents). */
  amount: number
  currency: string
  customer: { name: string; email: string; phone?: string }
  successUrl: string
  cancelUrl: string
}

/**
 * Stripe uses a hosted redirect; Razorpay opens a client-side modal. The client
 * branches on `type` to either navigate to `url` or launch the Razorpay checkout.
 */
export type CheckoutResult =
  | {
      type: 'redirect'
      provider: 'stripe'
      url: string
      providerOrderId: string
    }
  | {
      type: 'razorpay'
      provider: 'razorpay'
      orderId: string
      keyId: string
      /** Amount in the minor unit (paise) as returned by Razorpay. */
      amount: number
      currency: string
      providerOrderId: string
    }

export interface PaymentProvider {
  name: PaymentProviderName
  createCheckout(input: CheckoutInput): Promise<CheckoutResult>
}
