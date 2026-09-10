"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/types/database";

type LeadUpdate = Database["public"]["Tables"]["leads"]["Update"];

export async function updateLead(id: string, data: LeadUpdate) {
  const supabase = await createClient();

  // Get current lead to log changes
  const { data: currentLead } = await supabase.from("leads").select("stage, assigned_to").eq("id", id).single();

  const { data: lead, error } = await supabase.from("leads").update(data).eq("id", id).select().single();

  if (error) {
    return { error: error.message };
  }

  // Log stage change
  const { data: user } = await supabase.auth.getUser();

  if (data.stage && currentLead && data.stage !== currentLead.stage) {
    await supabase.from("lead_activity_log").insert({
      lead_id: id,
      user_id: user.user?.id ?? null,
      action: "stage_changed",
      old_value: currentLead.stage,
      new_value: data.stage,
    });
  }

  if (data.assigned_to && currentLead && data.assigned_to !== currentLead.assigned_to) {
    await supabase.from("lead_activity_log").insert({
      lead_id: id,
      user_id: user.user?.id ?? null,
      action: "assigned",
      old_value: currentLead.assigned_to,
      new_value: data.assigned_to,
    });
  }

  return { data: lead };
}

export async function addLeadNote(leadId: string, content: string) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    return { error: "No autenticado" };
  }

  const { data: note, error } = await supabase.from("lead_notes").insert({
    lead_id: leadId,
    author_id: user.user.id,
    content,
  }).select().single();

  if (error) {
    return { error: error.message };
  }

  // Log note addition
  await supabase.from("lead_activity_log").insert({
    lead_id: leadId,
    user_id: user.user.id,
    action: "note_added",
    new_value: content.substring(0, 100),
  });

  return { data: note };
}
