-- 00026: Add the lead_source enum values the website already posts.
--
-- The /terrenos form sends source = 'terrenos' and the /servicios form
-- (developer marketing & sales services) sends source = 'servicios'.
-- lead_source is a Postgres ENUM (see 00007); neither value existed, so
-- every /terrenos submission failed with
--   invalid input value for enum lead_source: "terrenos"
-- and the lead was lost. (Migration 00017's comment claiming the column
-- is TEXT was wrong; that comment is removed in this change.)
--
-- ALTER TYPE ... ADD VALUE cannot run inside a transaction block. When
-- applying via the Supabase SQL editor run each statement on its own,
-- not wrapped in BEGIN/COMMIT.
--
-- Idempotent: IF NOT EXISTS makes re-running a no-op.

ALTER TYPE lead_source ADD VALUE IF NOT EXISTS 'terrenos';
ALTER TYPE lead_source ADD VALUE IF NOT EXISTS 'servicios';
