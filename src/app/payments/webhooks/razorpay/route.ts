import type { NextRequest } from 'next/server'
import crypto from 'crypto'

import { markEnrollmentPaid } from '@/payments/recordPayment'

export const dynamic = 'force-dynamic'

type RazorpayWebhookBody = {
  event: string
  payload?: {
    payment?: {
      entity?: { id?: string; order_id?: string }
    }
    order?: {
      entity?: { id?: string }
    }
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  const signature = req.headers.get('x-razorpay-signature')

  if (!secret || !signature) {
    return new Response('Razorpay webhook not configured.', { status: 400 })
  }

  const body = await req.text()

  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex')
  const valid =
    expected.length === signature.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))

  if (!valid) {
    return new Response('Invalid signature.', { status: 400 })
  }

  try {
    const event = JSON.parse(body) as RazorpayWebhookBody

    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const payment = event.payload?.payment?.entity
      const orderId = payment?.order_id || event.payload?.order?.entity?.id
      if (orderId) {
        await markEnrollmentPaid(orderId, payment?.id)
      }
    }
  } catch (err) {
    console.error('Razorpay webhook handling failed:', err)
    return new Response('Handler error.', { status: 500 })
  }

  return new Response('ok')
}
