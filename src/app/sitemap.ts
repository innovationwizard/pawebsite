import type { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://puertaabierta.com.gt";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createAdminClient();

  // Fetch dynamic slugs in parallel
  const [projectsRes, articlesRes] = await Promise.all([
    supabase.from("projects").select("slug, updated_at").eq("is_published", true),
    supabase.from("news_articles").select("slug, updated_at").eq("is_published", true),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const projects = ((projectsRes.data ?? []) as any[]).map((p) => ({
    slug: p.slug as string,
    updated_at: p.updated_at as string,
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const articles = ((articlesRes.data ?? []) as any[]).map((a) => ({
    slug: a.slug as string,
    updated_at: a.updated_at as string,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/proyectos`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/noticias`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/avance-de-obra`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/preguntas-frecuentes`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/politica-de-privacidad`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terminos-y-condiciones`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const projectPages: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${SITE_URL}/proyectos/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/noticias/${a.slug}`,
    lastModified: new Date(a.updated_at),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const progressPages: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${SITE_URL}/avance-de-obra/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticPages, ...projectPages, ...articlePages, ...progressPages];
}
