"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Badge, ProjectStatusBadge } from "@/components/ui/badge";
import type { Database } from "@/lib/types/database";

type Project = Database["public"]["Tables"]["projects"]["Row"];

export default function AdminProyectosPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      const supabase = createClient();
      const { data } = await supabase
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true });
      setProjects((data as Project[]) ?? []);
      setIsLoading(false);
    }
    fetchProjects();
  }, []);

  const columns = [
    {
      key: "name",
      header: "Nombre",
      sortable: true,
      render: (row: Project) => (
        <span className="font-medium text-navy">{row.name}</span>
      ),
    },
    {
      key: "status",
      header: "Estado",
      sortable: true,
      render: (row: Project) => <ProjectStatusBadge status={row.status} />,
    },
    {
      key: "total_units",
      header: "Unidades",
      sortable: true,
      render: (row: Project) => <span>{row.total_units}</span>,
    },
    {
      key: "currency",
      header: "Moneda",
      sortable: true,
      render: (row: Project) => <span>{row.currency}</span>,
    },
    {
      key: "is_published",
      header: "Publicado",
      sortable: true,
      render: (row: Project) => (
        <Badge variant={row.is_published ? "success" : "default"}>
          {row.is_published ? "Sí" : "No"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      render: (row: Project) => (
        <Link
          href={`/admin/proyectos/${row.id}`}
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
            Proyectos
          </h1>
          <p className="mt-1 text-sm text-gray">
            Gestiona todos los proyectos inmobiliarios.
          </p>
        </div>
        <Link href="/admin/proyectos/nuevo">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Proyecto
          </Button>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={projects}
        searchPlaceholder="Buscar por nombre..."
        searchKeys={["name"]}
        onRowClick={(row) => router.push(`/admin/proyectos/${row.id}`)}
        emptyMessage="No hay proyectos registrados."
      />
    </div>
  );
}
