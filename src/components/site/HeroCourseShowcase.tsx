'use client'

import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

import type { Course } from '@/payload-types'
import { CourseIcon } from './CourseIcon'

const ACCENTS: Record<string, string> = {
  code: '#6366F1',
  globe: '#27AE60',
  chart: '#14B8A6',
  brain: '#8B5CF6',
  cloud: '#2B7FD4',
  smartphone: '#EC4899',
  shield: '#E2574C',
  database: '#E0992B',
  palette: '#D946EF',
}
const DEFAULT_ACCENT = '#2B7FD4'

const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  all: 'All levels',
}
const MODE_LABELS: Record<string, string> = {
  live: 'Live',
  'self-paced': 'Self-paced',
  hybrid: 'Hybrid',
}

const ROTATE_MS = 4500

export const HeroCourseShowcase: React.FC<{ courses: Course[] }> = ({ courses }) => {
  const [index, setIndex] = useState(0)
  const paused = useRef(false)

  useEffect(() => {
    if (courses.length <= 1) return
    const id = setInterval(() => {
      if (!paused.current) setIndex((i) => (i + 1) % courses.length)
    }, ROTATE_MS)
    return () => clearInterval(id)
  }, [courses.length])

  if (courses.length === 0) return null

  const course = courses[index]
  const accent = (course.icon && ACCENTS[course.icon]) || DEFAULT_ACCENT
  const highlights = (course.outcomes || []).slice(0, 3)
  const tags = [
    course.duration,
    course.level ? LEVEL_LABELS[course.level] || course.level : null,
  ].filter(Boolean) as string[]

  return (
    <div
      className="relative mx-auto w-full max-w-sm lg:mx-0"
      style={{ perspective: '1400px' }}
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <div
        key={index}
        className="hero-card-flip flex h-[33rem] flex-col overflow-hidden rounded-2xl border border-border bg-background"
        style={{ '--accent': accent } as React.CSSProperties}
      >
        {/* Accent header */}
        <div
          className="p-6"
          style={{ backgroundColor: `color-mix(in srgb, var(--card) 84%, ${accent} 16%)` }}
        >
          <div className="flex items-start justify-between">
            <span
              className="rounded-full px-3 py-1 text-xs font-medium"
              style={{
                backgroundColor: `color-mix(in srgb, var(--background) 55%, ${accent} 45%)`,
                color: '#fff',
              }}
            >
              {course.mode === 'self-paced' ? 'Free · self-paced' : 'Live cohort'}
            </span>
            <span
              className="flex size-11 items-center justify-center rounded-xl bg-background"
              style={{ color: accent }}
            >
              <CourseIcon name={course.icon} className="size-5" />
            </span>
          </div>
          <h3 className="mt-4 text-xl font-medium leading-snug">{course.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {course.duration || (course.mode ? MODE_LABELS[course.mode] : '')}
          </p>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-6">
          <p className="line-clamp-2 text-sm text-muted-foreground">{course.summary}</p>

          {highlights.length > 0 && (
            <div className="mt-5">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                What you’ll learn
              </div>
              <ul className="mt-3 space-y-2.5">
                {highlights.map((h) => (
                  <li key={h.id || h.outcome} className="flex items-start gap-2.5 text-sm">
                    <span
                      className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: `color-mix(in srgb, var(--background) 75%, ${accent} 25%)` }}
                    >
                      <Check className="size-3" style={{ color: accent }} />
                    </span>
                    <span className="line-clamp-1">{h.outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags + CTA pinned to the bottom */}
          <div className="mt-auto pt-5">
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md px-2 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: `color-mix(in srgb, var(--card) 70%, ${accent} 30%)`,
                    color: `color-mix(in srgb, ${accent} 75%, #000 25%)`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <Link
              href={`/courses/${course.slug}`}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[0.99]"
              style={{ backgroundColor: accent }}
            >
              View course
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Dots */}
      {courses.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {courses.map((c, i) => (
            <button
              key={c.id}
              type="button"
              aria-label={`Show ${c.title}`}
              onClick={() => setIndex(i)}
              className="h-2 rounded-full transition-all"
              style={{
                width: i === index ? '1.25rem' : '0.5rem',
                backgroundColor:
                  i === index ? accent : 'color-mix(in srgb, var(--foreground) 25%, transparent)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
