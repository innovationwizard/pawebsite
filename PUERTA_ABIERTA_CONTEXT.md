# Puerta Abierta Inmobiliaria — Company & Project Context

> **Source:** the `pawebsite` repository (Next.js marketing site + admin CMS/CRM for
> puertaabierta.com.gt), including its SQL migrations, seed data, page copy, internal
> planning docs (`IMPLEMENTATION_PLAN.md`, `UTM_INTEGRATION.md`,
> `marketing-project-data-extraction copy.md`, `ajustes5.txt`) and git history.
> **Compiled:** 2026-08-24.
> **Scope note:** everything below is what the repo actually contains. Where the repo is
> silent, contradictory, or where the live production database (not the repo) is the real
> source of truth, it is flagged explicitly in "Known gaps & contradictions". Nothing here
> is invented to fill a gap.

---

## 1. Company snapshot

| | |
|---|---|
| **Name** | Puerta Abierta Inmobiliaria |
| **Group** | Part of **Grupo Orión** (stated in `IMPLEMENTATION_PLAN.md`) |
| **Country / market** | Guatemala (site locale `es-GT`, currency GTQ + USD) |
| **Website** | puertaabierta.com.gt (Next.js on Vercel; replaced a previous WordPress site) |
| **Office** | 15 calle 7-77 zona 10, Edif. Optima Centro de Negocios, 5to Nivel, Of. 504, Guatemala |
| **Main phone / WhatsApp** | +502 2424 9388 |
| **Sales email** | ventas@puertaabierta.com.gt |
| **Founding date (JSON-LD)** | 2004 |
| **Headcount (JSON-LD)** | 33 |
| **Schema.org type** | `RealEstateAgent` |
| **Claimed track record** | "Más de 22 años", "30+ proyectos desarrollados", 901 units across 5 active projects |
| **Analytics** | Google Analytics `G-E0L8VZQ6EG` + `dataLayer` pushes (GTM/Meta Pixel were planned) |

**Positioning in its own words** (site copy):
- *Asesoría inmobiliaria gratuita* — the buyer pays nothing for advice.
- Accompaniment "de principio a fin": from first conversation to key handover, including
  mortgage paperwork.
- "Transparencia total" — no hidden costs, every number explained before deciding.
- "Financiamiento a tu medida" — multiple banks, FHA, *Mi Primera Vivienda*, flexible
  enganche schemes.
- "Decisiones respaldadas por datos e IA" — AI/data used for market analysis, commercial
  process and marketing (this is a real, load-bearing claim: see §6, Orion Intelligence,
  and the Runway AI avatar "Lic. Puertas").
- Stated values: Adaptabilidad, Innovación, Sostenibilidad, Integridad, Excelencia,
  Responsabilidad.

**Mission / vision** (defaults in code, overridable from the admin CMS):
- *Misión:* develop real-estate projects that exceed client expectations, generate
  sustainable value for communities, and contribute to Guatemala's urban development.
- *Visión:* be the leading inmobiliaria in Guatemala, recognized for excellence,
  design innovation and genuine commitment to families.

---

## 2. What it actually does and sells

Puerta Abierta operates on **two commercial lines** visible in the codebase:

### A. Sell/commercialize residential real estate (core business)
It markets and sells units in residential developments — apartments (vertical towers),
houses (horizontal), and commercial locales — to end buyers (*uso propio*) and investors
(*inversión*). The FAQ copy describes it as "una inmobiliaria en Guatemala especializada
en asesorarte para comprar apartamento o invertir en proyectos residenciales", i.e. it
positions as **advisor/commercializer** of projects, while other copy ("Desarrollamos
proyectos inmobiliarios") positions it as **developer**. The hero subtitle splits the
difference: *"Más de 22 años **comercializando** proyectos inmobiliarios."*

Revenue-relevant services bundled with the sale:
- Project selection and buyer-profile analysis
- Mortgage brokerage / credit advisory (banks + **FHA** + *Mi Primera Vivienda*)
- Visit scheduling, quotations (*cotizaciones*), reservation and PCV paperwork
- Post-sale accompaniment through *escrituración* and delivery

### B. Buy land (`/terrenos` lead-gen landing)
A dedicated landing page where owners offer land **to** Puerta Abierta:
- Buys urban, residential and commercial land in Guatemala City and metro municipalities
- Free evaluation, promise of contact "in under 24 business hours", evaluation in 24–72h
- Escrituración typically 30–60 business days after agreement
- Leads from this form land in the CRM with `source = "terrenos"`

---

## 3. The active portfolio — 5 projects, 901 units

Portfolio totals: **901 units, 10 towers, 86 floors**, sales team of 33+.
Unit-level pricing and availability live in **Orion Intelligence** (see §6), not in this repo.

### 3.1 Bosque Las Tapias (BLT) — `bosque-las-tapias`
- **Type:** apartamentos (vertical, residential) · **Currency:** GTQ
- **Location:** zona 18, Guatemala City
- **Structure:** 2 towers (B, C) × 13 floors × 9 units/floor = **234 units** (117/tower)
- **Unit types:** A PLUS (2 hab, 58.40 m², Q655,200), B PLUS (3 hab, 79.00 m², Q814,900),
  C PLUS (3 hab, ~83.2 m², ~Q853,400–853,600); non-PLUS A/B/C variants also exist
- **Terms:** 7% enganche · Q3,000 reserva · 24 cuotas de enganche (Torre B: 28) ·
  5.50% FHA · plazos 30/25/20/15/10 años · ingreso 2.0× cuota · escrituración 70/30 ·
  IUSI mensual incluido · seguro no incluido · cotización válida 7 días
- **WhatsApp/CRM line:** +502 2458 2648
- **Positioning:** simplest, most transparent price ladder (rule-based +Q10,000 increments
  for 3-hab); two towers let buyers pick delivery timing

### 3.2 Casa Elisa (CE) — `casa-elisa`
- **Type:** apartamentos, mixed residential + commercial · **Currency:** GTQ
- **Location:** zona 12, Guatemala City
- **Structure:** 1 building, 10 levels, 5–8 apartments/floor + 3 commercial *locales* on
  level 1 = **75 units** (72 apartments + 3 locales)
- **Unit types:** 11 residential layouts (A1–A3, A5–A7, B1–B3, C1–C2; 1–3 hab, with
  balconies/terraces) + LOCAL. Parking 12.5 m²/space; bodegas 1.78–4.9 m²
- **Terms — three cotizador variants:**
  - *CE Automático* (residential): 5% enganche · Q5,000 reserva · 1 cuota · 7.26% FHA ·
    plazos 30/25/17/15/10 · 70/30
  - *CE 208* (special unit): 10% enganche · 2 cuotas · 7.50% · ingreso 2.5× · seguro incluido
  - *CE Locales* (commercial): 20% enganche · 1 cuota · 7.50% · plazos 1/5/10/20 ·
    **escrituración 100% inmueble** · timbres 0%
- **Status:** **nearly sold out** — 74 of 75 units with PCV or reserved
- **Note:** appears in the site's *delivered* badge row, not the active row (see §9)

### 3.3 Boulevard 5 (B5) — `boulevard-5`
- **Type:** apartamentos ("smart apartments") · **Currency:** GTQ
- **Location:** zona 5, Guatemala City (competitive analysis on file references zona 10)
- **Structure:** 1 tower × 19 floors, 5–20 units/floor = **298 units**
- **Unit types:** **67 distinct configurations** — A (1 hab, 31–34 m², 80 units),
  B (2 hab, 47–52 m²), C (2 hab, 56–58 m²), D (2 hab, 66–70 m²), E (3 hab, 69–74 m², 71 units).
  `.1` suffix = ground-floor variant. Mix: 80× 1-hab, 147× 2-hab, 71× 3-hab
- **Extras:** parking 12.5 m² (tandem 25 m²), bodegas 5.3 m², multi-level sótano,
  **IkiSmart** smart-home integration on select units, mantenimiento Q16.00/m²
- **Prices:** 1-hab from ~Q700,000; 2-hab Q941,800–Q1,074,100+; per-type increment rates
  A 5.5%, B 5%, C 5%, D 2.5%, E 2.5%
- **Terms:** 7% enganche · Q10,000 reserva · 8 cuotas (Aptos Terraza: 7) · 7.26% FHA ·
  plazos 30/25/20/15/10 · 70/30
- **Status:** **nearly sold out** — ~7 of 298 available, 273 with signed PCV
- **Notable:** 200+ *cesión de derechos* (rights-transfer) records → active secondary /
  investor market
- **WhatsApp/CRM line:** +502 2458 4274

### 3.4 Benestare (BEN) — `benestare`
- **Type:** apartamentos, multi-tower · **Currency:** GTQ
- **Location:** zona 6, Guatemala City
- **Structure:** 5 towers (A–E) × 6 floors = **282 units**
  - Torre A: 54 units — 100% sold (43 tower transfers in process)
  - Torre B: 78 · Torre C: 66 · Torre D: 42 — active sales
  - Torre E: 42 — 100% frozen (strategic commercial hold)
- **Unit types:** A (1 hab, ~34 m²), B (3 hab, ~47 m²), C (3 hab, ~47 m² premium).
  **Only project with 1-bedroom units; no 2-bedroom option.**
- **Terms:** **5% enganche · Q1,500 reserva** (lowest entry in the portfolio) · 7 cuotas ·
  escrituración 70/30 · ingreso 2.0× · IUSI mensual incluido
  - Four rate scenarios: Mi Primera Casa Tipo A 5.00% · FHA Tipo B y C 5.50% ·
    Sin carencia FHA 7.26% · Crédito directo 8.50% (3-hab override: 5.50/7.26/7.50/8.50%)
  - **Plazos up to 40 years** — unique in the portfolio
- **Timeline:** staggered by tower — Torre A first (~10 months), Torre B 15-month cycle,
  Torre E last (est. July 2028); well drilling Nov 2025, infrastructure Feb 2026
- **Pricing strategy:** 6 rounds of increases since launch, Q10,000–Q15,000/round;
  1-hab discount Q8,700; appliance-package promo column; separate strategy for D and E
- **WhatsApp/CRM line:** +502 2458 4275

### 3.5 Santa Elena (SE) — `santa-elena`
- **Type:** **casas** (horizontal, single-family) · **Currency:** **USD** — the only one
- **Location:** Santa Elena / "Antigua Panorama", zona 0, Antigua Guatemala, Sacatepéquez
- **Structure:** **11 houses** (Casa 1–11), planta baja, individual lots
- **Models:** A — 491.91 m² construction, lots 386.00–400.44 m², $1,065,000–$1,300,000
  (Casas 1, 2, 5, 10, 11) · B — 581.00 m², lots 386.00–398.38 m², $1,639,500 fixed
  (Casas 3, 4, 6, 7, 8, 9). As of extraction: 4 reserved, 1 frozen, 6 available
- **Terms:** **30% enganche · $10,000 reserva · 15 cuotas de enganche** (longest) ·
  8.50% crédito directo · plazos 25/20/15/10/5 · 70/30 · **IUSI trimestral** ·
  **seguro incluido** (0.35% anual) · validity 7 days
- **Timeline:** 24 months total (Oct 2025 → Aug 2027); urbanización Oct 2025 → Jun 2026;
  each house ~15 months; well drilling Oct 2025 → Jan 2026
- **Positioning:** first and only horizontal + only USD project; premium Antigua market;
  dedicated salesperson Luccia Calvo
- **WhatsApp/CRM line:** +502 2458 4276

### 3.6 Cross-project comparison

| Parameter | BLT | CE (default) | CE (locales) | B5 | BEN | SE |
|---|---|---|---|---|---|---|
| Currency | GTQ | GTQ | GTQ | GTQ | GTQ | **USD** |
| Enganche | 7% | 5% | 20% | 7% | **5%** | **30%** |
| Reserva | Q3,000 | Q5,000 | Q5,000 | Q10,000 | **Q1,500** | **$10,000** |
| Cuotas enganche | 24/28 | 1 | 1 | 8 | 7 | **15** |
| Max plazo | 30 yr | 30 yr | 20 yr | 30 yr | **40 yr** | 25 yr |
| Tasa | 5.50% | 7.26% | 7.50% | 7.26% | 5.00–8.50% | 8.50% |
| Escrituración | 70/30 | 70/30 | **100/0** | 70/30 | 70/30 | 70/30 |
| IUSI | mensual | mensual | mensual | mensual | mensual | **trimestral** |
| Seguro en cuota | no | no | no | no | no | **sí** |

**Inventory:** BLT 234 · CE 75 · B5 298 · BEN 282 · SE 11 = **901 units**

### 3.7 Delivered / legacy projects
Shown on the homepage as gold "insignias" (badges), i.e. completed track record:
**Edificio 7-47, Telia, Casa 3, Santeli, Natú, Casa Elisa, Colinas de Castilla.**
Active-project badges (blue row): **Benestare, Boulevard 5, Bosque Las Tapias, Santa Elena.**

---

## 4. Tax, legal and commercial structure (all projects)

| Component | Rate | Notes |
|---|---|---|
| IVA | 12% | on the *inmueble* portion |
| Timbres fiscales | 3% | on the *acciones* portion (CE Locales = 0%) |
| IUSI | 0.9% annual | monthly for apartments, quarterly for SE |
| Seguro | 0.35% annual | only SE includes it in the cuota by default |
| Escrituración split | 70% inmueble / 30% acciones | default pre-tax extraction method |

**Standard cotizador disclaimers (GTQ projects):** prices subject to change without notice ·
quote valid 7 days · reserva non-refundable · square meters approximate · images referential.

**Payment methods accepted at reservation:** transferencia bancaria, boleta de depósito,
NeoLink/pasarela de pago, captura de banca móvil, cheque, otro.
**Partner banks:** Banrural, Industrial, G&T Continental, BAM, Bantrab, Inmobiliario, CHN,
Agromercantil, BAC, Promerica, Vivibanco, Ficohsa.

---

## 5. The website product (what this repo builds)

### 5.1 Public site (Spanish, es-GT)
| Route | Purpose |
|---|---|
| `/` | Landing: hero video (YouTube facade) → project logo ribbon → showcase slider → parallax banner → animated brand stats → why/how (5-step process) → project badges (delivered + active marquees) → technology section with the "Lic. Puertas" AI avatar → news capsules → testimonials → newsletter/contact form |
| `/quienes-somos` | Mission, vision, 6 values, 6 differentiators, editable hero image/video, animated stats |
| `/proyectos` | "Proyectos y Propiedades" listing with keyword search + filters: tipo (casas/apartamentos/terrenos, derived from actual data), zona, habitaciones, precio máximo |
| `/proyectos/[slug]` | Hero → overview → unit-types table → gallery+lightbox → financial summary → Google Maps → **per-project contact form** → per-project WhatsApp/call CTA |
| `/avance-de-obra` + `/[slug]` | Construction progress: % bars, dated entries, sub-item breakdowns, photo galleries |
| `/noticias` + `/[slug]` | Blog/news, Tiptap-rendered, categories |
| `/preguntas-frecuentes` | 7 FAQ categories (19 seeded Q&As), each with its own CTA, FAQPage JSON-LD |
| `/cotizador` | Financial calculator (monthly payment estimator) + advisor contact form |
| `/terrenos` | Land-acquisition lead-gen landing (benefits, 3-step process, FAQs, form) |
| `/graciasportucontacto` | **Thank-you page — every form redirects here so ad platforms fire conversion events on a URL** |
| `/politica-de-privacidad`, `/terminos-y-condiciones` | Legal, CMS-editable, noindex |

### 5.2 Admin (`/admin`, Supabase Auth, middleware-gated)
Dashboard (lead counts, funnel by stage) · **Proyectos** CRUD · **Noticias** + Categorías ·
**Avance de Obra** · **Testimonios** · **FAQ** · **Leads** (inbox, detail, notes, activity
log, CSV export) · **Precios** (one-click Orion sync) · **UTM** (generator, history, QA,
master data) · **Configuración** (site settings) · **Usuarios**.

### 5.3 Stack
Next.js 15 App Router + React 19 · TypeScript strict · Tailwind 4 + Framer Motion ·
Supabase (Postgres + Auth + Storage, RLS via `is_admin()`) · Tiptap (JSONB) · Zod ·
Vercel · YouTube embeds · Runway ML avatars (`@runwayml/avatars-react`).
Database: 25 idempotent SQL migrations; storage buckets for project images, logos, article
images, progress photos, testimonial avatars, site assets.

---

## 6. Flow of information (systems and data)

```
                 ORION INTELLIGENCE  (SSOT: units, prices, availability)
                          │  GET /api/public/units?status=AVAILABLE
                          ▼
   Admin ▸ Precios  ──►  /api/sync-prices  ──►  Supabase: unit_types replaced,
   (manual click)                                projects.starting_price,
                                                 starting_price_display, bedroom_range
                                                            │
                                                            ▼
                                             Next.js SSG/ISR  ──►  public pages
                                                   ▲
   Admin CRUD (projects, news, progress, FAQ, testimonials, settings)
                                                   │
                                          /api/revalidate (secret header)
```

**Key rules of the information model:**
1. **Orion Intelligence is the single source of truth for inventory and price.** The website
   database holds only an aggregated projection (min price per type, bedroom range, "desde"
   display string) refreshed by an explicit admin action — never hand-typed.
2. **Marketing/editorial content is owned by the website CMS** (`site_settings` key/value
   JSONB + content tables). Almost every string and image on the homepage and Quiénes Somos
   is editable from `/admin/configuracion`.
3. **RLS split:** public role can `SELECT` published content and `INSERT` leads/newsletter
   only; authenticated admins/editors have full CRUD.
4. **Analytics:** GA4 (`G-E0L8VZQ6EG`) plus `window.dataLayer` events; conversions are
   measured on `/graciasportucontacto` rather than on form submit.
5. **UTM parameters ride the lead:** `utm_source`, `utm_medium`, `utm_campaign` are captured
   on the form and stored on the `leads` row, so paid campaigns can be attributed to
   pipeline, not just to sessions.

---

## 7. Flow of operations (commercial funnel)

### 7.1 Lead capture — every entry point writes to the same table
| Entry point | Recorded as |
|---|---|
| Homepage newsletter/contact form | `source = pagina_web`, optional `project_interest_id` |
| Per-project contact form | `source = pagina_web` + `project_interest_id` = that project |
| Cotizador advisor form | `source = pagina_web` + project selected |
| `/terrenos` form | `source = terrenos`, message packs location + area + note |
| WhatsApp button / project CTA | `wa.me/<per-project number>` with a pre-filled message |
| Phone CTA | `tel:+<per-project number>` |

All HTTP forms `POST /api/contact`, which: rate-limits (5/min/IP) → validates with Zod →
drops honeypot spam silently → inserts the lead with `stage = "new"` via the service-role
client → optionally upserts a newsletter subscriber → the client redirects to
`/graciasportucontacto`.

**Per-project phone routing (important operational detail):** each project carries its own
`whatsapp_number` (digits-only international format). On a project page the floating
WhatsApp button, the WhatsApp CTA and the call button all use *that* number, so WhatsApp and
phone leads are attributed to the right project/inmobiliario in the CRM instead of pooling
into the company line. Projects without a number fall back to +502 2424 9388.

### 7.2 Lead qualification — CRM stages
`new` (Nuevo) → `contacted` (Contactado) → `interested` (Interesado) →
`visit_scheduled` (Visita Programada) → `negotiation` (Negociación) →
`closed_won` (Cerrado Ganado) / `closed_lost` (Cerrado Perdido)

Each lead supports: assignment to a user, notes (`lead_notes`), a full audit trail
(`lead_activity_log`, old/new values per change), and CSV export. This admin **replaced
PipeDrive** as the CRM (stated goal in `IMPLEMENTATION_PLAN.md`).

**Tracked lead sources (18):** facebook · meta · tiktok · linkedin · pagina_web · inbox ·
mailing · wati (WhatsApp automation) · referido · visita_inedita · senaletica · valla · pbx ·
prospeccion · activacion · evento · friends_and_family · terrenos · other.

**Buyer-profile fields tracked in the wider system:** gender; purchase type (uso propio /
inversión); marital status; education; occupation; department of origin (all 22); discovery
channel.

### 7.3 Sales → closing (as described in the FAQ and cotizador terms)
1. Contact and profile analysis (free advisory)
2. Options presented; **cotización** issued — valid 7 days
3. Project visit scheduled
4. **Reserva** paid (Q1,500–Q10,000 / $10,000, non-refundable on withdrawal)
5. **Enganche** paid in installments (1 to 28 months depending on project)
6. Mortgage application — bank, FHA, or Mi Primera Vivienda; income must be ≥ 2.0× the
   monthly payment (2.5× for CE 208)
7. **PCV** (Promesa de Compraventa) signed
8. **Escrituración** — 70% inmueble / 30% acciones (100% inmueble for CE locales)
9. Construction and delivery — buyers follow progress on `/avance-de-obra`
10. Post-sale accompaniment through key handover

*Secondary market:* B5 shows 200+ *cesión de derechos* records — buyers transferring their
rights before delivery. Benestare additionally allows transfers between towers.

### 7.4 Marketing operations — UTM governance
The admin embeds a full **UTM Generator + QA workflow** (absorbed in July 2026 from a
standalone app, `mktutmgen`, whose Supabase project and deployment were then decommissioned).
It enforces one naming formula across all paid media:

```
Campaign : {industry}_{country}_{company}_{brand}_{name}_{platform}_{format}_{buyType}_{date}
Ad Group : {brand}_{name}_{date}_{segmentation}
Ad/Piece : {brand}_{date}_{segmentation}_{pieceType}{name}{differentiator}
UTM      : ?utm_source=…&utm_medium=…&utm_campaign={campaign}&utm_term={adGroup}&utm_content={piece}
Full URL : {destinationUrl}{utmString}
```

Backed by 12 `utm_*` tables (campaigns, QA reviews, industries, brands, platforms, countries,
companies, ad formats, buy types, campaign types, segmentation types, ad piece types) holding
**414 migrated rows, including 134 campaigns with 1:1 QA reviews**. Screens: `/admin/utm`
(dashboard), `/generador`, `/historial`, `/qa`, `/datos-maestros`.

So the marketing loop closes: UTM built and QA'd in admin → used in Meta/TikTok/LinkedIn/
Google campaigns → user lands on the site → form captures utm_* → lead row carries campaign →
funnel stage progression in the same database → CSV/dashboard reporting.

### 7.5 AI in the commercial flow
- **"Lic. Puertas"** — a Runway ML real-time avatar on the homepage technology section.
  Visitors see a photo card and must click **LLAMAR** to start the call
  (`POST /api/avatar/session` creates a Runway realtime session). Auto-start was deliberately
  removed because it burned Runway credits.
- **Orion Intelligence** — the group's data platform, exposed to the website as a public
  units API and used as the pricing/inventory SSOT.

---

## 8. Competitive intelligence on file
Excel/PPT analyses exist (binary, not parsed in the repo) for: Zona 10 (→ B5), Zona 11,
Zona 5, Condado La Española zona 6, BLT direct competition (May 2025), Antigua Guatemala
(→ SE), Cobán, Carretera a El Salvador.

---

## 9. Known gaps & contradictions (read before quoting figures)

**Contradictions inside the repo — resolve with the business before publishing:**
1. **Track record:** metadata/footer say "más de 22 años" and "30+ proyectos"; the
   Quiénes Somos differentiator card is titled "**+5 Años y 12 Proyectos** de Respaldo"
   while its own body text says "más de dos décadas". JSON-LD `foundingDate` is 2004
   (= 22 years as of 2026), which supports the 22-year figure.
2. **Developer vs. commercializer:** copy alternates between "Desarrollamos proyectos" and
   "asesoramos / comercializamos". The FAQ ("trabajamos con desarrolladores confiables")
   leans commercializer.
3. **Casa Elisa** is one of the 5 active portfolio projects but appears in the *delivered*
   badge row, and it is the only active project with no dedicated WhatsApp line
   (migration 00025 sets numbers for BLT, BEN, B5, SE only).
4. **Boulevard 5 zone:** DB assigns zona 5; the competitive-analysis file and marketing
   extraction reference zona 10.

**Data that is deliberately not in the repo (production DB or offline assets):**
- Individual unit prices for Benestare and Casa Elisa; live availability for all projects
- Brand-highlight stat values (the migration comment shows the shape —
  `projects_count`, `sqm_developed`, `years_experience`, `historical_sales_millions` —
  actual values are edited in `/admin/configuracion`)
- Amenity lists (pools, gyms, rooftops), architectural renderings, floor plans
- Marketing copy per project, construction-progress photos, exact street addresses
- Bedroom counts for Santa Elena houses (0 in DB — absent from the source Excel)
- Mantenimiento rates for BLT, CE, BEN; delivery dates for individual BLT/CE towers
- IkiSmart feature detail for B5; developer/architect/contractor identities

**House rule that governs this repo** (`_THE_RULES.MD`): no mock, sample or invented data
anywhere in code, database or answers; production-first; ask rather than assume. Any figure
missing above should be requested, not estimated.

---

## 10. Glossary (Guatemalan real-estate terms used throughout)

| Term | Meaning |
|---|---|
| **Enganche** | Down payment, expressed as % of price, usually paid in monthly *cuotas de enganche* before closing |
| **Reserva** | Non-refundable deposit that takes a unit off the market |
| **Cuota** | Monthly payment (either enganche installment or mortgage payment) |
| **Plazo** | Mortgage term in years |
| **FHA** | Instituto de Fomento de Hipotecas Aseguradas — state mortgage insurance enabling lower rates |
| **Mi Primera Vivienda / Mi Primera Casa** | First-home program, preferential rate ≈5.0–5.5% |
| **PCV** | Promesa de Compraventa — binding purchase promise signed before escrituración |
| **Escrituración** | Deed execution; price split 70% *inmueble* / 30% *acciones* for tax purposes |
| **Timbres fiscales** | Stamp tax, 3%, applied to the *acciones* portion |
| **IUSI** | Impuesto Único Sobre Inmuebles — annual property tax (0.9%), billed monthly or quarterly |
| **Cesión de derechos** | Transfer of a buyer's contract rights to a third party before delivery |
| **Bodega** | Storage unit sold with the apartment |
| **Mantenimiento** | HOA/maintenance fee, quoted per m² |
| **Avance de obra** | Construction progress reporting |
| **Cotizador** | Quotation/financing calculator |
| **Visita inédita** | Walk-in prospect (first-time, unreferred visit) |
| **Señalética / Valla** | On-site signage / billboard, both tracked as lead sources |
