'use server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cookies } from 'next/headers'

import { sendPasswordReset } from '@/email'
import { getServerSideURL } from '@/utilities/getURL'
import { STUDENT_COOKIE, getCurrentStudent } from './auth'
import {
  createAndLoginStudent,
  findStudentByEmail,
  setSessionCookie,
  verifyCredentials,
} from './session'
import {
  TWO_FACTOR_COOKIE,
  completeEmailChallenge,
  resendEmailChallenge,
  startEmailChallenge,
} from './twoFactor'

export type AuthActionResult =
  | { ok: true; twoFactor?: boolean }
  | { ok: false; error: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const RESET_EXP_MIN = Number(process.env.PASSWORD_RESET_EXPIRATION_MINUTES || 60)

export async function registerStudent(
  _prev: AuthActionResult | null,
  formData: FormData,
): Promise<AuthActionResult> {
  const name = String(formData.get('name') || '').trim()
  const email = String(formData.get('email') || '')
    .trim()
    .toLowerCase()
  const password = String(formData.get('password') || '')
  const confirmPassword = String(formData.get('confirmPassword') || '')
  const phone = String(formData.get('phone') || '').trim()

  if (!name) return { ok: false, error: 'Please enter your name.' }
  if (!EMAIL_RE.test(email)) return { ok: false, error: 'Please enter a valid email address.' }
  if (password.length < 8) {
    return { ok: false, error: 'Password must be at least 8 characters.' }
  }
  if (password !== confirmPassword) {
    return { ok: false, error: 'Passwords do not match.' }
  }

  if (await findStudentByEmail(email)) {
    return { ok: false, error: 'An account with this email already exists. Please log in.' }
  }

  try {
    await createAndLoginStudent({ name, email, password, phone: phone || undefined })
    return { ok: true }
  } catch {
    return { ok: false, error: 'Could not create your account. Please try again.' }
  }
}

export async function loginStudent(
  _prev: AuthActionResult | null,
  formData: FormData,
): Promise<AuthActionResult> {
  const email = String(formData.get('email') || '')
    .trim()
    .toLowerCase()
  const password = String(formData.get('password') || '')

  if (!EMAIL_RE.test(email) || !password) {
    return { ok: false, error: 'Please enter your email and password.' }
  }

  let creds
  try {
    creds = await verifyCredentials(email, password)
  } catch {
    return { ok: false, error: 'Invalid email or password.' }
  }

  if (creds.user.twoFactorEnabled) {
    await startEmailChallenge({
      studentId: creds.user.id,
      name: creds.user.name,
      email: creds.user.email,
      pendingToken: creds.token,
    })
    return { ok: true, twoFactor: true }
  }

  await setSessionCookie(creds.token, creds.exp)
  return { ok: true }
}

export async function verifyTwoFactorLogin(
  _prev: AuthActionResult | null,
  formData: FormData,
): Promise<AuthActionResult> {
  const code = String(formData.get('code') || '').trim()
  if (!/^\d{6}$/.test(code)) return { ok: false, error: 'Enter the 6-digit code.' }
  const res = await completeEmailChallenge(code)
  return res.ok ? { ok: true } : { ok: false, error: res.error || 'Verification failed.' }
}

export async function resendTwoFactorCode(): Promise<AuthActionResult> {
  const res = await resendEmailChallenge()
  return res.ok ? { ok: true } : { ok: false, error: res.error || 'Could not resend the code.' }
}

export async function requestPasswordReset(
  _prev: AuthActionResult | null,
  formData: FormData,
): Promise<AuthActionResult> {
  const email = String(formData.get('email') || '')
    .trim()
    .toLowerCase()
  if (!EMAIL_RE.test(email)) return { ok: false, error: 'Please enter a valid email address.' }

  // Always report success so we never reveal whether an email is registered.
  try {
    const student = await findStudentByEmail(email)
    if (student) {
      const payload = await getPayload({ config: configPromise })
      const token = await payload.forgotPassword({
        collection: 'students',
        data: { email },
        disableEmail: true,
        overrideAccess: true,
      })
      if (token) {
        await sendPasswordReset(payload, {
          name: student.name,
          email: student.email,
          resetUrl: `${getServerSideURL()}/reset-password?token=${token}`,
          expiresMinutes: RESET_EXP_MIN,
        })
      }
    }
  } catch {
    // swallow — do not leak whether the account exists
  }
  return { ok: true }
}

export async function resetPassword(
  _prev: AuthActionResult | null,
  formData: FormData,
): Promise<AuthActionResult> {
  const token = String(formData.get('token') || '').trim()
  const password = String(formData.get('password') || '')
  const confirmPassword = String(formData.get('confirmPassword') || '')

  if (!token) return { ok: false, error: 'Missing reset token. Use the link from your email.' }
  if (password.length < 8) return { ok: false, error: 'Password must be at least 8 characters.' }
  if (password !== confirmPassword) return { ok: false, error: 'Passwords do not match.' }

  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.resetPassword({
      collection: 'students',
      data: { token, password },
      overrideAccess: true,
    })
    if (result.token) await setSessionCookie(result.token)
    return { ok: true }
  } catch {
    return {
      ok: false,
      error: 'This reset link is invalid or has expired. Please request a new one.',
    }
  }
}

export async function setTwoFactorEnabled(enabled: boolean): Promise<AuthActionResult> {
  const student = await getCurrentStudent()
  if (!student) return { ok: false, error: 'You are not signed in.' }
  const payload = await getPayload({ config: configPromise })
  await payload.update({
    collection: 'students',
    id: student.id,
    overrideAccess: true,
    data: { twoFactorEnabled: enabled },
  })
  return { ok: true }
}

export async function logoutStudent(): Promise<void> {
  const store = await cookies()
  store.delete(STUDENT_COOKIE)
  store.delete(TWO_FACTOR_COOKIE)
}
