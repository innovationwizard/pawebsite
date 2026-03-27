-- 00012: Storage Buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    ('project-images', 'project-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('project-logos', 'project-logos', true, 1048576, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
    ('article-images', 'article-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('progress-photos', 'progress-photos', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('testimonial-avatars', 'testimonial-avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('site-assets', 'site-assets', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
ON CONFLICT (id) DO NOTHING;
