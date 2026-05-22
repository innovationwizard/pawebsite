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

export interface BrandHighlightItem {
  label: string;
  value: string;
}

export function parseHighlightValue(raw: string): {
  prefix: string;
  end: number;
  suffix: string;
} {
  const match = String(raw ?? "").match(/^(\D*)([\d,.]*)(\D*)$/);
  const prefix = match?.[1] ?? "";
  const digits = (match?.[2] ?? "").replace(/,/g, "");
  const suffix = match?.[3] ?? "";
  const end = Number(digits);
  return { prefix, end: Number.isFinite(end) ? end : 0, suffix };
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

export async function getBrandHighlights(): Promise<BrandHighlightItem[]> {
  const data = await getSiteSetting<BrandHighlightItem[]>("brand_highlights");
  return Array.isArray(data) ? data : [];
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

export interface QuienesSomosHero {
  type: "image" | "video";
  url: string;
}

export async function getQuienesSomosHero(): Promise<QuienesSomosHero | null> {
  return getSiteSetting<QuienesSomosHero>("quienes_somos_hero");
}

export interface QuienesSomosContent {
  hero_h1: string;
  hero_subtext: string;
  mission: string;
  vision: string;
  value_1_title: string;
  value_1_desc: string;
  value_2_title: string;
  value_2_desc: string;
  value_3_title: string;
  value_3_desc: string;
  value_4_title: string;
  value_4_desc: string;
  trayectoria: string;
}

export async function getQuienesSomosContent(): Promise<QuienesSomosContent | null> {
  return getSiteSetting<QuienesSomosContent>("quienes_somos_content");
}
