"use client";

import { useState, useEffect } from "react";
import {
  History as HistoryIcon,
  Search,
  Download,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  User,
  Calendar,
  Link2,
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";
import { copyToClipboard, formatDate } from "@/lib/utm/utils";

interface CampaignRow {
  id: string;
  campaignName: string;
  dateLabel: string;
  segmentation: string;
  pieceType: string;
  pieceDifferentiator: string;
  destinationUrl: string;
  utmSourceOverride: string | null;
  utmMediumOverride: string | null;
  namingCampaign: string;
  namingAdGroup: string;
  namingPiece: string;
  utmString: string;
  fullUrl: string;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  brand: { name: string; abbreviation: string };
  platform: { name: string; abbreviation: string; source: string; medium: string };
  industry: { name: string; abbreviation: string };
  country: { name: string; abbreviation: string };
  company: { name: string; abbreviation: string };
  format: { name: string; abbreviation: string };
  buyType: { name: string; abbreviation: string };
  campaignType: { name: string } | null;
  createdBy?: { name: string | null; email: string | null };
  qaReview: { status: string } | null;
}

export default function HistoryPage() {
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/utm/campaigns")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setCampaigns)
      .catch(() => toast.error("Error cargando historial"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = campaigns.filter(
    (c) =>
      c.namingCampaign.toLowerCase().includes(search.toLowerCase()) ||
      c.brand.name.toLowerCase().includes(search.toLowerCase()) ||
      c.platform.name.toLowerCase().includes(search.toLowerCase()) ||
      c.utmString.toLowerCase().includes(search.toLowerCase())
  );

  async function handleCopy(text: string, id: string) {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedId(id);
      toast.success("Copiado");
      setTimeout(() => setCopiedId(null), 2000);
    }
  }

  function exportCSV() {
    const header = [
      "Campaña", "Grupo de Anuncios", "Pieza", "UTM", "URL Completa", "URL Destino",
      "Marca", "Plataforma", "utm_source", "utm_medium", "Estado QA", "Creado por", "Fecha",
    ].join(",");

    const rows = filtered.map((c) =>
      [
        `"${c.namingCampaign}"`,
        `"${c.namingAdGroup}"`,
        `"${c.namingPiece}"`,
        `"${c.utmString}"`,
        `"${c.fullUrl}"`,
        `"${c.destinationUrl}"`,
        c.brand.name,
        c.platform.name,
        c.utmSourceOverride || c.platform.source,
        c.utmMediumOverride || c.platform.medium,
        c.qaReview?.status ?? "PENDING",
        c.createdBy?.name ?? "",
        formatDate(c.createdAt),
      ].join(",")
    );

    const csv = [header, ...rows].join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `marcaciones_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exportado");
  }

  function parseUtmParams(utmString: string) {
    if (!utmString || !utmString.startsWith("?")) return [];
    const params = new URLSearchParams(utmString);
    return Array.from(params.entries());
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy">Historial</h1>
          <p className="mt-1 text-sm text-gray">
            Todas las marcaciones generadas &mdash; {filtered.length} registro{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 rounded-full border border-gray/30 bg-white px-4 py-2 text-sm font-medium text-navy transition-all hover:bg-navy/5"
        >
          <Download className="h-4 w-4" />
          Exportar CSV
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray/50" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por campaña, marca, plataforma o UTM..."
          className="w-full rounded-lg border border-gray/30 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-celeste focus:ring-2 focus:ring-celeste/20"
        />
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray/10 bg-off-white">
                <th className="w-8 px-2 py-3" />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray">Campaña</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray">Marca</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray">Plataforma</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray">QA</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray">Fecha</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray/10">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray">Cargando...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray">
                    <HistoryIcon className="mx-auto mb-2 h-8 w-8 text-gray/40" />
                    No se encontraron marcaciones
                  </td>
                </tr>
              ) : (
                filtered.map((c) => {
                  const isExpanded = expandedId === c.id;
                  const status = c.qaReview?.status;
                  const badge =
                    status === "APPROVED"
                      ? "bg-green-100 text-green-800"
                      : status === "REJECTED"
                        ? "bg-red-100 text-red-800"
                        : "bg-amber-100 text-amber-800";
                  return (
                    <tr key={c.id} className="group">
                      <td className="px-2 py-3">
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : c.id)}
                          className="rounded p-1 text-gray/50 transition-colors hover:text-navy"
                        >
                          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </button>
                      </td>
                      <td className="max-w-xs truncate px-4 py-3">
                        <p className="truncate font-medium text-navy">{c.namingCampaign || "—"}</p>
                        <p className="mt-0.5 truncate text-xs text-gray">{c.namingAdGroup}</p>
                      </td>
                      <td className="px-4 py-3 text-navy">{c.brand.name}</td>
                      <td className="px-4 py-3">
                        <code className="rounded bg-off-white px-1.5 py-0.5 text-xs text-gray">{c.platform.abbreviation}</code>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge}`}>
                          {status === "APPROVED" ? "OK" : status === "REJECTED" ? "Rechazado" : "Pendiente"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray">{formatDate(c.createdAt)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleCopy(c.fullUrl || c.utmString, c.id)}
                            className="rounded p-1.5 text-gray transition-colors hover:bg-navy/5 hover:text-navy"
                            title="Copiar URL+UTM"
                          >
                            {copiedId === c.id ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                          </button>
                          {c.fullUrl?.startsWith("http") && (
                            <a
                              href={c.fullUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded p-1.5 text-gray transition-colors hover:bg-navy/5 hover:text-navy"
                              title="Abrir URL"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {expandedId && (() => {
        const c = filtered.find((x) => x.id === expandedId);
        if (!c) return null;
        const utmParams = parseUtmParams(c.utmString);
        return (
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="flex items-center gap-3 bg-navy px-6 py-4">
              <Tag className="h-5 w-5 text-white" />
              <h2 className="font-semibold text-white">Detalle de Marcación</h2>
              <span className="ml-auto text-xs text-white/60">ID: {c.id}</span>
            </div>

            <div className="grid gap-6 p-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-navy">
                  <Tag className="h-4 w-4 text-gray" /> Convenciones de Nombre
                </h3>
                <DetailField label="Nombre de Campaña" value={c.namingCampaign} onCopy={() => handleCopy(c.namingCampaign, `${c.id}-nc`)} copied={copiedId === `${c.id}-nc`} />
                <DetailField label="Grupo de Anuncios" value={c.namingAdGroup} onCopy={() => handleCopy(c.namingAdGroup, `${c.id}-ag`)} copied={copiedId === `${c.id}-ag`} />
                <DetailField label="Pieza / Anuncio" value={c.namingPiece} onCopy={() => handleCopy(c.namingPiece, `${c.id}-pc`)} copied={copiedId === `${c.id}-pc`} />
              </div>

              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-navy">
                  <Link2 className="h-4 w-4 text-gray" /> Parámetros UTM
                </h3>
                {utmParams.map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between rounded-lg bg-off-white px-3 py-2">
                    <span className="text-xs font-medium text-gray">{key}</span>
                    <code className="max-w-[60%] truncate text-xs text-navy">{decodeURIComponent(val)}</code>
                  </div>
                ))}
                <DetailField label="UTM String completo" value={c.utmString} onCopy={() => handleCopy(c.utmString, `${c.id}-utm`)} copied={copiedId === `${c.id}-utm`} mono />
              </div>

              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-navy">
                  <ExternalLink className="h-4 w-4 text-gray" /> URLs
                </h3>
                <DetailField label="URL de Destino" value={c.destinationUrl || "—"} onCopy={() => handleCopy(c.destinationUrl, `${c.id}-dest`)} copied={copiedId === `${c.id}-dest`} mono />
                <DetailField label="URL Completa (destino + UTM)" value={c.fullUrl || "—"} onCopy={() => handleCopy(c.fullUrl, `${c.id}-full`)} copied={copiedId === `${c.id}-full`} mono link={c.fullUrl?.startsWith("http") ? c.fullUrl : undefined} />
              </div>

              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-navy">
                  <Calendar className="h-4 w-4 text-gray" /> Datos de Campaña
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <MetaItem label="Industria" value={`${c.industry.name} (${c.industry.abbreviation})`} />
                  <MetaItem label="País" value={`${c.country.name} (${c.country.abbreviation})`} />
                  <MetaItem label="Empresa" value={`${c.company.name} (${c.company.abbreviation})`} />
                  <MetaItem label="Marca" value={`${c.brand.name} (${c.brand.abbreviation})`} />
                  <MetaItem label="Plataforma" value={`${c.platform.name} (${c.platform.abbreviation})`} />
                  <MetaItem label="Formato" value={`${c.format.name} (${c.format.abbreviation})`} />
                  <MetaItem label="Tipo de Compra" value={`${c.buyType.name} (${c.buyType.abbreviation})`} />
                  {c.campaignType && <MetaItem label="Tipo de Campaña" value={c.campaignType.name} />}
                  <MetaItem label="Nombre Campaña" value={c.campaignName} />
                  <MetaItem label="Etiqueta Fecha" value={c.dateLabel} />
                  {c.segmentation && <MetaItem label="Segmentación" value={c.segmentation} />}
                  {c.pieceType && <MetaItem label="Tipo Pieza" value={c.pieceType} />}
                  {c.pieceDifferentiator && <MetaItem label="Diferenciador" value={c.pieceDifferentiator} />}
                </div>
              </div>

              <div className="space-y-4 md:col-span-2">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-navy">
                  <User className="h-4 w-4 text-gray" /> Auditoría
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {c.createdBy?.name && <MetaItem label="Creado por" value={c.createdBy.name} />}
                  <MetaItem label="Creado" value={formatDate(c.createdAt)} />
                  <MetaItem label="Actualizado" value={formatDate(c.updatedAt)} />
                  {c.startDate && <MetaItem label="Inicio" value={formatDate(c.startDate)} />}
                  {c.endDate && <MetaItem label="Fin" value={formatDate(c.endDate)} />}
                  <MetaItem
                    label="Estado QA"
                    value={
                      c.qaReview?.status === "APPROVED"
                        ? "Aprobado"
                        : c.qaReview?.status === "REJECTED"
                          ? "Rechazado"
                          : c.qaReview?.status === "IN_REVIEW"
                            ? "En revisión"
                            : "Pendiente"
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function DetailField({
  label,
  value,
  onCopy,
  copied,
  mono,
  link,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  copied: boolean;
  mono?: boolean;
  link?: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-medium text-gray">{label}</span>
        <div className="flex items-center gap-1">
          {link && (
            <a href={link} target="_blank" rel="noopener noreferrer" className="rounded p-1 text-gray/50 transition-colors hover:text-navy">
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          <button onClick={onCopy} className="rounded p-1 text-gray/50 transition-colors hover:text-navy">
            {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
      <div
        className={`break-all rounded-lg border border-gray/20 bg-off-white px-3 py-2 ${mono ? "font-mono text-xs" : "text-sm"} ${
          value === "—" ? "text-gray/50" : "text-navy"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-off-white px-3 py-2">
      <p className="text-[10px] font-medium uppercase tracking-wide text-gray">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-navy">{value}</p>
    </div>
  );
}
