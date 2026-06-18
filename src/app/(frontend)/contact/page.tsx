import type { Metadata } from 'next'

import { Mail, MapPin, Phone } from 'lucide-react'
import React from 'react'

import { EnquiryForm } from './EnquiryForm'

export const dynamic = 'force-static'

type Args = { searchParams: Promise<{ course?: string }> }

export default async function ContactPage({ searchParams }: Args) {
  const { course } = await searchParams

  return (
    <div>
      <section className="border-b border-border">
        <div className="container py-16 text-center lg:py-20">
          <h1 className="text-3xl font-medium sm:text-4xl">Get in touch</h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Have a question or ready to enroll? Send us an enquiry and a course advisor will get
            back to you.
          </p>
        </div>
      </section>

      <section className="container grid gap-12 py-12 lg:grid-cols-3 lg:py-16">
        <div className="lg:col-span-2">
          <EnquiryForm defaultCourse={course} />
        </div>

        <aside className="space-y-6 lg:col-span-1">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-medium">Contact details</h2>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
                <a href="mailto:hello@hub4youth.ai" className="hover:text-primary">
                  hello@hub4youth.ai
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="text-muted-foreground">+91 00000 00000</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="text-muted-foreground">Online — learn from anywhere</span>
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-border p-6 text-sm text-muted-foreground">
            <p>
              Prefer a call? Leave your phone number and a preferred time in the message, and
              we&apos;ll ring you back.
            </p>
          </div>
        </aside>
      </section>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Contact — hub4youth.ai',
  description: 'Get in touch with hub4youth.ai to enquire about our AI courses.',
}
