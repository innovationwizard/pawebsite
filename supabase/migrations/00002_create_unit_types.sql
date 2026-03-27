-- 00002: Unit Types
CREATE TABLE IF NOT EXISTS unit_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    type_name TEXT NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms INTEGER,
    interior_area_m2 NUMERIC(8, 2),
    terrace_area_m2 NUMERIC(8, 2),
    total_area_m2 NUMERIC(8, 2) NOT NULL,
    parking_spaces INTEGER DEFAULT 1,
    parking_description TEXT,
    has_bodega BOOLEAN DEFAULT false,
    bodega_area_m2 NUMERIC(8, 2),
    list_price NUMERIC(14, 2),
    price_display TEXT,
    price_currency TEXT NOT NULL CHECK (price_currency IN ('GTQ', 'USD')),
    floor_plan_image_url TEXT,
    notes TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_unit_types_project ON unit_types(project_id);
