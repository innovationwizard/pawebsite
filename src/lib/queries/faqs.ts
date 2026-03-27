import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/types/database";

type FaqRow = Database["public"]["Tables"]["faqs"]["Row"];
type FaqCategoryRow = Database["public"]["Tables"]["faq_categories"]["Row"];

export interface FaqCategoryWithItems extends FaqCategoryRow {
  faqs: FaqRow[];
}

export async function getPublishedFAQs(): Promise<FaqCategoryWithItems[]> {
  const supabase = await createClient();
  const { data: categories, error: catError } = await supabase
    .from("faq_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (catError) {
    console.error("Error fetching FAQ categories:", catError.message);
    return [];
  }

  const { data: faqs, error: faqError } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (faqError) {
    console.error("Error fetching FAQs:", faqError.message);
    return [];
  }

  const categoryList = (categories ?? []) as FaqCategoryRow[];
  const faqList = (faqs ?? []) as FaqRow[];

  return categoryList.map((category) => ({
    ...category,
    faqs: faqList.filter((faq) => faq.category_id === category.id),
  }));
}
