import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/types/database";

type ProgressRow = Database["public"]["Tables"]["construction_progress"]["Row"];
type ProgressPhotoRow = Database["public"]["Tables"]["construction_progress_photos"]["Row"];

export interface ProgressWithPhotos extends ProgressRow {
  construction_progress_photos: ProgressPhotoRow[];
}

export async function getProgressByProject(projectId: string): Promise<ProgressWithPhotos[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("construction_progress")
    .select(
      `
      *,
      construction_progress_photos ( * )
    `
    )
    .eq("project_id", projectId)
    .eq("is_published", true)
    .order("entry_date", { ascending: false });

  if (error) {
    console.error("Error fetching progress:", error.message);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []) as any as ProgressWithPhotos[];
}

interface ProjectSummary {
  id: string;
  name: string;
  slug: string;
}

export interface ProjectWithLatestProgress {
  project: ProjectSummary;
  latestProgress: ProgressWithPhotos | null;
}

export async function getLatestProgressPerProject(): Promise<ProjectWithLatestProgress[]> {
  const supabase = await createClient();

  const { data: projects, error: projError } = await supabase
    .from("projects")
    .select("id, name, slug")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (projError || !projects) {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const projectList = (projects as any[]) as ProjectSummary[];

  const results = await Promise.all(
    projectList.map(async (project) => {
      const { data } = await supabase
        .from("construction_progress")
        .select(
          `
          *,
          construction_progress_photos ( * )
        `
        )
        .eq("project_id", project.id)
        .eq("is_published", true)
        .order("entry_date", { ascending: false })
        .limit(1)
        .single();

      return {
        project,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        latestProgress: data ? (data as any as ProgressWithPhotos) : null,
      };
    })
  );

  return results.filter((r) => r.latestProgress !== null);
}
