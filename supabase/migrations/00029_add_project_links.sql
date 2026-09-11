-- 00029: Project website and social links (ajustes7 item 7).
--
-- Shown in "Acerca del proyecto" on each project page next to the
-- project's WhatsApp line. Nullable; each link is hidden when empty and
-- editable from the admin project form.
--
-- Seed values come from the client's ajustes7 brief. Boulevard 5's
-- Instagram and all Casa Elisa links were not provided (the brief lists
-- Benestare's Instagram under Boulevard 5) and are left NULL on purpose.
--
-- Matched by exact project name; raises if a name does not resolve to
-- exactly one row. Idempotent: re-running writes the same values.

ALTER TABLE projects ADD COLUMN IF NOT EXISTS website_url   TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS facebook_url  TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS instagram_url TEXT;

DO $$
DECLARE
  rec     RECORD;
  updated INT;
BEGIN
  FOR rec IN
    SELECT * FROM (VALUES
      ('Bosque Las Tapias', 'https://bosquelastapias.gt/', 'https://www.facebook.com/BosqueLasTapias',        'https://www.instagram.com/bosquelastapias/'),
      ('Benestare',         'https://benestare.gt/',       'https://www.facebook.com/ResidencialesBenestare', 'https://www.instagram.com/benestare.gt/'),
      ('Boulevard 5',       'https://boulevard5.gt/',      'https://www.facebook.com/boulevard5.gt',          NULL),
      ('Santa Elena',       'https://santaelena.gt/',      'https://www.facebook.com/SantaElenaAntigua.gt',   'https://www.instagram.com/santaelena.gt/')
    ) AS t(project_name, website, facebook, instagram)
  LOOP
    UPDATE projects
       SET website_url   = rec.website,
           facebook_url  = rec.facebook,
           instagram_url = rec.instagram
     WHERE name = rec.project_name;
    GET DIAGNOSTICS updated = ROW_COUNT;
    IF updated <> 1 THEN
      RAISE EXCEPTION
        'Expected exactly 1 project named "%", but updated % row(s)',
        rec.project_name, updated;
    END IF;
  END LOOP;
END $$;
