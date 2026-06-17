import Link from 'next/link'
import React from 'react'

import { BrandMark } from '@/components/site/BrandMark'

export const SiteFooter: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="container grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2 text-lg font-medium">
            <BrandMark className="size-8" />
            <span>
              hub4youth<span className="text-primary">.ai</span>
            </span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Empowering the next generation through AI — industry-ready online IT courses for
            students and working professionals.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/courses" className="hover:text-foreground">
                All courses
              </Link>
            </li>
            <li>
              <Link href="/#why" className="hover:text-foreground">
                Why hub4youth
              </Link>
            </li>
            <li>
              <Link href="/posts" className="hover:text-foreground">
                Blog
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/about" className="hover:text-foreground">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium">Get in touch</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="mailto:hello@hub4youth.ai" className="hover:text-foreground">
                hello@hub4youth.ai
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container flex flex-col items-center justify-between gap-2 py-6 text-sm text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} hub4youth. All rights reserved.</span>
          <span>Built for the next generation of tech talent.</span>
        </div>
      </div>
    </footer>
  )
}
