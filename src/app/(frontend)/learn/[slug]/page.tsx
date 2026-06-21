import type { Metadata } from 'next'

import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, Lock } from 'lucide-react'
import React from 'react'

import type { Course } from '@/payload-types'
import { Button } from '@/components/ui/button'
import RichText from '@/components/RichText'
import { LessonComplete } from '@/components/site/LessonComplete'
import { LessonMedia } from '@/components/site/LessonMedia'
import { getCurrentStudent } from '@/students/auth'
import { completedLessonIds, getEnrolledCourse } from '@/students/enrollment'
import { cn } from '@/utilities/ui'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{ slug?: string }>
  searchParams: Promise<{ lesson?: string }>
}

type Lesson = NonNullable<NonNullable<Course['curriculum']>[number]['lessons']>[number]

type FlatLesson = {
  id: string
  title: string
  moduleTitle: string
  content: Lesson['content']
  videoUrl: Lesson['videoUrl']
}

function flattenLessons(course: Course): FlatLesson[] {
  const out: FlatLesson[] = []
  ;(course.curriculum || []).forEach((mod, mi) => {
    ;(mod.lessons || []).forEach((l, li) => {
      out.push({
        id: l.id || `${mi}-${li}`,
        title: l.lesson,
        moduleTitle: mod.moduleTitle,
        content: l.content,
        videoUrl: l.videoUrl,
      })
    })
  })
  return out
}

export default async function LearnCoursePage({ params, searchParams }: Args) {
  const { slug = '' } = await params
  const { lesson: lessonParam } = await searchParams

  const student = await getCurrentStudent()
  if (!student) redirect(`/login?redirect=${encodeURIComponent(`/learn/${slug}`)}`)

  const result = await getEnrolledCourse(student.id, slug)
  if (result.status === 'not-found') notFound()

  if (result.status === 'not-enrolled') {
    return (
      <div className="container max-w-xl py-20 text-center lg:py-28">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Lock className="size-7" />
        </div>
        <h1 className="mt-6 text-2xl font-medium">Enroll to access this course</h1>
        <p className="mt-3 text-muted-foreground">
          You&apos;re not enrolled in {result.course.title} yet. Enroll to unlock all lessons.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild>
            <Link href={`/enroll?course=${result.course.slug}`}>Enroll now</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/courses/${result.course.slug}`}>View course details</Link>
          </Button>
        </div>
      </div>
    )
  }

  const { course, enrollment } = result
  const lessons = flattenLessons(course)
  const completed = new Set(completedLessonIds(enrollment))

  if (lessons.length === 0) {
    return (
      <div className="container max-w-2xl py-20 text-center lg:py-28">
        <h1 className="text-2xl font-medium">{course.title}</h1>
        <p className="mt-3 text-muted-foreground">
          Lesson content is being prepared. Please check back soon.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/learn">Back to my learning</Link>
        </Button>
      </div>
    )
  }

  const activeIndex = Math.max(
    0,
    lessons.findIndex((l) => l.id === lessonParam),
  )
  const active = lessons[activeIndex]
  const prev = activeIndex > 0 ? lessons[activeIndex - 1] : null
  const next = activeIndex < lessons.length - 1 ? lessons[activeIndex + 1] : null

  const doneCount = lessons.filter((l) => completed.has(l.id)).length
  const pct = Math.round((doneCount / lessons.length) * 100)

  return (
    <div className="container py-8 lg:py-12">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/learn" className="hover:text-foreground">
            My learning
          </Link>
          <span>/</span>
          <span className="text-foreground">{course.title}</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {doneCount} / {lessons.length} · {pct}%
        </span>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[300px_1fr]">
        {/* Lesson list */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
          </div>
          <nav className="mt-4 space-y-4">
            {(course.curriculum || []).map((mod, mi) => (
              <div key={mod.id || mi}>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {mod.moduleTitle}
                </p>
                <ul className="mt-2 space-y-1">
                  {(mod.lessons || []).map((l, li) => {
                    const id = l.id || `${mi}-${li}`
                    const isActive = id === active.id
                    const isDone = completed.has(id)
                    return (
                      <li key={id}>
                        <Link
                          href={`/learn/${course.slug}?lesson=${id}`}
                          className={cn(
                            'flex items-start gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                            isActive
                              ? 'bg-primary/10 font-medium text-foreground'
                              : 'text-muted-foreground hover:bg-card hover:text-foreground',
                          )}
                        >
                          <span
                            className={cn(
                              'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border',
                              isDone
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-muted-foreground/40',
                            )}
                          >
                            {isDone && <Check className="size-3" />}
                          </span>
                          <span>{l.lesson}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Lesson content */}
        <article className="min-w-0">
          <p className="text-sm text-muted-foreground">{active.moduleTitle}</p>
          <h1 className="mt-1 text-2xl font-medium sm:text-3xl">{active.title}</h1>

          {active.videoUrl && (
            <div className="mt-6">
              <LessonMedia url={active.videoUrl} title={active.title} />
            </div>
          )}

          {active.content ? (
            <RichText className="mt-6" data={active.content} enableGutter={false} />
          ) : (
            !active.videoUrl && (
              <p className="mt-6 text-muted-foreground">
                This lesson doesn&apos;t have content yet.
              </p>
            )
          )}

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
            <LessonComplete
              enrollmentId={enrollment.id}
              lessonId={active.id}
              initialComplete={completed.has(active.id)}
            />
            <div className="flex gap-2">
              {prev && (
                <Button asChild variant="outline">
                  <Link href={`/learn/${course.slug}?lesson=${prev.id}`}>
                    <ArrowLeft className="mr-1.5 size-4" /> Previous
                  </Link>
                </Button>
              )}
              {next && (
                <Button asChild variant="outline">
                  <Link href={`/learn/${course.slug}?lesson=${next.id}`}>
                    Next <ArrowRight className="ml-1.5 size-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug = '' } = await params
  return {
    title: `Learn — ${slug}`,
    robots: { index: false },
  }
}
