-- ============================================================================
-- 00023: UTM Generator schema (merged from the standalone mktutmgen app)
-- ----------------------------------------------------------------------------
-- Integrates the UTM Generator + QA workflow into pawebsite's public schema.
-- Conventions match pawebsite (see UTM_INTEGRATION.md): UUID v4 PKs, TEXT+CHECK
-- for enums, snake_case columns, timestamptz, reused is_admin() + update_updated_at().
-- mktutmgen's own users table is NOT ported — creator/reviewer FKs reference
-- auth.users (see 00024 for the cuid->uuid + user remap that loads the data).
-- Idempotent: IF NOT EXISTS / guarded policies.
-- ============================================================================

-- ── Master data (admin-editable dropdowns) ─────────────────────────────────
create table if not exists utm_industries (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  abbreviation text not null unique,
  is_active boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists utm_countries (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  abbreviation text not null unique,
  is_active boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists utm_companies (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  abbreviation text not null unique,
  is_active boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists utm_brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  abbreviation text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  unique (name, abbreviation)
);

create table if not exists utm_platforms (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  abbreviation text not null unique,
  source text not null,
  medium text not null default '',
  is_active boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists utm_ad_formats (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  abbreviation text not null unique,
  is_active boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists utm_buy_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  abbreviation text not null unique,
  is_active boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists utm_campaign_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  is_active boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists utm_segmentation_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  is_active boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists utm_ad_piece_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  is_active boolean not null default true,
  sort_order integer not null default 0
);

-- ── Campaigns ──────────────────────────────────────────────────────────────
create table if not exists utm_campaigns (
  id uuid primary key default gen_random_uuid(),

  implementation_date timestamptz,
  start_date          timestamptz,
  end_date            timestamptz,

  industry_id      uuid not null references utm_industries(id),
  country_id       uuid not null references utm_countries(id),
  company_id       uuid not null references utm_companies(id),
  brand_id         uuid not null references utm_brands(id),
  platform_id      uuid not null references utm_platforms(id),
  format_id        uuid not null references utm_ad_formats(id),
  buy_type_id      uuid not null references utm_buy_types(id),
  campaign_type_id uuid references utm_campaign_types(id),

  campaign_name        text not null,
  date_label           text not null,
  segmentation         text not null default '',
  piece_type           text not null default '',
  piece_differentiator text not null default '',

  utm_source_override text,
  utm_medium_override text,

  destination_url text not null default '',
  naming_campaign text not null default '',
  naming_ad_group text not null default '',
  naming_piece    text not null default '',
  utm_string      text not null default '',
  full_url        text not null default '',

  -- Attribution preserved: every campaign has a creator (mktutmgen NOT NULL).
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_utm_campaigns_created on utm_campaigns (created_at desc);
create index if not exists idx_utm_campaigns_naming  on utm_campaigns (naming_campaign);
create index if not exists idx_utm_campaigns_created_by on utm_campaigns (created_by);

-- ── QA reviews (1:1 with campaign) ──────────────────────────────────────────
create table if not exists utm_qa_reviews (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null unique references utm_campaigns(id) on delete cascade,

  status text not null default 'PENDING'
    check (status in ('PENDING','IN_REVIEW','APPROVED','REJECTED')),

  -- Platform check
  platform_correct text not null default 'PENDING' check (platform_correct in ('PENDING','OK','FAIL','NA')),

  -- Campaign-level checks
  campaign_name_correct      text not null default 'PENDING' check (campaign_name_correct in ('PENDING','OK','FAIL','NA')),
  campaign_objective_correct text not null default 'PENDING' check (campaign_objective_correct in ('PENDING','OK','FAIL','NA')),
  campaign_budget_match      text not null default 'PENDING' check (campaign_budget_match in ('PENDING','OK','FAIL','NA')),
  budget_level               text not null default '',
  budget_allocation          text not null default '',
  campaign_observations      text not null default '',

  -- Ad Group checks
  ad_group_name_correct    text not null default 'PENDING' check (ad_group_name_correct in ('PENDING','OK','FAIL','NA')),
  ad_group_start_date      timestamptz,
  is_evergreen             boolean not null default false,
  ad_group_end_date        timestamptz,
  event_name               text not null default '',
  geo_age_gender_match     text not null default 'PENDING' check (geo_age_gender_match in ('PENDING','OK','FAIL','NA')),
  included_audiences_match text not null default 'PENDING' check (included_audiences_match in ('PENDING','OK','FAIL','NA')),
  excluded_audiences_match text not null default 'PENDING' check (excluded_audiences_match in ('PENDING','OK','FAIL','NA')),
  placement_scope          text not null default '',
  ad_group_observations    text not null default '',

  -- Ad-level checks
  ad_name_correct          text not null default 'PENDING' check (ad_name_correct in ('PENDING','OK','FAIL','NA')),
  profiles_correct         text not null default 'PENDING' check (profiles_correct in ('PENDING','OK','FAIL','NA')),
  main_copy_approved       text not null default 'PENDING' check (main_copy_approved in ('PENDING','OK','FAIL','NA')),
  title_copy_approved      text not null default 'PENDING' check (title_copy_approved in ('PENDING','OK','FAIL','NA')),
  description_copy_approved text not null default 'PENDING' check (description_copy_approved in ('PENDING','OK','FAIL','NA')),
  cta_value                text not null default '',
  url_matches_naming       text not null default 'PENDING' check (url_matches_naming in ('PENDING','OK','FAIL','NA')),
  url_with_utm_works       text not null default 'PENDING' check (url_with_utm_works in ('PENDING','OK','FAIL','NA')),
  preview_link             text not null default '',
  tracking_events          text not null default '',
  ad_observations          text not null default '',

  -- Responsibility (optional; ON DELETE SET NULL like leads.assigned_to)
  implemented_by uuid references auth.users(id) on delete set null,
  implemented_at timestamptz,
  reviewed_by    uuid references auth.users(id) on delete set null,
  reviewed_at    timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── updated_at triggers (reuse pawebsite's update_updated_at() from 00013) ──
do $$
declare t text;
begin
  foreach t in array array[
    'utm_industries','utm_countries','utm_companies','utm_brands','utm_platforms',
    'utm_ad_formats','utm_buy_types','utm_campaign_types','utm_segmentation_types',
    'utm_ad_piece_types','utm_campaigns','utm_qa_reviews'
  ]
  loop
    -- master-data tables have no updated_at; only add where the column exists
    if exists (select 1 from information_schema.columns
               where table_name = t and column_name = 'updated_at') then
      execute format('drop trigger if exists set_updated_at on %I', t);
      execute format('create trigger set_updated_at before update on %I
                      for each row execute function update_updated_at()', t);
    end if;
  end loop;
end $$;

-- ── RLS: admin-only (reuse is_admin() from 00013) ───────────────────────────
do $$
declare t text;
begin
  foreach t in array array[
    'utm_industries','utm_countries','utm_companies','utm_brands','utm_platforms',
    'utm_ad_formats','utm_buy_types','utm_campaign_types','utm_segmentation_types',
    'utm_ad_piece_types','utm_campaigns','utm_qa_reviews'
  ]
  loop
    execute format('alter table %I enable row level security', t);
    begin
      execute format('create policy "Admin full %s" on %I for all using (is_admin()) with check (is_admin())', t, t);
    exception when duplicate_object then null;
    end;
  end loop;
end $$;
