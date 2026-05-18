# Implementation Plan — ajustes5.txt
**Date:** 2026-05-18  
**Branch:** main  
**Scope:** 7 feature items from ajustes5.txt

---

## Pre-implementation context

### Codebase state
- Next.js 16 / React 19 / TypeScript / Supabase / Tailwind 4 / Vercel
- Admin panel at `/admin` with Supabase Auth
- Current project_type DB enum: `vertical | horizontal | mixed-use`
- Location stored as free text (`location_description`) — no structured zone field
- Avatar: `<AvatarCall>` in `tech-section.tsx` auto-connects on mount (consumes Runway credits)
- Admin configuracion: manages hero video, tertiary banner, company info, social links, legal copy
- Forms: `cotizador-contact-form.tsx` → `POST /api/contact` → shows inline success state (no redirect)

### Decisions locked in
- Location filter: add `zone` TEXT column to `projects` table; admin controls it per-project; filter auto-populates from DB values
- Project types: add `casas`, `apartamentos`, `terrenos` to the `project_type` PostgreSQL enum
- Lic. Puertas idle photo: configurable via admin site settings (ImageUploader), stored as `lic_puertas_photo` key in `site_settings`
- Admin images to add: team photos (Quiénes Somos), homepage section backgrounds, Lic. Puertas avatar photo

---

## Item 1 — Rename "Proyectos" → "Proyectos y Propiedades"

**Files:**
| File | Change |
|---|---|
| `src/lib/constants/navigation.ts` | `"Proyectos"` label → `"Proyectos y Propiedades"` |
| `src/app/proyectos/page.tsx` | `<title>` / `metadata.title` + `<h1>` heading |
| `src/components/layout/footer.tsx` | footer nav link label |

**Notes:**
- The route `/proyectos` stays the same — no redirect needed, no SEO break
- Search for any other hardcoded "Proyectos" labels in nav/footer/breadcrumbs

---

## Item 2 — Filters + keyword search on "Proyectos y Propiedades"

### 2a. Database migration
```sql
-- Add zone column
ALTER TABLE projects ADD COLUMN zone TEXT;

-- Extend project_type enum (PostgreSQL: ALTER TYPE is transactional safe for ADD VALUE)
ALTER TYPE project_type ADD VALUE IF NOT EXISTS 'casas';
ALTER TYPE project_type ADD VALUE IF NOT EXISTS 'apartamentos';
ALTER TYPE project_type ADD VALUE IF NOT EXISTS 'terrenos';
```
Migration file: `supabase/migrations/YYYYMMDDHHMMSS_add_zone_and_project_types.sql`

### 2b. TypeScript types
- `src/lib/types/database.ts`: add `'casas' | 'apartamentos' | 'terrenos'` to `ProjectType`

### 2c. Admin — project edit form
- `src/app/admin/proyectos/[id]/page.tsx`:
  - Add **Zona / Área** text input (maps to `zone` column)
  - Add new `project_type` options: Casas, Apartamentos, Terrenos (alongside existing vertical/horizontal/mixed-use)
- `src/lib/actions/projects.ts`: include `zone` in update/create payloads

### 2d. Backend — query update
- `src/lib/queries/projects.ts` → `getPublishedProjects()`: select `zone` column
- Add `getProjectZones()` query: `SELECT DISTINCT zone FROM projects WHERE is_published = true AND zone IS NOT NULL ORDER BY zone`

### 2e. Frontend — filter component redesign

**Desktop layout:** Horizontal filter bar above project grid (sticky on scroll)  
**Mobile layout:** Full-screen drawer (bottom sheet pattern), opened via "Filtros" button with active-filter count badge

New `ProjectFilters` state shape:
```typescript
interface ProjectFilters {
  keyword: string;          // keyword search on name + location_description
  projectType: string[];    // multi-select: Casas | Apartamentos | Terrenos | all existing types
  zone: string[];           // multi-select from DB-driven list
  bedrooms: string;         // "1" | "2" | "3" | "4+" | ""
  priceMax: number | null;  // max starting_price
}
```

**Files to create/modify:**
| File | Action |
|---|---|
| `src/components/projects/project-filter.tsx` | Full redesign — new multi-dimensional filter UI |
| `src/app/proyectos/projects-listing.tsx` | Accept `zones: string[]` prop; apply all filter dimensions client-side |
| `src/app/proyectos/page.tsx` | Fetch zones via `getProjectZones()`; pass to `ProjectsListing` |

**Filter logic (client-side):**
- Keyword: case-insensitive match on `name` + `location_description`
- Project type: exact match on `project_type` enum value
- Zone: exact match on `zone` column
- Bedrooms: parse `bedroom_range` string (e.g. "2-3 habitaciones") — filter if range overlaps selection
- Price: `starting_price <= priceMax` (only if `priceMax` is set)
- All active filters combined with AND logic
- "Limpiar filtros" button resets all dimensions
- Live count: "X proyectos encontrados" updates as filters change

**UX patterns (per research):**
- Desktop: filter chips in a horizontal bar, dropdowns for zone/type
- Mobile: bottom drawer with accordion sections, sticky "Ver X resultados" button at bottom
- Active filter indicator: navy pill showing selected value; badge count on mobile "Filtros (2)" button

---

## Item 3 — Lic. Puertas: manual call initiation (no auto-start)

### Problem
`<AvatarCall connectUrl="/api/avatar/session" />` mounts and immediately establishes a Runway realtime session — consuming credits on every page load.

### Solution
Replace with a two-state component:
1. **Idle state:** branded card showing Lic. Puertas photo + name/title + "LLAMAR" button
2. **Active state:** mounts `<AvatarCall>` only after user clicks "LLAMAR"; shows loading spinner while session initializes; provides "Colgar" / disconnect button

### Files

**New component:** `src/components/landing/avatar-call-card.tsx`
```
State machine: idle → connecting → connected → idle
```
- `idle`: Show photo (from `licPuertasPhotoUrl` prop) + "LLAMAR" button
- `connecting`: Show spinner + "Conectando..." text
- `connected`: Render `<AvatarCall>` + "Colgar" button overlay
- On disconnect / error: return to `idle`

**Modified:** `src/components/landing/tech-section.tsx`
- Replace `<AvatarCall>` with `<AvatarCallCard licPuertasPhotoUrl={photoUrl} />`
- Fetch `photoUrl` from `site_settings` (server component or pass as prop)

**Admin — site settings:** `src/app/admin/configuracion/page.tsx`
- Add new section: **"Lic. Puertas — Avatar"**
- `ImageUploader` for `lic_puertas_photo` key in `site_settings` bucket `site-assets`
- Text inputs: `lic_puertas_name` (e.g. "Lic. Carlos Puertas"), `lic_puertas_title` (e.g. "Asesor Senior")

**Settings queries/actions:**
- `src/lib/queries/settings.ts`: add `getLicPuertasSettings()` function
- `src/lib/actions/settings.ts`: handled by existing `updateSiteSetting()`

---

## Item 4 — Admin: image management for all site images

### Scope (per user confirmation)
- Team/staff photos on Quiénes Somos (currently no images — new feature)
- Background/section images on homepage
- Banner images outside current tertiary banner
- Lic. Puertas avatar photo (covered in Item 3)

### 4a. Team members (Quiénes Somos)

**DB:** New `site_settings` key: `team_members` (JSON array)
```json
[
  { "name": "", "title": "", "photo_url": "", "bio": "" }
]
```

**Admin — `src/app/admin/configuracion/page.tsx`:**
- New section: **"Equipo"**
- Dynamic list: add/remove team members
- Per member: name input, title input, bio textarea, ImageUploader (bucket `site-assets`)
- Save entire array as `team_members` setting

**Frontend — `src/app/quienes-somos/page.tsx`:**
- Fetch `team_members` from settings
- If array has items, render a new **"Nuestro Equipo"** section
- Grid of cards: photo (circular), name, title, optional bio
- If no team members configured, section is hidden (graceful)

### 4b. Homepage section background images

**Audit required during implementation** — walk through all components in `src/components/landing/` and identify hardcoded image src values:
- `why-how-section.tsx`
- Any background image in hero/banner sections not covered by `tertiary_banner`

**Approach:**
- Each identified image gets a corresponding key in `site_settings` (e.g. `homepage_section_X_image`)
- Add `ImageUploader` controls in admin configuracion for each

**Note:** This audit will be done at implementation time. The plan covers the pattern; exact keys depend on what's found.

---

## Item 5 — Footer logo 2× larger

**File:** `src/components/layout/footer.tsx`

**Change:** Find the footer logo `<Image>` component.  
Current: `width={120} height={40}` (or equivalent Tailwind sizing)  
New: `width={240} height={80}` (2×)

---

## Item 6 — Thank you page after form submission

### New page: `src/app/graciasportucontacto/page.tsx`

**Requirements:**
- Route: `/graciasportucontacto`
- Same brand identity (navy, celeste, Poppins, logo)
- `noindex, nofollow` meta (prevents GA4 goal/conversion data corruption)
- Content:
  - ✓ Confirmation heading: "¡Gracias por contactarnos!"
  - Subtext: "Hemos recibido tu mensaje. Un asesor te contactará en menos de 24 horas."
  - One secondary CTA: "Ver Proyectos" → `/proyectos`
- Data layer push for conversion tracking (GTM-ready):
  ```javascript
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: 'lead_form_submitted' });
  ```
  This fires when GTM is installed (Item 8), enabling META Pixel + GA4 conversion events.

### Form redirect update

**File:** `src/components/cotizador/cotizador-contact-form.tsx`
- On successful API response: call `router.push('/graciasportucontacto')` instead of showing inline success state
- Remove inline success message (no longer needed)

**Note:** Same thank you page will be reused by the terrenos landing page form (Item 7).

---

## Item 7 — Terrenos landing page

**Route:** `/terrenos`  
**Goal:** Lead generation for landowners interested in **selling** their land to/through Puerta Abierta  
**Not in main navigation** (per requirement)

### New page: `src/app/terrenos/page.tsx`

**Page structure (based on real estate lead gen best practices):**

```
1. HERO
   - Strong hook headline targeting sellers (e.g. "¿Tienes un terreno en Guatemala? Nosotros lo compramos")
   - Subheadline with value proposition
   - Primary CTA button → scrolls to form
   - Hero background image (configurable via admin)

2. TRUST STRIP
   - 22+ años de experiencia | X terrenos adquiridos | Proceso transparente

3. BENEFITS / WHY SELL TO PUERTA ABIERTA
   - 3-column icon grid: Fast process, Fair price, Secure transaction

4. HOW IT WORKS (3 steps)
   - Comparte los datos de tu terreno → Evaluamos y te contactamos → Cierre seguro y rápido

5. LEAD CAPTURE FORM (primary conversion point)
   Fields:
   - Nombre completo (required)
   - Teléfono (required)
   - Correo electrónico (required)
   - Zona / Municipio del terreno (required)
   - Área aproximada en m² (required, number)
   - Mensaje adicional (optional)
   - Honeypot field (spam protection, same as existing contact form)

6. SOCIAL PROOF
   - Testimonials (reuse existing testimonials from DB if applicable)

7. SECONDARY CTA
   - "¿Tienes dudas? Contáctanos por WhatsApp" → WhatsApp link

8. FAQ (2-3 questions specific to selling land)
```

### DB — new lead source
- `src/lib/types/database.ts`: add `'terrenos'` to `LeadSource` enum
- Supabase migration: `ALTER TYPE lead_source ADD VALUE IF NOT EXISTS 'terrenos';`

### Form API
- Reuse `POST /api/contact`
- Submit with `source: 'terrenos'`
- On success: redirect to `/graciasportucontacto`

### Content note
> **Action required from client:** The specific hooks, headlines, and copy for this page must be provided. The structure above is final; the text content will need to be filled in. If no copy is provided before implementation, placeholder structure will be built and content will be added in a follow-up session.

### Admin image
- Add `terrenos_hero_image` to site settings for the hero background

### SEO metadata
```typescript
export const metadata: Metadata = {
  title: "Vende tu Terreno | Puerta Abierta Inmobiliaria",
  description: "¿Tienes un terreno en Guatemala? Puerta Abierta te ofrece un proceso rápido, transparente y seguro. Contáctanos hoy.",
};
```

---

## Items 8 & 9 — META Pixel + Google Analytics (next phase)

**Scope:** These are explicitly listed as "Próximos pasos" — not in the current implementation sprint.

**Pre-work completed by Item 6:** The thank you page fires `window.dataLayer.push({ event: 'lead_form_submitted' })` so that when GTM is installed, conversion tracking is immediately operational without additional code changes.

**Implementation notes (to be planned separately):**
- META Pixel: install via GTM custom HTML tag OR Next.js `<Script>` in root layout
- GA4: install via GTM or `@next/third-parties` (official Next.js package)
- Both require GTM container ID and Pixel ID from client

---

## Implementation order

| # | Item | Estimated complexity | Dependencies |
|---|---|---|---|
| 1 | Rename nav label | XS | none |
| 5 | Footer logo 2× | XS | none |
| 6 | Thank you page + form redirect | S | none |
| 3 | Lic. Puertas manual call | M | admin photo upload |
| 2 | Filters + search | L | DB migration |
| 4 | Admin image management | L | team members schema |
| 7 | Terrenos landing page | L | DB migration (lead source), content from client |

**Recommended execution order:** 1 → 5 → 6 → 3 → 2 → 4 → 7

Rationale: Quick wins first (1, 5, 6), then the avatar fix (3) which stops credit burn immediately, then the larger DB-dependent features.

---

## Database migrations summary

| Migration | SQL | Safe for production |
|---|---|---|
| Add `zone` to projects | `ALTER TABLE projects ADD COLUMN zone TEXT;` | ✅ nullable, no data loss |
| Add project_type values | `ALTER TYPE project_type ADD VALUE IF NOT EXISTS 'casas/apartamentos/terrenos';` | ✅ additive only |
| Add lead_source value | `ALTER TYPE lead_source ADD VALUE IF NOT EXISTS 'terrenos';` | ✅ additive only |

All migrations are additive (no column drops, no type changes, no data migrations) and are safe to run on a live production database.

---

## Open questions (resolve before implementation)

1. **Terrenos copy:** Client must provide headline hooks, benefit descriptions, and FAQ questions for the `/terrenos` landing page before that page can be finalized.
2. **Homepage background images:** Exact list of images to make admin-editable will be confirmed during the Item 4 audit.
3. **Team member data:** Who should appear on Quiénes Somos? Names, titles, photos, bios — needed before the team section can go live.
