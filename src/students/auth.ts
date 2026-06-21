import 'server-only'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { headers as nextHeaders } from 'next/headers'

import type { Student } from '@/payload-types'

// Payload's default cookie auth reads `${cookiePrefix}-token` (prefix `payload`).
export const STUDENT_COOKIE = 'payload-token'

/**
 * Resolve the currently logged-in student from the request cookies, or null.
 * Returns null for admin (`users`) sessions — this is the student-facing guard.
 */
export async function getCurrentStudent(): Promise<Student | null> {
  try {
    const payload = await getPayload({ config: configPromise })
    const headers = await nextHeaders()
    const { user } = await payload.auth({ headers })
    if (user && user.collection === 'students') {
      return user as unknown as Student
    }
  } catch {
    // Not authenticated / invalid token — treat as logged out.
  }
  return null
}
