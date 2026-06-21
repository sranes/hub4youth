import Link from 'next/link'
import { ArrowRight, BookOpen, Clock, Layers, Signal } from 'lucide-react'
import React from 'react'

import type { Course } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/utilities/formatPrice'
import { CourseIcon } from './CourseIcon'

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

function lessonCount(course: Course): number {
  return (course.curriculum || []).reduce(
    (sum, mod) => sum + (Array.isArray(mod.lessons) ? mod.lessons.length : 0),
    0,
  )
}

export const CourseCardDetailed: React.FC<{ course: Course; accent: string }> = ({
  course,
  accent,
}) => {
  const { title, slug, summary, price, currency, duration, level, mode, icon } = course
  const lessons = lessonCount(course)

  return (
    <div
      style={
        {
          '--accent': accent,
          backgroundColor: `color-mix(in srgb, var(--card) 87%, ${accent} 13%)`,
        } as React.CSSProperties
      }
      className="group flex h-full flex-col rounded-xl border border-border p-6 transition-all hover:-translate-y-0.5 hover:border-[var(--accent)]"
    >
      <div
        className="mb-4 flex size-12 items-center justify-center rounded-lg"
        style={{
          backgroundColor: `color-mix(in srgb, var(--card) 76%, ${accent} 24%)`,
          color: accent,
        }}
      >
        <CourseIcon name={icon} className="size-6" />
      </div>

      <h3 className="text-lg font-medium leading-snug">
        <Link href={`/courses/${slug}`} className="hover:underline">
          {title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{summary}</p>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted-foreground">
        {duration && (
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" /> {duration}
          </span>
        )}
        {level && (
          <span className="inline-flex items-center gap-1.5">
            <Signal className="size-3.5" /> {LEVEL_LABELS[level] || level}
          </span>
        )}
        {mode && (
          <span className="inline-flex items-center gap-1.5">
            <Layers className="size-3.5" /> {MODE_LABELS[mode] || mode}
          </span>
        )}
        {lessons > 0 && (
          <span className="inline-flex items-center gap-1.5">
            <BookOpen className="size-3.5" /> {lessons} lessons
          </span>
        )}
      </div>

      <div className="mt-auto pt-5">
        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="text-lg font-medium">{formatPrice(price, currency || 'INR')}</span>
          <Link
            href={`/courses/${slug}`}
            className="inline-flex items-center gap-1 text-sm font-medium"
            style={{ color: accent }}
          >
            View details
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <Button asChild className="mt-4 w-full">
          <Link href={`/enroll?course=${slug}`}>Enroll now</Link>
        </Button>
      </div>
    </div>
  )
}
