import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/types/database";

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
type UnitTypeRow = Database["public"]["Tables"]["unit_types"]["Row"];

export async function getPublishedProjects(): Promise<ProjectRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching projects:", error.message);
    return [];
  }

  return (data ?? []) as ProjectRow[];
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
