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

type Article = Database["public"]["Tables"]["news_articles"]["Row"];
type Category = Database["public"]["Tables"]["news_categories"]["Row"];

interface ArticleWithCategory extends Article {
  category_name?: string;
}

export default function AdminNoticiasPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<ArticleWithCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      const [articlesRes, categoriesRes] = await Promise.all([
        supabase.from("news_articles").select("*").order("created_at", { ascending: false }),
        supabase.from("news_categories").select("*"),
      ]);

      const categoriesMap = new Map<string, string>();
      ((((categoriesRes as any).data) as Category[]) ?? []).forEach((c) => {
        categoriesMap.set(c.id, c.name);
      });

      const articlesWithCat: ArticleWithCategory[] = ((((articlesRes as any).data) as Article[]) ?? []).map((a) => ({
        ...a,
        category_name: a.category_id ? categoriesMap.get(a.category_id) ?? "Sin categoría" : "Sin categoría",
      }));

      setArticles(articlesWithCat);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const columns = [
    {
      key: "title",
      header: "Título",
      sortable: true,
      render: (row: ArticleWithCategory) => (
        <span className="font-medium text-navy">{row.title}</span>
      ),
    },
    {
      key: "category_name",
      header: "Categoría",
      sortable: true,
      render: (row: ArticleWithCategory) => (
        <Badge variant="info">{row.category_name}</Badge>
      ),
    },
    {
      key: "is_published",
      header: "Publicado",
      sortable: true,
      render: (row: ArticleWithCategory) => (
        <Badge variant={row.is_published ? "success" : "default"}>
          {row.is_published ? "Sí" : "No"}
        </Badge>
      ),
    },
    {
      key: "published_at",
      header: "Fecha",
      sortable: true,
      render: (row: ArticleWithCategory) => (
        <span className="text-gray">
          {row.published_at
            ? new Date(row.published_at).toLocaleDateString("es-GT")
            : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      render: (row: ArticleWithCategory) => (
        <Link
          href={`/admin/noticias/${row.id}`}
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
            Noticias
          </h1>
          <p className="mt-1 text-sm text-gray">
            Gestiona los artículos del blog.
          </p>
        </div>
        <Link href="/admin/noticias/nuevo">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Artículo
          </Button>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={articles}
        searchPlaceholder="Buscar por título..."
        searchKeys={["title"]}
        onRowClick={(row) => router.push(`/admin/noticias/${row.id}`)}
        emptyMessage="No hay artículos registrados."
      />
    </div>
  );
}
