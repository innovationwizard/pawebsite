-- 00021: Replace architectural project_type vocabulary
-- (vertical/horizontal/mixed-use) with product-type vocabulary
-- (casas/apartamentos/terrenos). Seed existing rows accordingly.
--
-- Santa Elena is the only horizontal/casas project today; everything
-- else is a vertical apartment building.
--
-- Idempotent: drops the existing CHECK first, normalizes data, then
-- re-creates the CHECK with the new value set. Re-running is a no-op.

ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_project_type_check;

UPDATE projects SET project_type = 'casas'        WHERE name  = 'Santa Elena';
UPDATE projects SET project_type = 'apartamentos' WHERE name <> 'Santa Elena';

ALTER TABLE projects
  ADD CONSTRAINT projects_project_type_check
  CHECK (project_type IN ('casas', 'apartamentos', 'terrenos'));
