'use client'

import { useRouter } from 'next/navigation'
import { Check, ShieldCheck } from 'lucide-react'
import React, { useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { setTwoFactorEnabled } from '@/students/actions'

export const TwoFactorToggle: React.FC<{ initialEnabled: boolean }> = ({ initialEnabled }) => {
  const router = useRouter()
  const [enabled, setEnabled] = useState(initialEnabled)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const toggle = () => {
    const next = !enabled
    setError(null)
    setEnabled(next) // optimistic
    startTransition(async () => {
      const res = await setTwoFactorEnabled(next)
      if (!res.ok) {
        setEnabled(!next)
        setError(res.error)
        return
      }
      router.refresh()
    })
  }

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 flex size-9 items-center justify-center rounded-lg ${
            enabled ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
          }`}
        >
          {enabled ? <ShieldCheck className="size-5" /> : <Check className="size-5" />}
        </span>
        <div>
          <p className="font-medium">Two-factor authentication</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {enabled
              ? 'On — we email a 6-digit code each time you log in.'
              : 'Off — add an emailed code at login for extra security.'}
          </p>
          {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
        </div>
      </div>
      <Button
        type="button"
        variant={enabled ? 'outline' : 'default'}
        onClick={toggle}
        disabled={pending}
      >
        {enabled ? 'Turn off' : 'Turn on'}
      </Button>
    </div>
  )
}
