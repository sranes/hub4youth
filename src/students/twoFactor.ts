import 'server-only'

import crypto from 'crypto'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cookies } from 'next/headers'

import type { Student } from '@/payload-types'
import { sendTwoFactorCode } from '@/email'
import { setSessionCookie } from './session'

export const TWO_FACTOR_COOKIE = 'h4y-2fa'
export const TWO_FACTOR_EXP_MIN = Number(process.env.TWO_FACTOR_CODE_EXPIRATION_MINUTES || 10)

const hashCode = (code: string) => crypto.createHash('sha256').update(code).digest('hex')
const genCode = () => String(crypto.randomInt(0, 1_000_000)).padStart(6, '0')

/** Decode a JWT's `exp` (seconds) without verifying — only used to mirror cookie lifetime. */
function tokenExp(token: string): number | undefined {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf8'))
    return typeof payload.exp === 'number' ? payload.exp : undefined
  } catch {
    return undefined
  }
}

/**
 * Step 1: credentials are already verified and we hold a (not-yet-active) session
 * token. Store an emailed OTP challenge; the token is parked server-side and only
 * becomes the live session once the code is confirmed in step 2.
 */
export async function startEmailChallenge(args: {
  studentId: number
  name: string
  email: string
  pendingToken: string
}): Promise<void> {
  const payload = await getPayload({ config: configPromise })
  const code = genCode()
  const challengeId = crypto.randomBytes(24).toString('hex')
  const expiresAt = new Date(Date.now() + TWO_FACTOR_EXP_MIN * 60 * 1000)

  await payload.update({
    collection: 'students',
    id: args.studentId,
    overrideAccess: true,
    data: {
      twoFactorChallengeId: challengeId,
      twoFactorCodeHash: hashCode(code),
      twoFactorExpiresAt: expiresAt.toISOString(),
      twoFactorPendingToken: args.pendingToken,
    },
  })

  await sendTwoFactorCode(payload, {
    name: args.name,
    email: args.email,
    code,
    expiresMinutes: TWO_FACTOR_EXP_MIN,
  })

  const store = await cookies()
  store.set(TWO_FACTOR_COOKIE, challengeId, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
  })
}

async function findByChallenge(challengeId: string): Promise<Student | null> {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'students',
    where: { twoFactorChallengeId: { equals: challengeId } },
    limit: 1,
    overrideAccess: true,
  })
  return (res.docs[0] as Student) || null
}

export async function hasPendingChallenge(): Promise<boolean> {
  const store = await cookies()
  return Boolean(store.get(TWO_FACTOR_COOKIE)?.value)
}

/** Step 2: verify the emailed code, then promote the parked token to a live session. */
export async function completeEmailChallenge(
  code: string,
): Promise<{ ok: boolean; error?: string }> {
  const store = await cookies()
  const challengeId = store.get(TWO_FACTOR_COOKIE)?.value
  if (!challengeId) return { ok: false, error: 'Your login session expired. Please log in again.' }

  const student = await findByChallenge(challengeId)
  if (!student || !student.twoFactorCodeHash || !student.twoFactorPendingToken) {
    return { ok: false, error: 'Your login session expired. Please log in again.' }
  }

  const expired =
    !student.twoFactorExpiresAt || new Date(student.twoFactorExpiresAt).getTime() < Date.now()
  if (expired) return { ok: false, error: 'That code has expired. Request a new one.' }

  if (hashCode(code.trim()) !== student.twoFactorCodeHash) {
    return { ok: false, error: 'Incorrect code. Please try again.' }
  }

  const token = student.twoFactorPendingToken
  await setSessionCookie(token, tokenExp(token))

  // Clear the challenge and remove the temporary cookie.
  const payload = await getPayload({ config: configPromise })
  await payload.update({
    collection: 'students',
    id: student.id,
    overrideAccess: true,
    data: {
      twoFactorChallengeId: null,
      twoFactorCodeHash: null,
      twoFactorExpiresAt: null,
      twoFactorPendingToken: null,
    },
  })
  store.delete(TWO_FACTOR_COOKIE)

  return { ok: true }
}

/** Re-issue a fresh code for the pending challenge. */
export async function resendEmailChallenge(): Promise<{ ok: boolean; error?: string }> {
  const store = await cookies()
  const challengeId = store.get(TWO_FACTOR_COOKIE)?.value
  if (!challengeId) return { ok: false, error: 'Your login session expired. Please log in again.' }

  const student = await findByChallenge(challengeId)
  if (!student) return { ok: false, error: 'Your login session expired. Please log in again.' }

  const payload = await getPayload({ config: configPromise })
  const code = genCode()
  const expiresAt = new Date(Date.now() + TWO_FACTOR_EXP_MIN * 60 * 1000)
  await payload.update({
    collection: 'students',
    id: student.id,
    overrideAccess: true,
    data: { twoFactorCodeHash: hashCode(code), twoFactorExpiresAt: expiresAt.toISOString() },
  })
  await sendTwoFactorCode(payload, {
    name: student.name,
    email: student.email,
    code,
    expiresMinutes: TWO_FACTOR_EXP_MIN,
  })
  store.set(TWO_FACTOR_COOKIE, challengeId, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
  })
  return { ok: true }
}
