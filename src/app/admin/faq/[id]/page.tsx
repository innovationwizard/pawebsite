"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { createFaq, updateFaq, deleteFaq } from "@/lib/actions/faqs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import type { Database } from "@/lib/types/database";

type Faq = Database["public"]["Tables"]["faqs"]["Row"];
type FaqCategory = Database["public"]["Tables"]["faq_categories"]["Row"];

export default function EditarFaqPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "nuevo";

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!isNew);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [categories, setCategories] = useState<FaqCategory[]>([]);

  const [categoryId, setCategoryId] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [sortOrder, setSortOrder] = useState("0");

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      const { data: categoriesData } = await supabase
        .from("faq_categories")
        .select("*")
        .order("sort_order");
      setCategories((categoriesData as FaqCategory[]) ?? []);

      if (!isNew) {
        const { data } = await supabase
          .from("faqs")
          .select("*")
          .eq("id", id)
          .single();

        if (!data) {
          router.push("/admin/faq");
          return;
        }

        const faq = data as Faq;
        setCategoryId(faq.category_id ?? "");
        setQuestion(faq.question);
        setAnswer(faq.answer);
        setIsPublished(faq.is_published);
        setSortOrder(faq.sort_order.toString());
        setIsFetching(false);
      }
    }
    fetchData();
  }, [id, isNew, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    const data = {
      category_id: categoryId || null,
      question,
      answer,
      is_published: isPublished,
      sort_order: parseInt(sortOrder) || 0,
    };

    if (isNew) {
      const result = await createFaq(data);
      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }
      router.push("/admin/faq");
    } else {
      const result = await updateFaq(id, data);
      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }
      setSuccess("Pregunta actualizada correctamente.");
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("¿Estás seguro de que deseas eliminar esta pregunta? Esta acción no se puede deshacer.")) {
      return;
    }

    setIsLoading(true);
    const result = await deleteFaq(id);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    router.push("/admin/faq");
  }

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  if (isFetching) {
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
          <Link
            href="/admin/faq"
            className="inline-flex items-center text-sm text-gray hover:text-navy"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Volver a preguntas frecuentes
          </Link>
          <h1 className="mt-2 font-heading text-2xl font-bold text-navy">
            {isNew ? "Nueva Pregunta" : "Editar Pregunta"}
          </h1>
        </div>
        {!isNew && (
          <Button variant="ghost" onClick={handleDelete} className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="rounded-2xl border border-gray/10 bg-white p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold text-navy">
            Contenido de la Pregunta
          </h2>
          <div className="grid gap-4">
            <Select
              id="category_id"
              label="Categoría"
              options={categoryOptions}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              placeholder="Seleccionar categoría"
            />
            <Input
              id="question"
              label="Pregunta"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
            <Textarea
              id="answer"
              label="Respuesta"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={6}
              required
            />
            <Input
              id="sort_order"
              label="Orden"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-5 w-5 rounded border-gray/30 text-celeste focus:ring-celeste/20"
              />
              <span className="text-sm font-medium text-navy">
                Publicar pregunta
              </span>
            </label>
          </div>
        </section>

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl bg-green-50 p-4 text-sm text-green-600">
            {success}
          </div>
        )}

        <div className="flex gap-3">
          <Button type="submit" isLoading={isLoading}>
            {isNew ? "Crear Pregunta" : "Guardar Cambios"}
          </Button>
          <Link href="/admin/faq">
            <Button type="button" variant="ghost">
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
