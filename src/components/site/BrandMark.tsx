import React from 'react'

/**
 * hub4youth.ai logo mark: a brain split into an organic green half (with a leaf)
 * and a blue "AI" half (with a small circuit). Colors are fixed to the brand
 * identity so the logo stays consistent regardless of the selected theme.
 */
export const BrandMark: React.FC<{ className?: string; title?: string }> = ({
  className,
  title = 'hub4youth.ai',
}) => (
  <svg
    viewBox="0 0 32 32"
    className={className}
    role="img"
    aria-label={title}
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    {/* left organic half */}
    <path d="M16 2 A14 14 0 0 0 16 30 Z" fill="#27AE60" />
    {/* right AI half */}
    <path d="M16 2 A14 14 0 0 1 16 30 Z" fill="#2B7FD4" />
    {/* leaf on the green half */}
    <path
      d="M10 10.5 C13.2 12.8 13.2 19.2 10 21.5 C6.8 19.2 6.8 12.8 10 10.5 Z"
      fill="#ffffff"
      opacity="0.9"
    />
    <path d="M10 11 L10 21" stroke="#27AE60" strokeWidth="1" strokeLinecap="round" />
    {/* circuit on the blue half */}
    <g fill="#ffffff">
      <circle cx="21" cy="10.5" r="1.5" />
      <circle cx="24.5" cy="17" r="1.5" />
      <circle cx="20" cy="21.5" r="1.5" />
    </g>
    <path
      d="M21 10.5 L24.5 17 L20 21.5"
      fill="none"
      stroke="#ffffff"
      strokeWidth="1"
      opacity="0.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
