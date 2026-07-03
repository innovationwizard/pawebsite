"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Wand2,
  Copy,
  Check,
  Plus,
  Download,
  RotateCcw,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";
import { generateNaming, validateNaming } from "@/lib/utm/naming";
import type { NamingInput, NamingOutput } from "@/lib/utm/naming";
import { copyToClipboard } from "@/lib/utm/utils";

interface MasterItem {
  id: string;
  name: string;
  abbreviation: string;
  source?: string;
  medium?: string;
}

interface MasterData {
  industries: MasterItem[];
  brands: MasterItem[];
  platforms: MasterItem[];
  countries: MasterItem[];
  companies: MasterItem[];
  adFormats: MasterItem[];
  buyTypes: MasterItem[];
  campaignTypes: MasterItem[];
  segmentationTypes: MasterItem[];
  adPieceTypes: MasterItem[];
}

const EMPTY_FORM = {
  industryId: "",
  countryId: "",
  companyId: "",
  brandId: "",
  campaignName: "",
  platformId: "",
  formatId: "",
  buyTypeId: "",
  dateLabel: "",
  segmentation: "",
  pieceType: "",
  pieceDifferentiator: "",
  utmSourceOverride: "",
  utmMediumOverride: "",
  destinationUrl: "",
  startDate: "",
  endDate: "",
};

export default function GeneratorPage() {
  const [masterData, setMasterData] = useState<MasterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  useEffect(() => {
    fetch("/api/utm/master-data")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setMasterData)
      .catch(() => toast.error("Error cargando datos maestros"))
      .finally(() => setLoading(false));
  }, []);

  const find = useCallback(
    (list: MasterItem[] | undefined, id: string) => list?.find((i) => i.id === id),
    []
  );

  const naming: NamingOutput | null = useMemo(() => {
    if (!masterData) return null;
    const industry = find(masterData.industries, form.industryId);
    const country = find(masterData.countries, form.countryId);
    const company = find(masterData.companies, form.companyId);
    const brand = find(masterData.brands, form.brandId);
    const platform = find(masterData.platforms, form.platformId);
    const format = find(masterData.adFormats, form.formatId);
    const buyType = find(masterData.buyTypes, form.buyTypeId);

    const input: NamingInput = {
      industryAbbr: industry?.abbreviation ?? "",
      countryAbbr: country?.abbreviation ?? "",
      companyAbbr: company?.abbreviation ?? "",
      brandAbbr: brand?.abbreviation ?? "",
      campaignName: form.campaignName,
      platformAbbr: platform?.abbreviation ?? "",
      formatAbbr: format?.abbreviation ?? "",
      buyTypeAbbr: buyType?.abbreviation ?? "",
      dateLabel: form.dateLabel,
      segmentation: form.segmentation,
      pieceType: form.pieceType,
      pieceDifferentiator: form.pieceDifferentiator,
      utmSource: form.utmSourceOverride || platform?.source || "",
      utmMedium: form.utmMediumOverride || platform?.medium || "",
      destinationUrl: form.destinationUrl,
    };
    return generateNaming(input);
  }, [form, masterData, find]);

  const issues = useMemo(() => (naming ? validateNaming(naming) : []), [naming]);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSavedId(null);
  }

  function resetForm() {
    setForm({ ...EMPTY_FORM });
    setSavedId(null);
  }

  async function persistCampaign(): Promise<boolean> {
    if (savedId || !naming || saving) return !!savedId;
    setSaving(true);
    try {
      const res = await fetch("/api/utm/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ...naming }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSavedId(data.id);
      return true;
    } catch {
      toast.error("Error al guardar la campaña");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleCopy(text: string, field: string) {
    if (!savedId && issues.length === 0 && naming) {
      const ok = await persistCampaign();
      if (ok) toast.success("Marcación guardada y copiada");
    }
    const copied = await copyToClipboard(text);
    if (copied) {
      setCopiedField(field);
      if (savedId) toast.success("Copiado al portapapeles");
      setTimeout(() => setCopiedField(null), 2000);
    }
  }

  async function handleSave() {
    if (!naming) return;
    const ok = await persistCampaign();
    if (ok) toast.success("Campaña guardada exitosamente");
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-gray/10" />
        <div className="h-96 animate-pulse rounded-2xl bg-gray/10" />
      </div>
    );
  }

  const platform = find(masterData?.platforms, form.platformId);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy">Generador UTM</h1>
          <p className="mt-1 text-sm text-gray">Selecciona los parámetros para generar la marcación</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetForm}
            className="inline-flex items-center gap-2 rounded-full border border-gray/30 bg-white px-4 py-2 text-sm font-medium text-navy transition-all hover:bg-navy/5"
          >
            <RotateCcw className="h-4 w-4" />
            Limpiar
          </button>
          <button
            onClick={handleSave}
            disabled={issues.length > 0 || !!savedId || saving}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all disabled:opacity-50 ${
              savedId
                ? "border border-green-200 bg-green-50 text-green-700"
                : "bg-celeste text-white hover:bg-celeste/90"
            }`}
          >
            {savedId ? (
              <>
                <Check className="h-4 w-4" /> Guardada
              </>
            ) : saving ? (
              "Guardando..."
            ) : (
              <>
                <Plus className="h-4 w-4" /> Guardar
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <FormSection title="Identificación" icon="🏢">
            <SelectField label="Industria" value={form.industryId} onChange={(v) => updateField("industryId", v)} options={masterData?.industries ?? []} />
            <SelectField label="País" value={form.countryId} onChange={(v) => updateField("countryId", v)} options={masterData?.countries ?? []} />
            <SelectField label="Empresa" value={form.companyId} onChange={(v) => updateField("companyId", v)} options={masterData?.companies ?? []} />
            <SelectField label="Marca" value={form.brandId} onChange={(v) => updateField("brandId", v)} options={masterData?.brands ?? []} />
          </FormSection>

          <FormSection title="Configuración de Campaña" icon="⚙️">
            <TextField label="Nombre de Campaña" value={form.campaignName} onChange={(v) => updateField("campaignName", v)} placeholder="Ej: navidad, BackToSchool, pmax" />
            <SelectField label="Plataforma" value={form.platformId} onChange={(v) => updateField("platformId", v)} options={masterData?.platforms ?? []} />
            <SelectField label="Formato / Objetivo" value={form.formatId} onChange={(v) => updateField("formatId", v)} options={masterData?.adFormats ?? []} />
            <SelectField label="Tipo de Compra" value={form.buyTypeId} onChange={(v) => updateField("buyTypeId", v)} options={masterData?.buyTypes ?? []} />
            <TextField label="Etiqueta de Fecha" value={form.dateLabel} onChange={(v) => updateField("dateLabel", v)} placeholder="Ej: nov2023, ao, 1al31dic" />
          </FormSection>

          <FormSection title="Segmentación y Pieza" icon="🎯">
            <SelectField
              label="Segmentación"
              value={form.segmentation}
              onChange={(v) => updateField("segmentation", v)}
              options={masterData?.segmentationTypes.map((s) => ({ ...s, abbreviation: s.name })) ?? []}
              valueKey="name"
            />
            <SelectField
              label="Tipo de Pieza"
              value={form.pieceType}
              onChange={(v) => updateField("pieceType", v)}
              options={masterData?.adPieceTypes.map((s) => ({ ...s, abbreviation: s.name })) ?? []}
              valueKey="name"
            />
            <TextField label="Diferenciador de Pieza" value={form.pieceDifferentiator} onChange={(v) => updateField("pieceDifferentiator", v)} placeholder="Ej: 1, Xela, Zapatos, _home" />
          </FormSection>

          <FormSection title="UTM Source & Medium" icon="🔗">
            <TextField label="Source" value={form.utmSourceOverride} onChange={(v) => updateField("utmSourceOverride", v)} placeholder={platform?.source || "Se auto-completa con la plataforma"} />
            <TextField label="Medium" value={form.utmMediumOverride} onChange={(v) => updateField("utmMediumOverride", v)} placeholder={platform?.medium || "Se auto-completa con la plataforma"} />
            <TextField label="URL de Destino" value={form.destinationUrl} onChange={(v) => updateField("destinationUrl", v)} placeholder="https://www.ejemplo.com/" />
          </FormSection>
        </div>

        <div className="space-y-6 lg:sticky lg:top-8 lg:self-start">
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="flex items-center gap-3 bg-navy px-6 py-4">
              <Wand2 className="h-5 w-5 text-white" />
              <h2 className="font-semibold text-white">Preview en Tiempo Real</h2>
            </div>

            <div className="space-y-5 p-6">
              {issues.length > 0 && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <p className="text-xs font-semibold text-amber-800">Advertencias:</p>
                  {issues.map((issue, i) => (
                    <p key={i} className="mt-1 text-xs text-amber-700">• {issue}</p>
                  ))}
                </div>
              )}

              <OutputBlock label="Nombre de Campaña" sublabel="(R) naming_campaign" value={naming?.namingCampaign || "—"} onCopy={() => handleCopy(naming?.namingCampaign || "", "campaign")} copied={copiedField === "campaign"} />
              <OutputBlock label="Nombre de Grupo de Anuncios" sublabel="(T) naming_adgroup" value={naming?.namingAdGroup || "—"} onCopy={() => handleCopy(naming?.namingAdGroup || "", "adgroup")} copied={copiedField === "adgroup"} />
              <OutputBlock label="Nombre de Anuncio / Pieza" sublabel="(W) naming_piece" value={naming?.namingPiece || "—"} onCopy={() => handleCopy(naming?.namingPiece || "", "piece")} copied={copiedField === "piece"} />
              <OutputBlock label="UTM String" sublabel="(Z) parámetros UTM" value={naming?.utmString || "—"} onCopy={() => handleCopy(naming?.utmString || "", "utm")} copied={copiedField === "utm"} mono />
              <OutputBlock label="URL Completa" sublabel="(AB) URL + UTM" value={naming?.fullUrl || "—"} onCopy={() => handleCopy(naming?.fullUrl || "", "url")} copied={copiedField === "url"} mono link={naming?.fullUrl?.startsWith("http") ? naming.fullUrl : undefined} />

              <button
                onClick={() => {
                  const all = [
                    `Campaña: ${naming?.namingCampaign}`,
                    `Grupo: ${naming?.namingAdGroup}`,
                    `Pieza: ${naming?.namingPiece}`,
                    `UTM: ${naming?.utmString}`,
                    `URL: ${naming?.fullUrl}`,
                  ].join("\n");
                  handleCopy(all, "all");
                }}
                className="w-full rounded-lg border border-gray/20 bg-off-white px-4 py-2.5 text-sm font-medium text-navy transition-all hover:bg-navy/5"
              >
                {copiedField === "all" ? (
                  <span className="flex items-center justify-center gap-2">
                    <Check className="h-4 w-4 text-green-600" /> Copiado
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Download className="h-4 w-4" /> Copiar Todo
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormSection({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray/10 px-5 py-3">
        <span className="text-base">{icon}</span>
        <h3 className="text-sm font-semibold text-navy">{title}</h3>
      </div>
      <div className="grid gap-4 p-5 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  valueKey = "id",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: MasterItem[];
  valueKey?: "id" | "name";
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-gray/30 bg-white px-3 py-2 pr-8 text-sm text-navy outline-none transition-all focus:border-celeste focus:ring-2 focus:ring-celeste/20"
        >
          <option value="">Seleccionar...</option>
          {options.map((opt) => (
            <option key={opt.id} value={valueKey === "name" ? opt.name : opt.id}>
              {opt.name} {opt.abbreviation !== opt.name ? `(${opt.abbreviation})` : ""}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray/50" />
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray/30 bg-white px-3 py-2 text-sm text-navy outline-none transition-all placeholder:text-gray/50 focus:border-celeste focus:ring-2 focus:ring-celeste/20"
      />
    </div>
  );
}

function OutputBlock({
  label,
  sublabel,
  value,
  onCopy,
  copied,
  mono,
  link,
}: {
  label: string;
  sublabel: string;
  value: string;
  onCopy: () => void;
  copied: boolean;
  mono?: boolean;
  link?: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-navy">{label}</span>
          <span className="ml-1.5 text-[10px] text-gray/60">{sublabel}</span>
        </div>
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
        className={`break-all rounded-lg border border-gray/20 bg-off-white px-4 py-3 font-mono ${mono ? "text-xs" : "text-sm"} ${
          value === "—" ? "text-gray/50" : "text-navy"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
