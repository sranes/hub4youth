import 'server-only'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Course, Enrollment } from '@/payload-types'

/** Paid enrollments for a student, with the related course populated. */
export async function getMyEnrollments(studentId: number): Promise<Enrollment[]> {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'enrollments',
    where: {
      and: [{ student: { equals: studentId } }, { status: { equals: 'paid' } }],
    },
    depth: 1,
    // Courses.defaultPopulate omits `curriculum`; override so the dashboard can
    // count lessons / compute progress from the populated course.
    populate: {
      courses: { title: true, slug: true, icon: true, curriculum: true },
    },
    limit: 100,
    overrideAccess: true,
    sort: '-createdAt',
  })
  return res.docs
}

export type EnrolledCourseResult =
  | { status: 'not-found' }
  | { status: 'not-enrolled'; course: Course }
  | { status: 'ok'; course: Course; enrollment: Enrollment }

/**
 * Resolve a published course by slug and check the student has a paid enrollment
 * for it. The studentId always comes from the authenticated session.
 */
export async function getEnrolledCourse(
  studentId: number,
  slug: string,
): Promise<EnrolledCourseResult> {
  const payload = await getPayload({ config: configPromise })

  // overrideAccess:false with no req.user → published-only (students never see drafts).
  const courseRes = await payload.find({
    collection: 'courses',
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: false,
  })
  const course = courseRes.docs[0]
  if (!course) return { status: 'not-found' }

  const enrRes = await payload.find({
    collection: 'enrollments',
    where: {
      and: [
        { student: { equals: studentId } },
        { course: { equals: course.id } },
        { status: { equals: 'paid' } },
      ],
    },
    limit: 1,
    overrideAccess: true,
  })
  const enrollment = enrRes.docs[0]
  if (!enrollment) return { status: 'not-enrolled', course }

  return { status: 'ok', course, enrollment }
}

/** Normalise the json progress field to a string[] of completed lesson ids. */
export function completedLessonIds(enrollment: Enrollment): string[] {
  const raw = enrollment.completedLessons
  return Array.isArray(raw) ? (raw.filter((v) => typeof v === 'string') as string[]) : []
}
