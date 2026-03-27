-- 00007: Leads
DO $$ BEGIN
    CREATE TYPE lead_stage AS ENUM (
        'new',
        'contacted',
        'interested',
        'visit_scheduled',
        'negotiation',
        'closed_won',
        'closed_lost'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
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
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

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

CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(stage);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_project ON leads(project_interest_id);
CREATE INDEX IF NOT EXISTS idx_leads_assigned ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
