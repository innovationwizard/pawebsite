import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Untyped Supabase server client for the UTM feature.
 *
 * pawebsite's typed `Database` does not include the `utm_*` tables, so UTM data
 * access uses this untyped client. It carries the caller's auth cookies, so RLS
 * (`is_admin()` → admin/editor) governs every query — no service role needed for
 * table access.
 */
export async function createUtmClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — safe to ignore; middleware refreshes.
          }
        },
      },
    }
  );
}

type UtmClient = Awaited<ReturnType<typeof createUtmClient>>;

/**
 * Require an authenticated pawebsite admin (role admin OR editor) for a UTM API
 * route. Returns the user id, or a NextResponse error to return directly.
 * master-data editing is admin+editor (per the integration decision), so a single
 * gate covers both read and write.
 */
export async function requireUtmUser(
  supabase: UtmClient
): Promise<{ userId: string } | NextResponse> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const role = (user.user_metadata as { role?: string } | null)?.role;
  if (role !== "admin" && role !== "editor") {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }
  return { userId: user.id };
}
