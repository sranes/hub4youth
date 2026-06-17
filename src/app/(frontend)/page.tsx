import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import {
  ArrowRight,
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  Quote,
  Users,
} from 'lucide-react'
import React from 'react'

import type { Course } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { CourseCard } from '@/components/site/CourseCard'

export const dynamic = 'force-static'
export const revalidate = 600

async function getFeaturedCourses(): Promise<Course[]> {
  const payload = await getPayload({ config: configPromise })

  const featured = await payload.find({
    collection: 'courses',
    depth: 1,
    limit: 6,
    overrideAccess: false,
    where: { featured: { equals: true } },
  })

  if (featured.docs.length > 0) return featured.docs

  const latest = await payload.find({
    collection: 'courses',
    depth: 1,
    limit: 6,
    overrideAccess: false,
    sort: '-createdAt',
  })
  return latest.docs
}

const WHY = [
  {
    icon: Users,
    accent: '#2B7FD4',
    title: 'Live, mentor-led classes',
    body: 'Learn from working professionals in real time — ask questions, get unblocked, stay accountable.',
  },
  {
    icon: BriefcaseBusiness,
    accent: '#27AE60',
    title: 'Job-ready projects',
    body: 'Build a portfolio of real projects that demonstrates your skills to employers.',
  },
  {
    icon: Award,
    accent: '#E0992B',
    title: 'Recognised certification',
    body: 'Earn a shareable certificate you can add to your LinkedIn and résumé.',
  },
]

export default async function HomePage() {
  const courses = await getFeaturedCourses()

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border">
        <div className="container py-20 text-center lg:py-28">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            For students &amp; working professionals
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
            Launch your tech career with industry-ready IT courses
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Hands-on, mentor-led training in coding, data, AI and cloud. Learn live, build real
            projects, get certified.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/courses">Browse courses</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">Talk to an advisor</Link>
            </Button>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-x-10 gap-y-3 text-sm text-muted-foreground">
            <span>
              <strong className="font-medium text-foreground">20+</strong> courses
            </span>
            <span>
              <strong className="font-medium text-foreground">5,000+</strong> learners
            </span>
            <span>
              <strong className="font-medium text-foreground">4.8/5</strong> average rating
            </span>
          </div>
        </div>
      </section>

      {/* Featured courses */}
      <section className="container py-16 lg:py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-medium sm:text-3xl">Popular courses</h2>
            <p className="mt-2 text-muted-foreground">
              Start with one of our most in-demand programs.
            </p>
          </div>
          <Link
            href="/courses"
            className="hidden items-center gap-1 text-sm text-primary hover:underline sm:inline-flex"
          >
            View all <ArrowRight className="size-4" />
          </Link>
        </div>

        {courses.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
            No courses published yet. Add your first course in the{' '}
            <a href="/admin" className="text-primary hover:underline">
              admin panel
            </a>
            .
          </div>
        )}
      </section>

      {/* Why hub4youth */}
      <section id="why" className="border-y border-border bg-card">
        <div className="container py-16 lg:py-20">
          <h2 className="text-2xl font-medium sm:text-3xl">Why hub4youth</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {WHY.map(({ icon: Icon, accent, title, body }) => (
              <div
                key={title}
                className="rounded-xl border border-border p-6"
                style={{
                  backgroundColor: `color-mix(in srgb, var(--card) 87%, ${accent} 13%)`,
                }}
              >
                <div
                  className="flex size-11 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: `color-mix(in srgb, var(--card) 76%, ${accent} 24%)`,
                    color: accent,
                  }}
                >
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-4 text-lg font-medium">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="container py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-medium sm:text-3xl">Built for the next generation</h2>
            <p className="mt-4 text-muted-foreground">
              hub4youth helps students and professionals break into and grow within tech. Our
              courses are practical, current, and taught by people who do the work every day.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                'Curriculum mapped to real industry roles',
                'Small cohorts with personal mentorship',
                'Flexible schedules for students and working pros',
                'Career guidance and interview preparation',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card p-8">
            <Quote className="size-7 text-primary" />
            <p className="mt-4 text-lg leading-relaxed">
              “Went from zero coding to a junior developer offer in 5 months. The live classes made
              all the difference.”
            </p>
            <div className="mt-5 flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                AK
              </div>
              <div className="text-sm">
                <div className="font-medium">Aanya K.</div>
                <div className="text-muted-foreground">Web Development graduate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="container py-16 text-center lg:py-20">
          <h2 className="text-2xl font-medium sm:text-3xl">Ready to start learning?</h2>
          <p className="mx-auto mt-3 max-w-md text-primary-foreground/80">
            Book a free counselling call or browse our courses and enroll today.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary">
              <Link href="/courses">Get started</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link href="/contact">Talk to an advisor</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'hub4youth — Online IT courses for students & professionals',
  description:
    'Hands-on, mentor-led online IT courses in coding, data, AI and cloud. Learn live, build real projects, get certified.',
}
