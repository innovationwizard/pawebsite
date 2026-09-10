-- 00027: B2B lead fields for the /servicios (developer services) form.
--
-- Developers contacting Puerta Abierta about marketing & sales services
-- describe their company and their project. These are first-class,
-- filterable columns rather than text packed into `message` so the CRM
-- can segment B2B leads. All nullable: existing B2C leads are unaffected.
--
--   company           developer / company name
--   job_title         contact's role at the company
--   project_name      name of the development to be commercialized
--   project_location  zone / municipality of the development
--   project_stage     preventa | construccion | entregado
--   project_units     approximate number of units
--
-- Idempotent: re-running is a no-op.

ALTER TABLE leads ADD COLUMN IF NOT EXISTS company          TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS job_title        TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS project_name     TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS project_location TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS project_stage    TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS project_units    INTEGER;

ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_project_stage_check;
ALTER TABLE leads
  ADD CONSTRAINT leads_project_stage_check
  CHECK (project_stage IS NULL OR project_stage IN ('preventa', 'construccion', 'entregado'));

ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_project_units_check;
ALTER TABLE leads
  ADD CONSTRAINT leads_project_units_check
  CHECK (project_units IS NULL OR project_units > 0);
