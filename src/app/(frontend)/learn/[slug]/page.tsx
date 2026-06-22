import type { Metadata } from 'next'

import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, HelpCircle, Lock, Wrench } from 'lucide-react'
import React from 'react'

import type { Course } from '@/payload-types'
import { Button } from '@/components/ui/button'
import RichText from '@/components/RichText'
import { LessonComplete } from '@/components/site/LessonComplete'
import { LessonMedia } from '@/components/site/LessonMedia'
import { QuizRunner, type QuizQuestion } from '@/components/site/QuizRunner'
import { getCurrentStudent } from '@/students/auth'
import { completedLessonIds, getEnrolledCourse } from '@/students/enrollment'
import type { QuizResult } from '@/app/(frontend)/learn/actions'
import { cn } from '@/utilities/ui'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{ slug?: string }>
  searchParams: Promise<{ lesson?: string; quiz?: string }>
}

type Module = NonNullable<Course['curriculum']>[number]
type Lesson = NonNullable<Module['lessons']>[number]
type Quiz = NonNullable<Course['finalAssessment']>

type Item =
  | { kind: 'lesson'; key: string; moduleIndex: number; moduleTitle: string; lesson: Lesson }
  | {
      kind: 'quiz'
      key: string
      moduleIndex: number
      quizKey: string
      title: string
      quiz: Quiz
    }

const hasQuestions = (q?: Quiz | null): q is Quiz => Boolean(q && (q.questions || []).length > 0)

function stripQuestions(quiz: Quiz): QuizQuestion[] {
  return (quiz.questions || []).map((q) => ({
    id: q.id || '',
    question: q.question,
    type: q.type === 'multiple' ? 'multiple' : 'single',
    options: (q.options || []).map((o) => ({ id: o.id || '', text: o.text })),
  }))
}

export default async function LearnCoursePage({ params, searchParams }: Args) {
  const { slug = '' } = await params
  const { lesson: lessonParam, quiz: quizParam } = await searchParams

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
  const modules = course.curriculum || []
  const completed = new Set(completedLessonIds(enrollment))
  const quizResults = (enrollment.quizResults as Record<string, QuizResult> | null) || {}

  // A module blocks progression only if it has a *required* quiz that isn't passed.
  const blocks = (m: Module) =>
    hasQuestions(m.quiz) && Boolean(m.quiz?.required) && !quizResults[`module:${m.id}`]?.passed
  const moduleUnlocked = (i: number) => !modules.slice(0, i).some(blocks)
  const finalUnlocked = !modules.some(blocks)
  const finalQuiz = hasQuestions(course.finalAssessment) ? course.finalAssessment! : null

  // Flat, ordered list of navigable items: each module's lessons then its quiz,
  // and finally the course assessment.
  const items: Item[] = []
  modules.forEach((mod, mi) => {
    ;(mod.lessons || []).forEach((l, li) => {
      items.push({
        kind: 'lesson',
        key: `lesson:${l.id || `${mi}-${li}`}`,
        moduleIndex: mi,
        moduleTitle: mod.moduleTitle,
        lesson: l,
      })
    })
    if (hasQuestions(mod.quiz)) {
      items.push({
        kind: 'quiz',
        key: `quiz:module:${mod.id}`,
        moduleIndex: mi,
        quizKey: `module:${mod.id}`,
        title: `${mod.moduleTitle} — quiz`,
        quiz: mod.quiz!,
      })
    }
  })
  if (finalQuiz) {
    items.push({
      kind: 'quiz',
      key: 'quiz:final',
      moduleIndex: modules.length,
      quizKey: 'final',
      title: 'Final assessment',
      quiz: finalQuiz,
    })
  }

  if (items.length === 0) {
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

  const itemLocked = (it: Item) =>
    it.kind === 'quiz' && it.quizKey === 'final'
      ? !finalUnlocked
      : !moduleUnlocked(it.moduleIndex)
  const itemHref = (it: Item) =>
    it.kind === 'lesson'
      ? `/learn/${course.slug}?lesson=${it.lesson.id}`
      : `/learn/${course.slug}?quiz=${it.quizKey}`

  // Resolve the active item from the URL (defaults to the first).
  let activeIndex = 0
  if (quizParam) {
    const i = items.findIndex((it) => it.kind === 'quiz' && it.quizKey === quizParam)
    if (i >= 0) activeIndex = i
  } else if (lessonParam) {
    const i = items.findIndex((it) => it.kind === 'lesson' && it.lesson.id === lessonParam)
    if (i >= 0) activeIndex = i
  }
  const active = items[activeIndex]
  const prev = activeIndex > 0 ? items[activeIndex - 1] : null
  const next = activeIndex < items.length - 1 ? items[activeIndex + 1] : null

  const totalLessons = items.filter((it) => it.kind === 'lesson').length
  const doneCount = items.filter((it) => it.kind === 'lesson' && completed.has(it.lesson.id!)).length
  const pct = totalLessons > 0 ? Math.round((doneCount / totalLessons) * 100) : 0

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
          {doneCount} / {totalLessons} · {pct}%
        </span>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[300px_1fr]">
        {/* Course outline */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
          </div>
          <nav className="mt-4 space-y-4">
            {modules.map((mod, mi) => {
              const unlocked = moduleUnlocked(mi)
              const quizKey = `module:${mod.id}`
              const quizPassed = quizResults[quizKey]?.passed
              return (
                <div key={mod.id || mi}>
                  <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {!unlocked && <Lock className="size-3" />}
                    {mod.moduleTitle}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {(mod.lessons || []).map((l, li) => {
                      const id = l.id || `${mi}-${li}`
                      const isActive = active.kind === 'lesson' && active.lesson.id === l.id
                      const isDone = completed.has(id)
                      const lockedRow = !unlocked
                      const inner = (
                        <>
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
                        </>
                      )
                      return (
                        <li key={id}>
                          {lockedRow ? (
                            <span className="flex cursor-not-allowed items-start gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground/50">
                              {inner}
                            </span>
                          ) : (
                            <Link
                              href={`/learn/${course.slug}?lesson=${id}`}
                              className={cn(
                                'flex items-start gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                                isActive
                                  ? 'bg-primary/10 font-medium text-foreground'
                                  : 'text-muted-foreground hover:bg-card hover:text-foreground',
                              )}
                            >
                              {inner}
                            </Link>
                          )}
                        </li>
                      )
                    })}

                    {hasQuestions(mod.quiz) && (
                      <li>
                        {unlocked ? (
                          <Link
                            href={`/learn/${course.slug}?quiz=${quizKey}`}
                            className={cn(
                              'flex items-start gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                              active.kind === 'quiz' && active.quizKey === quizKey
                                ? 'bg-primary/10 font-medium text-foreground'
                                : 'text-muted-foreground hover:bg-card hover:text-foreground',
                            )}
                          >
                            <span
                              className={cn(
                                'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border',
                                quizPassed
                                  ? 'border-primary bg-primary text-primary-foreground'
                                  : 'border-muted-foreground/40',
                              )}
                            >
                              {quizPassed ? (
                                <Check className="size-3" />
                              ) : (
                                <HelpCircle className="size-3" />
                              )}
                            </span>
                            <span>
                              Quiz{mod.quiz?.required ? ' · required' : ''}
                            </span>
                          </Link>
                        ) : (
                          <span className="flex cursor-not-allowed items-start gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground/50">
                            <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border border-muted-foreground/40">
                              <HelpCircle className="size-3" />
                            </span>
                            <span>Quiz</span>
                          </span>
                        )}
                      </li>
                    )}
                  </ul>
                </div>
              )
            })}

            {finalQuiz && (
              <div>
                <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {!finalUnlocked && <Lock className="size-3" />}
                  Final assessment
                </p>
                <ul className="mt-2">
                  <li>
                    {finalUnlocked ? (
                      <Link
                        href={`/learn/${course.slug}?quiz=final`}
                        className={cn(
                          'flex items-start gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                          active.kind === 'quiz' && active.quizKey === 'final'
                            ? 'bg-primary/10 font-medium text-foreground'
                            : 'text-muted-foreground hover:bg-card hover:text-foreground',
                        )}
                      >
                        <span
                          className={cn(
                            'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border',
                            quizResults['final']?.passed
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-muted-foreground/40',
                          )}
                        >
                          {quizResults['final']?.passed ? (
                            <Check className="size-3" />
                          ) : (
                            <HelpCircle className="size-3" />
                          )}
                        </span>
                        <span>Take the assessment</span>
                      </Link>
                    ) : (
                      <span className="flex cursor-not-allowed items-start gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground/50">
                        <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border border-muted-foreground/40">
                          <Lock className="size-3" />
                        </span>
                        <span>Complete required quizzes to unlock</span>
                      </span>
                    )}
                  </li>
                </ul>
              </div>
            )}
          </nav>
        </aside>

        {/* Main content */}
        <article className="min-w-0">
          {itemLocked(active) ? (
            <div className="rounded-xl border border-dashed border-border p-10 text-center">
              <Lock className="mx-auto size-8 text-muted-foreground" />
              <h1 className="mt-4 text-xl font-medium">This section is locked</h1>
              <p className="mt-2 text-muted-foreground">
                Pass the required quiz in the previous module to unlock it.
              </p>
            </div>
          ) : active.kind === 'lesson' ? (
            <>
              <p className="text-sm text-muted-foreground">{active.moduleTitle}</p>
              <h1 className="mt-1 text-2xl font-medium sm:text-3xl">{active.lesson.lesson}</h1>

              {active.lesson.videoUrl && (
                <div className="mt-6">
                  <LessonMedia url={active.lesson.videoUrl} title={active.lesson.lesson} />
                </div>
              )}

              {active.lesson.content ? (
                <RichText className="mt-6" data={active.lesson.content} enableGutter={false} />
              ) : (
                !active.lesson.videoUrl && (
                  <p className="mt-6 text-muted-foreground">
                    This lesson doesn&apos;t have content yet.
                  </p>
                )
              )}

              {active.lesson.tryIt && (
                <div className="mt-8 rounded-xl border border-primary/30 bg-primary/5 p-5">
                  <div className="flex items-center gap-2 text-sm font-medium text-primary">
                    <Wrench className="size-4" />
                    Try it yourself
                  </div>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground">
                    {active.lesson.tryIt}
                  </p>
                </div>
              )}

              <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
                <LessonComplete
                  enrollmentId={enrollment.id}
                  lessonId={active.lesson.id!}
                  initialComplete={completed.has(active.lesson.id!)}
                />
                <div className="flex gap-2">
                  {prev && !itemLocked(prev) && (
                    <Button asChild variant="outline">
                      <Link href={itemHref(prev)}>
                        <ArrowLeft className="mr-1.5 size-4" /> Previous
                      </Link>
                    </Button>
                  )}
                  {next && !itemLocked(next) && (
                    <Button asChild variant="outline">
                      <Link href={itemHref(next)}>
                        Next <ArrowRight className="ml-1.5 size-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <QuizRunner
              enrollmentId={enrollment.id}
              quizKey={active.quizKey}
              title={active.title}
              passMark={active.quiz.passMark ?? 70}
              required={Boolean(active.quiz.required)}
              questions={stripQuestions(active.quiz)}
              initialResult={quizResults[active.quizKey] || null}
            />
          )}
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
