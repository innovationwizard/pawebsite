"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Target, Users, Newspaper, Building2, TrendingUp, ArrowRight } from "lucide-react";
import { LEAD_STAGES } from "@/lib/constants/lead-stages";

interface DashboardStats {
  totalLeads: number;
  leadsThisMonth: number;
  leadsThisWeek: number;
  totalProjects: number;
  totalArticles: number;
  totalSubscribers: number;
  leadsByStage: Record<string, number>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const supabase = createClient();

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).toISOString();

      const [
        leadsRes,
        leadsMonthRes,
        leadsWeekRes,
        projectsRes,
        articlesRes,
        subscribersRes,
      ] = await Promise.all([
        supabase.from("leads").select("id, stage", { count: "exact", head: false }),
        supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", startOfMonth),
        supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", startOfWeek),
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("news_articles").select("id", { count: "exact", head: true }),
        supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }).eq("is_active", true),
      ]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const leads = (leadsRes.data ?? []) as any[];
      const leadsByStage: Record<string, number> = {};
      for (const lead of leads) {
        const stage = lead.stage as string;
        leadsByStage[stage] = (leadsByStage[stage] ?? 0) + 1;
      }

      setStats({
        totalLeads: leadsRes.count ?? 0,
        leadsThisMonth: leadsMonthRes.count ?? 0,
        leadsThisWeek: leadsWeekRes.count ?? 0,
        totalProjects: projectsRes.count ?? 0,
        totalArticles: articlesRes.count ?? 0,
        totalSubscribers: subscribersRes.count ?? 0,
        leadsByStage,
      });
      setIsLoading(false);
    }

    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div>
        <h1 className="font-heading text-2xl font-bold text-navy">Dashboard</h1>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-navy">Dashboard</h1>
      <p className="mt-1 text-sm text-gray">
        Resumen general de Puerta Abierta.
      </p>

      {/* Stat cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Target}
          label="Leads Totales"
          value={stats.totalLeads}
          href="/admin/leads"
        />
        <StatCard
          icon={TrendingUp}
          label="Leads Este Mes"
          value={stats.leadsThisMonth}
          href="/admin/leads"
        />
        <StatCard
          icon={Building2}
          label="Proyectos"
          value={stats.totalProjects}
          href="/admin/proyectos"
        />
        <StatCard
          icon={Newspaper}
          label="Artículos"
          value={stats.totalArticles}
          href="/admin/noticias"
        />
      </div>

      {/* Lead funnel */}
      <div className="mt-8 rounded-2xl bg-white p-6">
        <h2 className="font-heading text-lg font-bold text-navy">
          Embudo de Leads
        </h2>
        <div className="mt-4 space-y-3">
          {LEAD_STAGES.map((stage) => {
            const count = stats.leadsByStage[stage.value] ?? 0;
            const maxCount = Math.max(...Object.values(stats.leadsByStage), 1);
            const percent = (count / maxCount) * 100;

            return (
              <div key={stage.value} className="flex items-center gap-4">
                <span className="w-36 text-sm font-medium text-navy">
                  {stage.label}
                </span>
                <div className="flex-1">
                  <div className="h-6 w-full overflow-hidden rounded-full bg-gray/5">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(percent, 2)}%`,
                        backgroundColor: stage.color,
                      }}
                    />
                  </div>
                </div>
                <span className="w-10 text-right text-sm font-bold text-navy">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <QuickLink href="/admin/proyectos/nuevo" label="Crear Proyecto" />
        <QuickLink href="/admin/noticias/nuevo" label="Crear Artículo" />
        <QuickLink href="/admin/leads" label="Ver Leads" />
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 rounded-2xl bg-white p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-celeste/10">
        <Icon className="h-5 w-5 text-celeste" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-gray">
          {label}
        </p>
        <p className="mt-1 font-heading text-2xl font-bold text-navy">
          {value}
        </p>
      </div>
    </Link>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-xl border border-gray/10 bg-white px-5 py-4 text-sm font-medium text-navy transition-colors hover:border-celeste/20 hover:text-celeste"
    >
      {label}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}
