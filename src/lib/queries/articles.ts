import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/types/database";

type ArticleRow = Database["public"]["Tables"]["news_articles"]["Row"];

export interface ArticleWithCategory extends ArticleRow {
  category_name: string | null;
}

export async function getPublishedArticles(limit?: number): Promise<ArticleWithCategory[]> {
  const supabase = await createClient();
  let query = supabase
    .from("news_articles")
    .select(`*, news_categories ( name )`)
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching articles:", error.message);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((data ?? []) as any[]).map((article) => ({
    ...article,
    category_name: article.news_categories?.name ?? null,
  }));
}

export async function getPublishedArticleSlugs(): Promise<{ slug: string }[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("news_articles")
    .select("slug")
    .eq("is_published", true);

  if (error) {
    console.error("Error fetching article slugs:", error.message);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((data ?? []) as any[]).map((a) => ({ slug: a.slug as string }));
}

export async function getArticleBySlug(slug: string): Promise<ArticleWithCategory | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news_articles")
    .select(`*, news_categories ( name, slug )`)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const article = data as any;
  return {
    ...article,
    category_name: article.news_categories?.name ?? null,
  };
}
