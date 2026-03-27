import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/types/database";

export async function getSiteSetting<T = Json>(key: string): Promise<T | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .single();

  if (error || !data) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data as any).value as T;
}

export interface BrandHighlights {
  projects_count: number;
  sqm_developed: number;
  years_experience: number;
  historical_sales_millions: number;
}

export interface TertiaryBannerSettings {
  image_url: string;
  title: string;
  cta_text: string;
  cta_link: string;
}

export interface CompanyInfo {
  address: string;
  email: string;
  phone: string;
  whatsapp: string;
}

export interface SocialLinks {
  linkedin: string;
  facebook: string;
  instagram: string;
  youtube: string;
}

export async function getHeroVideoUrl(): Promise<string | null> {
  const setting = await getSiteSetting<{ url: string }>("hero_video_url");
  return setting?.url ?? null;
}

export async function getBrandHighlights(): Promise<BrandHighlights | null> {
  return getSiteSetting<BrandHighlights>("brand_highlights");
}

export async function getTertiaryBanner(): Promise<TertiaryBannerSettings | null> {
  return getSiteSetting<TertiaryBannerSettings>("tertiary_banner");
}
