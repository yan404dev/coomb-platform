-- Align resume storage with new base/derived resume model

-- Ensure generated_resumes table exists with the expected structure
CREATE TABLE IF NOT EXISTS "generated_resumes" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "base_resume_id" UUID NOT NULL,
  "session_id" UUID,
  "title" TEXT NOT NULL,
  "job_description" TEXT,

  -- About
  "full_name" TEXT,
  "email" TEXT,
  "phone" TEXT,
  "linkedin" TEXT,
  "cpf" TEXT,
  "birth_date" TEXT,
  "has_disability" BOOLEAN,
  "sex" TEXT,
  "race" TEXT,
  "sexual_orientation" TEXT,
  "gender" TEXT,
  "professional_summary" TEXT,
  "career_goals" TEXT,

  -- Arrays
  "experiences" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "skills" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "languages" JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Additional info
  "city" TEXT,
  "salary_expectation" TEXT,
  "has_cnh" BOOLEAN,

  -- Social
  "instagram" TEXT,
  "facebook" TEXT,
  "portfolio" TEXT,

  -- Meta
  "is_published" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deleted_at" TIMESTAMPTZ(6),

  CONSTRAINT "generated_resumes_pkey" PRIMARY KEY ("id")
);

-- Basic indexes (skip if already there)
CREATE INDEX IF NOT EXISTS "generated_resumes_user_id_created_at_idx"
  ON "generated_resumes" ("user_id", "created_at" DESC);
CREATE INDEX IF NOT EXISTS "generated_resumes_base_resume_id_idx"
  ON "generated_resumes" ("base_resume_id");
CREATE INDEX IF NOT EXISTS "generated_resumes_session_id_idx"
  ON "generated_resumes" ("session_id");
CREATE INDEX IF NOT EXISTS "generated_resumes_deleted_at_idx"
  ON "generated_resumes" ("deleted_at");

-- Foreign keys (guarded to avoid duplicates)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'generated_resumes_user_id_fkey'
  ) THEN
    ALTER TABLE "generated_resumes"
      ADD CONSTRAINT "generated_resumes_user_id_fkey"
      FOREIGN KEY ("user_id") REFERENCES "users"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'generated_resumes_base_resume_id_fkey'
  ) THEN
    ALTER TABLE "generated_resumes"
      ADD CONSTRAINT "generated_resumes_base_resume_id_fkey"
      FOREIGN KEY ("base_resume_id") REFERENCES "resumes"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- Bring resumes table to new schema (add columns if missing)
ALTER TABLE "resumes"
  ADD COLUMN IF NOT EXISTS "full_name" TEXT,
  ADD COLUMN IF NOT EXISTS "email" TEXT,
  ADD COLUMN IF NOT EXISTS "phone" TEXT,
  ADD COLUMN IF NOT EXISTS "linkedin" TEXT,
  ADD COLUMN IF NOT EXISTS "cpf" TEXT,
  ADD COLUMN IF NOT EXISTS "birth_date" TEXT,
  ADD COLUMN IF NOT EXISTS "has_disability" BOOLEAN,
  ADD COLUMN IF NOT EXISTS "sex" TEXT,
  ADD COLUMN IF NOT EXISTS "race" TEXT,
  ADD COLUMN IF NOT EXISTS "sexual_orientation" TEXT,
  ADD COLUMN IF NOT EXISTS "gender" TEXT,
  ADD COLUMN IF NOT EXISTS "professional_summary" TEXT,
  ADD COLUMN IF NOT EXISTS "career_goals" TEXT,
  ADD COLUMN IF NOT EXISTS "experiences" JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS "skills" JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS "languages" JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS "city" TEXT,
  ADD COLUMN IF NOT EXISTS "salary_expectation" TEXT,
  ADD COLUMN IF NOT EXISTS "has_cnh" BOOLEAN,
  ADD COLUMN IF NOT EXISTS "instagram" TEXT,
  ADD COLUMN IF NOT EXISTS "facebook" TEXT,
  ADD COLUMN IF NOT EXISTS "portfolio" TEXT,
  ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ(6);

-- Remove legacy columns no longer used by the Prisma schema
ALTER TABLE "resumes"
  DROP COLUMN IF EXISTS "template_id",
  DROP COLUMN IF EXISTS "content",
  DROP COLUMN IF EXISTS "is_published";

DROP INDEX IF EXISTS "resumes_template_id_idx";
DROP INDEX IF EXISTS "resumes_is_published_idx";
DROP INDEX IF EXISTS "resumes_content_idx";

-- Seed completion score where null
UPDATE "resumes"
SET "completion_score" = 0
WHERE "completion_score" IS NULL;

-- Touch updated_at when we added columns (keeps @updatedAt consistent)
UPDATE "resumes"
SET "updated_at" = NOW()
WHERE TRUE;
