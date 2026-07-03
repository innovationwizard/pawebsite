import { createAdminClient } from "@/lib/supabase/admin";

export interface UtmUserRef {
  id: string;
  name: string | null;
  email: string | null;
}

/**
 * Build a map of auth.users id → {id, name, email} for resolving campaign/QA
 * creator + reviewer references. `auth.users` isn't reachable via RLS/PostgREST,
 * so we use the service-role admin client. `name` comes from user_metadata.name
 * (set for condor; falls back to email for pawebsite users that have no name).
 */
export async function getUtmUserMap(): Promise<Record<string, UtmUserRef>> {
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (error || !data) return {};

  const map: Record<string, UtmUserRef> = {};
  for (const u of data.users) {
    const meta = (u.user_metadata ?? {}) as { name?: string };
    map[u.id] = {
      id: u.id,
      name: meta.name ?? u.email ?? null,
      email: u.email ?? null,
    };
  }
  return map;
}
