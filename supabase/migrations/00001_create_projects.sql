-- 00001: Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    abbreviation TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    project_type TEXT NOT NULL CHECK (project_type IN ('vertical', 'horizontal', 'mixed-use')),
    currency TEXT NOT NULL CHECK (currency IN ('GTQ', 'USD')),
    description TEXT,
    location_description TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    total_units INTEGER NOT NULL,
    towers INTEGER,
    floors_per_tower INTEGER,
    status TEXT NOT NULL CHECK (status IN ('active', 'nearly_sold_out', 'sold_out', 'delivered', 'under_construction', 'frozen')),
    hero_image_url TEXT,
    hero_video_url TEXT,
    logo_url TEXT,
    starting_price NUMERIC(14, 2),
    starting_price_display TEXT,
    enganche_percent NUMERIC(5, 2),
    reserva_amount NUMERIC(14, 2),
    reserva_display TEXT,
    cuotas_enganche INTEGER,
    max_plazo_years INTEGER,
    bank_rate_display TEXT,
    special_features TEXT[],
    bedroom_range TEXT,
    area_range_m2 TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT false,
    meta_title TEXT,
    meta_description TEXT,
    og_image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_is_published ON projects(is_published);
