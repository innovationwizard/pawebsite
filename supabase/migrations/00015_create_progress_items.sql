-- 00015: Progress sub-items for detailed procedure breakdowns

CREATE TABLE IF NOT EXISTS progress_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    progress_id UUID NOT NULL REFERENCES construction_progress(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    percent INTEGER NOT NULL DEFAULT 0 CHECK (percent >= 0 AND percent <= 100),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_progress_items_progress ON progress_items(progress_id, sort_order);

-- RLS
ALTER TABLE progress_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read progress items" ON progress_items FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM construction_progress
        WHERE construction_progress.id = progress_items.progress_id
        AND construction_progress.is_published = true
    ));

CREATE POLICY "Admin full progress_items" ON progress_items FOR ALL
    USING (is_admin()) WITH CHECK (is_admin());
