'use server'

import { cookies } from 'next/headers'

import { STUDENT_COOKIE } from './auth'
import { createAndLoginStudent, findStudentByEmail, loginWithPassword } from './session'

export type AuthActionResult = { ok: true } | { ok: false; error: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function registerStudent(
  _prev: AuthActionResult | null,
  formData: FormData,
): Promise<AuthActionResult> {
  const name = String(formData.get('name') || '').trim()
  const email = String(formData.get('email') || '')
    .trim()
    .toLowerCase()
  const password = String(formData.get('password') || '')

  if (!name) return { ok: false, error: 'Please enter your name.' }
  if (!EMAIL_RE.test(email)) return { ok: false, error: 'Please enter a valid email address.' }
  if (password.length < 8) {
    return { ok: false, error: 'Password must be at least 8 characters.' }
  }

  if (await findStudentByEmail(email)) {
    return { ok: false, error: 'An account with this email already exists. Please log in.' }
  }

  try {
    await createAndLoginStudent({ name, email, password })
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

  try {
    await loginWithPassword(email, password)
    return { ok: true }
  } catch {
    return { ok: false, error: 'Invalid email or password.' }
  }
}

export async function logoutStudent(): Promise<void> {
  const store = await cookies()
  store.delete(STUDENT_COOKIE)
}
