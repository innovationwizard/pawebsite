# Puerta Abierta Inmobiliaria — Website Implementation Plan

## Context

Puerta Abierta Inmobiliaria (part of Grupo Orión) needs to replace their current WordPress site at puertaabierta.com.gt with a modern, dynamic marketing website. The new site must match the luxury aesthetic of serhant.com (their top reference), serve as a lead-generation engine, and include a built-in CMS + lead management system (replacing PipeDrive). The company manages 5 real estate projects (901 units) across Guatemala.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router) + React 19 |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS 4 + Framer Motion |
| Database/Auth/Storage | Supabase (PostgreSQL + Auth + Storage) |
| Rich Text | Tiptap (JSON storage) |
| Hosting | Vercel |
| Analytics | Google Analytics G-E0L8VZQ6EG |
| Video | YouTube embeds (facade pattern) |
| Validation | Zod |

---

## File Structure

```
pawebsite/
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── middleware.ts                        # Auth guard for /admin routes
├── supabase/
│   └── migrations/                     # 13 idempotent SQL migrations
│       ├── 00001_create_projects.sql
│       ├── 00002_create_unit_types.sql
│       ├── 00003_create_news_articles.sql
│       ├── 00004_create_construction_progress.sql
│       ├── 00005_create_testimonials.sql
│       ├── 00006_create_faqs.sql
│       ├── 00007_create_leads.sql
│       ├── 00008_create_newsletter_subscribers.sql
│       ├── 00009_create_site_settings.sql
│       ├── 00010_create_lead_notes.sql
│       ├── 00011_create_lead_activity_log.sql
│       ├── 00012_create_storage_buckets.sql
│       └── 00013_create_rls_policies.sql
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root: fonts, GA, metadata, lang="es-GT"
│   │   ├── page.tsx                    # Landing page (Inicio)
│   │   ├── globals.css
│   │   ├── sitemap.ts / robots.ts
│   │   ├── proyectos/
│   │   │   ├── page.tsx               # Projects listing
│   │   │   └── [slug]/page.tsx        # Individual project
│   │   ├── noticias/
│   │   │   ├── page.tsx               # News listing
│   │   │   └── [slug]/page.tsx        # Article
│   │   ├── avance-de-obra/
│   │   │   ├── page.tsx               # Progress overview
│   │   │   └── [slug]/page.tsx        # Per-project gallery
│   │   ├── preguntas-frecuentes/page.tsx
│   │   ├── politica-de-privacidad/page.tsx
│   │   ├── terminos-y-condiciones/page.tsx
│   │   ├── admin/
│   │   │   ├── layout.tsx             # Sidebar + auth guard
│   │   │   ├── page.tsx               # Dashboard
│   │   │   ├── login/page.tsx
│   │   │   ├── proyectos/             # CRUD
│   │   │   ├── noticias/              # CRUD
│   │   │   ├── avance-de-obra/        # CRUD
│   │   │   ├── testimonios/           # CRUD
│   │   │   ├── faq/                   # CRUD
│   │   │   ├── leads/                 # Inbox + detail
│   │   │   ├── configuracion/         # Site settings
│   │   │   └── usuarios/              # User management
│   │   └── api/
│   │       ├── contact/route.ts
│   │       ├── newsletter/route.ts
│   │       ├── leads/route.ts + export/route.ts
│   │       ├── upload/route.ts
│   │       └── revalidate/route.ts
│   ├── components/
│   │   ├── ui/                        # button, input, card, badge, accordion, etc.
│   │   ├── layout/                    # navbar, footer, mobile-menu, whatsapp-button
│   │   ├── landing/                   # hero-video, project-logos-ribbon, showcase-slider,
│   │   │                              # tertiary-banner, brand-highlights, why-how-section,
│   │   │                              # news-capsules, testimonials-slider, newsletter-form
│   │   ├── projects/                  # project-card, project-hero, unit-types-table, etc.
│   │   ├── news/                      # article-card, article-content, category-filter
│   │   ├── progress/                  # progress-gallery, progress-indicator
│   │   ├── admin/                     # sidebar, data-table, rich-text-editor, image-uploader,
│   │   │                              # lead-funnel-board, lead-detail-panel, csv-export
│   │   └── animations/               # scroll-reveal, counter-animation, parallax-section, marquee
│   ├── lib/
│   │   ├── supabase/                  # client.ts, server.ts, admin.ts, middleware.ts
│   │   ├── types/                     # database.ts (auto-gen), project.ts, lead.ts, etc.
│   │   ├── constants/                 # navigation.ts, lead-sources.ts, lead-stages.ts, metadata.ts
│   │   ├── utils/                     # format-currency.ts, format-date.ts, validators.ts, csv.ts
│   │   ├── actions/                   # Server Actions: projects, articles, leads, settings, etc.
│   │   └── queries/                   # Server-side fetch: projects, articles, testimonials, etc.
│   └── hooks/                         # use-intersection, use-counter, use-media-query
```

---

## Database Schema

### Core Tables (13 migrations)

**projects** — name, abbreviation, slug, type (vertical/horizontal/mixed-use), currency (GTQ/USD), location, total_units, towers, floors, status, hero_image/video, logo, starting_price, financial terms (enganche, reserva, cuotas, plazo, bank_rate), special_features[], bedroom_range, area_range, sort_order, is_published, SEO fields

**unit_types** — project_id FK, type_name, bedrooms, bathrooms, interior/terrace/total area, parking, bodega, list_price, floor_plan_image, sort_order

**news_articles** + **news_categories** + **news_tags** — title, slug, excerpt, content (Tiptap JSONB), cover_image, category FK, is_published, published_at, SEO fields

**construction_progress** + **construction_progress_photos** — project_id FK, title, description, progress_percent (0-100), entry_date, photos with captions and sort_order

**testimonials** — client_name, client_title, content, rating, project FK, avatar, is_published, sort_order

**faqs** + **faq_categories** — categorized Q&A with sort_order, is_published

**leads** — first/last name, email, phone, source (enum matching 17 existing sources), stage (new→contacted→interested→visit_scheduled→negotiation→closed_won/closed_lost), project_interest FK, assigned_to FK, message, UTM fields, is_newsletter_subscriber

**lead_notes** — lead_id FK, author FK, content, timestamp

**lead_activity_log** — lead_id FK, user FK, action, old/new values, timestamp

**newsletter_subscribers** — email (unique), full_name, phone, is_active

**site_settings** — key-value (TEXT → JSONB) for hero_video_url, brand_highlights, company_info, social_links, tertiary_banner, notification_email

**Storage buckets:** project-images, project-logos, article-images, progress-photos, testimonial-avatars, site-assets

**RLS:** Public SELECT on published content. Public INSERT on leads + newsletter. Authenticated admin full CRUD on all tables. `is_admin()` helper function checks `raw_user_meta_data.role`.

---

## SQL Migration Details

### 00001: Projects Table

```sql
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

CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_is_published ON projects(is_published);
```

### 00002: Unit Types

```sql
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

CREATE INDEX idx_unit_types_project ON unit_types(project_id);
```

### 00003: News/Blog

```sql
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

CREATE INDEX idx_articles_slug ON news_articles(slug);
CREATE INDEX idx_articles_published ON news_articles(is_published, published_at DESC);
CREATE INDEX idx_articles_category ON news_articles(category_id);
```

### 00004: Construction Progress

```sql
CREATE TABLE IF NOT EXISTS construction_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    progress_percent INTEGER CHECK (progress_percent >= 0 AND progress_percent <= 100),
    entry_date DATE NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS construction_progress_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    progress_id UUID NOT NULL REFERENCES construction_progress(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    caption TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_progress_project ON construction_progress(project_id, entry_date DESC);
CREATE INDEX idx_progress_photos ON construction_progress_photos(progress_id);
```

### 00005: Testimonials

```sql
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    client_title TEXT,
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    avatar_url TEXT,
    is_published BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_testimonials_published ON testimonials(is_published, sort_order);
```

### 00006: FAQs

```sql
CREATE TABLE IF NOT EXISTS faq_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES faq_categories(id) ON DELETE SET NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_faqs_category ON faqs(category_id, sort_order);
CREATE INDEX idx_faqs_published ON faqs(is_published);
```

### 00007: Leads

```sql
CREATE TYPE lead_stage AS ENUM (
    'new',
    'contacted',
    'interested',
    'visit_scheduled',
    'negotiation',
    'closed_won',
    'closed_lost'
);

CREATE TYPE lead_source AS ENUM (
    'facebook',
    'meta',
    'tiktok',
    'linkedin',
    'pagina_web',
    'inbox',
    'mailing',
    'wati',
    'referido',
    'visita_inedita',
    'senaletica',
    'valla',
    'pbx',
    'prospeccion',
    'activacion',
    'evento',
    'friends_and_family',
    'other'
);

CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    source lead_source NOT NULL DEFAULT 'pagina_web',
    source_detail TEXT,
    stage lead_stage NOT NULL DEFAULT 'new',
    project_interest_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    message TEXT,
    is_newsletter_subscriber BOOLEAN NOT NULL DEFAULT false,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_leads_stage ON leads(stage);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_project ON leads(project_interest_id);
CREATE INDEX idx_leads_assigned ON leads(assigned_to);
CREATE INDEX idx_leads_created ON leads(created_at DESC);
CREATE INDEX idx_leads_email ON leads(email);
```

### 00008: Newsletter Subscribers

```sql
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    phone TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    unsubscribed_at TIMESTAMPTZ
);

CREATE INDEX idx_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX idx_subscribers_active ON newsletter_subscribers(is_active);
```

### 00009: Site Settings

```sql
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
```

### 00010: Lead Notes

```sql
CREATE TABLE IF NOT EXISTS lead_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lead_notes_lead ON lead_notes(lead_id, created_at DESC);
```

### 00011: Lead Activity Log

```sql
CREATE TABLE IF NOT EXISTS lead_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lead_activity_lead ON lead_activity_log(lead_id, created_at DESC);
```

### 00012: Storage Buckets

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    ('project-images', 'project-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('project-logos', 'project-logos', true, 1048576, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
    ('article-images', 'article-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('progress-photos', 'progress-photos', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('testimonial-avatars', 'testimonial-avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('site-assets', 'site-assets', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
ON CONFLICT (id) DO NOTHING;
```

### 00013: RLS Policies

```sql
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE unit_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE construction_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE construction_progress_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Admin helper function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM auth.users
        WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' IN ('admin', 'editor')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public read for published content
CREATE POLICY "Public read published projects" ON projects FOR SELECT USING (is_published = true);
CREATE POLICY "Public read unit types" ON unit_types FOR SELECT USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = unit_types.project_id AND projects.is_published = true));
CREATE POLICY "Public read published articles" ON news_articles FOR SELECT USING (is_published = true);
CREATE POLICY "Public read categories" ON news_categories FOR SELECT USING (true);
CREATE POLICY "Public read tags" ON news_tags FOR SELECT USING (true);
CREATE POLICY "Public read article tags" ON news_article_tags FOR SELECT USING (true);
CREATE POLICY "Public read published progress" ON construction_progress FOR SELECT USING (is_published = true);
CREATE POLICY "Public read progress photos" ON construction_progress_photos FOR SELECT USING (EXISTS (SELECT 1 FROM construction_progress WHERE construction_progress.id = construction_progress_photos.progress_id AND construction_progress.is_published = true));
CREATE POLICY "Public read published testimonials" ON testimonials FOR SELECT USING (is_published = true);
CREATE POLICY "Public read FAQ categories" ON faq_categories FOR SELECT USING (true);
CREATE POLICY "Public read published FAQs" ON faqs FOR SELECT USING (is_published = true);
CREATE POLICY "Public read site settings" ON site_settings FOR SELECT USING (true);

-- Public insert for leads + newsletter
CREATE POLICY "Public submit leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Public subscribe newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

-- Admin full access on all tables
CREATE POLICY "Admin full projects" ON projects FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin full unit_types" ON unit_types FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin full news_articles" ON news_articles FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin full news_categories" ON news_categories FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin full news_tags" ON news_tags FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin full news_article_tags" ON news_article_tags FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin full construction_progress" ON construction_progress FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin full progress_photos" ON construction_progress_photos FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin full testimonials" ON testimonials FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin full faq_categories" ON faq_categories FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin full faqs" ON faqs FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin full leads" ON leads FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin full lead_notes" ON lead_notes FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin full lead_activity_log" ON lead_activity_log FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin full newsletter_subscribers" ON newsletter_subscribers FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin full site_settings" ON site_settings FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Storage policies
CREATE POLICY "Public read storage" ON storage.objects FOR SELECT USING (bucket_id IN ('project-images', 'project-logos', 'article-images', 'progress-photos', 'testimonial-avatars', 'site-assets'));
CREATE POLICY "Admin upload storage" ON storage.objects FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update storage" ON storage.objects FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete storage" ON storage.objects FOR DELETE USING (is_admin());

-- updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON unit_types FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON news_articles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON construction_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## Implementation Phases

### Phase 1: Foundation (Days 1-3)
- Initialize Next.js 15 + TypeScript strict + Tailwind 4
- Brand tokens: colors (#0d1d41, #5b6770, #04b0d6), fonts (Mangueira Black, Poppins)
- Supabase project setup + run all 13 migrations
- Supabase client utilities (browser, server, admin)
- Auto-generate TypeScript types from schema
- Environment variables template
- Root layout with GA script + metadata
- Primitive UI components (button, input, card, badge, skeleton, accordion, toast)
- Deploy skeleton to Vercel

### Phase 2: Layout Shell + Landing Page (Days 4-8)
- Sticky navbar (transparent → navy on scroll, mobile hamburger)
- Footer (company info, social links, legal links)
- Floating WhatsApp button (wa.me/50242403164)
- Animation components (scroll-reveal, counter, parallax, marquee)
- All 10 landing page sections wired to Supabase data:
  1. Hero video (YouTube embed, half-screen, overlay text + CTA)
  2. Project logos ribbon (marquee auto-scroll, links to /proyectos/[slug])
  3. Project showcase slider (horizontal cards with drag/swipe)
  4. Tertiary banner (full-width image + overlay CTA)
  5. Brand highlights (animated counters: +30 projects, 757K m², 22 years, $650M)
  6. Why/How section (process graphic with numbered steps)
  7. News capsules (3 latest articles as vertical cards)
  8. Testimonials slider (horizontal auto-scroll)
  9. Newsletter/contact form + map embed
  10. Footer
- Contact form + newsletter API routes (create leads in DB)

### Phase 3: Project Pages (Days 9-12)
- Projects listing with status filter + project cards (hover scale 1.03)
- Individual project pages:
  - Hero image/video with logo overlay
  - Project overview (description, location, key specs)
  - Unit types comparison table
  - Image gallery (placeholder slots, lightbox)
  - Financial terms summary card
  - Location map embed
  - Contact CTA
- `generateStaticParams` + `generateMetadata` for SEO

### Phase 4: Content Pages (Days 13-16)
- News listing + article pages (Tiptap JSON renderer)
- Construction progress overview + per-project photo galleries with dates
- FAQ page (categorized accordions)
- Privacy policy + terms pages (content from site_settings)
- Dynamic sitemap + structured data (JSON-LD: RealEstateAgent, Product, Article, FAQPage)

### Phase 5: Admin CMS (Days 17-22)
- Supabase Auth (email/password, role-based: admin/editor)
- Auth middleware protecting /admin/* routes
- Admin layout with sidebar navigation
- Reusable components: data table, image uploader, Tiptap rich text editor
- CRUD for: projects (+ unit types sub-form), news, construction progress, testimonials, FAQ
- Site settings page (hero video, brand highlights, company info, social links, banners)
- User management (admin only)
- On-demand ISR revalidation on content publish/edit

### Phase 6: Lead Management (Days 23-27)
- Lead inbox page:
  - Table view: name, email, phone, project, source, stage, date
  - Filters: stage, source, project, date range, assigned user
  - Full-text search across name/email/phone
  - Sortable columns
- Lead detail page:
  - Contact info panel
  - Stage pipeline buttons (New → Contacted → Interested → Visit Scheduled → Negotiation → Won/Lost)
  - Notes timeline (add note, chronological history)
  - Activity log (automated: stage changes, assignments, notes)
- CSV export with applied filters
- Email notification on new lead (Supabase Edge Function or webhook)
- Admin dashboard:
  - Lead counts: today, this week, this month
  - Funnel visualization by stage
  - Source breakdown chart
  - Project interest breakdown
  - Recent activity feed
- UTM parameter capture from URL on contact form submissions

### Phase 7: Polish (Days 28-30)
- Performance: next/image with sizes/priority, YouTube facade, font preloading, lazy loading below-fold
- SEO: unique title/description per page, OG tags, structured data, canonical URLs, robots/sitemap
- Accessibility: keyboard nav, ARIA labels, focus rings, color contrast WCAG AA
- Mobile responsive audit: 320px, 375px, 768px, 1024px, 1280px, 1536px
- Security: CSP headers, rate limiting on public API routes, honeypot on forms, input sanitization
- Error handling: custom 404, global error boundary, Zod validation with user-facing messages

---

## Animation Strategy (serhant.com Aesthetic)

| Pattern | Implementation | Where Used |
|---------|---------------|------------|
| Scroll-reveal | Framer Motion `useInView` + variants (fade-up, slide-left, stagger) | Every landing section |
| Animated counters | `useMotionValue` + `useTransform`, 2s ease-out | Brand highlights |
| Parallax | `useScroll` + `useTransform` at 0.3x speed | Tertiary banner, hero |
| Marquee | Pure CSS `@keyframes`, pause on hover | Project logos ribbon |
| Card hover | CSS `hover:scale-[1.03]` + image `hover:scale-[1.07]` + shadow | Project/news cards |
| Navbar scroll | `scrollY` tracking, transparent → solid navy at 80px | Navbar |
| Page transitions | Framer `AnimatePresence` with fade, 0.3s | All routes |
| Slider | Framer `drag="x"` + `dragConstraints` | Projects, testimonials |
| Reduced motion | `useReducedMotion` → disable all | Global respect |

All animations use `transform` + `opacity` only (GPU-composited, no layout thrash).

---

## Lead Management System Design

### Intake Flow
```
User fills contact form → Client-side Zod validation → Server Action
→ Extract UTM params from URL → Insert into leads (stage='new', source='pagina_web')
→ If newsletter opt-in, insert into newsletter_subscribers
→ Trigger email notification → Show toast confirmation
```

### Pipeline Stages
```
new → contacted → interested → visit_scheduled → negotiation → closed_won
                                                               → closed_lost
```

Each transition logged in `lead_activity_log`.

### Lead Detail Layout
```
+---------------------------------------------+
|  [< Back to Leads]           [Export CSV]    |
+---------------------------------------------+
| CONTACT INFO          | PIPELINE             |
| Name: ...             | [New] [Contacted]    |
| Email: ...            | [Interested] [Visit] |
| Phone: ...            | [Negotiation]        |
| Source: Facebook       | [Won] [Lost]         |
| Project: Benestare    |                      |
| UTM: fb/cpc/spring26  |                      |
| Created: Mar 15, 2026 |                      |
+---------------------------------------------+
| NOTES                                        |
| [Add note field]                [Submit]     |
| ------------------------------------------- |
| Mar 20 - Juan: Called, interested in Torre B |
| Mar 16 - Maria: Initial contact via email    |
+---------------------------------------------+
| ACTIVITY LOG                                 |
| Mar 20 14:32 - Stage: new → contacted        |
| Mar 16 09:15 - Lead created from web form    |
+---------------------------------------------+
```

---

## Key Architectural Decisions

1. **Tiptap JSON over raw HTML** for article storage — prevents XSS, enables structured rendering
2. **Server Actions for admin mutations** — automatic CSRF, co-located with forms
3. **ISR + on-demand revalidation** — static performance + instant content updates
4. **Single `site_settings` key-value table** — flexible config without schema changes
5. **Lead activity log as separate table** — efficient cross-lead querying, no row locking
6. **YouTube facade pattern** — static thumbnail until click, saves ~800KB on initial load

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-E0L8VZQ6EG
NEXT_PUBLIC_WHATSAPP_NUMBER=50242403164
NEXT_PUBLIC_SITE_URL=https://puertaabierta.com.gt
REVALIDATION_SECRET=
```

---

## Verification Plan

1. **Database:** Run all 13 migrations — verify tables, indexes, RLS, triggers via Supabase Dashboard
2. **Public site:** Navigate every page, verify data from DB, test forms, verify responsive at 375px/768px/1280px
3. **Admin panel:** Login → create/edit/publish project → verify ISR reflects changes on public site
4. **Leads:** Submit contact form → verify in admin inbox → change stage → add note → export CSV
5. **SEO:** Validate sitemap.xml, robots.txt, structured data, OG tags
6. **Performance:** Lighthouse 90+ on all metrics, YouTube facade loads correctly
7. **Analytics:** GA events fire on page views and form submissions
