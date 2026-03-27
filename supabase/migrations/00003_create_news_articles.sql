-- 00003: News/Blog
CREATE TABLE IF NOT EXISTS news_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS news_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content JSONB NOT NULL,
    cover_image_url TEXT,
    category_id UUID REFERENCES news_categories(id) ON DELETE SET NULL,
    author_name TEXT,
    is_published BOOLEAN NOT NULL DEFAULT false,
    published_at TIMESTAMPTZ,
    meta_title TEXT,
    meta_description TEXT,
    og_image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS news_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS news_article_tags (
    article_id UUID NOT NULL REFERENCES news_articles(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES news_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON news_articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_published ON news_articles(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON news_articles(category_id);
