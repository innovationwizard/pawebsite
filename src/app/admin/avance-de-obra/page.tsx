"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Database } from "@/lib/types/database";

type ProgressEntry = Database["public"]["Tables"]["construction_progress"]["Row"];
type Project = Database["public"]["Tables"]["projects"]["Row"];

interface ProgressWithProject extends ProgressEntry {
  project_name: string;
}

export default function AdminAvanceDeObraPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<ProgressWithProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      const [progressRes, projectsRes] = await Promise.all([
        supabase.from("construction_progress").select("*").order("entry_date", { ascending: false }),
        supabase.from("projects").select("id,name"),
      ]);

      const projectsMap = new Map<string, string>();
      ((((projectsRes as any).data) as Pick<Project, "id" | "name">[]) ?? []).forEach((p) => {
        projectsMap.set(p.id, p.name);
      });

      const entriesWithProject: ProgressWithProject[] = ((((progressRes as any).data) as ProgressEntry[]) ?? []).map((e) => ({
        ...e,
        project_name: projectsMap.get(e.project_id) ?? "Proyecto desconocido",
      }));

      setEntries(entriesWithProject);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const columns = [
    {
      key: "project_name",
      header: "Proyecto",
      sortable: true,
      render: (row: ProgressWithProject) => (
        <span className="font-medium text-navy">{row.project_name}</span>
      ),
    },
    {
      key: "title",
      header: "Título",
      sortable: true,
      render: (row: ProgressWithProject) => <span>{row.title}</span>,
    },
    {
      key: "progress_percent",
      header: "Avance",
      sortable: true,
      render: (row: ProgressWithProject) => (
        <div className="flex items-center gap-2">
          <div className="h-2 w-20 overflow-hidden rounded-full bg-gray/10">
            <div
              className="h-full rounded-full bg-celeste"
              style={{ width: `${row.progress_percent ?? 0}%` }}
            />
          </div>
          <span className="text-sm text-gray">{row.progress_percent ?? 0}%</span>
        </div>
      ),
    },
    {
      key: "entry_date",
      header: "Fecha",
      sortable: true,
      render: (row: ProgressWithProject) => (
        <span className="text-gray">
          {new Date(row.entry_date).toLocaleDateString("es-GT")}
        </span>
      ),
    },
    {
      key: "is_published",
      header: "Publicado",
      sortable: true,
      render: (row: ProgressWithProject) => (
        <Badge variant={row.is_published ? "success" : "default"}>
          {row.is_published ? "Sí" : "No"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      render: (row: ProgressWithProject) => (
        <Link
          href={`/admin/avance-de-obra/${row.id}`}
          className="text-celeste hover:underline text-sm font-medium"
          onClick={(e) => e.stopPropagation()}
        >
          Editar
        </Link>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-celeste border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy">
            Avance de Obra
          </h1>
          <p className="mt-1 text-sm text-gray">
            Gestiona las entradas de avance de construcción.
          </p>
        </div>
        <Link href="/admin/avance-de-obra/nuevo">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Entrada
          </Button>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={entries}
        searchPlaceholder="Buscar por título..."
        searchKeys={["title", "project_name"]}
        onRowClick={(row) => router.push(`/admin/avance-de-obra/${row.id}`)}
        emptyMessage="No hay entradas de avance registradas."
      />
    </div>
  );
}
