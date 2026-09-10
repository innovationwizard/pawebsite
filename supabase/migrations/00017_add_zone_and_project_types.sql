-- Add zone column to projects (for location filter)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS zone TEXT;

-- project_type values (casas, apartamentos, terrenos) are governed by the
-- CHECK constraint in 00021. lead_source is a Postgres ENUM (00007); the
-- 'terrenos' and 'servicios' values are added in 00026.
