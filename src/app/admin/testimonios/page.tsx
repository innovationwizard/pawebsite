"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Database } from "@/lib/types/database";

type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];
type Project = Database["public"]["Tables"]["projects"]["Row"];

interface TestimonialWithProject extends Testimonial {
  project_name: string;
}

export default function AdminTestimoniosPage() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<TestimonialWithProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      const [testimonialsRes, projectsRes] = await Promise.all([
        supabase.from("testimonials").select("*").order("sort_order"),
        supabase.from("projects").select("id,name"),
      ]);

      const projectsMap = new Map<string, string>();
      ((((projectsRes as any).data) as Pick<Project, "id" | "name">[]) ?? []).forEach((p) => {
        projectsMap.set(p.id, p.name);
      });

      const data: TestimonialWithProject[] = ((((testimonialsRes as any).data) as Testimonial[]) ?? []).map((t) => ({
        ...t,
        project_name: t.project_id ? projectsMap.get(t.project_id) ?? "—" : "—",
      }));

      setTestimonials(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const columns = [
    {
      key: "client_name",
      header: "Cliente",
      sortable: true,
      render: (row: TestimonialWithProject) => (
        <span className="font-medium text-navy">{row.client_name}</span>
      ),
    },
    {
      key: "project_name",
      header: "Proyecto",
      sortable: true,
      render: (row: TestimonialWithProject) => (
        <span className="text-gray">{row.project_name}</span>
      ),
    },
    {
      key: "rating",
      header: "Calificación",
      sortable: true,
      render: (row: TestimonialWithProject) => (
        <div className="flex items-center gap-1">
          {row.rating !== null ? (
            <>
              {Array.from({ length: row.rating }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              ))}
              <span className="ml-1 text-xs text-gray">{row.rating}/5</span>
            </>
          ) : (
            <span className="text-xs text-gray">—</span>
          )}
        </div>
      ),
    },
    {
      key: "is_published",
      header: "Publicado",
      sortable: true,
      render: (row: TestimonialWithProject) => (
        <Badge variant={row.is_published ? "success" : "default"}>
          {row.is_published ? "Sí" : "No"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      render: (row: TestimonialWithProject) => (
        <Link
          href={`/admin/testimonios/${row.id}`}
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
            Testimonios
          </h1>
          <p className="mt-1 text-sm text-gray">
            Gestiona los testimonios de clientes.
          </p>
        </div>
        <Link href="/admin/testimonios/nuevo">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Testimonio
          </Button>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={testimonials}
        searchPlaceholder="Buscar por nombre de cliente..."
        searchKeys={["client_name"]}
        onRowClick={(row) => router.push(`/admin/testimonios/${row.id}`)}
        emptyMessage="No hay testimonios registrados."
      />
    </div>
  );
}
