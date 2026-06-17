const LOCALES: Record<string, string> = {
  INR: 'en-IN',
  USD: 'en-US',
  EUR: 'en-IE',
  GBP: 'en-GB',
}

export const formatPrice = (amount?: number | null, currency = 'INR'): string => {
  if (amount === 0) return 'Free'
  if (amount == null) return ''
  try {
    return new Intl.NumberFormat(LOCALES[currency] || 'en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `${amount}`
  }
}
