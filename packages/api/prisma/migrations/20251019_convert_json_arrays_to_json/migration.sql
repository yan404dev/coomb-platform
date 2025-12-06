-- Convert jsonb[] columns to jsonb
-- This migration converts array-type JSON columns to single JSON columns
-- The data structure remains the same (JSON arrays), but the PostgreSQL column type changes

-- Experiences: Convert from jsonb[] to jsonb
ALTER TABLE resume
ALTER COLUMN experiences TYPE jsonb USING
  CASE
    WHEN experiences IS NULL THEN '[]'::jsonb
    WHEN jsonb_typeof(experiences::jsonb) = 'array' THEN experiences::jsonb
    ELSE experiences[1]
  END;

-- Skills: Convert from jsonb[] to jsonb
ALTER TABLE resume
ALTER COLUMN skills TYPE jsonb USING
  CASE
    WHEN skills IS NULL THEN '[]'::jsonb
    WHEN jsonb_typeof(skills::jsonb) = 'array' THEN skills::jsonb
    ELSE skills[1]
  END;

-- Languages: Convert from jsonb[] to jsonb
ALTER TABLE resume
ALTER COLUMN languages TYPE jsonb USING
  CASE
    WHEN languages IS NULL THEN '[]'::jsonb
    WHEN jsonb_typeof(languages::jsonb) = 'array' THEN languages::jsonb
    ELSE languages[1]
  END;

-- Educations: Convert from jsonb[] to jsonb
ALTER TABLE resume
ALTER COLUMN educations TYPE jsonb USING
  CASE
    WHEN educations IS NULL THEN '[]'::jsonb
    WHEN jsonb_typeof(educations::jsonb) = 'array' THEN educations::jsonb
    ELSE educations[1]
  END;

-- Certifications: Convert from jsonb[] to jsonb
ALTER TABLE resume
ALTER COLUMN certifications TYPE jsonb USING
  CASE
    WHEN certifications IS NULL THEN '[]'::jsonb
    WHEN jsonb_typeof(certifications::jsonb) = 'array' THEN certifications::jsonb
    ELSE certifications[1]
  END;
