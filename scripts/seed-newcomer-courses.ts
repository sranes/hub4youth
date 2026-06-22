import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

import { createNewcomerCourses } from '../src/seed/newcomerCourses'

// Standalone runner: creates the free newcomer courses (idempotent). In
// production the same courses are created by the data migration
// 20260622_*_add_newcomer_courses. Run with: npx tsx scripts/seed-newcomer-courses.ts
async function main() {
  const payload = await getPayload({ config })
  const created = await createNewcomerCourses(payload)
  console.log(`Newcomer courses created: ${created}`)
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
