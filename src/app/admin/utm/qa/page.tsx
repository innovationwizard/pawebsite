"use client";

import { useState, useEffect } from "react";
import {
  ClipboardCheck,
  CheckCircle,
  XCircle,
  Clock,
  MinusCircle,
  ChevronDown,
  Search,
  Filter,
} from "lucide-react";
import toast from "react-hot-toast";
import type { QACheckValue, QAStatusValue } from "@/lib/utm/types";

interface CampaignWithQA {
  id: string;
  namingCampaign: string;
  brand: { name: string };
  platform: { name: string };
  createdAt: string;
  qaReview: {
    id: string;
    status: QAStatusValue;
    [key: string]: unknown;
  } | null;
}

const QA_CHECK_ICONS: Record<QACheckValue, React.ReactNode> = {
  OK: <CheckCircle className="h-4 w-4 text-green-600" />,
  FAIL: <XCircle className="h-4 w-4 text-red-600" />,
  PENDING: <Clock className="h-4 w-4 text-amber-500" />,
  NA: <MinusCircle className="h-4 w-4 text-gray/60" />,
};

const STATUS_LABELS: Record<QAStatusValue, string> = {
  PENDING: "Pendiente",
  IN_REVIEW: "En Revisión",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
};

const QA_SECTIONS: Array<{
  title: string;
  icon: string;
  responsibility: string;
  checks: { key: string; label: string }[];
  textFields?: { key: string; label: string; multiline?: boolean }[];
  boolFields?: { key: string; label: string }[];
}> = [
  {
    title: "Plataforma",
    icon: "📱",
    responsibility: "Quien Implementa",
    checks: [{ key: "platformCorrect", label: "¿La plataforma es correcta?" }],
  },
  {
    title: "Campaña",
    icon: "📊",
    responsibility: "Quien Implementa / Specialist",
    checks: [
      { key: "campaignNameCorrect", label: "¿Está bien el nombre de la campaña?" },
      { key: "campaignObjectiveCorrect", label: "¿Es correcto el objetivo de campaña?" },
      { key: "campaignBudgetMatch", label: "¿El presupuesto coincide con la bitácora?" },
    ],
    textFields: [
      { key: "budgetLevel", label: "Nivel de presupuesto" },
      { key: "budgetAllocation", label: "¿Asignación diaria o total?" },
      { key: "campaignObservations", label: "Observaciones", multiline: true },
    ],
  },
  {
    title: "Conjunto de Anuncios",
    icon: "👥",
    responsibility: "Quien Implementa / Specialist",
    checks: [
      { key: "adGroupNameCorrect", label: "¿Está bien el nombre del grupo?" },
      { key: "geoAgeGenderMatch", label: "¿Coincide segmentación de lugares, sexo y edad?" },
      { key: "includedAudiencesMatch", label: "¿Coinciden los públicos incluidos?" },
      { key: "excludedAudiencesMatch", label: "¿Coinciden los públicos excluidos?" },
    ],
    textFields: [
      { key: "placementScope", label: "Ubicaciones (IG, FB o ambas)" },
      { key: "eventName", label: "Evento" },
      { key: "adGroupObservations", label: "Observaciones", multiline: true },
    ],
    boolFields: [{ key: "isEvergreen", label: "¿Es atemporal (AO)?" }],
  },
  {
    title: "Anuncios",
    icon: "🎨",
    responsibility: "Quien Implementa / Specialist",
    checks: [
      { key: "adNameCorrect", label: "¿Está bien el nombre del anuncio?" },
      { key: "profilesCorrect", label: "¿Los perfiles de FB e IG son correctos?" },
      { key: "mainCopyApproved", label: "¿El copy principal está aprobado?" },
      { key: "titleCopyApproved", label: "¿El copy de título está aprobado?" },
      { key: "descriptionCopyApproved", label: "¿La descripción está aprobada?" },
      { key: "urlMatchesNaming", label: "¿La URL coincide con la marcación?" },
      { key: "urlWithUtmWorks", label: "¿Funciona la URL con UTM?" },
    ],
    textFields: [
      { key: "ctaValue", label: "CTA del anuncio" },
      { key: "previewLink", label: "Preview Link" },
      { key: "trackingEvents", label: "Eventos de seguimiento" },
      { key: "adObservations", label: "Observaciones", multiline: true },
    ],
  },
];

export default function QAPage() {
  const [campaigns, setCampaigns] = useState<CampaignWithQA[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [qaForm, setQaForm] = useState<Record<string, unknown>>({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/utm/campaigns")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setCampaigns)
      .catch(() => toast.error("Error cargando campañas"))
      .finally(() => setLoading(false));
  }, []);

  function selectCampaign(campaign: CampaignWithQA) {
    setSelected(campaign.id);
    if (campaign.qaReview) {
      setQaForm(campaign.qaReview as Record<string, unknown>);
    } else {
      setQaForm({ status: "PENDING" });
    }
  }

  function updateQAField(key: string, value: unknown) {
    setQaForm((prev) => ({ ...prev, [key]: value }));
  }

  function cycleCheck(key: string) {
    const current = (qaForm[key] as QACheckValue) || "PENDING";
    const order: QACheckValue[] = ["PENDING", "OK", "FAIL", "NA"];
    const next = order[(order.indexOf(current) + 1) % order.length];
    updateQAField(key, next);
  }

  async function saveQA() {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/utm/qa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId: selected, ...qaForm }),
      });
      if (!res.ok) throw new Error();
      toast.success("QA guardado exitosamente");
      const updated = await fetch("/api/utm/campaigns").then((r) => r.json());
      setCampaigns(updated);
    } catch {
      toast.error("Error al guardar QA");
    } finally {
      setSaving(false);
    }
  }

  const filtered = campaigns.filter((c) => {
    const matchesSearch = c.namingCampaign.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || (c.qaReview?.status ?? "PENDING") === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-navy">QA &amp; Revisión</h1>
        <p className="mt-1 text-sm text-gray">Checklist completo de calidad para campañas</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm lg:max-h-[calc(100vh-12rem)]">
          <div className="space-y-3 border-b border-gray/10 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray/50" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar campaña..."
                className="w-full rounded-lg border border-gray/30 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-celeste focus:ring-2 focus:ring-celeste/20"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray/50" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray/30 bg-white py-2 pl-9 pr-8 text-sm outline-none focus:border-celeste focus:ring-2 focus:ring-celeste/20"
              >
                <option value="ALL">Todos los estados</option>
                <option value="PENDING">Pendiente</option>
                <option value="IN_REVIEW">En Revisión</option>
                <option value="APPROVED">Aprobado</option>
                <option value="REJECTED">Rechazado</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray/50" />
            </div>
          </div>

          <div className="flex-1 divide-y divide-gray/10 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-sm text-gray">Cargando...</div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray">No se encontraron campañas</div>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => selectCampaign(c)}
                  className={`w-full px-4 py-3 text-left transition-all hover:bg-navy/5 ${
                    selected === c.id ? "border-l-2 border-l-navy bg-navy/5" : ""
                  }`}
                >
                  <p className="truncate text-sm font-medium text-navy">{c.namingCampaign || "Sin nombre"}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs text-gray">{c.brand.name} · {c.platform.name}</span>
                    <span
                      className={`ml-auto text-[10px] font-medium uppercase ${
                        c.qaReview?.status === "APPROVED"
                          ? "text-green-600"
                          : c.qaReview?.status === "REJECTED"
                            ? "text-red-600"
                            : "text-amber-600"
                      }`}
                    >
                      {STATUS_LABELS[(c.qaReview?.status as QAStatusValue) ?? "PENDING"]}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {selected ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl bg-white px-5 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                <ClipboardCheck className="h-5 w-5 text-gray" />
                <span className="text-sm font-semibold text-navy">Estado General:</span>
                <select
                  value={(qaForm.status as string) || "PENDING"}
                  onChange={(e) => updateQAField("status", e.target.value)}
                  className="rounded-lg border border-gray/30 bg-white px-3 py-1.5 text-sm font-medium outline-none focus:border-celeste focus:ring-2 focus:ring-celeste/20"
                >
                  {(Object.entries(STATUS_LABELS) as [QAStatusValue, string][]).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={saveQA}
                disabled={saving}
                className="rounded-full bg-celeste px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-celeste/90 disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Guardar QA"}
              </button>
            </div>

            {QA_SECTIONS.map((section) => (
              <div key={section.title} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray/10 px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span>{section.icon}</span>
                    <h3 className="text-sm font-semibold text-navy">{section.title}</h3>
                  </div>
                  <span className="text-[10px] text-gray">{section.responsibility}</span>
                </div>
                <div className="space-y-3 p-5">
                  {section.checks.map((check) => (
                    <div key={check.key} className="flex items-center justify-between rounded-lg border border-gray/10 px-4 py-2.5">
                      <span className="text-sm text-navy">{check.label}</span>
                      <button
                        onClick={() => cycleCheck(check.key)}
                        className="flex items-center gap-1.5 rounded-lg border border-gray/20 px-2.5 py-1 text-xs font-medium transition-all hover:bg-navy/5"
                      >
                        {QA_CHECK_ICONS[(qaForm[check.key] as QACheckValue) || "PENDING"]}
                        <span>{(qaForm[check.key] as string) || "PENDING"}</span>
                      </button>
                    </div>
                  ))}

                  {section.boolFields?.map((field) => (
                    <div key={field.key} className="flex items-center justify-between rounded-lg border border-gray/10 px-4 py-2.5">
                      <span className="text-sm text-navy">{field.label}</span>
                      <button
                        onClick={() => updateQAField(field.key, !qaForm[field.key])}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                          qaForm[field.key] ? "bg-green-100 text-green-800" : "bg-gray/10 text-gray"
                        }`}
                      >
                        {qaForm[field.key] ? "Sí" : "No"}
                      </button>
                    </div>
                  ))}

                  {section.textFields?.map((field) => (
                    <div key={field.key}>
                      <label className="mb-1 block text-xs font-medium text-gray">{field.label}</label>
                      {field.multiline ? (
                        <textarea
                          value={(qaForm[field.key] as string) || ""}
                          onChange={(e) => updateQAField(field.key, e.target.value)}
                          rows={2}
                          className="w-full rounded-lg border border-gray/30 bg-white px-3 py-2 text-sm outline-none focus:border-celeste focus:ring-2 focus:ring-celeste/20"
                          placeholder="OK o escribir observaciones..."
                        />
                      ) : (
                        <input
                          type="text"
                          value={(qaForm[field.key] as string) || ""}
                          onChange={(e) => updateQAField(field.key, e.target.value)}
                          className="w-full rounded-lg border border-gray/30 bg-white px-3 py-2 text-sm outline-none focus:border-celeste focus:ring-2 focus:ring-celeste/20"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-24 text-center shadow-sm">
            <ClipboardCheck className="mb-3 h-12 w-12 text-gray/40" />
            <p className="text-sm font-medium text-gray">Selecciona una campaña para revisar</p>
          </div>
        )}
      </div>
    </div>
  );
}
