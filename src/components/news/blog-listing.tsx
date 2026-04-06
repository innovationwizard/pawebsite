"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { formatDate } from "@/lib/utils/format-date";

interface Article {
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  category_name: string | null;
  category_id: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  duration: string | null;
}

interface BlogListingProps {
  articles: Article[];
  categories: Category[];
  videos: YouTubeVideo[];
}

type ActiveTab = "articulos" | "videos";

export function BlogListing({ articles, categories, videos }: BlogListingProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("articulos");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredArticles = activeCategory
    ? articles.filter((a) => a.category_id === activeCategory)
    : articles;

  return (
    <div className="mt-10 flex flex-col gap-10 lg:flex-row">
      {/* Sidebar */}
      <aside className="shrink-0 lg:w-64">
        <div className="sticky top-28">
          {/* Tabs */}
          <div className="flex gap-1 rounded-xl bg-gray/5 p-1">
            <button
              onClick={() => { setActiveTab("articulos"); setActiveCategory(null); }}
              className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                activeTab === "articulos"
                  ? "bg-white text-navy shadow-sm"
                  : "text-gray hover:text-navy"
              }`}
            >
              Artículos
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                activeTab === "videos"
                  ? "bg-white text-navy shadow-sm"
                  : "text-gray hover:text-navy"
              }`}
            >
              Videos
            </button>
          </div>

          {/* Category filters (articles only) */}
          {activeTab === "articulos" && categories.length > 0 && (
            <nav className="mt-6">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray/60">
                Categorías
              </h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setActiveCategory(null)}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                      activeCategory === null
                        ? "bg-celeste/10 text-celeste"
                        : "text-gray hover:bg-gray/5 hover:text-navy"
                    }`}
                  >
                    Todos
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                        activeCategory === cat.id
                          ? "bg-celeste/10 text-celeste"
                          : "text-gray hover:bg-gray/5 hover:text-navy"
                      }`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1">
        {activeTab === "articulos" && (
          <>
            {filteredArticles.length === 0 ? (
              <p className="py-16 text-center text-gray/40">
                No hay artículos en esta categoría.
              </p>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                {filteredArticles.map((article, index) => (
                  <ScrollReveal key={article.slug} variant="fade-up" delay={index * 0.05}>
                    <ArticleCard {...article} />
                  </ScrollReveal>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "videos" && (
          <>
            {videos.length === 0 ? (
              <p className="py-16 text-center text-gray/40">
                Próximamente publicaremos videos.
              </p>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                {videos.map((video, index) => (
                  <ScrollReveal key={video.id} variant="fade-up" delay={index * 0.05}>
                    <VideoCard {...video} />
                  </ScrollReveal>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- Article Card ---------- */
function ArticleCard({
  slug,
  title,
  excerpt,
  cover_image_url,
  published_at,
  category_name,
}: Article) {
  return (
    <Link
      href={`/noticias/${slug}`}
      className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {cover_image_url ? (
          <Image
            src={cover_image_url}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.07]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-navy/5">
            <span className="text-xs text-gray/40">[ Imagen ]</span>
          </div>
        )}
        {category_name && (
          <div className="absolute left-4 top-4">
            <span className="rounded-full bg-navy/80 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {category_name}
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        {published_at && (
          <p className="text-xs text-gray">{formatDate(published_at)}</p>
        )}
        <h3 className="mt-2 font-heading text-lg font-bold text-navy line-clamp-2 transition-colors group-hover:text-celeste">
          {title}
        </h3>
        {excerpt && (
          <p className="mt-2 text-sm text-gray line-clamp-3">{excerpt}</p>
        )}
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-celeste">
          Leer más
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

/* ---------- Video Card ---------- */
function VideoCard({ id, title, thumbnail, publishedAt, duration }: YouTubeVideo) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.07]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
            <Play className="h-6 w-6 text-navy ml-0.5" fill="currentColor" />
          </div>
        </div>
        {/* Duration badge */}
        {duration && (
          <div className="absolute bottom-3 right-3">
            <span className="rounded bg-black/80 px-2 py-0.5 text-xs font-medium text-white">
              {duration}
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        <p className="text-xs text-gray">{formatDate(publishedAt)}</p>
        <h3 className="mt-2 font-heading text-base font-bold text-navy line-clamp-2 transition-colors group-hover:text-celeste">
          {title}
        </h3>
      </div>
    </a>
  );
}
