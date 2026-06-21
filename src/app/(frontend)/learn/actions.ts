'use server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Enrollment } from '@/payload-types'
import { getCurrentStudent } from '@/students/auth'
import { completedLessonIds } from '@/students/enrollment'

export type ProgressResult = { ok: boolean; completed: string[] }

/**
 * Toggle a lesson's completion for the current student. Ownership is verified
 * server-side: the enrollment must belong to the logged-in student and be paid.
 */
export async function setLessonComplete(
  enrollmentId: number,
  lessonId: string,
  completed: boolean,
): Promise<ProgressResult> {
  const student = await getCurrentStudent()
  if (!student) return { ok: false, completed: [] }

  const payload = await getPayload({ config: configPromise })

  let enrollment: Enrollment
  try {
    enrollment = await payload.findByID({
      collection: 'enrollments',
      id: enrollmentId,
      overrideAccess: true,
    })
  } catch {
    return { ok: false, completed: [] }
  }

  const ownerId =
    typeof enrollment.student === 'object' && enrollment.student
      ? enrollment.student.id
      : enrollment.student
  if (ownerId !== student.id || enrollment.status !== 'paid') {
    return { ok: false, completed: [] }
  }

  const set = new Set(completedLessonIds(enrollment))
  if (completed) set.add(lessonId)
  else set.delete(lessonId)
  const next = Array.from(set)

  await payload.update({
    collection: 'enrollments',
    id: enrollmentId,
    overrideAccess: true,
    data: { completedLessons: next },
  })

  return { ok: true, completed: next }
}
