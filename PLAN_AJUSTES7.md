# Implementation Plan — ajustes7
**Date:** 2026-09-11
**Branch:** main (base `85d9204`)
**Source:** `ajustes7/Puerta Abierta Inmobiliaria Updates - Website.pdf` (3 pp.)
**Status:** APPROVED 2026-09-11 — see decisions in §9. Q6/Q7 (Boulevard 5 Instagram, Casa Elisa links) still open; those two values are left empty and admin-editable.

---

## 0. What the client asked for

### A. `/servicios`
1. Replace the current Servicios lead form with the **Pipedrive Web Form** embed:
   ```html
   <div class="pipedriveWebForms" data-pd-webforms="https://webforms.pipedrive.com/f/5X4VMzIxCcDVCNnsgwLetITzbHooKPx7NmYw4ZMmRjayMaTnv4XMD6bJSIHGaNlMmT"><script src="https://webforms.pipedrive.com/f/loader"></script></div>
   ```
   - adapt it to the site's look & feel
   - keep the redirect to the Servicios thank-you page on submit
2. Delete the text-only band *"Así es como Puerta Abierta lleva tu operación y tus ventas a otro nivel"* (screenshot in the PDF = `ServiciosMethodBanner`).
3. In the four-card section below it, replace the headline *"No contratas una agencia. Sumas un equipo que ya vende"* with **"Así es como Puerta Abierta lleva tu operación y ventas a otro nivel"**; keep the cards.

### B. Site-wide
4. Buttons: the hover effect "was not done" — on hover the outline must **draw itself progressively, slow-to-medium speed**, around the button.
5. Admin option for a **hero video** on `/terrenos` and `/servicios` (YouTube link); until a video is set, keep the current background.
6. **Outlined-only text on white backgrounds** → fill with the same colour as the stroke. Outlined text on blue/dark backgrounds stays as is.
7. Project pages (Boulevard 5, Bosque Las Tapias, Benestare, Santa Elena, Casa Elisa): in *"Acerca del proyecto"* show the project's **website, Facebook, Instagram (with logos) and WhatsApp**. Data supplied for four projects (see §5).

---

## 1. Findings (verified)

| # | Finding | Evidence |
|---|---|---|
| F1 | **Why the button hover never showed:** `@property --sweep-angle` is registered with `inherits: false`. The `::after` ring reads `var(--sweep-angle)` but a non-inheriting registered property never reaches the pseudo-element, so it always renders `0deg` — the hover state changed a value nobody read. The CSS *is* compiled and applied (checked in `.next/static/chunks/*.css`); it simply cannot animate. | `src/app/globals.css` lines 74–117; compiled output |
| F2 | **The Pipedrive embed is a cross-origin `<iframe>`.** The `loader` script replaces the `<div>` with `<iframe src="https://webforms.pipedrive.com/f/<id>?embeded=1&uuid=…">` (max-width 768 px) and talks to it via `postMessage`: `RESIZE` (auto-height), `REDIRECT` (sets `window.top.location.href` to a URL the *form* sends), `REQUEST_COOKIES`, `REQUEST_JS_VARIABLES` (reads `window.pd_webform.<name>` to prefill hidden fields). There is **no submit callback** exposed to the host page. | Downloaded and read `https://webforms.pipedrive.com/f/loader` (47 KB) |
| F3 | Consequence of F2 — **our CSS cannot style anything inside the form** (inputs, labels, button, validation). Fonts/colours must be set in Pipedrive's Web Form editor (*Style* tab: theme colour, background, font). We can fully style everything *around* it (eyebrow, heading, lead, card, WhatsApp block). | F2 |
| F4 | Consequence of F2 — **the redirect is configured in Pipedrive**, not on our site: Web Form → *Settings → After submission → Redirect to URL*. The loader executes whatever URL the form sends. Our thank-you route is `/graciasportucontacto?tipo=servicios` (fires the GA4 `lead_form_submitted` event with `lead_type: servicios`). | F2 |
| F5 | Consequence of F2 — **Servicios leads will stop appearing in `/admin/leads`** (they go straight to Pipedrive). The B2B columns added in ajustes6 stay for Terrenos/other forms but Servicios will not write to them. | — |
| F6 | The loader can prefill **hidden fields** from `window.pd_webform` — the supported way to pass `utm_source/medium/campaign` and the page URL into Pipedrive. Requires the client to add hidden fields to the form in Pipedrive and map them to JS variables of the same names. | F2 |
| F7 | CSP (`next.config.ts`) blocks the embed today: `script-src` lacks `https://webforms.pipedrive.com` and `frame-src` lacks it too. Same class of bug as the YouTube hero fix (`85d9204`). | `next.config.ts` lines 57–61 |
| F8 | `OutlineText` is used in 20+ headings on both light and dark surfaces with one style (`text-outline`). No tone information reaches it today. | grep |
| F9 | `site_settings.servicios_hero` exists as `{ type: "image", url }`; `/terrenos` has no hero setting at all (static gradient). `HeroVideo` (home) already contains the YouTube-with-gradient-cover logic, but it is coupled to the home copy. | `queries/settings.ts`, `terrenos-hero.tsx`, `hero-video.tsx` |
| F10 | `projects` has no social/website columns; WhatsApp exists per project (`whatsapp_number`, set for 4 of 5 — Casa Elisa falls back to the company line). | `database.ts`, migration 00025 |
| F11 | Data inconsistency in the PDF: **Boulevard 5's Instagram is listed as `https://www.instagram.com/benestare.gt/`** — identical to Benestare's. **Casa Elisa** is named in the request but has no links listed. | PDF p.2–3 |

---

## 2. Item 1 — Pipedrive Web Form on `/servicios`

**Files:** `src/components/servicios/servicios-form.tsx` (rewrite), new `src/components/servicios/pipedrive-web-form.tsx`, `next.config.ts` (CSP), `src/lib/constants/servicios.ts` (form URL constant → env var)

### 2a. Embed component (`PipedriveWebForm`)
- Client component. Renders `<div class="pipedriveWebForms" data-pd-webforms={url} />` and loads `https://webforms.pipedrive.com/f/loader` with `next/script` (`afterInteractive`). The loader scans for the div on `DOMContentLoaded`/`load`; because Next mounts after those events, the component calls the loader's scan again after mount (re-inject the script tag or dispatch `load`) — to be confirmed in implementation against the loader's `h()` bootstrap.
- Before the loader runs, set `window.pd_webform = { utm_source, utm_medium, utm_campaign, page_url }` from `getUtmParams()` so hidden fields can be prefilled (Q4).
- Skeleton with the card's final height while the iframe loads; `RESIZE` messages then size it.
- Form URL from `NEXT_PUBLIC_PIPEDRIVE_SERVICIOS_FORM_URL` (Rule 11 — no hard-coded config), falling back to nothing (section hides with a console error if unset).

### 2b. Look & feel — what we control vs. what Pipedrive controls
| We style (host page) | Pipedrive form editor must set |
|---|---|
| Section background `#f9fafb`, eyebrow "HABLEMOS DE TU PROYECTO", heading with accent, lead copy, WhatsApp block (unchanged from today) | Theme/primary colour **`#0573b0`** (button), text colour **`#030328`**, font **Poppins** (if offered; otherwise the closest sans), form background white or transparent, corner radius max |
| White `rounded-2xl` card with `ring-1 ring-navy/5` wrapping the iframe, padding, max-width | Field labels/placeholders text, required marks, submit label **"Sí, quiero llevar mis ventas a otro nivel"** |
| Small print under the card ("Sin compromiso. Tu información es confidencial.") | *After submission → Redirect to URL*: `https://puertaabierta.com.gt/graciasportucontacto?tipo=servicios` |

I will deliver the exact values above as a checklist for whoever edits the form in Pipedrive (Q2).

### 2c. Redirect
Handled by Pipedrive (F4). No code on our side; the existing thank-you page already fires the `servicios` conversion event.

### 2d. CSP
```
script-src  … https://webforms.pipedrive.com
frame-src   … https://webforms.pipedrive.com
connect-src … https://webforms.pipedrive.com
```

### 2e. What happens to the current form
`servicios-form.tsx` (our own form → `/api/contact` → Supabase with B2B columns) is removed from the page. The API, validators and admin fields remain (Terrenos still uses `/api/contact`). See Q1 for whether to keep our form as a fallback.

---

## 3. Item 2 + 3 — Servicios section changes
- Delete `<ServiciosMethodBanner />` from `src/app/servicios/page.tsx` and remove `servicios-method-banner.tsx`.
- `servicios-reasons.tsx`: H2 → **"Así es como Puerta Abierta lleva tu operación y ventas a otro nivel."** — accent word per the deleted band's design: "otro nivel" (outlined on dark). Eyebrow stays "POR QUÉ TRABAJAR CON NOSOTROS" (Q3 if they prefer "EL MÉTODO PUERTA ABIERTA").
- Lead copy of the deleted band ("Performance marketing, fuerza de ventas optimizada y tecnología…") is dropped with it, unless Q3 says to keep it as the new lead under the retitled heading.

---

## 4. Item 4 — Button hover (fix F1)
**File:** `src/app/globals.css`

- Move the animated variable and its transition **onto the `::after` ring itself**: `.btn-sweep::after { --sweep-angle: 0deg; transition: --sweep-angle .9s cubic-bezier(.22,1,.36,1) }` and `.btn-sweep:hover::after { --sweep-angle: 360deg }`. The pseudo-element then owns the value it paints — no inheritance needed.
- Speed "lenta-media": **0.9 s** draw (was 0.55 s), same reverse on mouse-out.
- Keep `@property` registration (needed for interpolation), keep reduced-motion guard.
- Verification without screenshots: unit-check the compiled CSS contains `.btn-sweep:hover:after{--sweep-angle:360deg}` and the transition on `:after`; you confirm visually.

---

## 5. Item 5 — Hero video for `/terrenos` and `/servicios`
**Files:** `src/components/landing/hero-video.tsx` → extract `src/components/landing/youtube-background.tsx` (the iframe + IFrame-API-gated gradient cover, no copy), `servicios-hero.tsx`, `terrenos-hero.tsx`, `queries/settings.ts`, `admin/configuracion/page.tsx`, `database.ts` (settings shapes are Json — no migration)

- Settings shape for both pages: `{ type: "image" | "video", url }` (same as `quienes_somos_hero`). `servicios_hero` is extended (currently image-only); new key `terrenos_hero`.
- Admin: image/video radio + `ImageUploader` or URL input, in the existing "Servicios — Hero" section and a new "Terrenos — Hero" section. Video accepts a **YouTube watch/short/embed URL** (parsed with the same `extractYouTubeId`); the direct-MP4 option Quiénes Somos uses is also accepted (renders `<video>`).
- Rendering priority: video → image → current gradient. Video uses the same cover-until-`PLAYING` mechanism as the home hero (so no YouTube chrome), and the same CSP allowance already in place.
- Home `HeroVideo` refactors to use `YouTubeBackground` internally — no behaviour change.

---

## 6. Item 6 — Outlined text: solid on white, outline on dark
**Files:** `globals.css`, `section-heading.tsx`, the dark sections

- CSS: `.text-outline` default becomes **solid celeste** (`color: var(--color-celeste); -webkit-text-stroke: 0`); inside `[data-tone="dark"]` it is the outline as today.
- `SectionHeading tone="dark"` sets `data-tone="dark"` on its wrapper; the hero sections (`hero-video`, `servicios-hero`, `terrenos-hero`, `project-hero`, `project-cta`, `tech-section`, `servicios-reasons`, `brand-highlights`, `servicios-kpis`) get `data-tone="dark"` on the `<section>`.
- Result: every `OutlineText` on `bg-white`/`bg-off-white` renders filled; on navy/gradient it stays outlined. No per-usage edits.

---

## 7. Item 7 — Project website + social links in "Acerca del proyecto"
**Files:** new `supabase/migrations/00029_add_project_links.sql`, `database.ts`, `admin/proyectos/[id]/page.tsx`, `admin/proyectos/nuevo/page.tsx`, `project-overview.tsx`

### 7a. Migration (applied by you in the SQL editor, as before)
```sql
ALTER TABLE projects ADD COLUMN IF NOT EXISTS website_url   TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS facebook_url  TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS instagram_url TEXT;
-- seed, matched by exact name, raising if a name does not resolve to one row (same pattern as 00025/00028)
```
Seed values from the PDF:

| Project | Website | Facebook | Instagram |
|---|---|---|---|
| Bosque Las Tapias | https://bosquelastapias.gt/ | https://www.facebook.com/BosqueLasTapias | https://www.instagram.com/bosquelastapias/ |
| Benestare | https://benestare.gt/ | https://www.facebook.com/ResidencialesBenestare | https://www.instagram.com/benestare.gt/ |
| Boulevard 5 | https://boulevard5.gt/ | https://www.facebook.com/boulevard5.gt | **`benestare.gt` in the PDF — Q6** |
| Santa Elena | https://santaelena.gt/ | https://www.facebook.com/SantaElenaAntigua.gt | https://www.instagram.com/santaelena.gt/ |
| Casa Elisa | — Q7 — | — Q7 — | — Q7 — |

### 7b. Admin
Three URL inputs ("Sitio web", "Facebook", "Instagram") in a new *Enlaces del proyecto* card on the project form; validated as `https://` URLs; empty → `NULL`.

### 7c. Public rendering
In `ProjectOverview`, under the description: a row of pill links — Globe icon + "Sitio web", Facebook logo, Instagram logo (the footer's existing SVG icons, extracted to `components/ui/social-icons.tsx`), WhatsApp logo (`wa.me/<whatsapp_number>` with the project-specific text; falls back to the company line as the rest of the page does). Each link `target="_blank" rel="noopener noreferrer"`; hidden individually when the column is empty. Buttons use the `outline` pill variant so they get the new hover.

---

## 8. Execution order

| Step | Item | Size | Notes |
|---|---|---|---|
| 1 | Button hover fix (F1) | XS | Pure CSS; the item the client noticed first |
| 2 | Outline text tone (Item 6) | S | CSS + `data-tone` attributes |
| 3 | Servicios section edits (Items 2–3) | XS | Delete band, retitle |
| 4 | Project links (Item 7) | M | Migration → SQL editor → admin → overview |
| 5 | Hero video settings (Item 5) | M | Extract `YouTubeBackground`, admin sections |
| 6 | Pipedrive embed (Item 1) | M | CSP + component + Pipedrive-side checklist; last so the form URL/env var and Pipedrive settings (Q1–Q4) are settled |

Each step = one commit; `tsc`, `lint` (now green — keep it so) and `build` before each commit. No screenshots; visual checks are yours.

---

## 9. Decisions log (2026-09-11)

| # | Topic | Decision |
|---|---|---|
| F3 | Form fields/button cannot be styled from our CSS | Accepted |
| F4 | Redirect is a Pipedrive setting | Accepted — **already configured by the client (Q3)** |
| F5 | Servicios leads no longer appear in `/admin/leads` | Accepted |
| Q2 | Styling inside the form | Done by the **Pipedrive team** using the §2b checklist |
| Q4 | UTM hidden fields | **Deferred** — the page still sets `window.pd_webform` so it works the day the fields are added |
| Q5 | Form URL location | Vercel env var `NEXT_PUBLIC_PIPEDRIVE_SERVICIOS_FORM_URL`; instructions in §10 |
| Q6 | Boulevard 5 Instagram | **Open** — left empty |
| Q7 | Casa Elisa links / WhatsApp | **Open** — links left empty; WhatsApp falls back to the company line |
| Q8 | Servicios copy | Eyebrow "POR QUÉ TRABAJAR CON NOSOTROS" kept; deleted band's lead sentence dropped |
| Q9 | Hero video sources | YouTube links **and** direct MP4 |
| Q10 | Button draw duration | 0.9 s |

## 10. Setting the Pipedrive form URL (Vercel)

1. Vercel → project **pawebsite** → *Settings* → *Environment Variables*.
2. *Add New*: **Key** `NEXT_PUBLIC_PIPEDRIVE_SERVICIOS_FORM_URL` · **Value** `https://webforms.pipedrive.com/f/5X4VMzIxCcDVCNnsgwLetITzbHooKPx7NmYw4ZMmRjayMaTnv4XMD6bJSIHGaNlMmT` · **Environments**: Production, Preview, Development (all three). Save.
3. *Deployments* → latest → ⋯ → **Redeploy** (env vars are baked in at build time because the key is `NEXT_PUBLIC_`; a redeploy is required — a new git push also works).
4. Local: add the same line to `.env.local` (`.env.example` documents it). Without the variable the form section renders a visible notice instead of an empty space.
