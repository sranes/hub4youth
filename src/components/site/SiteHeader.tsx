'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import { BrandMark } from '@/components/site/BrandMark'
import { ThemeToggle } from '@/components/site/ThemeToggle'
import { logoutStudent } from '@/students/actions'

const NAV = [
  { label: 'Courses', href: '/courses' },
  { label: 'About', href: '/about' },
  { label: 'Why us', href: '/#why' },
  { label: 'Contact', href: '/contact' },
]

export type HeaderStudent = { name?: string | null; email: string }

export const SiteHeader: React.FC<{ student?: HeaderStudent | null }> = ({ student }) => {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    await logoutStudent()
    setOpen(false)
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-medium">
          <BrandMark className="size-8" />
          <span>
            hub4youth<span className="text-primary">.ai</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />

          <div className="hidden items-center gap-2 md:flex">
            {student ? (
              <>
                <Link
                  href="/learn"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  My learning
                </Link>
                <Link
                  href="/account"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Account
                </Link>
                <Button size="sm" variant="outline" onClick={handleLogout}>
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Log in
                </Link>
                <Button asChild size="sm">
                  <Link href="/courses">Enroll now</Link>
                </Button>
              </>
            )}
          </div>

          <button
            className="inline-flex size-9 items-center justify-center md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background md:hidden">
          <div className="container flex flex-col gap-1 py-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-card hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {student ? (
              <>
                <Link
                  href="/learn"
                  className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-card hover:text-foreground"
                  onClick={() => setOpen(false)}
                >
                  My learning
                </Link>
                <Link
                  href="/account"
                  className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-card hover:text-foreground"
                  onClick={() => setOpen(false)}
                >
                  Account
                </Link>
                <Button size="sm" variant="outline" className="mt-2" onClick={handleLogout}>
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-card hover:text-foreground"
                  onClick={() => setOpen(false)}
                >
                  Log in
                </Link>
                <Button asChild size="sm" className="mt-2">
                  <Link href="/courses" onClick={() => setOpen(false)}>
                    Enroll now
                  </Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
