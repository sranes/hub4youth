import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

import { applyLessonContent } from '../seed/lessonContent'

// Data migration: re-apply the (now enriched) lesson content and write the
// per-module quizzes + final assessments. Runs after add_quizzes so the quiz
// tables exist. The earlier seed migration already ran on prod, so this newer
// one is needed to refresh existing courses with the richer content + quizzes.
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const updated = await applyLessonContent(payload, req)
  payload.logger.info(`[migration] Enriched content + quizzes for ${updated} lessons`)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Content/quizzes are data, not schema — nothing to roll back.
}
