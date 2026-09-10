import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/types/database";

type LeadRow = Database["public"]["Tables"]["leads"]["Row"];
type LeadNoteRow = Database["public"]["Tables"]["lead_notes"]["Row"];
type LeadActivityRow = Database["public"]["Tables"]["lead_activity_log"]["Row"];

export interface LeadWithDetails extends LeadRow {
  project_interest_name: string | null;
}

export async function getLeads(): Promise<LeadWithDetails[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select(`*, projects ( name )`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching leads:", error.message);
    return [];
  }

  return (data ?? []).map((lead) => ({
    ...lead,
    project_interest_name: lead.projects?.name ?? null,
  }));
}

export async function getLeadById(id: string) {
  const supabase = await createClient();

  const [leadRes, notesRes, activityRes] = await Promise.all([
    supabase.from("leads").select(`*, projects ( name )`).eq("id", id).single(),
    supabase.from("lead_notes").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
    supabase.from("lead_activity_log").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
  ]);

  if (leadRes.error) {
    return null;
  }

  const lead = leadRes.data;

  return {
    lead: {
      ...lead,
      project_interest_name: lead.projects?.name ?? null,
    },
    notes: (notesRes.data ?? []) as LeadNoteRow[],
    activity: (activityRes.data ?? []) as LeadActivityRow[],
  };
}
