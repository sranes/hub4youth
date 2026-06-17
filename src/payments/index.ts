import type { PaymentProvider, PaymentProviderName } from './types'
import { razorpayProvider } from './razorpay'
import { stripeProvider } from './stripe'

export * from './types'

const hasRazorpay = (): boolean =>
  Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)

const hasStripe = (): boolean => Boolean(process.env.STRIPE_SECRET_KEY)

/** True when at least one provider has credentials configured. */
export const isPaymentEnabled = (): boolean => hasRazorpay() || hasStripe()

/**
 * Decide which provider to use for a given currency, honouring PAYMENT_PROVIDER.
 * 'auto' routes INR to Razorpay (if configured) and everything else to Stripe,
 * with sensible fallbacks. Returns null when nothing usable is configured.
 */
export const resolveProviderName = (currency: string): PaymentProviderName | null => {
  const pref = (process.env.PAYMENT_PROVIDER || 'auto').toLowerCase()

  if (pref === 'razorpay') return hasRazorpay() ? 'razorpay' : null
  if (pref === 'stripe') return hasStripe() ? 'stripe' : null

  // auto
  if (currency.toUpperCase() === 'INR' && hasRazorpay()) return 'razorpay'
  if (hasStripe()) return 'stripe'
  if (hasRazorpay()) return 'razorpay'
  return null
}

export const getPaymentProvider = (currency: string): PaymentProvider | null => {
  const name = resolveProviderName(currency)
  if (name === 'razorpay') return razorpayProvider
  if (name === 'stripe') return stripeProvider
  return null
}
