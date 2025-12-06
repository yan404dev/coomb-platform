-- Create skills table to normalize resume skills
CREATE TABLE "skills" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "resume_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "level" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "skills_resume_id_idx" ON "skills"("resume_id");

ALTER TABLE "skills"
  ADD CONSTRAINT "skills_resume_id_fkey"
  FOREIGN KEY ("resume_id") REFERENCES "resumes"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Create languages table to normalize resume languages
CREATE TABLE "languages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "resume_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "languages_resume_id_idx" ON "languages"("resume_id");

ALTER TABLE "languages"
  ADD CONSTRAINT "languages_resume_id_fkey"
  FOREIGN KEY ("resume_id") REFERENCES "resumes"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate existing skills JSON into the new table
INSERT INTO "skills" ("id", "resume_id", "name", "level", "created_at", "updated_at")
SELECT
    CASE
        WHEN (skill->>'id') ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
            THEN (skill->>'id')::UUID
        ELSE gen_random_uuid()
    END AS id,
    r.id AS resume_id,
    skill->>'name' AS name,
    skill->>'level' AS level,
    r.created_at,
    r.updated_at
FROM "resumes" r
CROSS JOIN LATERAL jsonb_array_elements(COALESCE(r.skills, '[]'::jsonb)) AS skill
WHERE jsonb_typeof(COALESCE(r.skills, '[]'::jsonb)) = 'array'
  AND COALESCE(skill->>'name', '') <> '';

-- Migrate existing languages JSON into the new table
INSERT INTO "languages" ("id", "resume_id", "name", "level", "created_at", "updated_at")
SELECT
    CASE
        WHEN (language->>'id') ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
            THEN (language->>'id')::UUID
        ELSE gen_random_uuid()
    END AS id,
    r.id AS resume_id,
    language->>'name' AS name,
    COALESCE(language->>'level', '') AS level,
    r.created_at,
    r.updated_at
FROM "resumes" r
CROSS JOIN LATERAL jsonb_array_elements(COALESCE(r.languages, '[]'::jsonb)) AS language
WHERE jsonb_typeof(COALESCE(r.languages, '[]'::jsonb)) = 'array'
  AND COALESCE(language->>'name', '') <> ''
  AND COALESCE(language->>'level', '') <> '';

-- Drop the legacy JSON columns
ALTER TABLE "resumes" DROP COLUMN "skills";
ALTER TABLE "resumes" DROP COLUMN "languages";
