"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { createArticle } from "@/lib/actions/articles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { ImageUploader } from "@/components/admin/image-uploader";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import type { Database, Json } from "@/lib/types/database";

type Category = Database["public"]["Tables"]["news_categories"]["Row"];

export default function NuevoArticuloPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
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
    async function fetchCategories() {
      const supabase = createClient();
      const { data } = await supabase
        .from("news_categories")
        .select("*")
        .order("name");
      setCategories((data as Category[]) ?? []);
    }
    fetchCategories();
  }, []);

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function handleTitleChange(value: string) {
    setTitle(value);
    setSlug(generateSlug(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await createArticle({
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

    router.push("/admin/noticias");
  }

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/noticias"
          className="inline-flex items-center text-sm text-gray hover:text-navy"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Volver a noticias
        </Link>
        <h1 className="mt-2 font-heading text-2xl font-bold text-navy">
          Nuevo Artículo
        </h1>
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
              onChange={(e) => handleTitleChange(e.target.value)}
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

        <div className="flex gap-3">
          <Button type="submit" isLoading={isLoading}>
            Crear Artículo
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
