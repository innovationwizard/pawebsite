import Link from "next/link";
import { Wand2, ClipboardCheck, CheckCircle, Clock } from "lucide-react";
import { createUtmClient } from "@/lib/utm/server";

/* eslint-disable @typescript-eslint/no-explicit-any */

export const dynamic = "force-dynamic";

export default async function UtmDashboardPage() {
  let total = 0;
  let pending = 0;
  let approved = 0;
  let recent: any[] = [];

  try {
    const supabase = await createUtmClient();
    const [tRes, pRes, aRes, rRes] = await Promise.all([
      supabase.from("utm_campaigns").select("*", { count: "exact", head: true }),
      supabase.from("utm_qa_reviews").select("*", { count: "exact", head: true }).eq("status", "PENDING"),
      supabase.from("utm_qa_reviews").select("*", { count: "exact", head: true }).eq("status", "APPROVED"),
      supabase
        .from("utm_campaigns")
        .select("id, naming_campaign, brand:utm_brands(name), platform:utm_platforms(name), qaReview:utm_qa_reviews(status)")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);
    total = tRes.count ?? 0;
    pending = pRes.count ?? 0;
    approved = aRes.count ?? 0;
    recent = rRes.data ?? [];
  } catch (e) {
    console.error("UTM dashboard error:", e);
  }

  const stats = [
    { label: "Campañas Totales", value: total, icon: Wand2, color: "bg-celeste/10 text-celeste" },
    { label: "QA Pendiente", value: pending, icon: Clock, color: "bg-amber-100 text-amber-700" },
    { label: "QA Aprobado", value: approved, icon: CheckCircle, color: "bg-green-100 text-green-700" },
    { label: "En Revisión", value: Math.max(0, total - pending - approved), icon: ClipboardCheck, color: "bg-navy/10 text-navy" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-navy">Generador UTM</h1>
        <p className="mt-1 text-sm text-gray">Resumen de marcaciones y estado de QA</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
            <div className={`rounded-xl p-3 ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{value}</p>
              <p className="text-xs text-gray">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/admin/utm/generador" className="group flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="rounded-xl bg-navy p-3 text-white transition-transform group-hover:scale-105">
            <Wand2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-navy">Nueva Marcación</h3>
            <p className="text-sm text-gray">Generar naming y UTMs para una campaña</p>
          </div>
        </Link>

        <Link href="/admin/utm/qa" className="group flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="rounded-xl bg-navy p-3 text-white transition-transform group-hover:scale-105">
            <ClipboardCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-navy">Revisar QA</h3>
            <p className="text-sm text-gray">{pending} campañas pendientes de revisión</p>
          </div>
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="border-b border-gray/10 px-6 py-4">
          <h2 className="font-semibold text-navy">Campañas Recientes</h2>
        </div>
        {recent.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-gray">No hay campañas creadas aún.</div>
        ) : (
          <div className="divide-y divide-gray/10">
            {recent.map((c) => {
              const status = c.qaReview?.status;
              const badge =
                status === "APPROVED"
                  ? "bg-green-100 text-green-800"
                  : status === "REJECTED"
                    ? "bg-red-100 text-red-800"
                    : "bg-amber-100 text-amber-800";
              const label = status === "APPROVED" ? "Aprobado" : status === "REJECTED" ? "Rechazado" : "Pendiente";
              return (
                <div key={c.id} className="flex items-center justify-between px-6 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-navy">{c.naming_campaign || "Sin nombre"}</p>
                    <p className="mt-0.5 text-xs text-gray">
                      {c.brand?.name} · {c.platform?.name}
                    </p>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge}`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
