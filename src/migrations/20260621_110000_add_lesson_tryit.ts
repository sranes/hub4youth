import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "courses_curriculum_lessons" ADD COLUMN "try_it" varchar;
  ALTER TABLE "_courses_v_version_curriculum_lessons" ADD COLUMN "try_it" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "courses_curriculum_lessons" DROP COLUMN "try_it";
  ALTER TABLE "_courses_v_version_curriculum_lessons" DROP COLUMN "try_it";`)
}
