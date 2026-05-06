-- 00016: Gallery images per project

CREATE TABLE IF NOT EXISTS project_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_images_project ON project_images(project_id, sort_order);

-- RLS
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read project images" ON project_images FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = project_images.project_id
        AND projects.is_published = true
    ));

CREATE POLICY "Admin full project_images" ON project_images FOR ALL
    USING (is_admin()) WITH CHECK (is_admin());
