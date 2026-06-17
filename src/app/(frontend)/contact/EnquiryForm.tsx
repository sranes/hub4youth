'use client'

import { CheckCircle2 } from 'lucide-react'
import React, { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { submitEnquiry, type EnquiryState } from './actions'

const initialState: EnquiryState = { status: 'idle' }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? 'Sending…' : 'Send enquiry'}
    </Button>
  )
}

export const EnquiryForm: React.FC<{ defaultCourse?: string }> = ({ defaultCourse }) => {
  const [state, formAction] = useActionState(submitEnquiry, initialState)

  if (state.status === 'success') {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <CheckCircle2 className="mx-auto size-10 text-primary" />
        <h2 className="mt-4 text-xl font-medium">Enquiry received</h2>
        <p className="mt-2 text-muted-foreground">{state.message}</p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" name="name" required placeholder="Your full name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" name="email" type="email" required placeholder="you@example.com" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" placeholder="Optional" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="course">Course of interest</Label>
          <Input id="course" name="course" defaultValue={defaultCourse} placeholder="Optional" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Tell us what you're looking for…"
        />
      </div>

      {state.status === 'error' && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <SubmitButton />
      <p className="text-center text-xs text-muted-foreground">
        We&apos;ll only use your details to respond to your enquiry.
      </p>
    </form>
  )
}
