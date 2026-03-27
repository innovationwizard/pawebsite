"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { createTestimonial, updateTestimonial, deleteTestimonial } from "@/lib/actions/testimonials";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { ImageUploader } from "@/components/admin/image-uploader";
import type { Database } from "@/lib/types/database";

type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];
type Project = Database["public"]["Tables"]["projects"]["Row"];

export default function EditarTestimonioPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "nuevo";

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!isNew);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [projects, setProjects] = useState<Pick<Project, "id" | "name">[]>([]);

  const [clientName, setClientName] = useState("");
  const [clientTitle, setClientTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState("5");
  const [projectId, setProjectId] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [sortOrder, setSortOrder] = useState("0");

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      const { data: projectsData } = await supabase
        .from("projects")
        .select("id,name")
        .order("name");
      setProjects((projectsData as Pick<Project, "id" | "name">[]) ?? []);

      if (!isNew) {
        const { data } = await supabase
          .from("testimonials")
          .select("*")
          .eq("id", id)
          .single();

        if (!data) {
          router.push("/admin/testimonios");
          return;
        }

        const t = data as Testimonial;
        setClientName(t.client_name);
        setClientTitle(t.client_title ?? "");
        setContent(t.content);
        setRating(t.rating?.toString() ?? "5");
        setProjectId(t.project_id ?? "");
        setAvatarUrl(t.avatar_url);
        setIsPublished(t.is_published);
        setSortOrder(t.sort_order.toString());
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
      client_name: clientName,
      client_title: clientTitle || null,
      content,
      rating: rating ? parseInt(rating) : null,
      project_id: projectId || null,
      avatar_url: avatarUrl,
      is_published: isPublished,
      sort_order: parseInt(sortOrder) || 0,
    };

    if (isNew) {
      const result = await createTestimonial(data);
      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }
      router.push("/admin/testimonios");
    } else {
      const result = await updateTestimonial(id, data);
      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }
      setSuccess("Testimonio actualizado correctamente.");
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("¿Estás seguro de que deseas eliminar este testimonio? Esta acción no se puede deshacer.")) {
      return;
    }

    setIsLoading(true);
    const result = await deleteTestimonial(id);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    router.push("/admin/testimonios");
  }

  const projectOptions = projects.map((p) => ({
    value: p.id,
    label: p.name,
  }));

  const ratingOptions = [
    { value: "1", label: "1 estrella" },
    { value: "2", label: "2 estrellas" },
    { value: "3", label: "3 estrellas" },
    { value: "4", label: "4 estrellas" },
    { value: "5", label: "5 estrellas" },
  ];

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
            href="/admin/testimonios"
            className="inline-flex items-center text-sm text-gray hover:text-navy"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Volver a testimonios
          </Link>
          <h1 className="mt-2 font-heading text-2xl font-bold text-navy">
            {isNew ? "Nuevo Testimonio" : "Editar Testimonio"}
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
            Información del Testimonio
          </h2>
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                id="client_name"
                label="Nombre del cliente"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
              />
              <Input
                id="client_title"
                label="Título / cargo"
                value={clientTitle}
                onChange={(e) => setClientTitle(e.target.value)}
                placeholder="Propietario, Inversionista..."
              />
            </div>
            <Textarea
              id="content"
              label="Testimonio"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              required
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <Select
                id="rating"
                label="Calificación"
                options={ratingOptions}
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
              <Select
                id="project_id"
                label="Proyecto"
                options={projectOptions}
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="Seleccionar proyecto"
              />
              <Input
                id="sort_order"
                label="Orden"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray/10 bg-white p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold text-navy">
            Avatar del Cliente
          </h2>
          <ImageUploader
            bucket="testimonials"
            currentUrl={avatarUrl}
            onUpload={setAvatarUrl}
            onRemove={() => setAvatarUrl(null)}
            label="Foto del cliente"
          />
        </section>

        <section className="rounded-2xl border border-gray/10 bg-white p-6">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-5 w-5 rounded border-gray/30 text-celeste focus:ring-celeste/20"
            />
            <span className="text-sm font-medium text-navy">
              Publicar testimonio
            </span>
          </label>
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
            {isNew ? "Crear Testimonio" : "Guardar Cambios"}
          </Button>
          <Link href="/admin/testimonios">
            <Button type="button" variant="ghost">
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
