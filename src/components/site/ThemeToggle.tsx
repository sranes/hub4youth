'use client'

import { Moon, Sun } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { useTheme } from '@/providers/Theme'

export const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // The theme is only known on the client, so render the icon after mount to
  // avoid a hydration mismatch.
  useEffect(() => setMounted(true), [])

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={
        'inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-card hover:text-foreground ' +
        (className || '')
      }
    >
      {mounted ? (
        isDark ? (
          <Sun className="size-5" />
        ) : (
          <Moon className="size-5" />
        )
      ) : (
        <span className="size-5" />
      )}
    </button>
  )
}
