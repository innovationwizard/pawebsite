# Implementation Plan — ajustes6
**Date:** 2026-09-10
**Branch:** main
**Sources:** `ajustes6/Optimizaciones Website PAI.pdf` (3 pp.) + `ajustes6/Puerta Abierta — Website Look and Feel.pdf` (10 pp., home-page mockup)
**Status:** IMPLEMENTED 2026-09-10 on `main` (commits `dc58471` → restyle). **Pending on the client:** run the SQL in §4 in the Supabase SQL editor *before* deploying — until then the Terrenos and Servicios forms fail on insert (missing enum values / columns), exactly as Terrenos did before.

---

## 0. What the client asked for (verbatim intent, grouped)

### A. New "Servicios" page — B2B lead-gen landing for developers
Puerta Abierta is launching *Mercadeo y Ventas* services for real-estate developers that lack an
optimized sales/marketing force. The site is the paid-media destination for those campaigns and
must capture developer leads. Sections requested, in order:

1. Hero cover with image (client says "placeholder para mientras") + hero text
   *"Marketing, Ventas y Tecnología para desarrollo inmobiliario"* (I may adapt the tone) + CTA
   *"Sí, quiero llevar mis ventas a otro nivel"*.
2. Logo ribbon: Boulevard 5, Bosque Las Tapias, Benestare, Santa Elena, Casa Elisa, "etc."
3. Hero phrase about the Puerta Abierta process/operations: *"Es así como Puerta Abierta lleva tu
   operación y tus ventas a otro nivel"*.
4. "¿Cómo lo hacemos?" — performance marketing, fuerza de ventas optimizada, tecnología.
   Headline *"No contratas a una agencia. Sumas un equipo que ya vende."* Reference image supplied
   (dark navy, eyebrow "POR QUÉ TRABAJAR CON NOSOTROS", 4 cards: Operadores no teóricos /
   Enfoque a performance / Equipo y procesos listos / Tecnología propia).
5. Marketing · Ventas · Tecnología section (3 pillars with the copy given in the PDF).
6. "Enfoque integral basado en datos: Asesoramos, no presionamos" — Análisis de la competencia +
   asesoría con expertise + conversión y cierres.
7. Hitos y números: conversión promedio **8%**, volumen de leads promedio **1,200**, costo por lead
   promedio **Q15**.
8. Showcase de proyectos: Boulevard 5, Benestare, Bosque Las Tapias, Santa Elena — *"Estos proyectos
   ya confiaron en el método Puerta Abierta"*.
9. Web form for prospective clients (developers).
10. WhatsApp contact.
11. (Context paragraph) connection to **PipeDrive** CRM.

### B. Site-wide changes
1. New look & feel per the mockup PDF — colours + text layout only; **structure stays**.
2. Buttons: hover effect where the border "travels" around the button fill on hover.
3. Main menu: "Servicios" replaces "Blog y Noticias"; Blog y Noticias moves to a footer button.
4. Main menu: add "Terrenos".
5. Menu order: Inicio · Quiénes somos · Servicios · Proyectos · Terrenos · Avances de obra · FAQ ·
   Cotiza ahora — all on one line; shrink the logo if needed.
6. Home page: YouTube play/next icons must not appear on load.
7. Verify the Terrenos form works and leads show in the back panel.
8. Proyectos filter: add the "Terrenos" option.

---

## 1. Findings from the codebase audit (facts, verified)

| # | Finding | Evidence |
|---|---|---|
| F1 | **The Terrenos form has never been able to save a lead.** The live DB `lead_source` is a Postgres ENUM without `'terrenos'`; the form posts `source: "terrenos"` → insert fails → user sees *"Error al procesar tu solicitud"*. | Read-only query on 2026-09-10 returned `invalid input value for enum lead_source: "terrenos"`. `supabase/migrations/00007_create_leads.sql` defines the enum; `00017` only has a comment claiming the column is TEXT (it is not); the `ALTER TYPE … ADD VALUE 'terrenos'` planned in `PLAN_AJUSTES5.md` was never written. |
| F2 | `LEAD_SOURCES` (admin filter + label lookup) lacks `terrenos`, so even after F1 is fixed the admin dropdown cannot filter by it and the table shows the raw value. | `src/lib/constants/lead-sources.ts` |
| F3 | Terrenos form does not capture `utm_source/medium/campaign` (the home contact form does). | `src/components/terrenos/terrenos-form.tsx` vs `newsletter-form.tsx` |
| F4 | "Terrenos" is hidden from the Proyectos type filter **by design** of the last commit (`5e9b8d3`): options are derived from live `project_type` values, and no published project has `project_type = 'terrenos'` (live: Santa Elena = casas, the other 4 = apartamentos). | `projects-listing.tsx` → `availableTypes`; live DB read |
| F5 | The YouTube icons on the hero: the iframe is `pointer-events-none` but YouTube still paints its own chrome (large play button, and the "next" arrow because `loop` uses a `playlist` param) whenever autoplay is delayed/blocked (Safari/iOS Low-Power, first paint before the player starts). There is no poster/cover, so the chrome is visible. | `src/components/landing/hero-video.tsx` |
| F6 | Navbar breakpoint is `xl` (1280 px); 6 items + logo `h-20` fit today. Adding 2 items (Servicios, Terrenos) will overflow at `xl` unless the logo shrinks and/or link padding tightens. | `navbar.tsx` |
| F7 | No Pipedrive code exists anywhere; the repo's `IMPLEMENTATION_PLAN.md` states the admin CRM *replaced* Pipedrive. | grep |
| F8 | Design tokens today: `navy #0d1d41`, `celeste #04b0d6`, `gray #5b6770`, `off-white #f8f9fa`, `dark #0a0e1a`; body/headings both Poppins (Mangueira never delivered, `public/fonts/` is empty). | `globals.css`, `layout.tsx` |
| F9 | Pill buttons are hand-written Tailwind in ~41 places across ~30 public files; `components/ui/button.tsx` is used mainly by forms/admin. A global hover effect needs a shared class, not 41 edits. | grep `rounded-full` |
| F10 | Site settings already support per-page hero media (`quienes_somos_hero`), section images and highlight numbers via `/admin/configuracion` — the same mechanism can host the Servicios hero image and the 3 KPI numbers. | `src/lib/queries/settings.ts`, `admin/configuracion/page.tsx` |

---

## 2. Look & feel — what the mockup actually specifies

Sampled from the PDF render and **confirmed by the client (Q1)**:

| Token | Mockup value | Current | Usage in mockup |
|---|---|---|---|
| `navy` (dark surfaces) | `#030328` | `#0d1d41` | numbers band, "Educación", "Tecnología", footer backgrounds |
| hero gradient | `#020107 → #056ca8` (top-left → bottom-right) | flat navy/60 overlay | hero + tech section |
| `celeste` (accent) | `#1ec8f0` | `#04b0d6` | eyebrow labels, KPI numbers, outlined italic words, quote marks |
| primary button | `#0573b0` | `#04b0d6` | "Conoce nuestros proyectos", "Agenda una asesoría" |
| light surface | `#f9fafb` | `#f8f9fa` | process cards, testimonial cards, project grid band |
| heading text | `#030328` | `#0d1d41` | all light-section headings |

Typographic system in the mockup (applies to every section, light or dark):
- **Eyebrow**: 11–12 px, uppercase, `tracking-[0.2em]`, celeste, above every H2 ("NUESTROS PROYECTOS", "¿CÓMO LO HACEMOS?", "INNOVACIÓN · DATOS · IA" …).
- **H1/H2**: heavy weight (Poppins 800/900), tight leading, left-aligned, 2 lines max. One or two words highlighted as **outlined italic** (`-webkit-text-stroke` celeste, transparent fill, italic) — "ideal", "espera", "paso a paso.", "tecnología", "hogar ideal".
- **Body**: 16–18 px, grey (`white/70` on dark), `max-w-xl`.
- **Cards**: `rounded-2xl`, light `#f9fafb` on white; on dark, `white/5` fill + `white/10` border (reference image).
- **Stat tiles**: giant celeste number + small grey label, separated by a top hairline.
- **Buttons**: mockup shows `rounded-lg`, but **the site keeps its full-pill shape (Q3)**; colours change — primary solid `#0573b0`, secondary outline `white/30`; arrow "→" suffix on CTAs.
- **Navbar**: mockup shows a white bar; **the site keeps transparent-over-hero → navy on scroll (Q6)**. Logo shrinks to **65 px** tall (Q5).
- **Footer**: dark, 4 columns — brand + tagline + "Agenda una asesoría" button | PROYECTOS | SERVICIOS | EMPRESA; bottom bar © + Privacidad · Términos · Contacto.
- **Cards for projects**: white, category tag (NATURALEZA / SMART LIVING / ACCESIBLE / PREMIUM / ENTREGADO) + status pill, name, location · hab., price + "→".

Structure differences between mockup and current home — **not adopted** (Q2: only restyle; structure stays):
- Mockup nav: Proyectos / Asesoría / Educación / Sobre nosotros (client's own list in the PDF overrides this).
- Mockup has an "Educación primero" section and no Lic. Puertas avatar / news capsules / tertiary banner / newsletter form.
- Mockup footer link groups differ from the current footer (Navegación / Contacto / Síguenos).

---

## 3. Item-by-item implementation plan

### Item 1 — Design tokens + shared UI primitives (foundation for everything else)
**Files:** `src/app/globals.css`, `src/app/layout.tsx`, `src/components/ui/button.tsx`, new `src/components/ui/eyebrow.tsx`, new `src/components/ui/section-heading.tsx`, new `src/components/ui/outline-text.tsx`

- Update `:root` tokens to the confirmed palette (Q1). Keep the *names* (`navy`, `celeste`, `off-white`) so the 100+ existing `text-navy`/`bg-celeste` usages recolour automatically — this is what makes "colores y diagramación" feasible without a rewrite.
- Add tokens: `--color-navy-deep` (hero gradient start), `--color-blue-button` (`#0573b0`), `--color-surface` (`#f9fafb`).
- Add Poppins `800` + italic `900` weights to `next/font` (needed for the outlined italic accent).
- `OutlineText` — `<span className="italic font-black text-transparent [-webkit-text-stroke:1.5px_var(--color-celeste)]">` with a solid-colour fallback for browsers without `text-stroke`.
- `Eyebrow` + `SectionHeading` — one component so every section gets the eyebrow/H2/lead layout consistently.
- `Button`: add the border-sweep hover (Item 2), **keep `rounded-full`** (Q3), add variants `primary` (`#0573b0`), `outline-light` (dark backgrounds), `outline-dark`.
- Export a `linkButtonClass()` helper (or a `<ButtonLink>` component) so the 41 hand-written `<a>/<Link>` pills can be migrated to one class string.

### Item 2 — Button "border travels around the fill" hover
**File:** `src/app/globals.css` (utility `.btn-sweep`), consumed by `Button`/`ButtonLink`.

Confirmed (Q4): on hover a border line **draws itself once around the perimeter** of the button (starting at one point, running around until it closes; reverses/fades on mouse-out). Implementation (pure CSS, no JS, no layout shift):
- Button is `position: relative; isolation: isolate`.
- `::before` = a `conic-gradient` (or two `::before/::after` halves) masked to the border ring via `mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)` + `mask-composite: exclude`, `--angle` animated from `0deg → 360deg` on hover via `@property --angle` (Chromium/Safari 16.4+/Firefox 128+); fallback = simple border colour transition for browsers without `@property`.
- Respects `prefers-reduced-motion` (already globally handled in `globals.css`).

### Item 3 — Navigation restructure
**Files:** `src/lib/constants/navigation.ts`, `navbar.tsx`, `mobile-menu.tsx`, `footer.tsx`, `sitemap.ts`, `structured-data.tsx` (SiteNavigationElement if present)

- `NAV_ITEMS` → Inicio · Quiénes Somos · Servicios · Proyectos · Terrenos · Avances de Obra · FAQ; CTA "Cotiza Ahora" stays a separate button (mockup style: solid, with →).
- Fit on one line at `xl` (1280 px): logo `h-20 (80px) → 65px` (Q5, exact value via `h-[65px]`), link padding `px-4 → px-3`, `text-sm` kept. Verify at 1280 / 1366 / 1440 with `whitespace-nowrap`; if still tight, drop the desktop breakpoint from `xl` to `lg` only if it fits at 1024 — otherwise keep `xl`.
- Navbar behaviour unchanged: transparent over hero → `navy/95` on scroll (Q6). Only the CTA colour and link typography follow the new tokens.
- Footer: "Blog y Noticias" becomes a **button** (outline style) in the brand column; remove it from the plain link list. Footer link groups: keep the current 4 columns (Q2) and restyle to mockup typography/colours.
- Add `/servicios` to `sitemap.ts` (priority 0.9) and to the footer nav.

### Item 4 — Hero video: hide YouTube chrome
**File:** `src/components/landing/hero-video.tsx`

Root cause: F5. The **same YouTube video stays** (Q7); no MP4/poster available, so the cover is the brand gradient. Fix (no dependency on autoplay succeeding):
1. Render an opaque cover layer (hero brand gradient `#020107 → #056ca8`) *above* the iframe, `opacity: 1` by default.
2. Load the YouTube IFrame API (`enablejsapi=1` + `https://www.youtube.com/iframe_api` via `next/script`, `strategy="lazyOnload"`), attach `onStateChange`, and fade the cover out only when `event.data === YT.PlayerState.PLAYING`. If the state never reaches PLAYING (autoplay blocked), the cover simply stays — no icons, hero text still readable over the gradient.
3. Keep `controls=0&rel=0&iv_load_policy=3&disablekb=1&fs=0&playsinline=1`; remove `showinfo` (deprecated no-op).

### Item 5 — Terrenos: make the form actually work (F1–F3)
**Files:** new `supabase/migrations/00026_add_lead_source_terrenos_servicios.sql`, `src/lib/constants/lead-sources.ts`, `src/components/terrenos/terrenos-form.tsx`, `src/app/api/contact/route.ts`

```sql
-- 00026: lead_source enum is missing the values the site already posts.
-- Idempotent; ADD VALUE cannot run inside an explicit transaction block,
-- so this file must be applied as its own statement batch.
ALTER TYPE lead_source ADD VALUE IF NOT EXISTS 'terrenos';
ALTER TYPE lead_source ADD VALUE IF NOT EXISTS 'servicios';
```
- Delete the misleading comment in `00017` (it states the column is TEXT; it is an enum).
- `LEAD_SOURCES`: add `{ value: "terrenos", label: "Terrenos (web)" }` and `{ value: "servicios", label: "Servicios (web)" }` so the admin filter/label/CSV work.
- `terrenos-form.tsx`: capture `utm_source/utm_medium/utm_campaign` from `window.location.search` (same as `newsletter-form.tsx`).
- `/api/contact`: replace the hard-coded `validSources` array with `LEAD_SOURCES.map(s => s.value)` so the two lists cannot drift again.
- Deployment (Q8): the migration file is committed for history **and** its SQL is pasted into the Supabase SQL editor by the client (each `ALTER TYPE` as its own run, not inside `BEGIN/COMMIT`). Code that depends on the new enum values ships only after the SQL has been applied.
- Verification: submit the real form on a preview deploy → lead visible in `/admin/leads` with source "Terrenos (web)".

### Item 6 — Proyectos filter: "Terrenos" option
**Files:** `src/components/projects/project-filter.tsx`, `src/app/proyectos/projects-listing.tsx`

Decision (Q9-b): the "Terrenos" option is always present in the *Tipo de proyecto* select; choosing it **navigates to `/terrenos`** (`router.push`) instead of filtering. Implementation: `PROJECT_TYPE_OPTIONS` gains a `href` for `terrenos`; the select's `onChange` routes when the chosen option has an `href`, otherwise filters as today. Other type options stay data-derived. If a real `terrenos` project is ever published, the option reverts to filtering automatically (the `href` branch only applies when `availableTypes` has no `terrenos`).

### Item 7 — `/servicios` page (the core deliverable)
**Route:** `src/app/servicios/page.tsx` (server component; `Navbar solid`, `Footer`, `WhatsAppButton`)
**Components:** `src/components/servicios/` — `servicios-hero.tsx`, `servicios-logos.tsx` (reuses `ProjectLogosRibbon`), `servicios-method-banner.tsx`, `servicios-how.tsx` (4-card dark section, reference image), `servicios-pillars.tsx` (Marketing/Ventas/Tecnología), `servicios-approach.tsx` (Asesoramos, no presionamos — 3 items), `servicios-kpis.tsx` (8% / 1,200 / Q15), `servicios-showcase.tsx` (project cards from DB), `servicios-form.tsx`, `servicios-whatsapp-cta.tsx`
**Settings (Q10, Q13):** new `site_settings` keys `servicios_hero` (`{ type, url }` — same shape as `quienes_somos_hero`, uploaded via `ImageUploader` in `/admin/configuracion`) and `servicios_kpis` (`[{label, value, note}]` — same shape as `brand_highlights` plus an optional small-print note), editable in `/admin/configuracion` under a new "Servicios" section. Until an image is uploaded the hero renders the brand gradient, exactly like the home hero fallback — no placeholder file is committed.

Section spec (order as requested):

| # | Section | Content source | Notes |
|---|---|---|---|
| 1 | Hero | H1 proposal: **"Marketing, ventas y tecnología para vender tu desarrollo inmobiliario"** with *"tu desarrollo"* as outlined-italic accent; eyebrow "SERVICIOS PARA DESARROLLADORES"; sub-copy from the PDF context paragraph; CTA primary "Sí, quiero llevar mis ventas a otro nivel →" → `#formulario`; CTA secondary "Hablar por WhatsApp". | H1 approved (Q11). Media from `servicios_hero`. |
| 2 | Logo ribbon | `ProjectLogosRibbon` (the 5 active project logos) | Q12: active logos only — no insignias row. |
| 3 | Method banner | Eyebrow "EL MÉTODO PUERTA ABIERTA"; H2 "Así es como Puerta Abierta lleva tu operación y tus ventas a otro nivel." | Full-bleed dark band, mockup "numbers" styling. |
| 4 | ¿Cómo lo hacemos? | Eyebrow "POR QUÉ TRABAJAR CON NOSOTROS"; H2 "No contratas una agencia. Sumas un *equipo que ya vende*."; 4 cards exactly as the reference image (Operadores, no teóricos · Enfoque a performance · Equipo y procesos listos · Tecnología propia) with the card copy from the reference. | Dark section; last card highlighted (gradient border) as in the reference. |
| 5 | Pillars | Marketing / Ventas / Tecnología — copy verbatim from the PDF bullets, each with 3 sub-bullets (e.g. Marketing: pauta + content management · IA aplicada a marketing y analítica · optimización constante). | Light section, 3 `rounded-2xl` cards. |
| 6 | Enfoque | Eyebrow "ENFOQUE INTEGRAL BASADO EN DATOS"; H2 "Asesoramos, no presionamos."; 3 steps: Análisis de la competencia → Asesoría con expertise → Conversión y cierres. | Numbered 01/02/03 like the home process cards. |
| 7 | KPIs | 8% conversión promedio · 1,200 leads promedio · Q15 costo por lead promedio, with the qualifiers from the PDF ("basados en optimización digital", "dependiendo del target del proyecto") as small print. | `CounterAnimation`; values from `servicios_kpis` (admin-editable, Q13). Initial labels: "Tasa de conversión promedio" (8%), "Leads promedio por proyecto" (1,200), "Costo por lead promedio" (Q15). |
| 8 | Showcase | H2 "Estos proyectos ya confiaron en el método Puerta Abierta"; `ProjectCard` for Boulevard 5, Benestare, Bosque Las Tapias, Santa Elena (by slug, from `getPublishedProjects`). | Casa Elisa deliberately excluded per the PDF list. |
| 9 | Form | Fields approved (Q14): Nombre · Empresa/Desarrolladora · Cargo · Teléfono · Email · Nombre del proyecto · Ubicación · Etapa (Preventa / En construcción / Entregado) · Unidades aprox. · Mensaje. Posts to `/api/contact` with `source: "servicios"`, UTM capture, honeypot; the B2B fields go to **dedicated `leads` columns** (see §4) and are shown/filterable in `/admin/leads` + included in the CSV export. Redirect → `/graciasportucontacto`. | `DataLayerPush` on the thank-you page already fires `lead_form_submitted`; add `lead_type: "servicios"` so GA4/pauta can split B2B vs B2C conversions. |
| 10 | WhatsApp | Sticky `WhatsAppButton` + inline CTA. Number: company line +502 2424 9388 (Q15). Prefilled text: "Hola, soy desarrollador y quiero información sobre los servicios de marketing y ventas de Puerta Abierta." | |

SEO: `metadata` title/description for `/servicios`, OG image (reuse `/og/og-image.jpg`), `Service` JSON-LD in `structured-data.tsx`.

### Item 8 — Apply look & feel to every public page
Scope = all public routes (admin untouched): `/`, `/quienes-somos`, `/proyectos`, `/proyectos/[slug]`, `/terrenos`, `/servicios`, `/avance-de-obra(+slug)`, `/noticias(+slug)`, `/preguntas-frecuentes`, `/cotizador`, `/graciasportucontacto`, legal pages, `not-found`, `error`.

Per component (home order, then the rest):
- `hero-video`: eyebrow "INMOBILIARIA · GUATEMALA · GRUPO ORIÓN"; H1 with outlined "ideal"/"espera"; two CTAs (primary + outline "Cotiza ahora →"); trust row limited to the figures already on the site: "+22 años · 30+ proyectos · 901 unidades activas" (the mockup's "TOP 1%" is filler — Q16, dropped).
- `project-showcase-slider` + `project-card` → mockup card style (category tag + status pill + price + arrow). Category tags are **adopted (Q17)**: new nullable `projects.category_tag` TEXT column, edited in `/admin/proyectos/[id]` (free text, shown uppercase); the card hides the tag when empty. Initial values taken from the client's mockup: Bosque Las Tapias = NATURALEZA, Boulevard 5 = SMART LIVING, Benestare = ACCESIBLE, Santa Elena = PREMIUM, Casa Elisa = ENTREGADO — seeded by the same SQL run in the editor.
- `brand-highlights` → dark band, eyebrow "PUERTA ABIERTA EN NÚMEROS", H2 "Lo que hemos construido, *paso a paso.*", hairline + 4 celeste stats. Values keep coming from `brand_highlights` (mockup shows 300 mil m² / $200M vs code defaults 757 / $650M — DB values win; nothing hard-coded).
- `why-how-section` → light section, eyebrow "¿CÓMO LO HACEMOS?", H2 "Cinco etapas. Una sola promesa.", 2-column numbered cards.
- `project-badges` → eyebrow "NUESTROS PROYECTOS NOS RESPALDAN", **text chips ("✦ Name") in a single marquee row (Q18)** replacing both image rows; the chip list = current `DELIVERED_BADGES` + `ACTIVE_BADGES` names. The insignia PNGs stay in `public/` but are no longer rendered on the home.
- `tech-section` → dark gradient, eyebrow "INNOVACIÓN · DATOS · IA", outlined "tecnología"; the mockup's floating stat tiles are filler (Q16) — the right column keeps the existing Lic. Puertas `AvatarCallCard`, restyled.
- `testimonials-slider` → 2×2 white cards with celeste quote glyph (structure stays a slider on mobile).
- `footer` → dark `#030328`, small logo, columns per Q2.
- All other pages: swap headings to `SectionHeading`, buttons to `ButtonLink`, surfaces to new tokens. No copy changes outside what is listed here.

### Item 9 — Pipedrive connection — **OUT OF SCOPE (Q19)**
Not part of this iteration. Kept here as the reference design for a later one: server-side push from `/api/contact` (after the Supabase insert succeeds) to Pipedrive `POST /v1/persons` + `POST /v1/leads` with `PIPEDRIVE_API_TOKEN` + `PIPEDRIVE_PIPELINE_ID` env vars, idempotent on email/phone, retried via a `lead_sync_log` table so a Pipedrive outage never loses a web lead. Requires: API token, company domain, which pipeline/stage, custom-field keys for UTM + source, and whether **all** web leads or only `servicios` go to Pipedrive.

---

## 4. Database changes

| Migration | SQL | Safe for production |
|---|---|---|
| `00026_add_lead_source_terrenos_servicios.sql` | `ALTER TYPE lead_source ADD VALUE IF NOT EXISTS 'terrenos'; ALTER TYPE lead_source ADD VALUE IF NOT EXISTS 'servicios';` | ✅ additive; must not be wrapped in a transaction |
| `00027_add_leads_b2b_columns.sql` | `ALTER TABLE leads ADD COLUMN IF NOT EXISTS company TEXT, ADD COLUMN IF NOT EXISTS job_title TEXT, ADD COLUMN IF NOT EXISTS project_name TEXT, ADD COLUMN IF NOT EXISTS project_location TEXT, ADD COLUMN IF NOT EXISTS project_stage TEXT CHECK (project_stage IN ('preventa','construccion','entregado')), ADD COLUMN IF NOT EXISTS project_units INTEGER;` | ✅ nullable, additive (Q14) |
| `00028_add_projects_category_tag.sql` | `ALTER TABLE projects ADD COLUMN IF NOT EXISTS category_tag TEXT;` + `UPDATE projects SET category_tag = … WHERE slug = …` for the 5 projects (values from the client's mockup, Q17) | ✅ nullable, additive; idempotent updates |
| `site_settings` rows | `servicios_hero`, `servicios_kpis` — created on first save from admin (no seed needed; page renders the gradient fallback until then) | ✅ |

All three files are committed to `supabase/migrations/` and applied by the client through the **Supabase SQL editor (Q8)**; `00026` must be run statement-by-statement outside a transaction. `src/lib/types/database.ts` is updated for every new column.

---

## 5. Analytics / campaign readiness
- `/servicios` thank-you fires `lead_form_submitted` with `lead_type: servicios`; `/terrenos` with `lead_type: terrenos` (today both fire the same anonymous event).
- All three forms capture UTMs → stored on `leads` → visible in admin/CSV → matches the UTM Generator convention already in `/admin/utm`.
- GA4 excludes `/admin` already (commit `69bb8a7`); nothing to change.

---

## 6. Files touched (summary)

**New:** `src/app/servicios/page.tsx`, `src/components/servicios/*` (10 files), `src/components/ui/{eyebrow,section-heading,outline-text,button-link}.tsx`, `supabase/migrations/{00026,00027,00028}_*.sql`
**Modified:** `globals.css`, `layout.tsx`, `button.tsx`, `navigation.ts`, `navbar.tsx`, `mobile-menu.tsx`, `footer.tsx`, `sitemap.ts`, `structured-data.tsx`, `hero-video.tsx`, `project-filter.tsx`, `projects-listing.tsx`, `terrenos-form.tsx`, `lead-sources.ts`, `api/contact/route.ts`, `graciasportucontacto/page.tsx`, `queries/settings.ts`, `admin/configuracion/page.tsx`, `admin/leads/page.tsx`, `admin/leads/[id]/page.tsx`, `api/leads/export/route.ts`, `admin/proyectos/[id]/page.tsx`, `admin/proyectos/nuevo/page.tsx`, `lib/types/database.ts`, `project-card.tsx`, `project-badges.tsx`, every public page/section component for the restyle (≈30 files, class-level edits).
**Deleted:** the false comment in `00017_add_zone_and_project_types.sql`.

---

## 7. Execution order

| Step | Item | Size | Why this order |
|---|---|---|---|
| 1 | Item 5 — Terrenos fix + migrations 00026–00028 | S | Production bug losing real leads today; all SQL handed to the client in one go so the editor run happens once |
| 2 | Item 1 — tokens + primitives | M | Everything visual depends on it |
| 3 | Item 2 — button hover | S | Part of the primitives |
| 4 | Item 3 — navigation | S | Needed before `/servicios` can be linked |
| 5 | Item 7 — `/servicios` | L | Core business deliverable; built directly in the new style |
| 6 | Item 4 — hero video chrome | S | Independent |
| 7 | Item 6 — Terrenos filter | XS | Independent |
| 8 | Item 8 — restyle all pages | L | Last, so every page is touched once |

Each step = one commit; `npm run lint` + `npm run build` must pass before each commit; visual check at 375 / 768 / 1280 / 1440 px.

---

## 8. Risks
- **Enum migration**: `ALTER TYPE … ADD VALUE` fails inside a transaction on some tooling; apply as a standalone statement. Zero downtime otherwise.
- **Token recolour is global**: changing `--color-navy`/`--color-celeste` recolours the admin too (it shares `globals.css`). Mitigation: scope the new values under `body:not(.admin)` or define `--color-navy-site` tokens — decision in implementation, admin will be checked visually.
- **`-webkit-text-stroke`** has no outline fallback in very old browsers → falls back to solid celeste text (still legible).
- **Nav one-line fit at 1280 px** is tight with 7 items + CTA and a 65 px logo; may require `lg`/`xl` tuning after measuring real widths.
- **Ordering with the SQL editor**: if the code that writes `source = 'servicios'` or the new `leads` columns deploys before the client runs the SQL, those forms fail exactly like Terrenos does today. The SQL is delivered first and confirmed applied before the dependent commits are pushed.
- **Mockup filler figures** (TOP 1%, +12% plusvalía, 94% precisión, 24h, 300 mil m², $200M, 90% cierres, +1,200 familias, 12 años) are confirmed filler (Q16) and are not published anywhere.

---

## 9. Out of scope (not requested)
- Adopting the mockup's "Educación primero" section or its different nav labels.
- Changing copy on pages other than those listed.
- Any admin UI restyle.
- Pipedrive integration (Q19).

---

## 10. Decisions log (client answers, 2026-09-10)

| # | Question | Answer |
|---|---|---|
| 1 | Palette | Confirmed as sampled (§2) |
| 2 | Structure vs mockup | Only restyle; current structure and footer columns stay |
| 3 | Button shape | Keep full pills |
| 4 | Hover effect | Border draws itself **once** around the button |
| 5 | Logo size | 65 px tall |
| 6 | Navbar colour | Keep transparent over hero → navy on scroll |
| 7 | Hero video | Keep the exact same YouTube video; gradient cover until playing |
| 8 | Migrations | Client runs SQL in the Supabase SQL editor; files still committed |
| 9 | Terrenos in filter | Option always shown; selecting it links directly to `/terrenos` |
| 10 | Servicios hero image | Uploadable from `/admin/configuracion`; gradient until uploaded |
| 11 | Servicios H1 | "Marketing, ventas y tecnología para vender tu desarrollo inmobiliario" |
| 12 | Logo ribbon | The 5 active project logos only |
| 13 | KPIs | "1,200 leads" is **per project**; all three numbers editable from admin |
| 14 | Form fields | Approved; B2B fields stored in dedicated `leads` columns |
| 15 | WhatsApp | Company line +502 2424 9388 |
| 16 | Mockup figures | Filler — ignore all of them |
| 17 | Category tags | Adopt; admin-editable per project, seeded from the mockup values |
| 18 | Insignias | Text chips, single row |
| 19 | Pipedrive | Not in scope |
