-- 00025: Set the dedicated WhatsApp/phone line for each project.
--
-- These are the per-project CRM lines so WhatsApp clicks and calls on a
-- project page are attributed to that project. Stored digits-only, full
-- international format (502 + 8-digit local number), matching the format
-- the site expects for wa.me/<number> and tel:+<number>.
--
--   Bosque Las Tapias  +502 2458 2648
--   Benestare          +502 2458 4275
--   Boulevard 5        +502 2458 4274
--   Santa Elena        +502 2458 4276
--
-- Matched by exact project name. The block raises if any name does not
-- resolve to exactly one row, so a renamed/missing project fails loudly
-- instead of silently leaving a project on the fallback number.
--
-- Idempotent: re-running writes the same values.

DO $$
DECLARE
  rec     RECORD;
  updated INT;
BEGIN
  FOR rec IN
    SELECT * FROM (VALUES
      ('Bosque Las Tapias', '50224582648'),
      ('Benestare',         '50224584275'),
      ('Boulevard 5',       '50224584274'),
      ('Santa Elena',       '50224584276')
    ) AS t(project_name, wa)
  LOOP
    UPDATE projects SET whatsapp_number = rec.wa WHERE name = rec.project_name;
    GET DIAGNOSTICS updated = ROW_COUNT;
    IF updated <> 1 THEN
      RAISE EXCEPTION
        'Expected exactly 1 project named "%", but updated % row(s)',
        rec.project_name, updated;
    END IF;
  END LOOP;
END $$;
