-- Add zone column to projects (for location filter)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS zone TEXT;

-- project_type and lead_source are stored as TEXT in this database.
-- New values (casas, apartamentos, terrenos, terrenos lead source) are
-- accepted natively without schema changes since TEXT has no value constraints.
