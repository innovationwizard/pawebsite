import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { ArticleContent } from "@/components/news/article-content";
import { getPublishedArticleSlugs, getArticleBySlug } from "@/lib/queries/articles";
import { formatDate } from "@/lib/utils/format-date";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return await getPublishedArticleSlugs();
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Artículo no encontrado" };
  }

  return {
    title: article.meta_title ?? article.title,
    description: article.meta_description ?? article.excerpt ?? undefined,
    openGraph: {
      title: article.meta_title ?? article.title,
      description: article.meta_description ?? article.excerpt ?? undefined,
      images: article.og_image_url ?? article.cover_image_url ?? undefined,
      type: "article",
      publishedTime: article.published_at ?? undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24">
        {/* Cover image */}
        {article.cover_image_url && (
          <div className="relative mx-auto max-w-5xl px-6">
            <div className="relative aspect-[2/1] overflow-hidden rounded-2xl">
              <Image
                src={article.cover_image_url}
                alt={article.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          </div>
        )}

        <article className="mx-auto max-w-3xl px-6 py-12">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 text-sm text-gray transition-colors hover:text-navy"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Noticias
          </Link>

          <div className="mt-6">
            {article.category_name && (
              <span className="rounded-full bg-celeste/10 px-3 py-1 text-xs font-medium text-celeste">
                {article.category_name}
              </span>
            )}

            <h1 className="mt-4 font-heading text-3xl font-bold text-navy md:text-4xl lg:text-5xl">
              {article.title}
            </h1>

            <div className="mt-4 flex items-center gap-4 text-sm text-gray">
              {article.published_at && (
                <time dateTime={article.published_at}>
                  {formatDate(article.published_at)}
                </time>
              )}
              {article.author_name && (
                <>
                  <span className="text-gray/30">·</span>
                  <span>{article.author_name}</span>
                </>
              )}
            </div>
          </div>

          <div className="mt-10">
            <ArticleContent content={article.content} />
          </div>
        </article>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
