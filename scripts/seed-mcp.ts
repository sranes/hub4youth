import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

import { createMcpCourse } from '../src/seed/mcpCourse'

// Standalone runner: creates the free MCP course (idempotent). In production the
// same course is created by the data migration 20260621_*_add_mcp_course.
// Run with: npx tsx scripts/seed-mcp.ts
async function main() {
  const payload = await getPayload({ config })
  const created = await createMcpCourse(payload)
  console.log(created ? 'MCP course created.' : 'MCP course already exists — nothing to do.')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
