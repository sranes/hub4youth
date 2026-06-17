// Runs Payload migrations before the production build, but only when the
// database is Postgres (i.e. on Vercel). Local dev uses SQLite + dev "push",
// which has no migrations to run, so this is skipped there.
import { execSync } from 'node:child_process'

const url = process.env.DATABASE_URL || ''

if (url.startsWith('postgres')) {
  console.log('[predeploy] Postgres detected — running Payload migrations…')
  execSync('npx payload migrate', {
    stdio: 'inherit',
    env: { ...process.env, NODE_OPTIONS: '--no-deprecation' },
  })
} else {
  console.log('[predeploy] Non-Postgres DATABASE_URL — skipping migrations.')
}
