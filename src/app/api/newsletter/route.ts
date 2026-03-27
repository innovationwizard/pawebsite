import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { newsletterSchema } from "@/lib/utils/validators";
import { checkRateLimit, getClientIp } from "@/lib/utils/rate-limit";
import type { Database } from "@/lib/types/database";

export async function POST(request: Request) {
  try {
    // Rate limit: 5 subscriptions per minute per IP
    const ip = getClientIp(request);
    const { allowed } = checkRateLimit(`newsletter:${ip}`, { maxRequests: 5, windowMs: 60000 });
    if (!allowed) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Intenta en un minuto." },
        { status: 429 }
      );
    }

    const body = await request.json();

    const result = newsletterSchema.safeParse(body);
    if (!result.success) {
      const firstError = result.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message ?? "Datos inválidos" },
        { status: 400 }
      );
    }

    const data = result.data;

    // Honeypot check
    if (data.honeypot) {
      return NextResponse.json({ success: true });
    }

    const supabase = createAdminClient();

    const subscriberInsert: Database["public"]["Tables"]["newsletter_subscribers"]["Insert"] = {
      email: data.email,
      full_name: data.full_name ?? null,
      phone: data.phone ?? null,
      is_active: true,
    };
    const { error } = await supabase
      .from("newsletter_subscribers")
      .upsert(subscriberInsert as never, { onConflict: "email" });

    if (error) {
      console.error("Error subscribing:", error.message);
      return NextResponse.json(
        { error: "Error al suscribirte. Intenta de nuevo." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
