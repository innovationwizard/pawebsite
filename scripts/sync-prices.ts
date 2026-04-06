/**
 * Sync prices & unit types from Orion Intelligence API (SSOT) into PA website Supabase.
 *
 * Usage:  npx tsx scripts/sync-prices.ts [--dry-run]
 *
 * What it does:
 *  1. Fetches AVAILABLE units from Orion API
 *  2. Groups by project slug + unit_type
 *  3. Replaces `unit_types` for each matching project (Orion is SSOT)
 *  4. Updates `projects.starting_price`, `starting_price_display`, `bedroom_range`
 */

import { createClient } from "@supabase/supabase-js";

const ORION_API = "https://orion-intelligence.vercel.app/api/public/units?status=AVAILABLE";

const PA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const PA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const dryRun = process.argv.includes("--dry-run");

interface OrionUnit {
  unit_number: string;
  unit_type: string;
  bedrooms: number;
  price_list: number;
  status: string;
  area_total: number;
  project_slug: string;
  project_name: string;
  tower_name: string;
}

interface OrionResponse {
  units: OrionUnit[];
  synced_at: string;
  count: number;
}

interface AggregatedType {
  type_name: string;
  bedrooms: number;
  min_price: number;
  min_area: number;
  max_area: number;
  count: number;
}

function formatPrice(price: number, currency: string): string {
  const symbol = currency === "USD" ? "$" : "Q";
  return `${symbol}${price.toLocaleString("en-US")}`;
}

function bedroomRange(bedrooms: number[]): string {
  const unique = [...new Set(bedrooms)].filter((b) => b > 0).sort((a, b) => a - b);
  if (unique.length === 0) return "Consultar";
  if (unique.length === 1) return `${unique[0]}`;
  return `${unique[0]}–${unique[unique.length - 1]}`;
}

async function main() {
  console.log(dryRun ? "=== DRY RUN ===" : "=== SYNCING PRICES ===");

  // 1. Fetch from Orion
  const res = await fetch(ORION_API);
  if (!res.ok) throw new Error(`Orion API error: ${res.status}`);
  const orion: OrionResponse = await res.json();
  console.log(`Fetched ${orion.count} available units (synced: ${orion.synced_at})\n`);

  // 2. Group by project slug → unit_type aggregations
  const projectTypes = new Map<string, Map<string, AggregatedType>>();
  const projectMinPrice = new Map<string, number>();
  const projectBedrooms = new Map<string, number[]>();

  for (const unit of orion.units) {
    // Per-type aggregation
    if (!projectTypes.has(unit.project_slug)) {
      projectTypes.set(unit.project_slug, new Map());
    }
    const types = projectTypes.get(unit.project_slug)!;
    const existing = types.get(unit.unit_type);
    if (!existing) {
      types.set(unit.unit_type, {
        type_name: unit.unit_type,
        bedrooms: unit.bedrooms,
        min_price: unit.price_list,
        min_area: unit.area_total,
        max_area: unit.area_total,
        count: 1,
      });
    } else {
      existing.min_price = Math.min(existing.min_price, unit.price_list);
      existing.min_area = Math.min(existing.min_area, unit.area_total);
      existing.max_area = Math.max(existing.max_area, unit.area_total);
      existing.count++;
    }

    // Per-project min price
    const projMin = projectMinPrice.get(unit.project_slug);
    if (!projMin || unit.price_list < projMin) {
      projectMinPrice.set(unit.project_slug, unit.price_list);
    }

    // Per-project bedrooms
    if (!projectBedrooms.has(unit.project_slug)) {
      projectBedrooms.set(unit.project_slug, []);
    }
    projectBedrooms.get(unit.project_slug)!.push(unit.bedrooms);
  }

  // 3. Connect to PA Supabase
  const supabase = createClient(PA_URL, PA_KEY);

  // 4. Fetch PA projects
  const { data: projects, error: projErr } = await supabase
    .from("projects")
    .select("id, slug, starting_price, currency")
    .in("slug", [...projectMinPrice.keys()]);

  if (projErr) throw new Error(`Failed to fetch projects: ${projErr.message}`);

  // 5. For each matching project: replace unit types + update project
  for (const project of projects!) {
    const currency = project.currency ?? "GTQ";
    const types = projectTypes.get(project.slug);
    const minPrice = projectMinPrice.get(project.slug)!;
    const bedrooms = projectBedrooms.get(project.slug) ?? [];

    if (!types) continue;

    console.log(`${project.slug}:`);

    // Delete existing unit types
    if (!dryRun) {
      const { error } = await supabase
        .from("unit_types")
        .delete()
        .eq("project_id", project.id);
      if (error) {
        console.error(`  ERROR deleting unit types: ${error.message}`);
        continue;
      }
    }
    console.log(`  Deleted existing unit types`);

    // Insert new unit types from Orion
    const sortedTypes = [...types.values()].sort((a, b) => a.min_price - b.min_price);
    const inserts = sortedTypes.map((t, i) => ({
      project_id: project.id,
      type_name: t.type_name,
      bedrooms: t.bedrooms,
      total_area_m2: t.min_area === t.max_area ? t.min_area : t.min_area,
      list_price: t.min_price,
      price_display: formatPrice(t.min_price, currency),
      price_currency: currency,
      sort_order: i + 1,
    }));

    if (!dryRun) {
      const { error } = await supabase.from("unit_types").insert(inserts);
      if (error) {
        console.error(`  ERROR inserting unit types: ${error.message}`);
        continue;
      }
    }

    for (const t of sortedTypes) {
      console.log(`  + ${t.type_name}: ${t.bedrooms}bed, ${formatPrice(t.min_price, currency)}, ${t.min_area}m² (${t.count} avail)`);
    }

    // Update project starting price + bedroom range
    const newDisplay = formatPrice(minPrice, currency);
    const newBedRange = bedroomRange(bedrooms);

    if (!dryRun) {
      const { error } = await supabase
        .from("projects")
        .update({
          starting_price: minPrice,
          starting_price_display: newDisplay,
          bedroom_range: newBedRange,
        })
        .eq("id", project.id);
      if (error) console.error(`  ERROR updating project: ${error.message}`);
    }

    console.log(`  Starting: ${newDisplay} | Bedrooms: ${newBedRange}\n`);
  }

  console.log(dryRun ? "Dry run complete — no changes made." : "Sync complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
