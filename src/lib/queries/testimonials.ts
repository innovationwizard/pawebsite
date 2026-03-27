import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/types/database";

type TestimonialRow = Database["public"]["Tables"]["testimonials"]["Row"];

export async function getPublishedTestimonials(): Promise<TestimonialRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching testimonials:", error.message);
    return [];
  }

  return (data ?? []) as TestimonialRow[];
}
