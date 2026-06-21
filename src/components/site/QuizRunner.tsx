'use client'

import { useRouter } from 'next/navigation'
import { CheckCircle2, XCircle } from 'lucide-react'
import React, { useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { submitQuiz, type QuizResult } from '@/app/(frontend)/learn/actions'

export type QuizQuestion = {
  id: string
  question: string
  type: 'single' | 'multiple'
  options: { id: string; text: string }[]
}

type Props = {
  enrollmentId: number
  quizKey: string
  title: string
  passMark: number
  required: boolean
  questions: QuizQuestion[]
  initialResult: QuizResult | null
}

export const QuizRunner: React.FC<Props> = ({
  enrollmentId,
  quizKey,
  title,
  passMark,
  required,
  questions,
  initialResult,
}) => {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<string, Set<string>>>({})
  const [result, setResult] = useState<QuizResult | null>(initialResult)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const select = (q: QuizQuestion, optionId: string) => {
    setAnswers((prev) => {
      const current = new Set(prev[q.id] || [])
      if (q.type === 'single') {
        return { ...prev, [q.id]: new Set([optionId]) }
      }
      if (current.has(optionId)) current.delete(optionId)
      else current.add(optionId)
      return { ...prev, [q.id]: current }
    })
  }

  const allAnswered = questions.every((q) => (answers[q.id]?.size || 0) > 0)

  const submit = () => {
    setError(null)
    const payload: Record<string, string[]> = {}
    for (const q of questions) payload[q.id] = [...(answers[q.id] || [])]
    startTransition(async () => {
      const res = await submitQuiz(enrollmentId, quizKey, payload)
      if (!res.ok) {
        setError(res.error)
        return
      }
      setResult({ score: res.score, total: res.total, passed: res.passed })
      router.refresh() // unlock the next module if passed
    })
  }

  const pct = result ? Math.round((result.score / Math.max(result.total, 1)) * 100) : 0

  return (
    <div>
      <p className="text-sm text-muted-foreground">
        {questions.length} question{questions.length === 1 ? '' : 's'} · pass mark {passMark}%
        {required ? ' · required to continue' : ' · optional'}
      </p>
      <h1 className="mt-1 text-2xl font-medium sm:text-3xl">{title}</h1>

      {result && (
        <div
          className={`mt-6 flex items-start gap-3 rounded-lg border p-4 ${
            result.passed
              ? 'border-primary/40 bg-primary/5'
              : 'border-destructive/40 bg-destructive/5'
          }`}
        >
          {result.passed ? (
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
          ) : (
            <XCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
          )}
          <div className="text-sm">
            <p className="font-medium">
              {result.passed ? 'Passed' : 'Not passed yet'} — {result.score}/{result.total} ({pct}%)
            </p>
            <p className="mt-1 text-muted-foreground">
              {result.passed
                ? required
                  ? 'The next module is now unlocked.'
                  : 'Nice work.'
                : `You need ${passMark}% to pass. Review the lessons and try again.`}
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-6">
        {questions.map((q, qi) => (
          <fieldset key={q.id} className="rounded-lg border border-border p-5">
            <legend className="px-1 text-sm font-medium">
              {qi + 1}. {q.question}
              {q.type === 'multiple' && (
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  (select all that apply)
                </span>
              )}
            </legend>
            <div className="mt-3 space-y-2">
              {q.options.map((o) => {
                const checked = answers[q.id]?.has(o.id) || false
                return (
                  <label
                    key={o.id}
                    className="flex cursor-pointer items-center gap-3 rounded-md border border-border px-3 py-2 text-sm hover:bg-card"
                  >
                    <input
                      type={q.type === 'single' ? 'radio' : 'checkbox'}
                      name={q.id}
                      checked={checked}
                      onChange={() => select(q, o.id)}
                      className="size-4 accent-[var(--primary)]"
                    />
                    <span>{o.text}</span>
                  </label>
                )
              })}
            </div>
          </fieldset>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <div className="mt-6 flex items-center gap-3">
        <Button type="button" onClick={submit} disabled={pending || !allAnswered}>
          {pending ? 'Submitting…' : result ? 'Try again' : 'Submit answers'}
        </Button>
        {!allAnswered && (
          <span className="text-sm text-muted-foreground">Answer every question to submit.</span>
        )}
      </div>
    </div>
  )
}
