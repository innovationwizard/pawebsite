import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { HomeStructuredData } from "@/components/layout/structured-data";
import { HeroVideo } from "@/components/landing/hero-video";
import { OutlineText } from "@/components/ui/outline-text";
import { ProjectLogosRibbon } from "@/components/landing/project-logos-ribbon";
import { ProjectShowcaseSlider } from "@/components/landing/project-showcase-slider";
import { TertiaryBanner } from "@/components/landing/tertiary-banner";
import { BrandHighlights } from "@/components/landing/brand-highlights";
import { WhyHowSection } from "@/components/landing/why-how-section";
import { ProjectBadges } from "@/components/landing/project-badges";
import { TechSection } from "@/components/landing/tech-section";
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
  getLicPuertasSettings,
  getHomepageSectionImages,
  parseHighlightValue,
} from "@/lib/queries/settings";

export default async function Home() {
  // Fetch all landing page data in parallel
  const [projects, articles, testimonials, heroVideoUrl, highlights, banner, licPuertas, sectionImages] =
    await Promise.all([
      getPublishedProjects(),
      getPublishedArticles(3),
      getPublishedTestimonials(),
      getHeroVideoUrl(),
      getBrandHighlights(),
      getTertiaryBanner(),
      getLicPuertasSettings(),
      getHomepageSectionImages(),
    ]);

  const highlightItems = highlights.map((h) => {
    const { prefix, end, suffix } = parseHighlightValue(h.value);
    return { value: end, prefix, suffix, label: h.label };
  });

  // Hero trust row: years + projects from the admin-managed highlights, plus
  // the live count of units across published projects. Anything missing is
  // simply omitted.
  const findHighlight = (keyword: string) =>
    highlights.find((h) => h.label.toLowerCase().includes(keyword));
  const yearsHighlight = findHighlight("años");
  const projectsHighlight = findHighlight("proyectos");
  const activeUnits = projects.reduce((sum, p) => sum + (p.total_units ?? 0), 0);
  const trustItems = [
    yearsHighlight ? `${yearsHighlight.value} años` : null,
    projectsHighlight ? `${projectsHighlight.value} proyectos` : null,
    activeUnits > 0 ? `${activeUnits.toLocaleString("es-GT")} unidades activas` : null,
  ].filter((item): item is string => item !== null);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* 1. Hero Video Section */}
        <HeroVideo
          videoUrl={heroVideoUrl || "https://www.youtube.com/watch?v=rutCVOOj4KQ"}
          eyebrow="Inmobiliaria · Guatemala · Grupo Orión"
          title={
            <>
              Tu hogar <OutlineText>ideal</OutlineText>
              <br />
              te <OutlineText>espera</OutlineText>
            </>
          }
          subtitle="Más de 22 años comercializando proyectos inmobiliarios de alta calidad en Guatemala. Acompañamos cada decisión, desde el primer recorrido hasta las llaves."
          ctaText="Conoce nuestros proyectos"
          ctaHref="/proyectos"
          secondaryCtaText="Cotiza ahora"
          secondaryCtaHref="/cotizador"
          trustItems={trustItems}
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
          teamImageUrl={sectionImages?.team_image_url ?? null}
          capsula1Url={sectionImages?.capsula_1_url ?? null}
          capsula2Url={sectionImages?.capsula_2_url ?? null}
          capsula3Url={sectionImages?.capsula_3_url ?? null}
        />

        {/* 7. Project Badges (Insignias) */}
        <ProjectBadges />

        {/* 8. Technology Section */}
        <TechSection
          licPuertasPhotoUrl={licPuertas?.photo_url ?? null}
          licPuertasName={licPuertas?.name ?? "Lic. Puertas"}
          licPuertasTitle={licPuertas?.title ?? "Asesor Senior"}
        />

        {/* 9. News Capsules */}
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

        {/* 10. Testimonials Slider */}
        <TestimonialsSlider
          testimonials={testimonials.map((t) => ({
            id: t.id,
            client_name: t.client_name,
            client_title: t.client_title,
            content: t.content,
            rating: t.rating,
          }))}
        />

        {/* 11. Newsletter / Contact Form */}
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
