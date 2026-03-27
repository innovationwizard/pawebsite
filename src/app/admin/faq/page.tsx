"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { createFaqCategory } from "@/lib/actions/faqs";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { Database } from "@/lib/types/database";

type Faq = Database["public"]["Tables"]["faqs"]["Row"];
type FaqCategory = Database["public"]["Tables"]["faq_categories"]["Row"];

interface FaqWithCategory extends Faq {
  category_name: string;
}

export default function AdminFaqPage() {
  const router = useRouter();
  const [faqs, setFaqs] = useState<FaqWithCategory[]>([]);
  const [categories, setCategories] = useState<FaqCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const supabase = createClient();

    const [faqsRes, categoriesRes] = await Promise.all([
      supabase.from("faqs").select("*").order("sort_order"),
      supabase.from("faq_categories").select("*").order("sort_order"),
    ]);

    const cats = ((categoriesRes as any).data as FaqCategory[]) ?? [];
    setCategories(cats);

    const categoriesMap = new Map<string, string>();
    cats.forEach((c) => {
      categoriesMap.set(c.id, c.name);
    });

    const faqsWithCat: FaqWithCategory[] = ((((faqsRes as any).data) as Faq[]) ?? []).map((f) => ({
      ...f,
      category_name: f.category_id ? categoriesMap.get(f.category_id) ?? "Sin categoría" : "Sin categoría",
    }));

    setFaqs(faqsWithCat);
    setIsLoading(false);
  }

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault();
    setCategoryError("");
    setIsSavingCategory(true);

    const result = await createFaqCategory({
      name: newCategoryName,
      sort_order: categories.length,
    });

    if (result.error) {
      setCategoryError(result.error);
      setIsSavingCategory(false);
      return;
    }

    setNewCategoryName("");
    setShowCategoryForm(false);
    setIsSavingCategory(false);
    await fetchData();
  }

  const columns = [
    {
      key: "question",
      header: "Pregunta",
      sortable: true,
      render: (row: FaqWithCategory) => (
        <span className="font-medium text-navy line-clamp-2">{row.question}</span>
      ),
    },
    {
      key: "category_name",
      header: "Categoría",
      sortable: true,
      render: (row: FaqWithCategory) => (
        <Badge variant="info">{row.category_name}</Badge>
      ),
    },
    {
      key: "is_published",
      header: "Publicado",
      sortable: true,
      render: (row: FaqWithCategory) => (
        <Badge variant={row.is_published ? "success" : "default"}>
          {row.is_published ? "Sí" : "No"}
        </Badge>
      ),
    },
    {
      key: "sort_order",
      header: "Orden",
      sortable: true,
      render: (row: FaqWithCategory) => (
        <span className="text-gray">{row.sort_order}</span>
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      render: (row: FaqWithCategory) => (
        <Link
          href={`/admin/faq/${row.id}`}
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
            Preguntas Frecuentes
          </h1>
          <p className="mt-1 text-sm text-gray">
            Gestiona las preguntas frecuentes y sus categorías.
          </p>
        </div>
        <Link href="/admin/faq/nuevo">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Pregunta
          </Button>
        </Link>
      </div>

      {/* Categorías */}
      <section className="mb-8 rounded-2xl border border-gray/10 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg font-semibold text-navy">
            Categorías
          </h2>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowCategoryForm(!showCategoryForm)}
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            Nueva Categoría
          </Button>
        </div>

        {showCategoryForm && (
          <form onSubmit={handleCreateCategory} className="mb-4 flex gap-3 items-end">
            <div className="flex-1">
              <Input
                id="new_category"
                label="Nombre de categoría"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
              />
            </div>
            <Button type="submit" size="sm" isLoading={isSavingCategory}>
              Guardar
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                setShowCategoryForm(false);
                setNewCategoryName("");
              }}
            >
              Cancelar
            </Button>
          </form>
        )}

        {categoryError && (
          <p className="mb-3 text-sm text-red-600">{categoryError}</p>
        )}

        <div className="flex flex-wrap gap-2">
          {categories.length === 0 ? (
            <p className="text-sm text-gray/50">No hay categorías creadas.</p>
          ) : (
            categories.map((cat) => (
              <Badge key={cat.id} variant="info">
                {cat.name}
              </Badge>
            ))
          )}
        </div>
      </section>

      {/* FAQ Table */}
      <DataTable
        columns={columns}
        data={faqs}
        searchPlaceholder="Buscar por pregunta..."
        searchKeys={["question"]}
        onRowClick={(row) => router.push(`/admin/faq/${row.id}`)}
        emptyMessage="No hay preguntas frecuentes registradas."
      />
    </div>
  );
}
