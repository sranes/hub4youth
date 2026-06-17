import 'dotenv/config'
import config from '@payload-config'
import { getPayload } from 'payload'

const ADMIN_EMAIL = 'ranes@d2sol.com'
const ADMIN_PASSWORD = 'hub4youth!2026'

const courses = [
  {
    title: 'Full-Stack Web Development',
    slug: 'full-stack-web-development',
    summary: 'Build modern, production-ready web apps with JavaScript, React and Node.',
    price: 24999,
    currency: 'INR' as const,
    duration: '12 weeks',
    level: 'beginner' as const,
    mode: 'live' as const,
    icon: 'globe' as const,
    featured: true,
    outcomes: [
      { outcome: 'Build responsive UIs with React' },
      { outcome: 'Design and consume REST APIs with Node.js' },
      { outcome: 'Work with databases and authentication' },
      { outcome: 'Deploy full-stack apps to the cloud' },
    ],
    curriculum: [
      {
        moduleTitle: 'Frontend foundations',
        lessons: [{ lesson: 'HTML, CSS & modern JavaScript' }, { lesson: 'React fundamentals' }],
      },
      {
        moduleTitle: 'Backend & databases',
        lessons: [{ lesson: 'Node.js & Express' }, { lesson: 'SQL and data modelling' }],
      },
    ],
  },
  {
    title: 'Data Science & AI',
    slug: 'data-science-and-ai',
    summary: 'Go from Python basics to machine learning and AI with hands-on projects.',
    price: 34999,
    currency: 'INR' as const,
    duration: '16 weeks',
    level: 'intermediate' as const,
    mode: 'live' as const,
    icon: 'brain' as const,
    featured: true,
    outcomes: [
      { outcome: 'Analyse data with Python and pandas' },
      { outcome: 'Build and evaluate machine learning models' },
      { outcome: 'Apply modern AI techniques to real problems' },
    ],
    curriculum: [
      {
        moduleTitle: 'Python for data',
        lessons: [{ lesson: 'Python & pandas' }, { lesson: 'Data visualisation' }],
      },
      {
        moduleTitle: 'Machine learning',
        lessons: [{ lesson: 'Supervised learning' }, { lesson: 'Intro to deep learning' }],
      },
    ],
  },
  {
    title: 'Cloud & DevOps',
    slug: 'cloud-and-devops',
    summary: 'Master cloud infrastructure, CI/CD and containers used by modern engineering teams.',
    price: 29999,
    currency: 'INR' as const,
    duration: '10 weeks',
    level: 'intermediate' as const,
    mode: 'hybrid' as const,
    icon: 'cloud' as const,
    featured: true,
    outcomes: [
      { outcome: 'Deploy and manage cloud infrastructure' },
      { outcome: 'Build CI/CD pipelines' },
      { outcome: 'Containerise apps with Docker' },
    ],
    curriculum: [
      {
        moduleTitle: 'Cloud foundations',
        lessons: [{ lesson: 'Cloud concepts' }, { lesson: 'Compute, storage & networking' }],
      },
      {
        moduleTitle: 'DevOps practices',
        lessons: [{ lesson: 'CI/CD pipelines' }, { lesson: 'Docker & containers' }],
      },
    ],
  },
]

const run = async () => {
  const payload = await getPayload({ config })

  const existingUsers = await payload.find({ collection: 'users', limit: 1 })
  if (existingUsers.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: { name: 'Ranes', email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    })
    payload.logger.info(`Created admin user: ${ADMIN_EMAIL}`)
  } else {
    payload.logger.info('Admin user already exists, skipping user creation.')
  }

  for (const course of courses) {
    const existing = await payload.find({
      collection: 'courses',
      where: { slug: { equals: course.slug } },
      limit: 1,
    })
    if (existing.totalDocs > 0) {
      payload.logger.info(`Course "${course.title}" already exists, skipping.`)
      continue
    }
    await payload.create({
      collection: 'courses',
      data: { ...course, _status: 'published' },
      context: { disableRevalidate: true },
    })
    payload.logger.info(`Created course: ${course.title}`)
  }

  payload.logger.info('Seed complete.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
