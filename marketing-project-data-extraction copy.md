# Puerta Abierta Inmobiliaria — Project Data Extraction for Marketing

> **Extracted from:** Orion codebase (migrations, seed data, SSOT documents, cotizador configs)
> **Date:** 2026-03-26
> **Purpose:** Raw project data for marketing website development

---

## Company Overview

**Puerta Abierta Inmobiliaria** manages a portfolio of 5 real estate projects across Guatemala, spanning vertical apartments, mixed-use buildings, and horizontal housing. Total inventory: **901 units** across 10 towers, 86 floors, with a sales team of 33+ salespeople.

---

## Project 1: Bosque Las Tapias (BLT)

### Identity
- **Full Name:** Bosque Las Tapias
- **Abbreviation:** BLT
- **Slug:** `bosque-las-tapias`
- **Type:** Vertical — residential apartments
- **Currency:** GTQ (Guatemalan Quetzal)

### Physical Structure
- **Towers:** 2 (Torre B, Torre C)
- **Floors per tower:** 13
- **Units per floor:** 9
- **Total units:** 234 (117 per tower)

### Unit Types & Specifications

| Type | Bedrooms | Interior (m²) | Terrace (m²) | Total Area (m²) | Parking | List Price (Q) |
|------|----------|---------------|--------------|-----------------|---------|----------------|
| A PLUS | 2 | 44.21 | 14.19 | 58.40 | 1 car | Q655,200 |
| B PLUS | 3 | 60.21 | 18.79 | 79.00 | 1 car | Q814,900 |
| C PLUS | 3 | 60.64 | 22.54–22.59 | 83.18–83.23 | 1 car | Q853,400–Q853,600 |

> **Note:** Types A, B, C (non-PLUS variants) also exist in the seed data with identical or similar specs. Price adjustments are rule-based with +Q10,000 increments for 3-bedroom units.

### Financial Terms (Cotizador)

**Torre C:**
| Parameter | Value |
|-----------|-------|
| Enganche (down payment) | 7% |
| Reserva (deposit) | Q3,000 |
| Cuotas de enganche | 24 months |
| Bank rate | 5.50% FHA |
| Plazos (terms) | 30, 25, 20, 15, 10 years |
| Income requirement | 2.0× cuota bancaria |
| Escrituración split | 70% inmueble / 30% acciones |
| IUSI (property tax) | Monthly, included in cuota |
| Insurance | Not included |
| Validity | 7 days |

**Torre B:** Identical to Torre C except **28 cuotas de enganche** (vs 24).

### Competitive Analysis
- File on record: `ANÁLISIS COMPETENCIA DIRECTA BLT MAYO 2025.xlsx`

### Status & Positioning
- Simplest pricing structure of all projects
- Rule-based price increases (transparent, formula-driven)
- Two-tower option gives buyers flexibility in delivery timing

---

## Project 2: Casa Elisa (CE)

### Identity
- **Full Name:** Casa Elisa
- **Abbreviation:** CE
- **Slug:** `casa-elisa`
- **Type:** Vertical — mixed-use (residential + commercial)
- **Currency:** GTQ

### Physical Structure
- **Building:** Single building (1 tower, "Principal")
- **Floors:** 10 levels (Nivel 1–10)
- **Units per floor:** 5–8 apartments + 3 commercial locals on Level 1
- **Total units:** 75 (72 apartments + 3 commercial locals)

### Unit Types

| Category | Types | Bedrooms | Notes |
|----------|-------|----------|-------|
| Residential | A1, A2, A3, A5, A6, A7, B1, B2, B3, C1, C2 | 1, 2, or 3 | Various layouts with balconies & terraces |
| Commercial | LOCAL | 0 | 3 ground-floor commercial spaces |

### Area Features
- **Parking:** 12.5 m² per space (simple configuration)
- **Bodegas (storage):** Variable sizes — 1.78 m² to 4.9 m² (assigned per unit)
- **Special features:** Balconies, terraces (unit-dependent)

### Financial Terms (Cotizador — 3 Variants)

**CE Automático (Residential Default):**
| Parameter | Value |
|-----------|-------|
| Enganche | 5% |
| Reserva | Q5,000 |
| Cuotas de enganche | 1 month |
| Bank rate | 7.26% FHA |
| Plazos | 30, 25, 17, 15, 10 years |
| Income requirement | 2.0× cuota mensual |
| Escrituración | 70% inmueble / 30% acciones |

**CE 208 (Special Unit Override):**
| Parameter | Value |
|-----------|-------|
| Enganche | 10% |
| Cuotas de enganche | 2 months |
| Bank rate | 7.50% |
| Income requirement | 2.5× cuota mensual |
| Insurance | Included in cuota |

**CE Locales (Commercial Units):**
| Parameter | Value |
|-----------|-------|
| Enganche | 20% |
| Cuotas de enganche | 1 month |
| Bank rate | 7.50% |
| Plazos | 1, 5, 10, 20 years |
| Escrituración | **100% inmueble** (no acciones split) |
| Timbres | 0% |

### Status & Positioning
- **Nearly sold out** (74 of 75 units with PCV or reserved)
- Mixed residential/commercial creates dual investment opportunity
- Urban location with varied unit configurations
- 11 distinct residential unit types serve different buyer profiles

---

## Project 3: Boulevard 5 (B5)

### Identity
- **Full Name:** Boulevard 5
- **Abbreviation:** B5
- **Slug:** `boulevard-5`
- **Type:** Vertical — smart apartments
- **Currency:** GTQ
- **Location zone:** Competitive analysis references Zone 10, Guatemala City

### Physical Structure
- **Tower:** Single tower ("Principal")
- **Floors:** 19
- **Units per floor:** 5–20 (tapers on upper floors)
- **Total units:** 298

### Unit Types (67 Unique Configurations)

| Type Family | Suffix Range | Bedrooms | Area Range (m²) | Count |
|-------------|-------------|----------|-----------------|-------|
| A | A1–A12, A2.1–A7.1 | 1 | 31–34 | 80 |
| B | B1–B8, B1.1–B7.1 | 2 | 47–52 | ~60 |
| C | C1–C11, C2.1–C3.1 | 2 | 56–58 | ~50 |
| D | D1–D13 | 2 | 66–70 | ~40 |
| E | E1–E10, E1.1–E2.1 | 3 | 69–74 | 71 |

> `.1` suffix = ground-floor variant of the parent type.

**Bedroom Distribution:** 1-BR (80 units) · 2-BR (147 units) · 3-BR (71 units)

### Area Features
- **Parking (car):** 12.5 m² per space
- **Parking (tandem):** 25.0 m² (double-depth spaces)
- **Bodegas:** 5.3 m² (standard fixed size)
- **Parking system:** Multi-level sótano (basement) with numbered spots (e.g., S-5_328)
- **Smart home:** IkiSmart integration tracked in pricing (select units)
- **Mantenimiento (HOA):** Q16.00/m² annually

### Price Range
- **1-BR apartments:** From ~Q700,000
- **2-BR apartments:** Q941,800–Q1,074,100+
- **Per-type increment rates:** A=5.5%, B=5%, C=5%, D=2.5%, E=2.5%

### Financial Terms (Cotizador — 2 Variants)

**B5 Automático (Default):**
| Parameter | Value |
|-----------|-------|
| Enganche | 7% |
| Reserva | Q10,000 |
| Cuotas de enganche | 8 months |
| Bank rate | 7.26% FHA |
| Plazos | 30, 25, 20, 15, 10 years |
| Income requirement | 2.0× cuota bancaria |
| Escrituración | 70% inmueble / 30% acciones |
| Mantenimiento | Q16.00/m² |

**B5 Aptos Terraza (Terrace Units):**
- Same as Automático except: **7 cuotas de enganche** (vs 8)

### Competitive Analysis
- File on record: `ANÁLISIS COMPETENCIA ZONA 10.xlsx`

### Special Features
- **Cesión de Derechos (Rights Transfer):** 200+ transfer records — indicates strong secondary/investment market
- **Widest unit variety** of any project (67 distinct types)
- **Smart-home ready** (IkiSmart integration)

### Status & Positioning
- **Nearly sold out** — only ~7 units available out of 298
- 273 units with signed PCV (Promesa de Compraventa)
- Premium smart apartment positioning in Zone 10
- Strong investment appeal (active rights-transfer market)

---

## Project 4: Benestare (BEN)

### Identity
- **Full Name:** Benestare
- **Abbreviation:** BEN
- **Slug:** `benestare`
- **Type:** Vertical — multi-tower residential apartments
- **Currency:** GTQ

### Physical Structure
- **Towers:** 5 (Torre A, Torre B, Torre C, Torre D, Torre E)
- **Floors per tower:** 6
- **Total units:** 282

| Tower | Units/Floor | Total Units | Status |
|-------|-----------|-------------|--------|
| Torre A | 8–10 | 54 | 100% sold (43 tower transfers in process) |
| Torre B | 13 | 78 | Active sales |
| Torre C | 11 | 66 | Active sales |
| Torre D | 7 | 42 | Active sales |
| Torre E | 7 | 42 | 100% frozen (strategic commercial hold) |

### Unit Types

| Type | Bedrooms | Area (m²) | Notes |
|------|----------|----------|-------|
| A | 1 | ~34 | Only 1-BR option in portfolio |
| B | 3 | ~47 | Standard 3-BR |
| C | 3 | ~47 | Premium 3-BR variant |

> **Unique feature:** Benestare is the only project offering 1-bedroom units. It has NO 2-bedroom option.

### Parking & Amenities
- **Parking:** Individually assigned spots across basement levels N1–N4
- **Parking areas:** Not specified in SSOT (project-specific)
- **Bodegas:** Not specified in SSOT

### Delivery Timeline (Staggered by Tower)
- **Torre A:** Delivers first (construction ~10 months)
- **Torre B:** 15 months construction cycle
- **Torre E:** Delivers last (estimated July 2028)

> Construction start references: Perforación del pozo Nov 2025, infrastructure Feb 2026.

### Financial Terms (Cotizador — All 4 Active Towers Identical)

| Parameter | Value |
|-----------|-------|
| Enganche | **5%** (lowest GTQ enganche) |
| Reserva | **Q1,500** (lowest deposit) |
| Cuotas de enganche | 7 months |
| Escrituración | 70% inmueble / 30% acciones |
| Income requirement | 2.0× cuota bancaria |
| IUSI | Monthly, included in cuota |

**Bank Rate Options (4 scenarios — most flexible):**
| Label | Rate |
|-------|------|
| Mi primera Casa Tipo A | 5.00% |
| FHA Tipo B y C | 5.50% |
| Sin carencia FHA | 7.26% |
| Crédito directo | 8.50% |

**Plazos:** 40, 30, 25, 20 years — includes **40-year option** (unique to Benestare, longest in portfolio)

**Bedroom-specific rate override (3-BR):** Bank rates shift to 5.50%, 7.26%, 7.50%, 8.50%

### Competitive Analysis
- Zone-specific competitive analysis files on record (potential Zone 18 positioning)

### Pricing Strategy
- 6 rounds of price increases since launch
- Monthly increments: Q10,000–Q15,000 per round
- 1-BR units: Q8,700 discount
- Promotional column for electrodomésticos (appliance packages)
- Separate strategy for Towers D and E

### Status & Positioning
- Under construction with staggered tower delivery
- 5 towers give maximum buyer flexibility (unit type, delivery date, position)
- Lowest entry point: 5% enganche + Q1,500 reserva + 40-year financing
- Tower A fully sold demonstrates market validation
- Tower E strategic freeze creates controlled scarcity
- Tower transfer flexibility (ability to move between towers)

---

## Project 5: Santa Elena (SE)

### Identity
- **Full Name:** Santa Elena
- **Abbreviation:** SE
- **Slug:** `santa-elena`
- **Type:** Horizontal — single-family homes (casas)
- **Currency:** USD (US Dollars) — unique in portfolio
- **Location reference:** "Santa Elena — Antigua Panorama" (Antigua Guatemala area)

### Physical Structure
- **Houses:** 11 (Casa 1 through Casa 11)
- **Layout:** Ground level only (Planta Baja)
- **No towers or floors** — horizontal development with individual lots

### House Models & Specifications

| Model | Construction Area (m²) | Lot Range (m²) | Price Range (USD) | Units |
|-------|----------------------|----------------|-------------------|-------|
| A | 491.91 | 386.00–400.44 | $1,065,000–$1,300,000 | 5 (Casas 1, 2, 5, 10, 11) |
| B | 581.00 | 386.00–398.38 | $1,639,500 (fixed) | 6 (Casas 3, 4, 6, 7, 8, 9) |

### Unit-Level Detail

| Casa | Model | Lot Area (m²) | Price (USD) | Status |
|------|-------|--------------|-------------|--------|
| Casa 1 | A | 400.44 | $1,065,000 | RESERVED |
| Casa 2 | A | 400.25 | $1,090,000 | RESERVED |
| Casa 3 | B | 386.00 | $1,639,500 | AVAILABLE |
| Casa 4 | B | 398.38 | $1,639,500 | AVAILABLE |
| Casa 5 | A | 399.20 | $1,300,000 | AVAILABLE |
| Casa 6 | B | 386.00 | $1,639,500 | FROZEN |
| Casa 7 | B | 386.00 | $1,639,500 | RESERVED |
| Casa 8 | B | 386.00 | $1,639,500 | AVAILABLE |
| Casa 9 | B | 386.00 | $1,639,500 | AVAILABLE |
| Casa 10 | A | 400.36 | $1,300,000 | AVAILABLE |
| Casa 11 | A | 400.00 | $1,095,000 | RESERVED |

### Delivery Timeline (Construction Schedule)
- **Total project duration:** 24 months (Oct 2025 → Aug 2027)
- **Urbanización (infrastructure):** 9 months (Oct 2025 → Jun 2026)
- **Individual house construction:** 15 months each

| Phase | Start | End |
|-------|-------|-----|
| Urbanización | Oct 1, 2025 | Jun 9, 2026 |
| Perforación del pozo | Oct 29, 2025 | Jan 20, 2026 |
| Casas 1, 2, 5, 11 (pre-sold) | Dec 24, 2025 | Feb 16, 2027 |
| Casas 3, 6, 7, 10 | Mar 18, 2026 | May 11, 2027 |
| Casas 4, 8, 9 | Jun 10, 2026 | Aug 3, 2027 |

### Financial Terms (Cotizador)

| Parameter | Value |
|-----------|-------|
| Enganche | **30%** (highest in portfolio) |
| Reserva | **$10,000 USD** |
| Cuotas de enganche | **15 months** (longest payment schedule) |
| Bank rate | 8.50% (Crédito directo) |
| Plazos | 25, 20, 15, 10, 5 years |
| Income requirement | 2.0× cuota mensual |
| Escrituración | 70% inmueble / 30% acciones |
| IUSI (property tax) | **Quarterly** (not monthly — rural convention) |
| Insurance | **Included in cuota** (0.35% annually on price) |
| Validity | 7 days |

### Cotizador Disclaimers (SE-specific)
1. "Precio y disponibilidad sujetos a cambio sin previo aviso"
2. "Reserva no es reembolsable en caso de desistimiento"
3. "Cuota mensual es de referencia y podrá variar según institución financiera"
4. "Si es necesario financiamiento bancario el enganche mínimo a pagar es un 30%"

### Competitive Analysis
- File on record: `ANÁLISIS COMPETENCIA ANTIGUA GUATEMALA.xlsx`

### Status & Positioning
- **First and only horizontal project** in the Puerta Abierta portfolio
- **Only USD-denominated project** — appeals to international buyers / dual-currency portfolios
- Premium price point ($1M–$1.6M USD)
- Large lot sizes (386–400 m²) + substantial construction areas (492–581 m²)
- Antigua Guatemala location — historic, premium market
- 4 of 11 houses reserved (strong early traction)
- Dedicated salesperson: Luccia Calvo

---

## Cross-Project Comparison

### Financial Terms Matrix

| Parameter | BLT | CE (Default) | CE (Locales) | B5 | BEN | SE |
|-----------|-----|-------------|-------------|-----|-----|-----|
| **Currency** | GTQ | GTQ | GTQ | GTQ | GTQ | **USD** |
| **Enganche %** | 7% | 5% | 20% | 7% | **5%** | **30%** |
| **Reserva** | Q3,000 | Q5,000 | Q5,000 | Q10,000 | **Q1,500** | **$10,000** |
| **Cuotas** | 24/28 mo | 1 mo | 1 mo | 8 mo | 7 mo | **15 mo** |
| **Max Plazo** | 30 yr | 30 yr | 20 yr | 30 yr | **40 yr** | 25 yr |
| **Bank Rates** | 5.50% | 7.26% | 7.50% | 7.26% | 5.00–8.50% | 8.50% |
| **Income Mult.** | 2.0× | 2.0× | 2.0× | 2.0× | 2.0× | 2.0× |
| **Escrituración** | 70/30 | 70/30 | **100/0** | 70/30 | 70/30 | 70/30 |
| **IUSI** | Monthly | Monthly | Monthly | Monthly | Monthly | **Quarterly** |
| **Insurance** | No | No | No | No | No | **Yes** |
| **HOA/Mant.** | Pending | — | — | Q16/m² | — | — |

### Inventory Overview

| Project | Type | Towers | Floors | Total Units | Unit Types | Bedrooms |
|---------|------|--------|--------|-------------|-----------|----------|
| BLT | Apartments | 2 | 13/tower | 234 | 6 (A/B/C ± PLUS) | 2–3 |
| CE | Mixed-use | 1 | 10 | 75 | 11 + LOCAL | 0–3 |
| B5 | Smart Apts | 1 | 19 | 298 | **67** | 1–3 |
| BEN | Multi-tower | 5 | 6/tower | 282 | 3 (A/B/C) | 1, 3 |
| SE | Houses | — | — | 11 | 2 (A/B) | TBD |
| **TOTAL** | | **10** | **86** | **901** | | |

### Price Range Summary

| Project | Currency | Entry Price | Top Price | Entry/m² |
|---------|----------|------------|-----------|----------|
| BLT | GTQ | Q655,200 | Q853,600 | ~Q11,200/m² |
| CE | GTQ | Variable | Variable | Variable |
| B5 | GTQ | ~Q700,000 | Q1,074,100+ | ~Q14,000–Q22,000/m² |
| BEN | GTQ | Variable | Variable | Variable |
| SE | USD | $1,065,000 | $1,639,500 | ~$2,165–$2,822/m² (construction) |

> **Note on CE and BEN pricing:** Individual unit prices exist in the production database but are not fully enumerated in the codebase seed files. They are subject to multiple rounds of manual adjustments.

---

## Shared Cotizador Disclaimers (Standard — All GTQ Projects)

1. "Precios sujetos a cambio sin previo aviso"
2. "Cotización válida 7 días"
3. "La reserva no es reembolsable"
4. "Metros cuadrados son aproximados"
5. "Imágenes son de referencia"

---

## Lead Sources & Marketing Channels

Active lead sources tracked in the system (from `lead_sources` DB table):

| Source | Type |
|--------|------|
| Facebook | Paid social |
| Meta | Paid social |
| TikTok | Social |
| LinkedIn | Professional social |
| Página Web | Organic digital |
| Inbox | Email / contact form |
| Mailing | Direct email |
| Wati | WhatsApp automation |
| Referido | Word of mouth |
| Visita Inédita | Walk-in / direct visit |
| Señalética | Signage |
| Valla | Billboard (added for SE) |
| PBX | Phone |
| Prospección | Outbound sales |
| Activación | Event-based campaign |
| Evento | Events / expos |
| F&F | Friends & Family program |

---

## Buyer Persona Demographics (Tracked Fields)

The system captures buyer profiles with these demographic categories:

- **Gender:** M, F, Otro
- **Purchase type:** Uso propio (personal use), Inversión (investment)
- **Marital status:** Soltero/a, Casado/a, Unido/a, Divorciado/a, Viudo/a
- **Education:** Diversificado, Universitario, Licenciatura, Maestría, Doctorado, Otro
- **Occupation:** Empleado formal, Empleado informal, Independiente, Empresario
- **Departments (origin):** All 22 Guatemalan departments tracked
- **Discovery channel:** Facebook, Meta, Referido, Visita Inédita, Señalética, Web, Pipedrive, Expocasa, Mailing, Prospección, Evento, Otro

---

## Competitive Analysis Coverage

Competitive analysis files exist for these markets:

| File | Likely Project Mapping |
|------|----------------------|
| ANÁLISIS COMPETENCIA ZONA 10.xlsx | Boulevard 5 |
| ANÁLISIS COMPETENCIA ZONA 11.xlsx | — |
| ANÁLISIS COMPETENCIA ZONA 5.xlsx | — |
| Condado La Española - zona 6.pptx | — |
| ANÁLISIS COMPETENCIA DIRECTA BLT MAYO 2025.xlsx | Bosque Las Tapias (direct) |
| ANÁLISIS COMPETENCIA ANTIGUA GUATEMALA.xlsx | Santa Elena |
| ANÁLISIS COMPETENCIA COBÁN.xlsx | — |
| ANÁLISIS COMPETENCIA CARRETERA A EL SALVADOR.xlsx | — |

> **Note:** These are binary Excel/PowerPoint files. Content extraction requires opening them directly — they are not parsed in the codebase.

---

## Payment Methods Accepted

From the reservation system receipt types:

| Method | Label (Spanish) |
|--------|----------------|
| Bank transfer | Transferencia bancaria |
| Deposit slip | Boleta de depósito |
| NeoLink / Payment gateway | NeoLink / Pasarela de pago |
| Mobile banking screenshot | Captura de banca móvil |
| Check | Cheque |
| Other | Otro |

### Partner Banks (Guatemala)
Banrural, Industrial, G&T Continental, BAM, Bantrab, Inmobiliario, CHN, Agromercantil, BAC, Promerica, Vivibanco, Ficohsa

---

## Tax & Legal Structure (All Projects)

| Component | Rate | Notes |
|-----------|------|-------|
| IVA (VAT) | 12% | Applied to inmueble portion |
| Timbres fiscales | 3% | Applied to acciones portion (except CE Locales = 0%) |
| IUSI (property tax) | 0.9% annually | Monthly for apartments, quarterly for SE casas |
| Insurance | 0.35% annually | Only SE includes in cuota by default |
| Escrituración default | 70% inmueble / 30% acciones | Pre-tax extraction method |

---

## Information Gaps for Marketing

The following data points are **NOT available** in the codebase and would need to be sourced separately:

1. **Project addresses / exact locations** — Zones are inferred from competitive analysis files but not stored as structured data
2. **Amenity lists** (pools, gyms, common areas, rooftop, etc.) — Not tracked in the system
3. **Architectural renderings / floor plans** — Not stored in the codebase (would be in marketing assets)
4. **Project descriptions / marketing copy** — No promotional text exists; all data is operational
5. **Construction progress photos** — Not in codebase
6. **Benestare individual unit prices** — In production DB, not in seed files
7. **Casa Elisa individual unit prices** — In production DB, not fully enumerated in seed
8. **Bedroom counts for Santa Elena houses** — Set to 0 in DB (not available in source Excel)
9. **Amenity-specific details for B5 (IkiSmart features)** — Referenced but not detailed
10. **Mantenimiento rates for BLT, CE, BEN** — Labeled "Pendiente" or not specified
11. **Delivery dates for individual BLT and CE towers** — Not stored in DB
12. **Developer/architect/contractor information** — Not in codebase
13. **Neighborhood/zone descriptions** — Not in codebase
14. **Competitive analysis content** — Locked in binary Excel/PPT files
