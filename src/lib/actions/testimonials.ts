"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/types/database";

type TestimonialInsert = Database["public"]["Tables"]["testimonials"]["Insert"];
type TestimonialUpdate = Database["public"]["Tables"]["testimonials"]["Update"];

export async function createTestimonial(data: TestimonialInsert) {
  const supabase = await createClient();
  const { data: testimonial, error } = await supabase.from("testimonials").insert(data).select("*").single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { data: testimonial };
}

export async function updateTestimonial(id: string, data: TestimonialUpdate) {
  const supabase = await createClient();
  const { data: testimonial, error } = await supabase.from("testimonials").update(data).eq("id", id).select().single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { data: testimonial };
}

export async function deleteTestimonial(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}
