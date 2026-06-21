import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_courses_curriculum_quiz_questions_type" AS ENUM('single', 'multiple');
  CREATE TYPE "public"."enum_courses_final_assessment_questions_type" AS ENUM('single', 'multiple');
  CREATE TYPE "public"."enum__courses_v_version_curriculum_quiz_questions_type" AS ENUM('single', 'multiple');
  CREATE TYPE "public"."enum__courses_v_version_final_assessment_questions_type" AS ENUM('single', 'multiple');
  CREATE TABLE "courses_curriculum_quiz_questions_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"correct" boolean DEFAULT false
  );
  
  CREATE TABLE "courses_curriculum_quiz_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"type" "enum_courses_curriculum_quiz_questions_type" DEFAULT 'single'
  );
  
  CREATE TABLE "courses_final_assessment_questions_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"correct" boolean DEFAULT false
  );
  
  CREATE TABLE "courses_final_assessment_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"type" "enum_courses_final_assessment_questions_type" DEFAULT 'single'
  );
  
  CREATE TABLE "_courses_v_version_curriculum_quiz_questions_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"correct" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_courses_v_version_curriculum_quiz_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"type" "enum__courses_v_version_curriculum_quiz_questions_type" DEFAULT 'single',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_courses_v_version_final_assessment_questions_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"correct" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_courses_v_version_final_assessment_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"type" "enum__courses_v_version_final_assessment_questions_type" DEFAULT 'single',
  	"_uuid" varchar
  );
  
  ALTER TABLE "courses_curriculum" ADD COLUMN "quiz_required" boolean DEFAULT false;
  ALTER TABLE "courses_curriculum" ADD COLUMN "quiz_pass_mark" numeric DEFAULT 70;
  ALTER TABLE "courses" ADD COLUMN "final_assessment_required" boolean DEFAULT false;
  ALTER TABLE "courses" ADD COLUMN "final_assessment_pass_mark" numeric DEFAULT 70;
  ALTER TABLE "_courses_v_version_curriculum" ADD COLUMN "quiz_required" boolean DEFAULT false;
  ALTER TABLE "_courses_v_version_curriculum" ADD COLUMN "quiz_pass_mark" numeric DEFAULT 70;
  ALTER TABLE "_courses_v" ADD COLUMN "version_final_assessment_required" boolean DEFAULT false;
  ALTER TABLE "_courses_v" ADD COLUMN "version_final_assessment_pass_mark" numeric DEFAULT 70;
  ALTER TABLE "enrollments" ADD COLUMN "quiz_results" jsonb DEFAULT '{}'::jsonb;
  ALTER TABLE "courses_curriculum_quiz_questions_options" ADD CONSTRAINT "courses_curriculum_quiz_questions_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses_curriculum_quiz_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_curriculum_quiz_questions" ADD CONSTRAINT "courses_curriculum_quiz_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses_curriculum"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_final_assessment_questions_options" ADD CONSTRAINT "courses_final_assessment_questions_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses_final_assessment_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_final_assessment_questions" ADD CONSTRAINT "courses_final_assessment_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_courses_v_version_curriculum_quiz_questions_options" ADD CONSTRAINT "_courses_v_version_curriculum_quiz_questions_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_courses_v_version_curriculum_quiz_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_courses_v_version_curriculum_quiz_questions" ADD CONSTRAINT "_courses_v_version_curriculum_quiz_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_courses_v_version_curriculum"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_courses_v_version_final_assessment_questions_options" ADD CONSTRAINT "_courses_v_version_final_assessment_questions_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_courses_v_version_final_assessment_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_courses_v_version_final_assessment_questions" ADD CONSTRAINT "_courses_v_version_final_assessment_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_courses_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "courses_curriculum_quiz_questions_options_order_idx" ON "courses_curriculum_quiz_questions_options" USING btree ("_order");
  CREATE INDEX "courses_curriculum_quiz_questions_options_parent_id_idx" ON "courses_curriculum_quiz_questions_options" USING btree ("_parent_id");
  CREATE INDEX "courses_curriculum_quiz_questions_order_idx" ON "courses_curriculum_quiz_questions" USING btree ("_order");
  CREATE INDEX "courses_curriculum_quiz_questions_parent_id_idx" ON "courses_curriculum_quiz_questions" USING btree ("_parent_id");
  CREATE INDEX "courses_final_assessment_questions_options_order_idx" ON "courses_final_assessment_questions_options" USING btree ("_order");
  CREATE INDEX "courses_final_assessment_questions_options_parent_id_idx" ON "courses_final_assessment_questions_options" USING btree ("_parent_id");
  CREATE INDEX "courses_final_assessment_questions_order_idx" ON "courses_final_assessment_questions" USING btree ("_order");
  CREATE INDEX "courses_final_assessment_questions_parent_id_idx" ON "courses_final_assessment_questions" USING btree ("_parent_id");
  CREATE INDEX "_courses_v_version_curriculum_quiz_questions_options_order_idx" ON "_courses_v_version_curriculum_quiz_questions_options" USING btree ("_order");
  CREATE INDEX "_courses_v_version_curriculum_quiz_questions_options_parent_id_idx" ON "_courses_v_version_curriculum_quiz_questions_options" USING btree ("_parent_id");
  CREATE INDEX "_courses_v_version_curriculum_quiz_questions_order_idx" ON "_courses_v_version_curriculum_quiz_questions" USING btree ("_order");
  CREATE INDEX "_courses_v_version_curriculum_quiz_questions_parent_id_idx" ON "_courses_v_version_curriculum_quiz_questions" USING btree ("_parent_id");
  CREATE INDEX "_courses_v_version_final_assessment_questions_options_order_idx" ON "_courses_v_version_final_assessment_questions_options" USING btree ("_order");
  CREATE INDEX "_courses_v_version_final_assessment_questions_options_parent_id_idx" ON "_courses_v_version_final_assessment_questions_options" USING btree ("_parent_id");
  CREATE INDEX "_courses_v_version_final_assessment_questions_order_idx" ON "_courses_v_version_final_assessment_questions" USING btree ("_order");
  CREATE INDEX "_courses_v_version_final_assessment_questions_parent_id_idx" ON "_courses_v_version_final_assessment_questions" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "courses_curriculum_quiz_questions_options" CASCADE;
  DROP TABLE "courses_curriculum_quiz_questions" CASCADE;
  DROP TABLE "courses_final_assessment_questions_options" CASCADE;
  DROP TABLE "courses_final_assessment_questions" CASCADE;
  DROP TABLE "_courses_v_version_curriculum_quiz_questions_options" CASCADE;
  DROP TABLE "_courses_v_version_curriculum_quiz_questions" CASCADE;
  DROP TABLE "_courses_v_version_final_assessment_questions_options" CASCADE;
  DROP TABLE "_courses_v_version_final_assessment_questions" CASCADE;
  ALTER TABLE "courses_curriculum" DROP COLUMN "quiz_required";
  ALTER TABLE "courses_curriculum" DROP COLUMN "quiz_pass_mark";
  ALTER TABLE "courses" DROP COLUMN "final_assessment_required";
  ALTER TABLE "courses" DROP COLUMN "final_assessment_pass_mark";
  ALTER TABLE "_courses_v_version_curriculum" DROP COLUMN "quiz_required";
  ALTER TABLE "_courses_v_version_curriculum" DROP COLUMN "quiz_pass_mark";
  ALTER TABLE "_courses_v" DROP COLUMN "version_final_assessment_required";
  ALTER TABLE "_courses_v" DROP COLUMN "version_final_assessment_pass_mark";
  ALTER TABLE "enrollments" DROP COLUMN "quiz_results";
  DROP TYPE "public"."enum_courses_curriculum_quiz_questions_type";
  DROP TYPE "public"."enum_courses_final_assessment_questions_type";
  DROP TYPE "public"."enum__courses_v_version_curriculum_quiz_questions_type";
  DROP TYPE "public"."enum__courses_v_version_final_assessment_questions_type";`)
}
