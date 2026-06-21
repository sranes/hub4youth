'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  loginStudent,
  registerStudent,
  type AuthActionResult,
} from '@/students/actions'

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? pendingLabel : label}
    </Button>
  )
}

export const LoginForm: React.FC<{ redirectTo: string }> = ({ redirectTo }) => {
  const router = useRouter()
  const [state, action] = useActionState<AuthActionResult | null, FormData>(loginStudent, null)

  useEffect(() => {
    if (state?.ok) {
      router.push(redirectTo)
      router.refresh()
    }
  }, [state, redirectTo, router])

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required placeholder="you@example.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required placeholder="Your password" />
      </div>
      {state && !state.ok && <p className="text-sm text-destructive">{state.error}</p>}
      <SubmitButton label="Log in" pendingLabel="Logging in…" />
      <p className="text-center text-sm text-muted-foreground">
        New here?{' '}
        <Link
          href={`/register?redirect=${encodeURIComponent(redirectTo)}`}
          className="text-primary hover:underline"
        >
          Create an account
        </Link>
      </p>
    </form>
  )
}

export const RegisterForm: React.FC<{ redirectTo: string }> = ({ redirectTo }) => {
  const router = useRouter()
  const [state, action] = useActionState<AuthActionResult | null, FormData>(registerStudent, null)

  useEffect(() => {
    if (state?.ok) {
      router.push(redirectTo)
      router.refresh()
    }
  }, [state, redirectTo, router])

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" required placeholder="Your full name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required placeholder="you@example.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="At least 8 characters"
        />
      </div>
      {state && !state.ok && <p className="text-sm text-destructive">{state.error}</p>}
      <SubmitButton label="Create account" pendingLabel="Creating account…" />
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link
          href={`/login?redirect=${encodeURIComponent(redirectTo)}`}
          className="text-primary hover:underline"
        >
          Log in
        </Link>
      </p>
    </form>
  )
}
