-- Create experiences table to normalize resume experiences
CREATE TABLE "experiences" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "resume_id" UUID NOT NULL,
    "position" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "start_date" TEXT NOT NULL,
    "end_date" TEXT,
    "current" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
    CONSTRAINT "experiences_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "experiences_resume_id_idx" ON "experiences"("resume_id");

ALTER TABLE "experiences"
  ADD CONSTRAINT "experiences_resume_id_fkey"
  FOREIGN KEY ("resume_id") REFERENCES "resumes"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate existing JSON data into the new table
INSERT INTO "experiences" (
    "id",
    "resume_id",
    "position",
    "company",
    "start_date",
    "end_date",
    "current",
    "description",
    "created_at",
    "updated_at"
)
SELECT
    CASE
        WHEN (experience->>'id') ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
            THEN (experience->>'id')::UUID
        ELSE gen_random_uuid()
    END AS id,
    r.id AS resume_id,
    experience->>'position' AS position,
    experience->>'company' AS company,
    COALESCE(experience->>'startDate', experience->>'start_date') AS start_date,
    NULLIF(COALESCE(experience->>'endDate', experience->>'end_date', ''), '') AS end_date,
    CASE
        WHEN experience ? 'current' THEN (experience->>'current')::BOOLEAN
        WHEN experience ? 'isCurrentJob' THEN (experience->>'isCurrentJob')::BOOLEAN
        ELSE false
    END AS current,
    NULLIF(experience->>'description', '') AS description,
    r.created_at,
    r.updated_at
FROM "resumes" r
CROSS JOIN LATERAL jsonb_array_elements(COALESCE(r.experiences, '[]'::jsonb)) AS experience
WHERE jsonb_typeof(COALESCE(r.experiences, '[]'::jsonb)) = 'array'
  AND COALESCE(experience->>'position', '') <> ''
  AND COALESCE(experience->>'company', '') <> ''
  AND COALESCE(COALESCE(experience->>'startDate', experience->>'start_date'), '') <> '';

-- Drop the legacy JSON column
ALTER TABLE "resumes" DROP COLUMN "experiences";
