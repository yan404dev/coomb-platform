-- Migration: Merge about_user table into users table
-- Description: Consolidates all user data into a single table, eliminating the 1:1 relationship
-- Date: 2025-01-18

-- Step 1: Add new columns to users table (migrated from about_user)
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS cpf                      VARCHAR,
  ADD COLUMN IF NOT EXISTS birth_date               VARCHAR,
  ADD COLUMN IF NOT EXISTS has_disability           BOOLEAN,
  ADD COLUMN IF NOT EXISTS race                     VARCHAR,
  ADD COLUMN IF NOT EXISTS sexual_orientation       VARCHAR,
  ADD COLUMN IF NOT EXISTS gender                   VARCHAR,
  ADD COLUMN IF NOT EXISTS state                    VARCHAR,
  ADD COLUMN IF NOT EXISTS city                     VARCHAR,
  ADD COLUMN IF NOT EXISTS salary_expectation       VARCHAR,
  ADD COLUMN IF NOT EXISTS has_cnh                  BOOLEAN,
  ADD COLUMN IF NOT EXISTS instagram                VARCHAR,
  ADD COLUMN IF NOT EXISTS facebook                 VARCHAR,
  ADD COLUMN IF NOT EXISTS linkedin                 VARCHAR,
  ADD COLUMN IF NOT EXISTS portfolio                VARCHAR,
  ADD COLUMN IF NOT EXISTS professional_summary     TEXT,
  ADD COLUMN IF NOT EXISTS career_goals             TEXT,
  ADD COLUMN IF NOT EXISTS personality_profile      JSONB,
  ADD COLUMN IF NOT EXISTS personality_generated_at TIMESTAMPTZ(6);

-- Step 2: Migrate data from about_user to users
UPDATE users u
SET
  cpf                      = au.cpf,
  birth_date               = au.birth_date,
  has_disability           = au.has_disability,
  race                     = au.race,
  sexual_orientation       = au.sexual_orientation,
  gender                   = au.gender,
  state                    = au.state,
  city                     = au.city,
  salary_expectation       = au.salary_expectation,
  has_cnh                  = au.has_cnh,
  instagram                = au.instagram,
  facebook                 = au.facebook,
  linkedin                 = au.linkedin,
  portfolio                = au.portfolio,
  professional_summary     = au.professional_summary,
  career_goals             = au.career_goals,
  personality_profile      = au.personality_profile,
  personality_generated_at = au.personality_generated_at
FROM about_user au
INNER JOIN resume r ON r.id = au.resume_id
WHERE r.user_id = u.id;

-- Step 3: Drop the about_user table (cascade will handle foreign keys)
DROP TABLE IF EXISTS about_user CASCADE;

-- Step 4: Verification query (optional, for manual check after migration)
-- SELECT COUNT(*) FROM users WHERE cpf IS NOT NULL OR professional_summary IS NOT NULL;
