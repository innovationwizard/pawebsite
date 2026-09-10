import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { SectionHeading } from "@/components/ui/section-heading";
import { OutlineText } from "@/components/ui/outline-text";
import { BlogListing } from "@/components/news/blog-listing";
import { getPublishedArticles, getNewsCategories } from "@/lib/queries/articles";
import { getYouTubeVideos } from "@/lib/queries/youtube";

export const metadata: Metadata = {
  title: "Blog y Noticias",
  description:
    "Artículos, guías y videos sobre inversión inmobiliaria, financiamiento y proyectos en Guatemala.",
};

export default async function NoticiasPage() {
  const [articles, categories, videos] = await Promise.all([
    getPublishedArticles(),
    getNewsCategories(),
    getYouTubeVideos(12),
  ]);

  return (
    <>
      <Navbar solid />
      <main className="flex-1 pt-24">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <SectionHeading
            as="h1"
            size="lg"
            eyebrow="Blog y noticias"
            title={
              <>
                Guías, artículos y <OutlineText>novedades</OutlineText>.
              </>
            }
            lead="Guías, artículos y videos sobre inversión inmobiliaria en Guatemala."
          />

          <BlogListing
            articles={articles.map((a) => ({
              slug: a.slug,
              title: a.title,
              excerpt: a.excerpt,
              cover_image_url: a.cover_image_url,
              published_at: a.published_at,
              category_name: a.category_name,
              category_id: a.category_id,
            }))}
            categories={categories}
            videos={videos}
          />
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
