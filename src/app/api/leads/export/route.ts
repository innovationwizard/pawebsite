import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateCSV } from "@/lib/utils/csv";
import { getLeadProjectStageLabel } from "@/lib/constants/lead-project-stages";
import { isLeadStage } from "@/lib/constants/lead-stages";
import { isLeadSource } from "@/lib/constants/lead-sources";

export async function GET(request: Request) {
  const supabase = await createClient();

  // Verify authenticated admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !["admin", "editor"].includes(user.user_metadata?.role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Parse filters from URL
  const { searchParams } = new URL(request.url);
  const stageParam = searchParams.get("stage");
  const sourceParam = searchParams.get("source");
  const projectId = searchParams.get("project_id");
  const stage = isLeadStage(stageParam) ? stageParam : null;
  const source = isLeadSource(sourceParam) ? sourceParam : null;

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

  const leads = data ?? [];

  const headers = [
    "Nombre",
    "Apellido",
    "Email",
    "Teléfono",
    "Fuente",
    "Etapa",
    "Proyecto",
    "Mensaje",
    "Empresa",
    "Cargo",
    "Proyecto del desarrollador",
    "Ubicación del proyecto",
    "Etapa del proyecto",
    "Unidades",
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
    lead.company ?? "",
    lead.job_title ?? "",
    lead.project_name ?? "",
    lead.project_location ?? "",
    getLeadProjectStageLabel(lead.project_stage),
    lead.project_units != null ? String(lead.project_units) : "",
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
