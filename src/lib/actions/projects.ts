"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/types/database";

type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];

export async function createProject(data: ProjectInsert) {
  const supabase = await createClient();
  const { data: project, error } = await supabase.from("projects").insert(data).select("*").single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/proyectos");
  revalidatePath("/sitemap.xml");
  return { data: project };
}

export async function updateProject(id: string, data: ProjectUpdate) {
  const supabase = await createClient();
  const { data: project, error } = await supabase.from("projects").update(data).eq("id", id).select().single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/proyectos");
  revalidatePath(`/proyectos/${project.slug}`);
  revalidatePath("/avance-de-obra");
  revalidatePath("/sitemap.xml");
  return { data: project };
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/proyectos");
  revalidatePath("/sitemap.xml");
  return { success: true };
}
