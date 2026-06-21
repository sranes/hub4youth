import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

import { applyLessonContent } from '../seed/lessonContent'

// Data migration: populate the free courses' lessons with authored rich-text
// content. Runs on deploy (production Postgres) where the seed script can't reach.
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const updated = await applyLessonContent(payload, req)
  payload.logger.info(`[migration] Seeded lesson content for ${updated} lessons`)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Lesson content is data, not schema — nothing to roll back.
}
