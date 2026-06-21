import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "students" ADD COLUMN "phone" varchar;
  ALTER TABLE "students" ADD COLUMN "two_factor_enabled" boolean DEFAULT false;
  ALTER TABLE "students" ADD COLUMN "two_factor_challenge_id" varchar;
  ALTER TABLE "students" ADD COLUMN "two_factor_code_hash" varchar;
  ALTER TABLE "students" ADD COLUMN "two_factor_expires_at" timestamp(3) with time zone;
  ALTER TABLE "students" ADD COLUMN "two_factor_pending_token" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "students" DROP COLUMN "phone";
  ALTER TABLE "students" DROP COLUMN "two_factor_enabled";
  ALTER TABLE "students" DROP COLUMN "two_factor_challenge_id";
  ALTER TABLE "students" DROP COLUMN "two_factor_code_hash";
  ALTER TABLE "students" DROP COLUMN "two_factor_expires_at";
  ALTER TABLE "students" DROP COLUMN "two_factor_pending_token";`)
}
