import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/types/database";

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
type UnitTypeRow = Database["public"]["Tables"]["unit_types"]["Row"];
type ProjectImageRow = Database["public"]["Tables"]["project_images"]["Row"];

export type ProjectRowWithZona = ProjectRow & {
  zona: {
    name: string;
    slug: string;
    municipio: { name: string; slug: string } | null;
  } | null;
};

export async function getPublishedProjects(): Promise<ProjectRowWithZona[]> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("projects")
    .select("*, zona:zonas(name, slug, municipio:municipios(name, slug))")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching projects:", error.message);
    return [];
  }

  return (data ?? []) as ProjectRowWithZona[];
}

/**
 * Returns the public-facing location label for a project, per the
 * audience-mental-model algorithm:
 *   - If municipio is Ciudad de Guatemala → "zona N" (the zona name).
 *   - Otherwise → the municipio name (e.g., "Antigua Guatemala", "Mixco").
 *
 * Civilians don't conflate Mixco zonas with Ciudad de Guatemala zonas,
 * and they don't recognize "zona 0" as Antigua. The condition gates on
 * municipio (not departamento) so adding other Guatemala-depto
 * municipios like Mixco produces the right label without ambiguity.
 */
export function getProjectLocationLabel(
  project: ProjectRowWithZona,
): string | null {
  const zona = project.zona;
  if (!zona) return null;
  if (zona.municipio?.slug === "guatemala") {
    return zona.name;
  }
  return zona.municipio?.name ?? null;
}

/**
 * Distinct location labels for the public filter, derived from the
 * actual project set so options with zero results never appear.
 * Sorted: municipio/city names first (alphabetical), then zonas by
 * numeric order.
 */
export function deriveLocationOptions(
  projects: ProjectRowWithZona[],
): string[] {
  const labels = projects
    .map(getProjectLocationLabel)
    .filter((l): l is string => l !== null);
  const unique = Array.from(new Set(labels));
  return unique.sort((a, b) => {
    const aIsZona = a.startsWith("zona ");
    const bIsZona = b.startsWith("zona ");
    if (aIsZona && !bIsZona) return 1;
    if (!aIsZona && bIsZona) return -1;
    if (aIsZona && bIsZona) {
      const aNum = parseInt(a.slice(5), 10);
      const bNum = parseInt(b.slice(5), 10);
      return aNum - bNum;
    }
    return a.localeCompare(b, "es");
  });
}

/**
 * Fetch published project slugs without requiring cookies.
 * Used in generateStaticParams at build time.
 */
export async function getPublishedProjectSlugs(): Promise<{ slug: string }[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("projects")
    .select("slug")
    .eq("is_published", true);

  if (error) {
    console.error("Error fetching project slugs:", error.message);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((data ?? []) as any[]).map((p) => ({ slug: p.slug as string }));
}

export async function getProjectBySlug(slug: string): Promise<ProjectRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) {
    return null;
  }

  return data as ProjectRow;
}

export async function getProjectUnitTypes(projectId: string): Promise<UnitTypeRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("unit_types")
    .select("*")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching unit types:", error.message);
    return [];
  }

  return (data ?? []) as UnitTypeRow[];
}

export async function getProjectGalleryImages(projectId: string): Promise<ProjectImageRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_images")
    .select("*")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching project gallery:", error.message);
    return [];
  }

  return (data ?? []) as ProjectImageRow[];
}
