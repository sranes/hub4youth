import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { CourseCardDetailed } from '@/components/site/CourseCardDetailed'

export const dynamic = 'force-static'
export const revalidate = 600

// One distinct colour per card position, matching the homepage "Popular courses".
const PALETTE = ['#2B7FD4', '#27AE60', '#8B5CF6', '#E0992B', '#14B8A6', '#EC4899']

export default async function CoursesPage() {
  const payload = await getPayload({ config: configPromise })

  const courses = await payload.find({
    collection: 'courses',
    depth: 1,
    // Courses.defaultPopulate omits `curriculum`; include it so cards can show
    // the lesson count.
    populate: { courses: { curriculum: true } },
    limit: 100,
    overrideAccess: false,
    sort: '-createdAt',
  })

  return (
    <div>
      <section className="border-b border-border bg-gradient-to-b from-card to-background">
        <div className="container py-16 text-center lg:py-20">
          <h1 className="text-3xl font-medium sm:text-4xl">All courses</h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Practical, mentor-led AI programs designed to get you building real applications — and
            hired.
          </p>
        </div>
      </section>

      <section className="container py-12 lg:py-16">
        {courses.docs.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.docs.map((course, i) => (
              <CourseCardDetailed
                key={course.id}
                course={course}
                accent={PALETTE[i % PALETTE.length]}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
            No courses published yet. Add your first course in the{' '}
            <a href="/admin" className="text-primary hover:underline">
              admin panel
            </a>
            .
          </div>
        )}
      </section>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'AI courses',
  description:
    'Browse hub4youth.ai courses in artificial intelligence, machine learning and generative AI — from foundations to building real applications.',
  alternates: { canonical: '/courses' },
  openGraph: {
    title: 'AI courses — hub4youth.ai',
    description:
      'Courses in artificial intelligence, machine learning and generative AI — from foundations to building real applications.',
    url: '/courses',
  },
}
