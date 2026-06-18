const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://hub4youth.ai')

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  // Marketing pages and course detail pages are included; admin/api/checkout and
  // the Payload-generated sitemaps are excluded.
  exclude: [
    '/admin',
    '/admin/*',
    '/api/*',
    '/enroll',
    '/enroll/*',
    '/next/*',
    '/search',
    '/posts/*',
    '/posts-sitemap.xml',
    '/pages-sitemap.xml',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/enroll'],
      },
    ],
    additionalSitemaps: [`${SITE_URL}/pages-sitemap.xml`, `${SITE_URL}/posts-sitemap.xml`],
  },
}
