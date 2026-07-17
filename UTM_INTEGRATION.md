# UTM Generator integration (mktutmgen → pawebsite)

**Purpose:** absorb the standalone `mktutmgen` app (UTM Generator + QA workflow)
into pawebsite's admin as a first-class feature, preserving **all** existing
records, and decommission the separate Supabase project + Vercel deployment to
cut cost. This is the shared status doc + decision log — read it before working
on the UTM feature.

_Created 2026-07-01. Status: **COMPLETE (2026-07-02)** — migration in prod, code
ported + deployed (pawebsite `6ae69e9`), mktutmgen shows the "moved" page
(`bbbe648`), source Supabase project `exsnvlzhpgrkiqvoonlh` **deleted**. Only
open item: app-level smoke-test of the deployed `/admin/utm` (data safety was
already guaranteed by the pre-deletion diff).**_

---

## Endpoints

| | Source | Destination |
|---|---|---|
| App | mktutmgen (`utm-generator`) | pawebsite |
| Supabase project | `exsnvlzhpgrkiqvoonlh` (to be **deleted** after cutover) | `cymyzcarmhgonqcbeygl` (keeper) |
| Stack | Next 15 · **Prisma** · **NextAuth**+bcrypt · Radix · TW3 | Next 16 · **Supabase JS** · **Supabase Auth** · TW4 |
| Deploy | mktutmgen.vercel.app (to be removed) | pawebsite.vercel.app / puertaabierta.com.gt |

---

## Locked decisions (from intake Q&A, 2026-07-01)

1. **Scope = everything.** Generator + history + QA-review workflow + master-data
   admin, all embedded under pawebsite admin (target: `/admin/utm/*`, new
   sidebar section).
2. **Data layer = port to the Supabase JS client.** No Prisma in pawebsite.
   Grounded in _THE_RULES_ R6 (RLS/security), R11 (match host codebase), R7/R8
   (one stack, no unjustified surface). Prisma-alongside was rejected — it only
   won on speed (lowest priority in the rules ladder).
3. **Users = remap to pawebsite admins.** mktutmgen's `users` table (NextAuth /
   bcrypt) is **not** carried as a login system. Each mktutmgen user maps to an
   existing pawebsite admin (Supabase `auth.users`, UUID). Campaign/QA creator +
   reviewer + implementer FKs are rewritten to the mapped pawebsite user UUID.
   Access is gated by pawebsite's existing admin auth.
4. **Table naming = `utm_` prefix** in pawebsite's `public` schema
   (`utm_campaigns`, `utm_qa_reviews`, `utm_industries`, `utm_brands`,
   `utm_platforms`, `utm_countries`, `utm_companies`, `utm_ad_formats`,
   `utm_buy_types`, `utm_campaign_types`, `utm_segmentation_types`,
   `utm_ad_piece_types`). Integration into the shared schema, **not** a separate
   schema.
5. **Conventions = match pawebsite; flag divergences, don't refactor** (R10, R11).
   See below.

---

## Divergences from `_THE_RULES.MD` (air_lite ACTIVE PROJECT CONTEXT)

These are Jorge's newer standards that **pawebsite predates and does not follow.**
Per R10/R11 we deliberately match pawebsite for internal consistency and do **not**
refactor. Logged here so the debt is explicit and revisitable.

| Standard (air_lite) | pawebsite (followed here) | Why we diverge |
|---|---|---|
| **UUIDv7**, never v4 | **UUID v4** (`gen_random_uuid()`) — new `utm_` tables use v4 to match | R11: mixing v7 into a v4 codebase would be inconsistent; whole-app change is out of scope (R10). |
| anon / service_role keys **deprecated** | **anon + `service_role`** key names retained (admin client uses service role) | R11: pawebsite's entire data layer uses these; swapping keys is an app-wide change, out of scope. |
| Next 16: `middleware.ts` deprecated → DAL (`dal.ts`) + `verifySession()` | **`middleware.ts`** gating `/admin/:path*` (already uses correct `getUser()`, not `getSession()`) | R11: UTM pages live under `/admin`, already covered by existing middleware; introducing a parallel DAL pattern for one feature would fragment auth. |

**Consequence of the ID divergence (data migration):** mktutmgen PKs are **cuid**
(text). To fit pawebsite's UUID world and the user-remap, the migration converts
every cuid → a generated UUID (v4) and rewrites **all** FK references during load,
so no records are lost and the merged tables are UUID-native. New rows use
`gen_random_uuid()`.

---

## Migration — DONE (authored + verified 2026-07-01)

Two SQL files, to run in pawebsite's **SQL Editor** in order:
- **`supabase/migrations/00023_create_utm_schema.sql`** — 12 `utm_*` tables (UUID
  v4, TEXT+CHECK enums, snake_case, FKs to `auth.users`, indexes), RLS via
  `is_admin()`, `updated_at` triggers via `update_updated_at()`. Idempotent.
- **`supabase/migrations/00024_seed_utm_data.sql`** — all **414 rows** (13
  industries…, 134 campaigns, 134 qa_reviews), cuid→UUID remapped, 3 users
  remapped to pawebsite `auth.users`, `ON CONFLICT (id) DO NOTHING` (idempotent).
  Generated from source; do not hand-edit.

**Source data facts** (verified): strict 1:1 campaigns↔qa_reviews; 0 orphan FKs;
all 134 campaigns owned by condor; all QA rows `PENDING` with no reviewer/
implementer; `campaign_type_id` null throughout; no apostrophes in text.

**Local verification (ephemeral Postgres, stubbed auth.users/is_admin/update_updated_at):**
DDL ran clean · 414 rows loaded · counts match source exactly · 134/134 campaigns
attributed to condor · 0 orphan QA · CHECK constraints reject bad enum values ·
`updated_at` trigger bumps on update · idempotent re-run stable (still 134) ·
real records round-trip intact (naming + full UTM URLs preserved).

Remaining migration step: **Jorge pastes 00023 then 00024 into pawebsite SQL
Editor**; run the trailing count query to confirm. (Also expose nothing extra —
these live in `public`, already exposed.)

## Code port — DONE (code-complete + builds, 2026-07-02)

Ported onto pawebsite's stack, styled in pawebsite's idiom (navy/celeste/gray).
`tsc --noEmit` clean; `npm run build` succeeds (all routes compile).

- **lib** `src/lib/utm/`: `naming.ts` (verbatim), `types.ts`, `utils.ts`,
  `transform.ts` (snake↔camel), `server.ts` (untyped UTM Supabase client +
  `requireUtmUser` admin/editor gate), `users.ts` (auth.users resolver via
  service role for createdBy/reviewedBy).
- **API** `src/app/api/utm/{campaigns,qa,master-data}/route.ts`: Prisma→Supabase,
  return the same camelCase JSON the UI consumes (embeds aliased + `keysToCamel`).
  master-data writes gated admin+editor.
- **UI** `src/app/admin/utm/`: `layout.tsx` (Toaster + `UtmNav` tabs), `page.tsx`
  (dashboard, server/Supabase), `generador/`, `historial/`, `qa/`,
  `datos-maestros/`. Restyled to pawebsite (no orion/glass-card).
- **Sidebar**: "UTM" entry (`Link2` icon) → `/admin/utm`.
- **Deps added**: `react-hot-toast` only (used by all screens). `xlsx` was
  evaluated and removed (history exports via manual CSV). No Radix/zustand/date-fns.

**Remaining:** live smoke-test as a logged-in admin (load historial → 134 rows;
create a campaign in generador; save a QA review; edit a master-data row), then
decommission mktutmgen.

## (original) Code port plan

Port mktutmgen's app surface onto pawebsite's stack under `/admin/utm/*`.

**Delete / replace (stack swap):**
- `lib/prisma.ts`, `lib/auth.ts` (NextAuth+bcrypt), `middleware.ts`,
  `(auth)/login/page.tsx`, `providers.tsx` → **not ported**. Auth is pawebsite's
  existing admin (middleware already gates `/admin/:path*`); server code uses
  `supabase.auth.getUser()` + role check. `requireAuth`/`requireAdmin` call sites
  replaced accordingly.

**Port as-is (pure, no DB):**
- `lib/naming.ts` (163 lines) — naming/UTM formula engine. Copy verbatim.

**Rewrite Prisma → Supabase client (keep JSON response shape to minimize UI churn):**
- `api/campaigns/route.ts` — `prisma.campaign.findMany({include:…})` →
  `.from('utm_campaigns').select('*, industry:utm_industries(*), country:utm_countries(*), company:utm_companies(*), brand:utm_brands(*), platform:utm_platforms(*), format:utm_ad_formats(*), buy_type:utm_buy_types(*), campaign_type:utm_campaign_types(*), qa:utm_qa_reviews(*)')`.
  POST computes naming then inserts; `created_by = auth.uid()`.
- `api/master-data/route.ts` — `MODEL_MAP` (prisma models) → table-name map
  (`utm_industries`, …). GET all in parallel; POST/PUT/DELETE gated to admins.
- `api/qa/route.ts` — same treatment against `utm_qa_reviews`.
- **snake_case↔camelCase:** DB is snake_case; API maps rows to the camelCase shape
  the UI already consumes, so the ~2,000 lines of UI need minimal field edits.

**Move UI into `/admin/utm/*` (new `AdminSidebar` "UTM" entry + sub-routes):**
- generator → `/admin/utm/generador` (667 ln)
- history → `/admin/utm/historial` (524 ln)
- qa → `/admin/utm/qa` (414 ln)
- admin (master-data) → `/admin/utm/datos-maestros` (434 ln)
- dashboard (177 ln) → optional `/admin/utm` landing.

**Styling decision (Jorge, 2026-07-02): ADOPT PAWEBSITE STYLE.** Do NOT bring over
mktutmgen's `orion` palette / `glass-card` / `brand-gradient` / `bg-grid` design
system. Restyle every ported UTM screen in pawebsite's admin idiom (navy / celeste
/ gray tokens, existing card/table/button patterns, `is_admin()` sidebar look).
This means rewriting each page's className usage, not copying it.

**Dependencies to add to pawebsite:** minimize. `xlsx` (history export) if kept;
`clsx` + `tailwind-merge` only if a `cn()` helper is needed (check for an existing
one first). Avoid pulling mktutmgen's Radix/zustand/date-fns stack unless a screen
genuinely needs it — prefer pawebsite's existing primitives. `lucide-react` +
`zod` already present.

**Open decision (role granularity):** mktutmgen restricted master-data editing to
ADMIN via `requireAdmin`. pawebsite's RLS `is_admin()` grants admin **and** editor
full access, so that distinction is lost unless we add an explicit role check in
the master-data mutations. Flag — decide during port.

## Decommission (after port + sign-off)
- **Data diff (2026-07-02): source == dest.** All 12 table counts match; content
  md5 fingerprints identical (campaigns/brands/platforms); source frozen since
  2026-03-09 (no drift). Nothing lost by deleting the source.
- **"Moved" page shipped in mktutmgen (2026-07-02):** `src/app/page.tsx` is a
  typewriter "Lo que estás buscando / ya no está aquí. / Ahora vive en
  **pawebsite**" + "¡Vámonos!" button → `https://puertaabierta.com.gt/admin/utm`.
  `src/middleware.ts` rewrites EVERY route to it (verified: /, /generator, /admin
  all render the notice). Root layout simplified. Builds clean.
- Remaining: remove mktutmgen Vercel project (or redeploy it once to serve the
  moved page as a bridge), and delete Supabase project `exsnvlzhpgrkiqvoonlh`
  (**irreversible**) — after the pawebsite UTM smoke-test passes.

---

## User remap (resolved 2026-07-01)

All 3 mktutmgen users map to pawebsite `auth.users` (UUID). mktutmgen `campaigns`
are owned entirely by **condor** (134); `qa_reviews` attribution is empty so far.
Every `createdById` / `reviewedById` / `implementedById` is rewritten to the
mapped UUID during migration.

| mktutmgen (cuid) | email (source) | → pawebsite UUID | pawebsite email | role |
|---|---|---|---|---|
| `cmmjf6nyi00003qrko82wn5i2` | condor@grupoorion.com | `57f2cf87-b890-4fd0-8d36-3d7f6a26e2e1` | condor@grupoorion.com **(new user, created 2026-07-01)** | editor |
| `cmmjf6ony00013qrk9i5olbhq` | sebas@grupoorion.com | `f0c45f45-5867-40ee-a289-80d8fe61dd06` | sebastian.carrillo@puertaabierta.com.gt | editor |
| `cmmjf6pdj00023qrkm5v9xgs2` | delfa@grupoorion.com | `a1b3ca73-6949-4300-8cb9-bf28f263901c` | delfa.priego@puertaabierta.com.gt | editor |

- **condor** was created fresh in pawebsite auth with its exact name/email and
  `user_metadata: {role: editor, name: condor}`. Its password was set at creation
  and delivered to Jorge out-of-band — **never stored in this repo**.
- pawebsite's other users carry no `name` in metadata; `name: "condor"` was added
  additively so the ported UTM UI can show it (falling back to email elsewhere).

## Open items

- [x] User remap mapping — resolved; condor user created.
- [x] Route/nav label — `/admin/utm`, sidebar "UTM", sub-routes
      generador/historial/qa/datos-maestros.
- [x] Migration SQL authored (00023 + 00024) and verified locally.
- [x] Source record counts captured (414 total) and matched in verification.
- [x] **Migration executed in pawebsite prod (2026-07-02)** — counts verified
      exact (134 campaigns, 134 qa_reviews, master data 13/8/1/22/7/47/19/4/8/17).
- [x] Master-data role granularity = **admin + editor** (matches `is_admin()`;
      no extra role check needed).
- [ ] Execute the code port (in progress; see plan above).
- [ ] Decommission mktutmgen (Vercel + Supabase project) after sign-off.

---

## Security note

`mktutmgen/.env` stores its Supabase **DB password in plaintext**, and it appeared
in inspection output this session. The source project is slated for deletion, so
rotation is likely moot — but do not reuse that password elsewhere.

## Working agreement

Jorge drives git (no add/commit/push by the assistant). DB DDL/data-load is run by
Jorge (SQL Editor) or via an explicitly-authorized connection. See
`orion/SUPABASE_CONSOLIDATION.md` for the prior landbank→orion merge and the
schema-per-app playbook (this one is a deeper *integration*, not schema-per-app).
