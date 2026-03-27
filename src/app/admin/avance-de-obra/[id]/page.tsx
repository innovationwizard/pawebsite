"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  createProgressEntry,
  updateProgressEntry,
  deleteProgressEntry,
  addProgressPhoto,
  deleteProgressPhoto,
} from "@/lib/actions/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { ImageUploader } from "@/components/admin/image-uploader";
import type { Database } from "@/lib/types/database";

type ProgressEntry = Database["public"]["Tables"]["construction_progress"]["Row"];
type ProgressPhoto = Database["public"]["Tables"]["construction_progress_photos"]["Row"];
type Project = Database["public"]["Tables"]["projects"]["Row"];

export default function EditarAvancePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "nuevo";

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!isNew);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [projects, setProjects] = useState<Pick<Project, "id" | "name">[]>([]);
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);

  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [progressPercent, setProgressPercent] = useState("0");
  const [entryDate, setEntryDate] = useState(new Date().toISOString().slice(0, 10));
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      const { data: projectsData } = await supabase
        .from("projects")
        .select("id,name")
        .order("name");
      setProjects((projectsData as Pick<Project, "id" | "name">[]) ?? []);

      if (!isNew) {
        const [entryRes, photosRes] = await Promise.all([
          supabase.from("construction_progress").select("*").eq("id", id).single(),
          supabase
            .from("construction_progress_photos")
            .select("*")
            .eq("progress_id", id)
            .order("sort_order"),
        ]);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(entryRes as any).data) {
          router.push("/admin/avance-de-obra");
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const entry = (entryRes as any).data as ProgressEntry;
        setProjectId(entry.project_id);
        setTitle(entry.title);
        setDescription(entry.description ?? "");
        setProgressPercent(entry.progress_percent?.toString() ?? "0");
        setEntryDate(entry.entry_date);
        setIsPublished(entry.is_published);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setPhotos(((photosRes as any).data as ProgressPhoto[]) ?? []);
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
      project_id: projectId,
      title,
      description: description || null,
      progress_percent: parseInt(progressPercent) || 0,
      entry_date: entryDate,
      is_published: isPublished,
    };

    if (isNew) {
      const result = await createProgressEntry(data);
      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }
      router.push("/admin/avance-de-obra");
    } else {
      const result = await updateProgressEntry(id, data);
      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }
      setSuccess("Entrada actualizada correctamente.");
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("¿Estás seguro de que deseas eliminar esta entrada? Esta acción no se puede deshacer.")) {
      return;
    }

    setIsLoading(true);
    const result = await deleteProgressEntry(id);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    router.push("/admin/avance-de-obra");
  }

  async function handlePhotoUpload(url: string) {
    const result = await addProgressPhoto({
      progress_id: id,
      photo_url: url,
      sort_order: photos.length,
    });

    if (result.error) {
      setError(result.error);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((result as any).data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setPhotos((prev) => [...prev, (result as any).data as ProgressPhoto]);
    }
  }

  async function handlePhotoDelete(photoId: string) {
    if (!confirm("¿Eliminar esta foto?")) return;

    const result = await deleteProgressPhoto(photoId);

    if (result.error) {
      setError(result.error);
      return;
    }

    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  }

  const projectOptions = projects.map((p) => ({
    value: p.id,
    label: p.name,
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
            href="/admin/avance-de-obra"
            className="inline-flex items-center text-sm text-gray hover:text-navy"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Volver a avance de obra
          </Link>
          <h1 className="mt-2 font-heading text-2xl font-bold text-navy">
            {isNew ? "Nueva Entrada de Avance" : "Editar Entrada de Avance"}
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
        {/* Información */}
        <section className="rounded-2xl border border-gray/10 bg-white p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold text-navy">
            Información de la Entrada
          </h2>
          <div className="grid gap-4">
            <Select
              id="project_id"
              label="Proyecto"
              options={projectOptions}
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="Seleccionar proyecto"
              required
            />
            <Input
              id="title"
              label="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Textarea
              id="description"
              label="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-navy">
                  Porcentaje de avance: {progressPercent}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={progressPercent}
                  onChange={(e) => setProgressPercent(e.target.value)}
                  className="w-full accent-celeste"
                />
                <div className="mt-1 flex justify-between text-xs text-gray">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
              <Input
                id="entry_date"
                label="Fecha de entrada"
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                required
              />
            </div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-5 w-5 rounded border-gray/30 text-celeste focus:ring-celeste/20"
              />
              <span className="text-sm font-medium text-navy">
                Publicar entrada
              </span>
            </label>
          </div>
        </section>

        {/* Fotos - solo para edición */}
        {!isNew && (
          <section className="rounded-2xl border border-gray/10 bg-white p-6">
            <h2 className="mb-4 font-heading text-lg font-semibold text-navy">
              Fotos de Avance
            </h2>

            {photos.length > 0 && (
              <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <Image
                      src={photo.photo_url}
                      alt={photo.caption ?? "Foto de avance"}
                      width={200}
                      height={150}
                      className="h-32 w-full rounded-xl object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handlePhotoDelete(photo.id)}
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                      aria-label="Eliminar foto"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <ImageUploader
              bucket="construction-progress"
              currentUrl={null}
              onUpload={handlePhotoUpload}
              onRemove={() => {}}
              label="Agregar foto"
            />
          </section>
        )}

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
            {isNew ? "Crear Entrada" : "Guardar Cambios"}
          </Button>
          <Link href="/admin/avance-de-obra">
            <Button type="button" variant="ghost">
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
