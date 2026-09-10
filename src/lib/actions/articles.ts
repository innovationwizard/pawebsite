"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/types/database";

type ArticleInsert = Database["public"]["Tables"]["news_articles"]["Insert"];
type ArticleUpdate = Database["public"]["Tables"]["news_articles"]["Update"];

export async function createArticle(data: ArticleInsert) {
  const supabase = await createClient();
  const { data: article, error } = await supabase.from("news_articles").insert(data).select("*").single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/noticias");
  revalidatePath("/sitemap.xml");
  return { data: article };
}

export async function updateArticle(id: string, data: ArticleUpdate) {
  const supabase = await createClient();
  const { data: article, error } = await supabase.from("news_articles").update(data).eq("id", id).select().single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/noticias");
  revalidatePath(`/noticias/${article.slug}`);
  revalidatePath("/sitemap.xml");
  return { data: article };
}

export async function deleteArticle(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("news_articles").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/noticias");
  revalidatePath("/sitemap.xml");
  return { success: true };
}
