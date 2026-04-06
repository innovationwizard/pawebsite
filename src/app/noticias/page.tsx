import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { ArticleCard } from "@/components/news/article-card";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { getPublishedArticles } from "@/lib/queries/articles";

export const metadata: Metadata = {
  title: "Noticias",
  description: "Últimas noticias y novedades de Puerta Abierta Inmobiliaria.",
};

export default async function NoticiasPage() {
  const articles = await getPublishedArticles();

  return (
    <>
      <Navbar solid />
      <main className="flex-1 pt-24">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h1 className="font-heading text-4xl font-bold text-navy md:text-5xl">
            Noticias
          </h1>
          <p className="mt-4 text-lg text-gray">
            Entérate de nuestros últimos lanzamientos y novedades.
          </p>

          {articles.length === 0 ? (
            <p className="mt-16 text-center text-gray/40">
              Próximamente publicaremos noticias y novedades.
            </p>
          ) : (
            <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, index) => (
                <ScrollReveal key={article.slug} variant="fade-up" delay={index * 0.1}>
                  <ArticleCard
                    slug={article.slug}
                    title={article.title}
                    excerpt={article.excerpt}
                    cover_image_url={article.cover_image_url}
                    published_at={article.published_at}
                    category_name={article.category_name}
                  />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
