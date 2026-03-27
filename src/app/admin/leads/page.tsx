"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Search, Download, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LEAD_STAGES, type LeadStageOption } from "@/lib/constants/lead-stages";
import { LEAD_SOURCES } from "@/lib/constants/lead-sources";
import { formatRelativeDate } from "@/lib/utils/format-date";
import type { LeadStage, LeadSource, Database } from "@/lib/types/database";

type LeadRow = Database["public"]["Tables"]["leads"]["Row"];

interface LeadWithProject extends LeadRow {
  project_name: string | null;
}

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<LeadWithProject[]>([]);
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<LeadStage | "">("");
  const [sourceFilter, setSourceFilter] = useState<LeadSource | "">("");
  const [projectFilter, setProjectFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const [leadsRes, projectsRes] = await Promise.all([
        supabase.from("leads").select("*, projects ( name )").order("created_at", { ascending: false }),
        supabase.from("projects").select("id, name").order("name"),
      ]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const leadsData = (((leadsRes as any).data) ?? []) as any[];
      setLeads(
        leadsData.map((l: any) => ({
          ...l,
          project_name: l.projects?.name ?? null,
        }))
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setProjects((((projectsRes as any).data) ?? []) as { id: string; name: string }[]);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    let result = leads;

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.first_name.toLowerCase().includes(lower) ||
          (l.last_name?.toLowerCase().includes(lower)) ||
          (l.email?.toLowerCase().includes(lower)) ||
          (l.phone?.includes(lower))
      );
    }

    if (stageFilter) result = result.filter((l) => l.stage === stageFilter);
    if (sourceFilter) result = result.filter((l) => l.source === sourceFilter);
    if (projectFilter) result = result.filter((l) => l.project_interest_id === projectFilter);

    return result;
  }, [leads, search, stageFilter, sourceFilter, projectFilter]);

  const hasActiveFilters = stageFilter || sourceFilter || projectFilter;

  const stageMap = new Map<string, LeadStageOption>();
  LEAD_STAGES.forEach((s) => stageMap.set(s.value, s));

  const exportUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (stageFilter) params.set("stage", stageFilter);
    if (sourceFilter) params.set("source", sourceFilter);
    if (projectFilter) params.set("project_id", projectFilter);
    return `/api/leads/export?${params.toString()}`;
  }, [stageFilter, sourceFilter, projectFilter]);

  if (isLoading) {
    return (
      <div>
        <h1 className="font-heading text-2xl font-bold text-navy">Leads</h1>
        <div className="mt-8 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-white" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy">Leads</h1>
          <p className="mt-1 text-sm text-gray">
            {leads.length} leads totales · {filtered.length} mostrados
          </p>
        </div>
        <a href={exportUrl} download>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </a>
      </div>

      {/* Search + Filter toggle */}
      <div className="mt-6 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email o teléfono..."
            className="w-full rounded-xl border border-gray/20 bg-white py-2.5 pl-10 pr-4 text-sm text-navy placeholder:text-gray/40 focus:border-celeste focus:outline-none focus:ring-2 focus:ring-celeste/20"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
            hasActiveFilters
              ? "border-celeste bg-celeste/5 text-celeste"
              : "border-gray/20 text-gray hover:border-gray/40"
          }`}
        >
          <Filter className="h-4 w-4" />
          Filtros
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-celeste text-xs text-white">
              {[stageFilter, sourceFilter, projectFilter].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="mt-3 flex flex-wrap gap-3 rounded-xl border border-gray/10 bg-white p-4">
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value as LeadStage | "")}
            className="rounded-lg border border-gray/20 px-3 py-2 text-sm text-navy focus:border-celeste focus:outline-none"
          >
            <option value="">Todas las etapas</option>
            {LEAD_STAGES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value as LeadSource | "")}
            className="rounded-lg border border-gray/20 px-3 py-2 text-sm text-navy focus:border-celeste focus:outline-none"
          >
            <option value="">Todas las fuentes</option>
            {LEAD_SOURCES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="rounded-lg border border-gray/20 px-3 py-2 text-sm text-navy focus:border-celeste focus:outline-none"
          >
            <option value="">Todos los proyectos</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={() => {
                setStageFilter("");
                setSourceFilter("");
                setProjectFilter("");
              }}
              className="flex items-center gap-1 text-sm text-gray hover:text-navy"
            >
              <X className="h-3.5 w-3.5" />
              Limpiar
            </button>
          )}
        </div>
      )}

      {/* Leads table */}
      <div className="mt-6 overflow-x-auto rounded-xl border border-gray/10">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-gray/10 bg-off-white">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray">Contacto</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray">Proyecto</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray">Fuente</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray">Etapa</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray/50">
                  No se encontraron leads.
                </td>
              </tr>
            ) : (
              filtered.map((lead) => {
                const stage = stageMap.get(lead.stage);
                return (
                  <tr
                    key={lead.id}
                    onClick={() => router.push(`/admin/leads/${lead.id}`)}
                    className="cursor-pointer border-b border-gray/5 transition-colors hover:bg-off-white"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-navy">
                        {lead.first_name} {lead.last_name ?? ""}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-navy">{lead.email ?? "—"}</p>
                      <p className="text-xs text-gray">{lead.phone ?? ""}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray">
                      {lead.project_name ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="default">
                        {LEAD_SOURCES.find((s) => s.value === lead.source)?.label ?? lead.source}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                        style={{ backgroundColor: stage?.color ?? "#6b7280" }}
                      >
                        {stage?.label ?? lead.stage}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray">
                      {formatRelativeDate(lead.created_at)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
