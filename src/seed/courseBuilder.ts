import type { Payload, PayloadRequest } from 'payload'

import type { Course } from '@/payload-types'
import {
  buildLessonState,
  buildOverview,
  buildQuiz,
  type LessonContent,
  type QuizInput,
} from './lessonContent'

export type CourseModuleDef = {
  title: string
  lessons: { title: string; content: LessonContent }[]
  quiz?: QuizInput
}

export type CourseDef = {
  slug: string
  title: string
  summary: string
  overview: string[]
  level: NonNullable<Course['level']>
  duration: string
  icon: NonNullable<Course['icon']>
  outcomes: string[]
  modules: CourseModuleDef[]
  finalAssessment?: QuizInput
}

/**
 * Create a free, self-paced course from a definition. Idempotent (skips if the
 * slug exists). Uses the two-step pattern: create the bare curriculum, then
 * update with lesson content, tryIt and quizzes — Payload drops a deeply-nested
 * curriculum created in one call under the drafts-enabled collection.
 */
export async function createCourse(
  payload: Payload,
  def: CourseDef,
  req?: PayloadRequest,
): Promise<boolean> {
  const existing = await payload.find({
    collection: 'courses',
    where: { slug: { equals: def.slug } },
    limit: 1,
    overrideAccess: true,
    req,
  })
  if (existing.docs.length > 0) return false

  const bareCurriculum = def.modules.map((m) => ({
    moduleTitle: m.title,
    lessons: m.lessons.map((l) => ({ lesson: l.title, preview: false })),
  })) as Course['curriculum']

  const created = await payload.create({
    collection: 'courses',
    overrideAccess: true,
    context: { disableRevalidate: true },
    req,
    data: {
      title: def.title,
      slug: def.slug,
      _status: 'published',
      price: 0,
      currency: 'INR',
      level: def.level,
      mode: 'self-paced',
      icon: def.icon,
      featured: false,
      duration: def.duration,
      summary: def.summary,
      content: buildOverview(def.overview) as Course['content'],
      outcomes: def.outcomes.map((o) => ({ outcome: o })),
      curriculum: bareCurriculum,
    },
  })

  // Re-fetch to get the rows Payload created (create may not return curriculum),
  // then fill in content + tryIt + quizzes by position.
  const fresh = await payload.findByID({
    collection: 'courses',
    id: created.id,
    depth: 0,
    overrideAccess: true,
    req,
  })
  const curriculum = (fresh.curriculum || []).map((mod, mi) => ({
    ...mod,
    lessons: (mod.lessons || []).map((l, li) => {
      const lc = def.modules[mi].lessons[li].content
      return { ...l, content: buildLessonState(lc), ...(lc.tryIt ? { tryIt: lc.tryIt } : {}) }
    }),
    ...(def.modules[mi]?.quiz ? { quiz: buildQuiz(def.modules[mi].quiz as QuizInput, true) } : {}),
  })) as Course['curriculum']

  await payload.update({
    collection: 'courses',
    id: created.id,
    overrideAccess: true,
    context: { disableRevalidate: true },
    req,
    data: {
      curriculum,
      ...(def.finalAssessment ? { finalAssessment: buildQuiz(def.finalAssessment, false) } : {}),
    },
  })

  return true
}
