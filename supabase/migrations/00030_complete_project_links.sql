-- 00030: Complete the project links left NULL by 00029 (ajustes7 item 7).
--
-- Boulevard 5 Instagram and all Casa Elisa links were confirmed by the
-- client after 00029 was applied. Casa Elisa keeps no dedicated WhatsApp
-- line (company line fallback, as confirmed).
--
-- Matched by exact project name; raises if a name does not resolve to
-- exactly one row. Idempotent: re-running writes the same values.

DO $$
DECLARE
  updated INT;
BEGIN
  UPDATE projects
     SET instagram_url = 'https://www.instagram.com/boulevard5gt/'
   WHERE name = 'Boulevard 5';
  GET DIAGNOSTICS updated = ROW_COUNT;
  IF updated <> 1 THEN
    RAISE EXCEPTION 'Expected exactly 1 project named "Boulevard 5", but updated % row(s)', updated;
  END IF;

  UPDATE projects
     SET website_url   = 'https://casaelisa.gt/',
         facebook_url  = 'https://www.facebook.com/casaelisagt',
         instagram_url = 'https://www.instagram.com/casaelisagt/'
   WHERE name = 'Casa Elisa';
  GET DIAGNOSTICS updated = ROW_COUNT;
  IF updated <> 1 THEN
    RAISE EXCEPTION 'Expected exactly 1 project named "Casa Elisa", but updated % row(s)', updated;
  END IF;
END $$;
