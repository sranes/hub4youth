import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle2, Clock, Layers, Signal } from 'lucide-react'
import React, { cache } from 'react'

import type { Course } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { CourseIcon } from '@/components/site/CourseIcon'
import { formatPrice } from '@/utilities/formatPrice'
import { getServerSideURL } from '@/utilities/getURL'

export const dynamic = 'force-static'
export const revalidate = 600

const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  all: 'All levels',
}

const MODE_LABELS: Record<string, string> = {
  live: 'Live (instructor-led)',
  'self-paced': 'Self-paced',
  hybrid: 'Hybrid',
}

const queryCourseBySlug = cache(async ({ slug }: { slug: string }): Promise<Course | null> => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'courses',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: { slug: { equals: slug } },
  })

  return result.docs[0] || null
})

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const courses = await payload.find({
    collection: 'courses',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })
  return courses.docs.map(({ slug }) => ({ slug }))
}

type Args = { params: Promise<{ slug?: string }> }

export default async function CoursePage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const course = await queryCourseBySlug({ slug })

  if (!course) notFound()

  const { title, summary, content, curriculum, outcomes, heroImage, duration, level, mode } = course

  const courseJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: title,
    description: course.meta?.description || summary,
    provider: {
      '@type': 'Organization',
      name: 'hub4youth.ai',
      sameAs: getServerSideURL(),
    },
    offers: {
      '@type': 'Offer',
      category: (course.price ?? 0) > 0 ? 'Paid' : 'Free',
      price: String(course.price ?? 0),
      priceCurrency: course.currency || 'INR',
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      ...(duration ? { courseWorkload: duration } : {}),
    },
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <section className="border-b border-border bg-card">
        <div className="container grid gap-10 py-12 lg:grid-cols-3 lg:py-16">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/courses" className="hover:text-foreground">
                Courses
              </Link>
              <span>/</span>
              <span className="text-foreground">{title}</span>
            </div>
            <div className="mt-5 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CourseIcon name={course.icon} className="size-6" />
            </div>
            <h1 className="mt-4 text-3xl font-medium sm:text-4xl">{title}</h1>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{summary}</p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {duration && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-4" /> {duration}
                </span>
              )}
              {level && (
                <span className="inline-flex items-center gap-1.5">
                  <Signal className="size-4" /> {LEVEL_LABELS[level] || level}
                </span>
              )}
              {mode && (
                <span className="inline-flex items-center gap-1.5">
                  <Layers className="size-4" /> {MODE_LABELS[mode] || mode}
                </span>
              )}
            </div>
          </div>

          {/* Enroll card */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-border bg-background p-6">
              {heroImage && typeof heroImage === 'object' && (
                <Media
                  resource={heroImage}
                  className="mb-5 overflow-hidden rounded-lg"
                  imgClassName="w-full h-auto"
                />
              )}
              <div className="text-3xl font-medium">
                {formatPrice(course.price, course.currency || 'INR')}
              </div>
              <Button asChild size="lg" className="mt-4 w-full">
                <Link href={`/enroll?course=${course.slug}`}>Enroll now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="mt-3 w-full">
                <Link href={`/contact?course=${encodeURIComponent(title)}`}>
                  Request a callback
                </Link>
              </Button>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Have questions? Talk to a course advisor before you enroll.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container grid gap-12 py-12 lg:grid-cols-3 lg:py-16">
        <div className="space-y-12 lg:col-span-2">
          {content && (
            <div>
              <h2 className="text-2xl font-medium">About this course</h2>
              <RichText className="mt-4" data={content} enableGutter={false} />
            </div>
          )}

          {Array.isArray(outcomes) && outcomes.length > 0 && (
            <div>
              <h2 className="text-2xl font-medium">What you&apos;ll learn</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {outcomes.map((o) => (
                  <li key={o.id || o.outcome} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{o.outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {Array.isArray(curriculum) && curriculum.length > 0 && (
          <aside className="lg:col-span-1">
            <h2 className="text-2xl font-medium">Curriculum</h2>
            <div className="mt-4 space-y-3">
              {curriculum.map((mod, i) => (
                <div key={mod.id || i} className="rounded-lg border border-border bg-card p-5">
                  <h3 className="font-medium">
                    <span className="text-muted-foreground">Module {i + 1}:</span>{' '}
                    {mod.moduleTitle}
                  </h3>
                  {Array.isArray(mod.lessons) && mod.lessons.length > 0 && (
                    <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                      {mod.lessons.map((l, j) => (
                        <li key={l.id || j} className="flex items-start gap-2">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                          <span>{l.lesson}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </aside>
        )}
      </section>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const course = await queryCourseBySlug({ slug })
  if (!course) return { title: 'Course not found' }
  const description = course.meta?.description || course.summary
  return {
    title: course.title,
    description,
    alternates: { canonical: `/courses/${course.slug}` },
    openGraph: {
      title: `${course.title} — hub4youth.ai`,
      description,
      url: `/courses/${course.slug}`,
      type: 'website',
    },
  }
}
