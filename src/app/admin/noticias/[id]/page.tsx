"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { updateArticle, deleteArticle } from "@/lib/actions/articles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { ImageUploader } from "@/components/admin/image-uploader";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import type { Database, Json } from "@/lib/types/database";

type Article = Database["public"]["Tables"]["news_articles"]["Row"];
type Category = Database["public"]["Tables"]["news_categories"]["Row"];

export default function EditarArticuloPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState<Json>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [publishedAt, setPublishedAt] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [ogImageUrl, setOgImageUrl] = useState("");

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      const [articleRes, categoriesRes] = await Promise.all([
        supabase.from("news_articles").select("*").eq("id", id).single(),
        supabase.from("news_categories").select("*").order("name"),
      ]);

      setCategories(((categoriesRes as any).data as Category[]) ?? []);

      if (!articleRes.data) {
        router.push("/admin/noticias");
        return;
      }

      const a = (articleRes as any).data as Article;
      setTitle(a.title);
      setSlug(a.slug);
      setExcerpt(a.excerpt ?? "");
      setContent(a.content);
      setCoverImageUrl(a.cover_image_url);
      setCategoryId(a.category_id ?? "");
      setAuthorName(a.author_name ?? "");
      setIsPublished(a.is_published);
      setPublishedAt(a.published_at ? a.published_at.slice(0, 16) : "");
      setMetaTitle(a.meta_title ?? "");
      setMetaDescription(a.meta_description ?? "");
      setOgImageUrl(a.og_image_url ?? "");
      setIsFetching(false);
    }
    fetchData();
  }, [id, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    const result = await updateArticle(id, {
      title,
      slug,
      excerpt: excerpt || null,
      content: content ?? { type: "doc", content: [{ type: "paragraph" }] },
      cover_image_url: coverImageUrl,
      category_id: categoryId || null,
      author_name: authorName || null,
      is_published: isPublished,
      published_at: publishedAt || null,
      meta_title: metaTitle || null,
      meta_description: metaDescription || null,
      og_image_url: ogImageUrl || null,
    });

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    setSuccess("Artículo actualizado correctamente.");
    setIsLoading(false);
  }

  async function handleDelete() {
    if (!confirm("¿Estás seguro de que deseas eliminar este artículo? Esta acción no se puede deshacer.")) {
      return;
    }

    setIsLoading(true);
    const result = await deleteArticle(id);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    router.push("/admin/noticias");
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
            href="/admin/noticias"
            className="inline-flex items-center text-sm text-gray hover:text-navy"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Volver a noticias
          </Link>
          <h1 className="mt-2 font-heading text-2xl font-bold text-navy">
            Editar Artículo
          </h1>
        </div>
        <Button variant="ghost" onClick={handleDelete} className="text-red-600 hover:text-red-700 hover:bg-red-50">
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Información básica */}
        <section className="rounded-2xl border border-gray/10 bg-white p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold text-navy">
            Información del Artículo
          </h2>
          <div className="grid gap-4">
            <Input
              id="title"
              label="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Input
              id="slug"
              label="Slug (URL)"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                id="category_id"
                label="Categoría"
                options={categoryOptions}
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                placeholder="Seleccionar categoría"
              />
              <Input
                id="author_name"
                label="Autor"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
              />
            </div>
            <Textarea
              id="excerpt"
              label="Extracto"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              placeholder="Breve resumen del artículo..."
            />
          </div>
        </section>

        {/* Contenido */}
        <section className="rounded-2xl border border-gray/10 bg-white p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold text-navy">
            Contenido
          </h2>
          <RichTextEditor
            content={content}
            onChange={setContent}
            label="Contenido del artículo"
          />
        </section>

        {/* Imagen de portada */}
        <section className="rounded-2xl border border-gray/10 bg-white p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold text-navy">
            Imagen de Portada
          </h2>
          <ImageUploader
            bucket="news"
            currentUrl={coverImageUrl}
            onUpload={setCoverImageUrl}
            onRemove={() => setCoverImageUrl(null)}
            label="Imagen de portada"
          />
        </section>

        {/* Publicación */}
        <section className="rounded-2xl border border-gray/10 bg-white p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold text-navy">
            Publicación
          </h2>
          <div className="grid gap-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-5 w-5 rounded border-gray/30 text-celeste focus:ring-celeste/20"
              />
              <span className="text-sm font-medium text-navy">
                Publicar artículo
              </span>
            </label>
            <Input
              id="published_at"
              label="Fecha de publicación"
              type="datetime-local"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
            />
          </div>
        </section>

        {/* SEO */}
        <section className="rounded-2xl border border-gray/10 bg-white p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold text-navy">
            SEO
          </h2>
          <div className="grid gap-4">
            <Input
              id="meta_title"
              label="Meta título"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
            />
            <Textarea
              id="meta_description"
              label="Meta descripción"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={2}
            />
            <Input
              id="og_image_url"
              label="URL imagen OG"
              value={ogImageUrl}
              onChange={(e) => setOgImageUrl(e.target.value)}
            />
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
            Guardar Cambios
          </Button>
          <Link href="/admin/noticias">
            <Button type="button" variant="ghost">
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
