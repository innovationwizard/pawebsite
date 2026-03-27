"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils/format-date";

interface ArticleCardProps {
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  category_name: string | null;
}

export function ArticleCard({
  slug,
  title,
  excerpt,
  cover_image_url,
  published_at,
  category_name,
}: ArticleCardProps) {
  return (
    <Link
      href={`/noticias/${slug}`}
      className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
    >
      <div className="relative aspect-[3/2] overflow-hidden">
        {cover_image_url ? (
          <Image
            src={cover_image_url}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.07]"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
