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

export interface LicPuertasSettings {
  photo_url: string;
  name: string;
  title: string;
}

export async function getLicPuertasSettings(): Promise<LicPuertasSettings | null> {
  return getSiteSetting<LicPuertasSettings>("lic_puertas");
}

export interface HomepageSectionImages {
  team_image_url: string;
  capsula_1_url: string;
  capsula_2_url: string;
  capsula_3_url: string;
}

export async function getHomepageSectionImages(): Promise<HomepageSectionImages | null> {
  return getSiteSetting<HomepageSectionImages>("homepage_section_images");
}

export interface TeamMember {
  name: string;
  title: string;
  photo_url: string;
  bio: string;
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const data = await getSiteSetting<TeamMember[]>("team_members");
  return data ?? [];
}
