import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const ORION_API =
  "https://orion-intelligence.vercel.app/api/public/units?status=AVAILABLE";

interface OrionUnit {
  unit_type: string;
  bedrooms: number;
  price_list: number;
  area_total: number;
  project_slug: string;
}

interface AggType {
  type_name: string;
  bedrooms: number;
  min_price: number;
  min_area: number;
  count: number;
}

function formatPrice(price: number, currency: string): string {
  const symbol = currency === "USD" ? "$" : "Q";
  return `${symbol}${price.toLocaleString("en-US")}`;
}

function bedroomRange(bedrooms: number[]): string {
  const unique = [...new Set(bedrooms)]
    .filter((b) => b > 0)
    .sort((a, b) => a - b);
  if (unique.length === 0) return "Consultar";
  if (unique.length === 1) return `${unique[0]}`;
  return `${unique[0]}–${unique[unique.length - 1]}`;
}

export async function POST() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. Fetch from Orion
  const res = await fetch(ORION_API);
  if (!res.ok) {
    return NextResponse.json(
      { error: `Orion API error: ${res.status}` },
      { status: 502 }
    );
  }
  const orion = await res.json();
  const units: OrionUnit[] = orion.units;

  // 2. Aggregate by project + type
  const projectTypes = new Map<string, Map<string, AggType>>();
  const projectMinPrice = new Map<string, number>();
  const projectBedrooms = new Map<string, number[]>();

  for (const unit of units) {
    if (!projectTypes.has(unit.project_slug))
      projectTypes.set(unit.project_slug, new Map());
    const types = projectTypes.get(unit.project_slug)!;
    const ex = types.get(unit.unit_type);
    if (!ex) {
      types.set(unit.unit_type, {
        type_name: unit.unit_type,
        bedrooms: unit.bedrooms,
        min_price: unit.price_list,
        min_area: unit.area_total,
        count: 1,
      });
    } else {
      ex.min_price = Math.min(ex.min_price, unit.price_list);
      ex.min_area = Math.min(ex.min_area, unit.area_total);
      ex.count++;
    }

    const pm = projectMinPrice.get(unit.project_slug);
    if (!pm || unit.price_list < pm)
      projectMinPrice.set(unit.project_slug, unit.price_list);

    if (!projectBedrooms.has(unit.project_slug))
      projectBedrooms.set(unit.project_slug, []);
    projectBedrooms.get(unit.project_slug)!.push(unit.bedrooms);
  }

  // 3. Fetch PA projects
  const { data: projects, error: projErr } = await supabase
    .from("projects")
    .select("id, slug, currency")
    .in("slug", [...projectMinPrice.keys()]);

  if (projErr)
    return NextResponse.json({ error: projErr.message }, { status: 500 });

  // 4. Sync each project
  const log: string[] = [];
  for (const project of projects!) {
    const currency = project.currency ?? "GTQ";
    const types = projectTypes.get(project.slug);
    const minPrice = projectMinPrice.get(project.slug)!;
    const bedrooms = projectBedrooms.get(project.slug) ?? [];
    if (!types) continue;

    // Delete old unit types
    await supabase.from("unit_types").delete().eq("project_id", project.id);

    // Insert new
    const sorted = [...types.values()].sort((a, b) => a.min_price - b.min_price);
    await supabase.from("unit_types").insert(
      sorted.map((t, i) => ({
        project_id: project.id,
        type_name: t.type_name,
        bedrooms: t.bedrooms,
        total_area_m2: t.min_area,
        list_price: t.min_price,
        price_display: formatPrice(t.min_price, currency),
        price_currency: currency,
        sort_order: i + 1,
      }))
    );

    // Update project
    await supabase
      .from("projects")
      .update({
        starting_price: minPrice,
        starting_price_display: formatPrice(minPrice, currency),
        bedroom_range: bedroomRange(bedrooms),
      })
      .eq("id", project.id);

    log.push(
      `${project.slug}: ${sorted.length} types, from ${formatPrice(minPrice, currency)}`
    );
  }

  // 5. Revalidate project pages
  revalidatePath("/proyectos");
  revalidatePath("/");

  return NextResponse.json({
    ok: true,
    synced_at: orion.synced_at,
    orion_count: orion.count,
    projects: log,
  });
}
