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
import { HeroCourseShowcase } from '@/components/site/HeroCourseShowcase'

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
    title: 'Live, mentor-led AI classes',
    body: 'Learn AI in real time from working practitioners — ask questions, get unblocked, and stay accountable.',
  },
  {
    icon: BriefcaseBusiness,
    accent: '#27AE60',
    title: 'Build real AI projects',
    body: 'Create a portfolio of AI applications — from models to deployed apps — that proves your skills to employers.',
  },
  {
    icon: Award,
    accent: '#E0992B',
    title: 'Recognised AI certification',
    body: 'Earn a shareable AI certificate you can add to your LinkedIn and résumé.',
  },
]

export default async function HomePage() {
  const courses = await getFeaturedCourses()

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        {/* on-brand decorative glow so wide screens don't read as empty */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-32 -top-24 size-[28rem] rounded-full bg-[#27AE60]/10 blur-3xl" />
          <div className="absolute -right-32 bottom-0 size-[28rem] rounded-full bg-[#2B7FD4]/10 blur-3xl" />
        </div>

        <div className="container grid items-center gap-12 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
          {/* Left: copy */}
          <div className="text-center lg:text-left">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              For students &amp; working professionals
            </span>
            <h1 className="mt-5 text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
              Launch your future with industry-ready AI skills
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground lg:mx-0">
              Live, mentor-led courses in AI and machine learning — learn the concepts and build
              real, intelligent applications, from first principles to your first deployed project.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Button asChild size="lg">
                <Link href="/courses">Browse courses</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Talk to an advisor</Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-3 text-sm text-muted-foreground lg:justify-start">
              <span>
                <strong className="font-medium text-foreground">20+</strong> AI courses
              </span>
              <span>
                <strong className="font-medium text-foreground">5,000+</strong> learners
              </span>
              <span>
                <strong className="font-medium text-foreground">4.8/5</strong> average rating
              </span>
            </div>
          </div>

          {/* Right: auto-flipping course showcase */}
          <HeroCourseShowcase courses={courses} />
        </div>
      </section>

      {/* Featured courses */}
      <section className="container py-16 lg:py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-medium sm:text-3xl">Popular AI courses</h2>
            <p className="mt-2 text-muted-foreground">
              Start with one of our most in-demand AI programs.
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
          <h2 className="text-2xl font-medium sm:text-3xl">Why hub4youth.ai</h2>
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
            <h2 className="text-2xl font-medium sm:text-3xl">Built for the AI generation</h2>
            <p className="mt-4 text-muted-foreground">
              hub4youth.ai helps students and professionals learn artificial intelligence and build
              with it. Our courses are practical, current, and taught by people who work with AI
              every day.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                'Curriculum focused on AI, machine learning and generative AI',
                'Small cohorts with personal mentorship from AI practitioners',
                'Hands-on projects building real AI applications',
                'Career guidance for AI and tech roles',
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
              “Went from zero to building and deploying my own AI projects in months. The live,
              mentor-led classes made all the difference.”
            </p>
            <div className="mt-5 flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                AK
              </div>
              <div className="text-sm">
                <div className="font-medium">Aanya K.</div>
                <div className="text-muted-foreground">AI Foundation graduate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="container py-16 text-center lg:py-20">
          <h2 className="text-2xl font-medium sm:text-3xl">Ready to start building with AI?</h2>
          <p className="mx-auto mt-3 max-w-md text-primary-foreground/80">
            Book a free counselling call or explore our AI courses and enroll today.
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
  title: 'hub4youth.ai — Learn AI & build real projects',
  description:
    'Live, mentor-led AI courses for students and working professionals. Learn artificial intelligence and machine learning, and build real, intelligent applications.',
}
