import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { getActiveBrandTheme } from '@/brand'
import { AdminBar } from '@/components/AdminBar'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html
      className={cn(GeistSans.variable, GeistMono.variable)}
      data-brand={getActiveBrandTheme()}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalOrganization',
              name: 'hub4youth.ai',
              url: getServerSideURL(),
              logo: `${getServerSideURL()}/favicon.svg`,
              description:
                'Live, mentor-led AI courses for students and working professionals — learn artificial intelligence and build real applications.',
              email: 'hello@hub4youth.ai',
            }),
          }}
        />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <SiteHeader />
          {children}
          <SiteFooter />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: {
    default: 'hub4youth.ai — Learn AI & build real projects',
    template: '%s · hub4youth.ai',
  },
  description:
    'Live, mentor-led AI courses for students and working professionals. Learn artificial intelligence and machine learning, and build real, intelligent applications.',
  applicationName: 'hub4youth.ai',
  keywords: [
    'AI courses',
    'artificial intelligence course',
    'machine learning course',
    'generative AI',
    'learn AI online',
    'AI for students',
    'AI bootcamp',
    'data science',
    'mentor-led AI training',
    'hub4youth',
  ],
  authors: [{ name: 'hub4youth.ai' }],
  creator: 'hub4youth.ai',
  publisher: 'hub4youth.ai',
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@hub4youth',
  },
}
