'use client'

import React, { useEffect, useRef, useState } from 'react'

import type { Course } from '@/payload-types'
import { CourseCard } from './CourseCard'

// One distinct colour per card position, so every card reads differently
// regardless of the course's type/icon.
const PALETTE = ['#2B7FD4', '#27AE60', '#8B5CF6', '#E0992B', '#14B8A6', '#EC4899']

const ROTATE_MS = 5000 // first card slides out / next slides in every 5s
const TRANSITION_MS = 600
const GAP = 20 // px — matches the gap-5 used elsewhere

// 1 card on phones, 2 on tablets, 3 on desktop.
function useVisibleCount() {
  const [count, setCount] = useState(3)
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth
      setCount(w < 640 ? 1 : w < 1024 ? 2 : 3)
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])
  return count
}

export const PopularCourses: React.FC<{ courses: Course[] }> = ({ courses }) => {
  const visible = useVisibleCount()
  const viewportRef = useRef<HTMLDivElement>(null)
  const [vw, setVw] = useState(0)
  const [index, setIndex] = useState(0)
  const [animate, setAnimate] = useState(true)
  const paused = useRef(false)

  // Measure the viewport so we can advance by exactly one card + gap.
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setVw(el.clientWidth))
    ro.observe(el)
    setVw(el.clientWidth)
    return () => ro.disconnect()
  }, [])

  const canRotate = courses.length > visible

  // Advance one card every interval (paused on hover).
  useEffect(() => {
    if (!canRotate) {
      setIndex(0)
      return
    }
    const id = setInterval(() => {
      if (!paused.current) setIndex((i) => i + 1)
    }, ROTATE_MS)
    return () => clearInterval(id)
  }, [canRotate])

  // Seamless wrap: when we reach the cloned frame, snap back to the start
  // without animating, then re-enable the transition on the next frame.
  useEffect(() => {
    if (!canRotate) return
    if (index >= courses.length) {
      const t = setTimeout(() => {
        setAnimate(false)
        setIndex(0)
      }, TRANSITION_MS)
      return () => clearTimeout(t)
    }
    if (!animate) {
      const r = requestAnimationFrame(() => setAnimate(true))
      return () => cancelAnimationFrame(r)
    }
  }, [index, animate, canRotate, courses.length])

  if (courses.length === 0) return null

  // Clone the first `visible` cards onto the end so the wrap shows a full window.
  const list = canRotate ? [...courses, ...courses.slice(0, visible)] : courses

  const cardWidth = vw > 0 ? (vw - (visible - 1) * GAP) / visible : 0
  const step = cardWidth + GAP

  return (
    <div
      ref={viewportRef}
      className="overflow-hidden"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <div
        className="flex"
        style={{
          gap: `${GAP}px`,
          transform: `translateX(-${index * step}px)`,
          transition: animate ? `transform ${TRANSITION_MS}ms ease` : 'none',
        }}
      >
        {list.map((course, i) => (
          <div
            key={`${course.id}-${i}`}
            className="flex shrink-0 [&>a]:w-full"
            style={{ width: cardWidth || undefined }}
          >
            <CourseCard
              course={course}
              accent={PALETTE[(i % courses.length) % PALETTE.length]}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
