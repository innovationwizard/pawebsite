"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/types/database";

type FaqInsert = Database["public"]["Tables"]["faqs"]["Insert"];
type FaqUpdate = Database["public"]["Tables"]["faqs"]["Update"];
type FaqCategoryInsert = Database["public"]["Tables"]["faq_categories"]["Insert"];

export async function createFaq(data: FaqInsert) {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: faq, error } = await (supabase.from("faqs") as any).insert(data).select("*").single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/preguntas-frecuentes");
  return { data: faq };
}

export async function updateFaq(id: string, data: FaqUpdate) {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: faq, error } = await (supabase.from("faqs") as any).update(data).eq("id", id).select().single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/preguntas-frecuentes");
  return { data: faq };
}

export async function deleteFaq(id: string) {
  const supabase = await createClient();
  const { error } = await (supabase.from("faqs") as any).delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/preguntas-frecuentes");
  return { success: true };
}

export async function createFaqCategory(data: FaqCategoryInsert) {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: category, error } = await (supabase.from("faq_categories") as any).insert(data).select("*").single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/preguntas-frecuentes");
  return { data: category };
}
