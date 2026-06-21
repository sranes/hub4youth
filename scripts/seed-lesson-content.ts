import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

import { applyLessonContent } from '../src/seed/lessonContent'

// Standalone runner: writes the authored lesson content into the current DB.
// (In production the same content is applied automatically by the data migration
// 20260621_*_seed_lesson_content.) Run with: npx tsx scripts/seed-lesson-content.ts
async function main() {
  const payload = await getPayload({ config })
  const updated = await applyLessonContent(payload)
  console.log(`Done — ${updated} lessons updated.`)
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
