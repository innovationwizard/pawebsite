"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { formatDate } from "@/lib/utils/format-date";

interface NewsArticle {
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  category_name: string | null;
}

interface NewsCapsuleProps {
  articles: NewsArticle[];
}

export function NewsCapsules({ articles }: NewsCapsuleProps) {
  if (articles.length === 0) return null;

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal variant="fade-up">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-heading text-3xl font-bold text-navy md:text-4xl lg:text-5xl">
                Noticias
              </h2>
              <p className="mt-3 text-lg text-gray">
                Entérate de nuestros últimos lanzamientos y novedades.
              </p>
            </div>
            <Link
              href="/noticias"
              className="hidden items-center gap-2 text-sm font-medium text-celeste transition-colors hover:text-celeste/80 md:inline-flex"
            >
              Ver todas
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {articles.map((article, index) => (
            <ScrollReveal
              key={article.slug}
              variant="fade-up"
              delay={index * 0.1}
            >
              <Link
                href={`/noticias/${article.slug}`}
                className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
              >
                <div className="relative aspect-[3/2] overflow-hidden">
                  {article.cover_image_url ? (
                    <Image
                      src={article.cover_image_url}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.07]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-navy/5">
                      <span className="text-xs text-gray/40">
                        [ Imagen ]
                      </span>
                    </div>
                  )}
                  {article.category_name && (
                    <div className="absolute left-4 top-4">
                      <span className="rounded-full bg-navy/80 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        {article.category_name}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  {article.published_at && (
                    <p className="text-xs text-gray">
                      {formatDate(article.published_at)}
                    </p>
                  )}
                  <h3 className="mt-2 font-heading text-lg font-bold text-navy line-clamp-2 transition-colors group-hover:text-celeste">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="mt-2 text-sm text-gray line-clamp-3">
                      {article.excerpt}
                    </p>
                  )}
                  <motion.span
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-celeste"
                    whileHover={{ x: 4 }}
                  >
                    Leer más
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 text-sm font-medium text-celeste"
          >
            Ver todas las noticias
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
