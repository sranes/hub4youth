import type { Metadata } from 'next'

import Link from 'next/link'
import { Rocket, Sparkles, Target, TrendingUp } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/button'

export const dynamic = 'force-static'

const JOURNEY = [
  {
    icon: Sparkles,
    accent: '#E0992B',
    title: 'The Spark',
    body: 'It starts with "agent play", where youngsters use intuitive blocks to "breathe life" into digital companions.',
  },
  {
    icon: TrendingUp,
    accent: '#2B7FD4',
    title: 'The Shift',
    body: 'As they mature, the "magic" of AI grows alongside them.',
  },
  {
    icon: Rocket,
    accent: '#8B5CF6',
    title: 'The Force',
    body: 'They don’t just use apps; they "deploy" autonomous agents capable of programmable autonomy.',
  },
  {
    icon: Target,
    accent: '#27AE60',
    title: 'The Impact',
    body: 'By merging the frontiers of Artificial Intelligence with the grounded realities of "eco-nomic" literacy, we empower teens and graduates from our ecosystem not just as "technocrats" but as founders.',
  },
]

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border">
        <div className="container py-16 text-center lg:py-24">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Empowering through AI
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
            From blocks to brains
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            The vision behind hub4youth<span className="text-primary">.ai</span> — turning young
            learners from passive consumers into active creators.
          </p>
        </div>
      </section>

      {/* The vision */}
      <section className="container py-16 lg:py-20">
        <div className="mx-auto max-w-3xl space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p>
            At its heart, the concept is about moving from being a passive consumer to an active
            creator. We combine the &ldquo;magic&rdquo; of Artificial Intelligence with the
            practical skills of running a business and managing money, all through a safe app that
            feels like a game.
          </p>
          <p>
            By starting with simple blocks and stories for younger kids and moving to real-world
            projects for teens, we ensure every child is ready for a future where tech is
            everywhere — giving them the confidence to lead and innovate rather than just keep up.
          </p>
        </div>
      </section>

      {/* A foundry for agentic innovation */}
      <section className="border-y border-border bg-card">
        <div className="container py-16 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-medium sm:text-3xl">
              A foundry for agentic innovation
            </h2>
            <p className="mt-3 text-muted-foreground">
              We are building more than a learning platform. This is how a young creator grows with
              us.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {JOURNEY.map(({ icon: Icon, accent, title, body }) => (
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

      {/* Closing */}
      <section className="container py-16 lg:py-20">
        <blockquote className="mx-auto max-w-3xl border-l-2 border-primary pl-6 text-xl font-medium leading-relaxed">
          In today&rsquo;s tech-savvy world, our learners grow not just as founders and pioneers —
          they become the clay that shapes the future. We ensure every child has the agency to
          lead, turning every challenge into a playground for infinite human potential.
        </blockquote>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="container py-16 text-center lg:py-20">
          <h2 className="text-2xl font-medium sm:text-3xl">Join the next generation of creators</h2>
          <p className="mx-auto mt-3 max-w-md text-primary-foreground/80">
            Explore our courses or talk to an advisor to find the right starting point.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary">
              <Link href="/courses">Browse courses</Link>
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
  title: 'About — hub4youth.ai',
  description:
    'The vision behind hub4youth.ai — turning young learners from passive consumers into active creators by merging AI with real-world economic literacy.',
}
