'use server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Course, Enrollment } from '@/payload-types'
import { getCurrentStudent } from '@/students/auth'
import { completedLessonIds } from '@/students/enrollment'

export type ProgressResult = { ok: boolean; completed: string[] }

type Quiz = NonNullable<Course['finalAssessment']>
export type QuizResult = { score: number; total: number; passed: boolean }
export type QuizSubmitResult = ({ ok: true } & QuizResult) | { ok: false; error: string }

/** Load an enrollment and confirm it belongs to the current student and is paid. */
async function loadOwnedEnrollment(
  enrollmentId: number,
): Promise<Enrollment | null> {
  const student = await getCurrentStudent()
  if (!student) return null
  const payload = await getPayload({ config: configPromise })
  let enrollment: Enrollment
  try {
    enrollment = await payload.findByID({
      collection: 'enrollments',
      id: enrollmentId,
      depth: 0,
      overrideAccess: true,
    })
  } catch {
    return null
  }
  const ownerId =
    typeof enrollment.student === 'object' && enrollment.student
      ? enrollment.student.id
      : enrollment.student
  if (ownerId !== student.id || enrollment.status !== 'paid') return null
  return enrollment
}

/** Find the quiz for a key ("module:<id>" or "final") on a course. */
function findQuiz(course: Course, quizKey: string): Quiz | null {
  if (quizKey === 'final') return course.finalAssessment || null
  if (quizKey.startsWith('module:')) {
    const moduleId = quizKey.slice('module:'.length)
    const mod = (course.curriculum || []).find((m) => m.id === moduleId)
    return mod?.quiz || null
  }
  return null
}

/**
 * Grade a quiz/assessment submission server-side (correct answers never leave the
 * server) and store the result. `answers` maps questionId → selected optionIds.
 */
export async function submitQuiz(
  enrollmentId: number,
  quizKey: string,
  answers: Record<string, string[]>,
): Promise<QuizSubmitResult> {
  const enrollment = await loadOwnedEnrollment(enrollmentId)
  if (!enrollment) return { ok: false, error: 'You are not enrolled in this course.' }

  const payload = await getPayload({ config: configPromise })

  const courseId =
    typeof enrollment.course === 'object' && enrollment.course
      ? enrollment.course.id
      : enrollment.course
  if (!courseId) return { ok: false, error: 'Course not found.' }

  let course: Course
  try {
    course = await payload.findByID({ collection: 'courses', id: courseId, overrideAccess: true })
  } catch {
    return { ok: false, error: 'Course not found.' }
  }

  const quiz = findQuiz(course, quizKey)
  const questions = quiz?.questions || []
  if (!quiz || questions.length === 0) return { ok: false, error: 'Quiz not found.' }

  let correctCount = 0
  for (const q of questions) {
    const correctIds = (q.options || [])
      .filter((o) => o.correct)
      .map((o) => o.id)
      .filter((id): id is string => Boolean(id))
    const selected = new Set(answers[q.id || ''] || [])
    const allCorrectSelected = correctIds.every((id) => selected.has(id))
    const noWrongSelected = [...selected].every((id) => correctIds.includes(id))
    if (correctIds.length > 0 && allCorrectSelected && noWrongSelected) correctCount += 1
  }

  const total = questions.length
  const passMark = quiz.passMark ?? 70
  const passed = total > 0 ? (correctCount / total) * 100 >= passMark : true

  const results = {
    ...((enrollment.quizResults as Record<string, QuizResult> | null) || {}),
    [quizKey]: { score: correctCount, total, passed },
  }

  await payload.update({
    collection: 'enrollments',
    id: enrollmentId,
    overrideAccess: true,
    data: { quizResults: results },
  })

  return { ok: true, score: correctCount, total, passed }
}

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
