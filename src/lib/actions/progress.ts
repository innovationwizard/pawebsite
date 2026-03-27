"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/types/database";

type ProgressInsert = Database["public"]["Tables"]["construction_progress"]["Insert"];
type ProgressUpdate = Database["public"]["Tables"]["construction_progress"]["Update"];
type ProgressPhotoInsert = Database["public"]["Tables"]["construction_progress_photos"]["Insert"];

export async function createProgressEntry(data: ProgressInsert) {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: entry, error } = await (supabase.from("construction_progress") as any).insert(data).select("*").single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/avance-de-obra");
  return { data: entry };
}

export async function updateProgressEntry(id: string, data: ProgressUpdate) {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: entry, error } = await (supabase.from("construction_progress") as any).update(data).eq("id", id).select().single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/avance-de-obra");
  return { data: entry };
}

export async function deleteProgressEntry(id: string) {
  const supabase = await createClient();
  const { error } = await (supabase.from("construction_progress") as any).delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/avance-de-obra");
  return { success: true };
}

export async function addProgressPhoto(data: ProgressPhotoInsert) {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: photo, error } = await (supabase.from("construction_progress_photos") as any).insert(data).select("*").single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/avance-de-obra");
  return { data: photo };
}

export async function deleteProgressPhoto(id: string) {
  const supabase = await createClient();
  const { error } = await (supabase.from("construction_progress_photos") as any).delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/avance-de-obra");
  return { success: true };
}
