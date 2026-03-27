"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { updateLead, addLeadNote } from "@/lib/actions/leads";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  Building2,
  Calendar,
  Tag,
  Send,
  User,
} from "lucide-react";
import { LEAD_STAGES } from "@/lib/constants/lead-stages";
import { LEAD_SOURCES } from "@/lib/constants/lead-sources";
import { formatDate, formatRelativeDate } from "@/lib/utils/format-date";
import type { LeadStage, Database } from "@/lib/types/database";

type LeadRow = Database["public"]["Tables"]["leads"]["Row"];
type LeadNoteRow = Database["public"]["Tables"]["lead_notes"]["Row"];
type LeadActivityRow = Database["public"]["Tables"]["lead_activity_log"]["Row"];

interface LeadDetailProps {
  params: Promise<{ id: string }>;
}

export default function LeadDetailPage({ params }: LeadDetailProps) {
  const { id } = use(params);
  const router = useRouter();
  const [lead, setLead] = useState<(LeadRow & { project_name: string | null }) | null>(null);
  const [notes, setNotes] = useState<LeadNoteRow[]>([]);
  const [activity, setActivity] = useState<LeadActivityRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isChangingStage, setIsChangingStage] = useState(false);

  useEffect(() => {
    async function fetchLead() {
      const supabase = createClient();
      const [leadRes, notesRes, activityRes] = await Promise.all([
        supabase.from("leads").select("*, projects ( name )").eq("id", id).single(),
        supabase.from("lead_notes").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
        supabase.from("lead_activity_log").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
      ]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const leadData = (leadRes as any).data;
      if (!leadData) {
        router.push("/admin/leads");
        return;
      }

      setLead({
        ...leadData,
        project_name: leadData.projects?.name ?? null,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setNotes(((notesRes as any).data ?? []) as LeadNoteRow[]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setActivity(((activityRes as any).data ?? []) as LeadActivityRow[]);
      setIsLoading(false);
    }
    fetchLead();
  }, [id, router]);

  async function handleStageChange(newStage: LeadStage) {
    if (!lead || lead.stage === newStage) return;
    setIsChangingStage(true);

    const result = await updateLead(id, { stage: newStage });
    if (!result.error) {
      setLead((prev) => (prev ? { ...prev, stage: newStage } : prev));
      // Refresh activity log
      const supabase = createClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await supabase.from("lead_activity_log").select("*").eq("lead_id", id).order("created_at", { ascending: false }) as { data: any };
      setActivity((data ?? []) as LeadActivityRow[]);
    }
    setIsChangingStage(false);
  }

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!newNote.trim()) return;
    setIsSavingNote(true);

    const result = await addLeadNote(id, newNote.trim());
    if (!result.error) {
      setNewNote("");
      // Refresh notes and activity
      const supabase = createClient();
      const [notesRes, activityRes] = await Promise.all([
        supabase.from("lead_notes").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
        supabase.from("lead_activity_log").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
      ]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setNotes(((notesRes as any).data ?? []) as LeadNoteRow[]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setActivity(((activityRes as any).data ?? []) as LeadActivityRow[]);
    }
    setIsSavingNote(false);
  }

  if (isLoading || !lead) {
    return (
      <div>
        <h1 className="font-heading text-2xl font-bold text-navy">Lead</h1>
        <div className="mt-8 h-64 animate-pulse rounded-2xl bg-white" />
      </div>
    );
  }

  const sourceName = LEAD_SOURCES.find((s) => s.value === lead.source)?.label ?? lead.source;

  return (
    <div>
      <Link
        href="/admin/leads"
        className="inline-flex items-center gap-2 text-sm text-gray transition-colors hover:text-navy"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Leads
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Left column — Contact info */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-celeste/10">
                <User className="h-6 w-6 text-celeste" />
              </div>
              <div>
                <h1 className="font-heading text-xl font-bold text-navy">
                  {lead.first_name} {lead.last_name ?? ""}
                </h1>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {lead.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-gray/40" />
                  <a href={`mailto:${lead.email}`} className="text-sm text-celeste hover:underline">
                    {lead.email}
                  </a>
                </div>
              )}
              {lead.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-gray/40" />
                  <a href={`tel:${lead.phone}`} className="text-sm text-navy hover:text-celeste">
                    {lead.phone}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Tag className="h-4 w-4 shrink-0 text-gray/40" />
                <span className="text-sm text-gray">{sourceName}</span>
              </div>
              {lead.project_name && (
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 shrink-0 text-gray/40" />
                  <span className="text-sm text-navy">{lead.project_name}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 shrink-0 text-gray/40" />
                <span className="text-sm text-gray">{formatDate(lead.created_at)}</span>
              </div>
            </div>

            {/* UTM data */}
            {(lead.utm_source || lead.utm_medium || lead.utm_campaign) && (
              <div className="mt-6 border-t border-gray/10 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray/40">UTM</p>
                <div className="mt-2 space-y-1 text-xs text-gray">
                  {lead.utm_source && <p><Globe className="mr-1.5 inline h-3 w-3" />Source: {lead.utm_source}</p>}
                  {lead.utm_medium && <p>Medium: {lead.utm_medium}</p>}
                  {lead.utm_campaign && <p>Campaign: {lead.utm_campaign}</p>}
                </div>
              </div>
            )}

            {/* Message */}
            {lead.message && (
              <div className="mt-6 border-t border-gray/10 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray/40">Mensaje</p>
                <p className="mt-2 text-sm text-gray leading-relaxed">{lead.message}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right column — Pipeline + Notes + Activity */}
        <div className="space-y-6 lg:col-span-2">
          {/* Pipeline */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray/40">
              Etapa del Lead
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {LEAD_STAGES.map((stage) => {
                const isActive = lead.stage === stage.value;
                return (
                  <button
                    key={stage.value}
                    onClick={() => handleStageChange(stage.value)}
                    disabled={isChangingStage}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      isActive
                        ? "text-white shadow-md"
                        : "bg-gray/5 text-gray hover:bg-gray/10 hover:text-navy"
                    }`}
                    style={isActive ? { backgroundColor: stage.color } : undefined}
                  >
                    {stage.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray/40">
              Notas
            </h2>

            <form onSubmit={handleAddNote} className="mt-4 flex gap-3">
              <div className="flex-1">
                <Textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Agregar una nota..."
                  rows={2}
                  className="!min-h-[60px]"
                />
              </div>
              <Button type="submit" size="sm" isLoading={isSavingNote} disabled={!newNote.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>

            {notes.length > 0 && (
              <div className="mt-6 space-y-4">
                {notes.map((note) => (
                  <div key={note.id} className="border-l-2 border-celeste/20 pl-4">
                    <p className="text-sm text-navy">{note.content}</p>
                    <p className="mt-1 text-xs text-gray">
                      {formatRelativeDate(note.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Log */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray/40">
              Actividad
            </h2>

            {activity.length === 0 ? (
              <p className="mt-4 text-sm text-gray/40">Sin actividad registrada.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {activity.map((entry) => (
                  <div key={entry.id} className="flex gap-3">
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gray/20" />
                    <div>
                      <p className="text-sm text-navy">
                        {entry.action === "stage_changed" && (
                          <>
                            Etapa cambiada:{" "}
                            <span className="text-gray">{LEAD_STAGES.find((s) => s.value === entry.old_value)?.label ?? entry.old_value}</span>
                            {" → "}
                            <span className="font-medium">{LEAD_STAGES.find((s) => s.value === entry.new_value)?.label ?? entry.new_value}</span>
                          </>
                        )}
                        {entry.action === "note_added" && "Nota agregada"}
                        {entry.action === "assigned" && "Lead asignado"}
                        {entry.action === "created" && "Lead creado"}
                      </p>
                      <p className="text-xs text-gray">
                        {formatRelativeDate(entry.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
