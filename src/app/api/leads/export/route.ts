import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateCSV } from "@/lib/utils/csv";

export async function GET(request: Request) {
  const supabase = await createClient();

  // Verify authenticated admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !["admin", "editor"].includes(user.user_metadata?.role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Parse filters from URL
  const { searchParams } = new URL(request.url);
  const stage = searchParams.get("stage");
  const source = searchParams.get("source");
  const projectId = searchParams.get("project_id");

  let query = supabase
    .from("leads")
    .select(`*, projects ( name )`)
    .order("created_at", { ascending: false });

  if (stage) query = query.eq("stage", stage);
  if (source) query = query.eq("source", source);
  if (projectId) query = query.eq("project_interest_id", projectId);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leads = (data ?? []) as any[];

  const headers = [
    "Nombre",
    "Apellido",
    "Email",
    "Teléfono",
    "Fuente",
    "Etapa",
    "Proyecto",
    "Mensaje",
    "Suscriptor",
    "UTM Source",
    "UTM Medium",
    "UTM Campaign",
    "Fecha",
  ];

  const rows = leads.map((lead) => [
    lead.first_name ?? "",
    lead.last_name ?? "",
    lead.email ?? "",
    lead.phone ?? "",
    lead.source ?? "",
    lead.stage ?? "",
    lead.projects?.name ?? "",
    lead.message ?? "",
    lead.is_newsletter_subscriber ? "Sí" : "No",
    lead.utm_source ?? "",
    lead.utm_medium ?? "",
    lead.utm_campaign ?? "",
    lead.created_at ? new Date(lead.created_at).toLocaleDateString("es-GT") : "",
  ]);

  const csv = generateCSV(headers, rows);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
