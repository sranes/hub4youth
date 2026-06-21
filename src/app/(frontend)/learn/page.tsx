import type { Metadata } from 'next'

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, BookOpen } from 'lucide-react'
import React from 'react'

import type { Course } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { CourseIcon } from '@/components/site/CourseIcon'
import { getCurrentStudent } from '@/students/auth'
import { completedLessonIds, getMyEnrollments } from '@/students/enrollment'

export const dynamic = 'force-dynamic'

function lessonCount(course: Course): number {
  return (course.curriculum || []).reduce(
    (sum, mod) => sum + (Array.isArray(mod.lessons) ? mod.lessons.length : 0),
    0,
  )
}

export default async function LearnDashboardPage() {
  const student = await getCurrentStudent()
  if (!student) redirect('/login?redirect=/learn')

  const enrollments = await getMyEnrollments(student.id)

  return (
    <div className="container py-12 lg:py-16">
      <h1 className="text-2xl font-medium sm:text-3xl">My learning</h1>
      <p className="mt-2 text-muted-foreground">
        Welcome back{student.name ? `, ${student.name}` : ''}. Pick up where you left off.
      </p>

      {enrollments.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-border p-10 text-center">
          <BookOpen className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">You haven&apos;t enrolled in any courses yet.</p>
          <Button asChild className="mt-5">
            <Link href="/courses">Browse courses</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {enrollments.map((enrollment) => {
            const course = typeof enrollment.course === 'object' ? enrollment.course : null
            if (!course) return null
            const total = lessonCount(course)
            const done = completedLessonIds(enrollment).length
            const pct = total > 0 ? Math.round((done / total) * 100) : 0

            return (
              <Link
                key={enrollment.id}
                href={`/learn/${course.slug}`}
                className="group flex flex-col rounded-xl border border-border p-6 transition-all hover:-translate-y-0.5 hover:border-primary"
              >
                <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CourseIcon name={course.icon} className="size-5" />
                </div>
                <h2 className="mt-4 text-lg font-medium leading-snug">{course.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {total > 0 ? `${total} lessons` : 'Course'}
                </p>

                <div className="mt-4">
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {total > 0 ? `${done} of ${total} complete · ${pct}%` : 'Ready to start'}
                  </p>
                </div>

                <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  {done > 0 ? 'Continue' : 'Start learning'}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export const metadata: Metadata = {
  title: 'My learning — hub4youth',
  robots: { index: false },
}
