'use client'

import { useRouter } from 'next/navigation'
import { Check, Circle } from 'lucide-react'
import React, { useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { setLessonComplete } from '@/app/(frontend)/learn/actions'

type Props = {
  enrollmentId: number
  lessonId: string
  initialComplete: boolean
}

export const LessonComplete: React.FC<Props> = ({ enrollmentId, lessonId, initialComplete }) => {
  const router = useRouter()
  const [complete, setComplete] = useState(initialComplete)
  const [pending, startTransition] = useTransition()

  const toggle = () => {
    const next = !complete
    setComplete(next) // optimistic
    startTransition(async () => {
      const res = await setLessonComplete(enrollmentId, lessonId, next)
      if (!res.ok) {
        setComplete(!next) // revert on failure
        return
      }
      router.refresh() // refresh sidebar checkmarks + dashboard progress
    })
  }

  return (
    <Button
      type="button"
      variant={complete ? 'secondary' : 'default'}
      onClick={toggle}
      disabled={pending}
    >
      {complete ? <Check className="mr-1.5 size-4" /> : <Circle className="mr-1.5 size-4" />}
      {complete ? 'Completed' : 'Mark as complete'}
    </Button>
  )
}
