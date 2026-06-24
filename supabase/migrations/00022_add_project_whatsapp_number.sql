-- 00022: Per-project WhatsApp / phone number.
--
-- Each project needs its own contact line so WhatsApp clicks and calls
-- are attributed to the right inmobiliario in the CRM, instead of all
-- funneling into one global company number.
--
-- Stored as the full international number in digits only, no '+' and no
-- separators (e.g. '50242403164'). The site builds wa.me/<number> for
-- WhatsApp and tel:+<number> for calls. Nullable so existing rows keep
-- working until each project's number is filled in from the admin panel.
--
-- Idempotent: re-running is a no-op.

ALTER TABLE projects ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;
