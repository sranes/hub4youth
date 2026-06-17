import Link from 'next/link'
import { ArrowRight, Clock, Signal } from 'lucide-react'
import React from 'react'

import type { Course } from '@/payload-types'
import { formatPrice } from '@/utilities/formatPrice'
import { CourseIcon } from './CourseIcon'

const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  all: 'All levels',
}

export const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  const { title, slug, summary, price, currency, duration, level, icon } = course

  return (
    <Link
      href={`/courses/${slug}`}
      className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
    >
      <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <CourseIcon name={icon} className="size-5" />
      </div>

      <h3 className="text-lg font-medium leading-snug">{title}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{summary}</p>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {duration && (
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" /> {duration}
          </span>
        )}
        {level && (
          <span className="inline-flex items-center gap-1">
            <Signal className="size-3.5" /> {LEVEL_LABELS[level] || level}
          </span>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <span className="font-medium">{formatPrice(price, currency || 'INR')}</span>
        <span className="inline-flex items-center gap-1 text-sm text-primary">
          View
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}
