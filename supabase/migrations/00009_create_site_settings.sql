-- 00009: Site Settings
CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Settings keys:
-- 'hero_video_url' -> {"url": "https://youtube.com/..."}
-- 'brand_highlights' -> {"projects_count": 30, "sqm_developed": 757, "years_experience": 22, "historical_sales_millions": 650}
-- 'tertiary_banner' -> {"image_url": "...", "title": "...", "cta_text": "...", "cta_link": "..."}
-- 'company_info' -> {"address": "...", "email": "...", "phone": "...", "whatsapp": "..."}
-- 'social_links' -> {"linkedin": "...", "facebook": "...", "instagram": "...", "youtube": "..."}
-- 'notification_email' -> {"email": "ventas@puertaabierta.com.gt"}
