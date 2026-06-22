import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

import { createNewcomerCourses } from '../seed/newcomerCourses'

// Data migration: create the free hands-on newcomer courses (AI for Everyday
// Productivity, Build Your First AI App, Chat with Your Documents (RAG), and
// Python for AI). Idempotent — each is skipped if its slug already exists.
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const created = await createNewcomerCourses(payload, req)
  payload.logger.info(`[migration] Newcomer courses created: ${created}`)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Course data — not rolled back automatically.
}
