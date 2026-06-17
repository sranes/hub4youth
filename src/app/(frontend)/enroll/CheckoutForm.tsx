'use client'

import { useRouter } from 'next/navigation'
import React, { useActionState, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createCheckout, type CheckoutActionResult } from './actions'

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void }
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

function SubmitButton({ amountLabel }: { amountLabel: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? 'Starting checkout…' : `Pay ${amountLabel} & enroll`}
    </Button>
  )
}

type Props = {
  courseSlug: string
  courseTitle: string
  amountLabel: string
}

export const CheckoutForm: React.FC<Props> = ({ courseSlug, courseTitle, amountLabel }) => {
  const router = useRouter()
  const [state, formAction] = useActionState<CheckoutActionResult | null, FormData>(
    createCheckout,
    null,
  )
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [handling, setHandling] = useState(false)

  useEffect(() => {
    if (!state || !state.ok) return
    const { result, enrollmentId } = state

    if (result.type === 'free') {
      router.push(`/enroll/success?enrollment=${enrollmentId}`)
      return
    }

    if (result.type === 'redirect') {
      setHandling(true)
      window.location.href = result.url
      return
    }

    if (result.type === 'razorpay') {
      setHandling(true)
      loadRazorpayScript().then((ok) => {
        if (!ok || !window.Razorpay) {
          setHandling(false)
          return
        }
        const rzp = new window.Razorpay({
          key: result.keyId,
          amount: result.amount,
          currency: result.currency,
          order_id: result.orderId,
          name: 'hub4youth',
          description: courseTitle,
          prefill: { name, email, contact: phone },
          theme: { color: '#534AB7' },
          handler: () => {
            window.location.href = `/enroll/success?enrollment=${enrollmentId}`
          },
          modal: {
            ondismiss: () => {
              window.location.href = `/enroll/cancelled?enrollment=${enrollmentId}`
            },
          },
        })
        rzp.open()
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="courseSlug" value={courseSlug} />

      <div className="space-y-2">
        <Label htmlFor="name">Full name *</Label>
        <Input
          id="name"
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="For payment updates"
        />
      </div>

      {state && !state.ok && <p className="text-sm text-destructive">{state.error}</p>}
      {handling && (
        <p className="text-sm text-muted-foreground">Redirecting you to secure payment…</p>
      )}

      <SubmitButton amountLabel={amountLabel} />
      <p className="text-center text-xs text-muted-foreground">
        Payments are processed securely by our payment provider. You&apos;ll receive a confirmation
        by email.
      </p>
    </form>
  )
}
