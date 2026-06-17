import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { CourseCard } from '@/components/site/CourseCard'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function CoursesPage() {
  const payload = await getPayload({ config: configPromise })

  const courses = await payload.find({
    collection: 'courses',
    depth: 1,
    limit: 100,
    overrideAccess: false,
    sort: '-createdAt',
  })

  return (
    <div>
      <section className="border-b border-border">
        <div className="container py-16 text-center lg:py-20">
          <h1 className="text-3xl font-medium sm:text-4xl">Courses</h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Practical, mentor-led IT programs designed to get you hired and help you grow.
          </p>
        </div>
      </section>

      <section className="container py-12 lg:py-16">
        {courses.docs.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.docs.map((course) => (
              <CourseCard key={course.id} course={course} />
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
  title: 'Courses — hub4youth',
  description: 'Browse hub4youth online IT courses in coding, data, AI, cloud and more.',
}
