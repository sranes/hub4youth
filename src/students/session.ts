import 'server-only'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cookies } from 'next/headers'

import type { Student } from '@/payload-types'
import { STUDENT_COOKIE } from './auth'

async function setSessionCookie(token: string, exp?: number): Promise<void> {
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

/** Authenticate with email/password and set the session cookie. */
export async function loginWithPassword(email: string, password: string): Promise<Student> {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.login({ collection: 'students', data: { email, password } })
  if (!result.token) throw new Error('Login failed')
  await setSessionCookie(result.token, result.exp)
  return result.user as unknown as Student
}

/** Create a new student account, then log them in (sets the session cookie). */
export async function createAndLoginStudent(input: {
  name: string
  email: string
  password: string
}): Promise<Student> {
  const payload = await getPayload({ config: configPromise })
  await payload.create({
    collection: 'students',
    overrideAccess: true,
    data: { name: input.name, email: input.email, password: input.password },
  })
  return loginWithPassword(input.email, input.password)
}
