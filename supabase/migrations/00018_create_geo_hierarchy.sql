-- 00018: Geographic hierarchy (departamentos / municipios / zonas)
--
-- Creates normalized lookup tables for the depto -> municipio -> zona hierarchy.
-- Seeds Guatemala departamento, Guatemala municipio (Ciudad de Guatemala),
-- and the 22 zonas of Guatemala City (numbers 1-25 excluding 20, 22, 23 which
-- fell under Mixco, San Miguel Petapa, and Santa Catarina Pinula respectively).
--
-- Replaces the legacy `projects.zone` TEXT column (all values NULL in prod)
-- with `projects.zona_id` UUID FK to zonas(id).

-- ============================================================
-- Lookup tables
-- ============================================================

CREATE TABLE IF NOT EXISTS departamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS municipios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    departamento_id UUID NOT NULL REFERENCES departamentos(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (departamento_id, slug),
    UNIQUE (departamento_id, name)
);

CREATE TABLE IF NOT EXISTS zonas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    municipio_id UUID NOT NULL REFERENCES municipios(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (municipio_id, slug),
    UNIQUE (municipio_id, name)
);

CREATE INDEX IF NOT EXISTS idx_municipios_departamento ON municipios(departamento_id);
CREATE INDEX IF NOT EXISTS idx_zonas_municipio ON zonas(municipio_id);

-- ============================================================
-- Seed: Guatemala departamento, Guatemala municipio, 22 zonas
-- ============================================================

INSERT INTO departamentos (name, slug, sort_order)
VALUES ('Guatemala', 'guatemala', 1)
ON CONFLICT (name) DO NOTHING;

INSERT INTO municipios (departamento_id, name, slug, sort_order)
SELECT d.id, 'Guatemala', 'guatemala', 1
FROM departamentos d
WHERE d.slug = 'guatemala'
ON CONFLICT (departamento_id, slug) DO NOTHING;

INSERT INTO zonas (municipio_id, name, slug, sort_order)
SELECT m.id, 'zona ' || n::text, 'zona-' || n::text, n
FROM municipios m
JOIN departamentos d ON m.departamento_id = d.id
CROSS JOIN (
    SELECT generate_series(1, 25) AS n
) series
WHERE d.slug = 'guatemala'
  AND m.slug = 'guatemala'
  AND series.n NOT IN (20, 22, 23)
ON CONFLICT (municipio_id, slug) DO NOTHING;

-- ============================================================
-- Replace projects.zone TEXT with projects.zona_id FK
-- ============================================================

ALTER TABLE projects ADD COLUMN IF NOT EXISTS zona_id UUID REFERENCES zonas(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_projects_zona_id ON projects(zona_id);

-- Legacy text column is all NULL in prod; safe to drop.
ALTER TABLE projects DROP COLUMN IF EXISTS zone;

-- ============================================================
-- RLS
-- ============================================================

ALTER TABLE departamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE municipios ENABLE ROW LEVEL SECURITY;
ALTER TABLE zonas ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Public read departamentos" ON departamentos FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Public read municipios" ON municipios FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Public read zonas" ON zonas FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Admin full departamentos" ON departamentos FOR ALL USING (is_admin()) WITH CHECK (is_admin());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Admin full municipios" ON municipios FOR ALL USING (is_admin()) WITH CHECK (is_admin());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Admin full zonas" ON zonas FOR ALL USING (is_admin()) WITH CHECK (is_admin());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- updated_at triggers (uses update_updated_at() from migration 00013)
-- ============================================================

DROP TRIGGER IF EXISTS set_updated_at ON departamentos;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON departamentos FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON municipios;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON municipios FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON zonas;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON zonas FOR EACH ROW EXECUTE FUNCTION update_updated_at();
