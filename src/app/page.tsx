import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { HomeStructuredData } from "@/components/layout/structured-data";
import { HeroVideo } from "@/components/landing/hero-video";
import { ProjectLogosRibbon } from "@/components/landing/project-logos-ribbon";
import { ProjectShowcaseSlider } from "@/components/landing/project-showcase-slider";
import { TertiaryBanner } from "@/components/landing/tertiary-banner";
import { BrandHighlights } from "@/components/landing/brand-highlights";
import { WhyHowSection } from "@/components/landing/why-how-section";
import { NewsCapsules } from "@/components/landing/news-capsules";
import { TestimonialsSlider } from "@/components/landing/testimonials-slider";
import { NewsletterForm } from "@/components/landing/newsletter-form";
import { getPublishedProjects } from "@/lib/queries/projects";
import { getPublishedArticles } from "@/lib/queries/articles";
import { getPublishedTestimonials } from "@/lib/queries/testimonials";
import {
  getHeroVideoUrl,
  getBrandHighlights,
  getTertiaryBanner,
} from "@/lib/queries/settings";

export default async function Home() {
  // Fetch all landing page data in parallel
  const [projects, articles, testimonials, heroVideoUrl, highlights, banner] =
    await Promise.all([
      getPublishedProjects(),
      getPublishedArticles(3),
      getPublishedTestimonials(),
      getHeroVideoUrl(),
      getBrandHighlights(),
      getTertiaryBanner(),
    ]);

  const highlightItems = highlights
    ? [
        {
          value: highlights.projects_count,
          prefix: "+",
          suffix: "",
          label: "Proyectos Desarrollados",
        },
        {
          value: highlights.sqm_developed,
          prefix: "",
          suffix: "",
          label: "Mil m² Desarrollados",
        },
        {
          value: highlights.years_experience,
          prefix: "+",
          suffix: "",
          label: "Años de Experiencia",
        },
        {
          value: highlights.historical_sales_millions,
          prefix: "$",
          suffix: "M",
          label: "Millones Históricos",
        },
      ]
    : [];

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* 1. Hero Video Section */}
        <HeroVideo
          videoUrl={heroVideoUrl}
          title="Tu hogar ideal te espera"
          subtitle="Más de 22 años desarrollando proyectos inmobiliarios de alta calidad en Guatemala."
          ctaText="Conoce Nuestros Proyectos"
          ctaHref="/proyectos"
        />

        {/* 2. Project Logos Ribbon */}
        <ProjectLogosRibbon
          projects={projects.map((p) => ({
            slug: p.slug,
            name: p.name,
            logo_url: p.logo_url,
          }))}
        />

        {/* 3. Project Showcase Slider */}
        <ProjectShowcaseSlider
          projects={projects.map((p) => ({
            slug: p.slug,
            name: p.name,
            hero_image_url: p.hero_image_url,
            starting_price_display: p.starting_price_display,
            location_description: p.location_description,
            status: p.status,
            bedroom_range: p.bedroom_range,
            total_units: p.total_units,
          }))}
        />

        {/* 4. Tertiary Banner */}
        <TertiaryBanner
          imageUrl={banner?.image_url ?? null}
          title={banner?.title ?? "Invierte en tu futuro"}
          ctaText={banner?.cta_text ?? "Contáctanos"}
          ctaLink={banner?.cta_link ?? "#contacto"}
        />

        {/* 5. Brand Highlights */}
        <BrandHighlights items={highlightItems} />

        {/* 6. Why / How Section */}
        <WhyHowSection
          whyTitle="¿Por qué hacemos lo que hacemos?"
          whyDescription="Creemos que todos merecen un hogar de calidad. Nuestra pasión por la excelencia impulsa cada proyecto, creando comunidades donde las familias guatemaltecas pueden crecer y prosperar."
          howTitle="¿Cómo lo hacemos?"
          steps={[]}
        />

        {/* 7. News Capsules */}
        <NewsCapsules
          articles={articles.map((a) => ({
            slug: a.slug,
            title: a.title,
            excerpt: a.excerpt,
            cover_image_url: a.cover_image_url,
            published_at: a.published_at,
            category_name: a.category_name,
          }))}
        />

        {/* 8. Testimonials Slider */}
        <TestimonialsSlider
          testimonials={testimonials.map((t) => ({
            id: t.id,
            client_name: t.client_name,
            client_title: t.client_title,
            content: t.content,
            rating: t.rating,
          }))}
        />

        {/* 9. Newsletter / Contact Form */}
        <NewsletterForm
          projects={projects.map((p) => ({
            id: p.id,
            name: p.name,
          }))}
        />
      </main>
      <Footer />
      <WhatsAppButton />
      <HomeStructuredData />
    </>
  );
}
