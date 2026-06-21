import 'server-only'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cookies } from 'next/headers'

import type { Student } from '@/payload-types'
import { STUDENT_COOKIE } from './auth'

/** Set the Payload auth cookie from a session token (logs the browser in). */
export async function setSessionCookie(token: string, exp?: number): Promise<void> {
  const store = await cookies()
  store.set(STUDENT_COOKIE, token, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires: exp ? new Date(exp * 1000) : undefined,
  })
}

/** Find a student by email (case-insensitive), or null. */
export async function findStudentByEmail(email: string): Promise<Student | null> {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'students',
    where: { email: { equals: email } },
    limit: 1,
    overrideAccess: true,
  })
  return (res.docs[0] as Student) || null
}

export type Credentials = { user: Student; token: string; exp?: number }

/** Verify email/password WITHOUT setting the session cookie (used by 2FA step 1). */
export async function verifyCredentials(email: string, password: string): Promise<Credentials> {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.login({ collection: 'students', data: { email, password } })
  if (!result.token) throw new Error('Login failed')
  return { user: result.user as unknown as Student, token: result.token, exp: result.exp }
}

/** Authenticate with email/password and set the session cookie. */
export async function loginWithPassword(email: string, password: string): Promise<Student> {
  const { user, token, exp } = await verifyCredentials(email, password)
  await setSessionCookie(token, exp)
  return user
}

/** Create a new student account, then log them in (sets the session cookie). */
export async function createAndLoginStudent(input: {
  name: string
  email: string
  password: string
  phone?: string
}): Promise<Student> {
  const payload = await getPayload({ config: configPromise })
  await payload.create({
    collection: 'students',
    overrideAccess: true,
    data: {
      name: input.name,
      email: input.email,
      password: input.password,
      phone: input.phone || undefined,
    },
  })
  return loginWithPassword(input.email, input.password)
}
