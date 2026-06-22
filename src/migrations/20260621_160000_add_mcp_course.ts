import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

import { createMcpCourse } from '../seed/mcpCourse'

// Data migration: create the free "Model Context Protocol (MCP)" course
// (curriculum + per-module quizzes + final assessment). Idempotent — skips if
// the course already exists.
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const created = await createMcpCourse(payload, req)
  payload.logger.info(`[migration] MCP course ${created ? 'created' : 'already present'}`)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Course data — not rolled back automatically.
}
