'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useActionState, useEffect, useState, useTransition } from 'react'
import { useFormStatus } from 'react-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  loginStudent,
  registerStudent,
  requestPasswordReset,
  resendTwoFactorCode,
  resetPassword,
  verifyTwoFactorLogin,
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

function ErrorText({ state }: { state: AuthActionResult | null }) {
  if (!state || state.ok) return null
  return <p className="text-sm text-destructive">{state.error}</p>
}

// --- Login (with optional email-OTP second step) --------------------------
export const LoginForm: React.FC<{ redirectTo: string }> = ({ redirectTo }) => {
  const router = useRouter()
  const [state, action] = useActionState<AuthActionResult | null, FormData>(loginStudent, null)

  useEffect(() => {
    if (state?.ok && !state.twoFactor) {
      router.push(redirectTo)
      router.refresh()
    }
  }, [state, redirectTo, router])

  if (state?.ok && state.twoFactor) {
    return <TwoFactorForm redirectTo={redirectTo} />
  }

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required placeholder="you@example.com" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link href="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <Input id="password" name="password" type="password" required placeholder="Your password" />
      </div>
      <ErrorText state={state} />
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

const TwoFactorForm: React.FC<{ redirectTo: string }> = ({ redirectTo }) => {
  const router = useRouter()
  const [state, action] = useActionState<AuthActionResult | null, FormData>(
    verifyTwoFactorLogin,
    null,
  )
  const [resent, setResent] = useState(false)
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    if (state?.ok) {
      router.push(redirectTo)
      router.refresh()
    }
  }, [state, redirectTo, router])

  const resend = () => {
    setResent(false)
    startTransition(async () => {
      const res = await resendTwoFactorCode()
      if (res.ok) setResent(true)
    })
  }

  return (
    <form action={action} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        We emailed you a 6-digit code. Enter it below to finish logging in.
      </p>
      <div className="space-y-2">
        <Label htmlFor="code">Verification code</Label>
        <Input
          id="code"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          required
          placeholder="123456"
        />
      </div>
      <ErrorText state={state} />
      <SubmitButton label="Verify & log in" pendingLabel="Verifying…" />
      <p className="text-center text-sm text-muted-foreground">
        Didn&apos;t get it?{' '}
        <button
          type="button"
          onClick={resend}
          disabled={pending}
          className="text-primary hover:underline disabled:opacity-50"
        >
          {resent ? 'Code resent' : 'Resend code'}
        </button>
      </p>
    </form>
  )
}

// --- Register --------------------------------------------------------------
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
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input id="phone" name="phone" placeholder="For account updates" />
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
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Repeat password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          placeholder="Re-enter your password"
        />
      </div>
      <ErrorText state={state} />
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

// --- Forgot password -------------------------------------------------------
export const ForgotPasswordForm: React.FC = () => {
  const [state, action] = useActionState<AuthActionResult | null, FormData>(
    requestPasswordReset,
    null,
  )

  if (state?.ok) {
    return (
      <p className="text-sm text-muted-foreground">
        If an account exists for that email, we&apos;ve sent a password-reset link. Check your inbox
        (and spam). The link expires soon, so use it promptly.
      </p>
    )
  }

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required placeholder="you@example.com" />
      </div>
      <ErrorText state={state} />
      <SubmitButton label="Send reset link" pendingLabel="Sending…" />
      <p className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="text-primary hover:underline">
          Back to log in
        </Link>
      </p>
    </form>
  )
}

// --- Reset password --------------------------------------------------------
export const ResetPasswordForm: React.FC<{ token: string; redirectTo: string }> = ({
  token,
  redirectTo,
}) => {
  const router = useRouter()
  const [state, action] = useActionState<AuthActionResult | null, FormData>(resetPassword, null)

  useEffect(() => {
    if (state?.ok) {
      router.push(redirectTo)
      router.refresh()
    }
  }, [state, redirectTo, router])

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <div className="space-y-2">
        <Label htmlFor="password">New password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="At least 8 characters"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Repeat new password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          placeholder="Re-enter your new password"
        />
      </div>
      <ErrorText state={state} />
      <SubmitButton label="Set new password" pendingLabel="Saving…" />
    </form>
  )
}
