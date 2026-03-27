"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/types/database";

export async function updateSiteSetting(key: string, value: Json) {
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await supabase.from("site_settings").upsert({
    key,
    value,
    updated_by: user.user?.id ?? null,
  } as any, { onConflict: "key" });

  if (error) {
    return { error: error.message };
  }

  // Revalidate all pages that use settings
  revalidatePath("/");
  revalidatePath("/politica-de-privacidad");
  revalidatePath("/terminos-y-condiciones");
  return { success: true };
}
