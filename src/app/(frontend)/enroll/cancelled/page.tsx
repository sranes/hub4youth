import type { Metadata } from 'next'

import Link from 'next/link'
import { XCircle } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/button'

export const dynamic = 'force-static'

export default function EnrollCancelledPage() {
  return (
    <div className="container max-w-xl py-20 text-center lg:py-28">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <XCircle className="size-7" />
      </div>
      <h1 className="mt-6 text-3xl font-medium">Checkout cancelled</h1>
      <p className="mt-3 text-muted-foreground">
        No payment was taken. You can pick up where you left off whenever you&apos;re ready, or talk
        to an advisor if you have questions.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button asChild>
          <Link href="/courses">Back to courses</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">Talk to an advisor</Link>
        </Button>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Checkout cancelled — hub4youth',
  robots: { index: false },
}
