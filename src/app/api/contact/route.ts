import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { contactFormSchema } from "@/lib/utils/validators";
import { checkRateLimit, getClientIp } from "@/lib/utils/rate-limit";
import type { Database } from "@/lib/types/database";

export async function POST(request: Request) {
  try {
    // Rate limit: 5 submissions per minute per IP
    const ip = getClientIp(request);
    const { allowed } = checkRateLimit(`contact:${ip}`, { maxRequests: 5, windowMs: 60000 });
    if (!allowed) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Intenta en un minuto." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate input
    const result = contactFormSchema.safeParse(body);
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
      // Silently reject spam
      return NextResponse.json({ success: true });
    }

    const supabase = createAdminClient();

    // Create lead
    const leadInsert: Database["public"]["Tables"]["leads"]["Insert"] = {
      first_name: data.first_name,
      last_name: data.last_name ?? null,
      email: data.email,
      phone: data.phone ?? null,
      source: "pagina_web",
      stage: "new",
      project_interest_id: data.project_interest_id ?? null,
      message: data.message ?? null,
      is_newsletter_subscriber: data.is_newsletter_subscriber ?? false,
      utm_source: data.utm_source ?? null,
      utm_medium: data.utm_medium ?? null,
      utm_campaign: data.utm_campaign ?? null,
    };
    const { error: leadError } = await supabase.from("leads").insert(leadInsert as never);

    if (leadError) {
      console.error("Error creating lead:", leadError.message);
      return NextResponse.json(
        { error: "Error al procesar tu solicitud. Intenta de nuevo." },
        { status: 500 }
      );
    }

    // If newsletter opt-in, also add to subscribers
    if (data.is_newsletter_subscriber && data.email) {
      const subscriberInsert: Database["public"]["Tables"]["newsletter_subscribers"]["Insert"] = {
        email: data.email,
        full_name: [data.first_name, data.last_name]
          .filter(Boolean)
          .join(" "),
        phone: data.phone ?? null,
        is_active: true,
      };
      await supabase
        .from("newsletter_subscribers")
        .upsert(subscriberInsert as never, { onConflict: "email" });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
