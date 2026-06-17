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

// A distinct accent per course icon so each card reads differently. Mixed into
// the theme's --card colour below, so the tint stays subtle in light and dark.
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
const DEFAULT_ACCENT = '#6B7280'

export const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  const { title, slug, summary, price, currency, duration, level, icon } = course
  const accent = (icon && ACCENTS[icon]) || DEFAULT_ACCENT

  return (
    <Link
      href={`/courses/${slug}`}
      style={
        {
          '--accent': accent,
          backgroundColor: `color-mix(in srgb, var(--card) 87%, ${accent} 13%)`,
        } as React.CSSProperties
      }
      className="group flex flex-col rounded-xl border border-border p-6 transition-all hover:-translate-y-0.5 hover:border-[var(--accent)]"
    >
      <div
        className="mb-4 flex size-11 items-center justify-center rounded-lg"
        style={{
          backgroundColor: `color-mix(in srgb, var(--card) 76%, ${accent} 24%)`,
          color: accent,
        }}
      >
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
        <span
          className="inline-flex items-center gap-1 text-sm font-medium"
          style={{ color: accent }}
        >
          View
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}
