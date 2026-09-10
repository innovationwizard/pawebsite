-- 00028: Per-project category tag shown on project cards.
--
-- The new look & feel shows a short uppercase tag on each project card
-- (e.g. NATURALEZA, SMART LIVING). Free text, edited from the admin
-- project form; cards hide the tag when it is NULL/empty.
--
-- Initial values come from the client-approved website mockup
-- ("Puerta Abierta — Website Look and Feel", ajustes6). Matched by exact
-- project name; the block raises if a name does not resolve to exactly
-- one row so a renamed/missing project fails loudly.
--
-- Idempotent: re-running writes the same values.

ALTER TABLE projects ADD COLUMN IF NOT EXISTS category_tag TEXT;

DO $$
DECLARE
  rec     RECORD;
  updated INT;
BEGIN
  FOR rec IN
    SELECT * FROM (VALUES
      ('Bosque Las Tapias', 'Naturaleza'),
      ('Boulevard 5',       'Smart Living'),
      ('Benestare',         'Accesible'),
      ('Santa Elena',       'Premium'),
      ('Casa Elisa',        'Entregado')
    ) AS t(project_name, tag)
  LOOP
    UPDATE projects SET category_tag = rec.tag WHERE name = rec.project_name;
    GET DIAGNOSTICS updated = ROW_COUNT;
    IF updated <> 1 THEN
      RAISE EXCEPTION
        'Expected exactly 1 project named "%", but updated % row(s)',
        rec.project_name, updated;
    END IF;
  END LOOP;
END $$;
