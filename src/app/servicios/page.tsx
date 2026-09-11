import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { ServiciosHero } from "@/components/servicios/servicios-hero";
import { ProjectLogosRibbon } from "@/components/landing/project-logos-ribbon";
import { ServiciosReasons } from "@/components/servicios/servicios-reasons";
import { ServiciosPillars } from "@/components/servicios/servicios-pillars";
import { ServiciosApproach } from "@/components/servicios/servicios-approach";
import { ServiciosKpis } from "@/components/servicios/servicios-kpis";
import { ServiciosShowcase } from "@/components/servicios/servicios-showcase";
import { ServiciosForm } from "@/components/servicios/servicios-form";
import { getPublishedProjects } from "@/lib/queries/projects";
import { getServiciosHero, getServiciosKpis } from "@/lib/queries/settings";
import {
  SERVICIOS_DEFAULT_KPIS,
  SERVICIOS_SHOWCASE_PROJECT_NAMES,
  SERVICIOS_WHATSAPP_TEXT,
} from "@/lib/constants/servicios";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://puertaabierta.com.gt";
const COMPANY_WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "50224249388";

export const metadata: Metadata = {
  title: "Marketing y Ventas para Desarrolladores Inmobiliarios | Puerta Abierta",
  description:
    "Marketing, ventas y tecnología para vender tu desarrollo inmobiliario en Guatemala. No contratas una agencia: sumas un equipo que ya vende. Performance marketing, fuerza comercial optimizada y CRM propio.",
  alternates: { canonical: `${SITE_URL}/servicios` },
  openGraph: {
    title: "Marketing y Ventas para Desarrolladores Inmobiliarios | Puerta Abierta",
    description:
      "Sumamos a tu proyecto un equipo de mercadeo y ventas que ya opera en el mercado guatemalteco.",
    url: `${SITE_URL}/servicios`,
    type: "website",
  },
};

export default async function ServiciosPage() {
  const [projects, hero, kpis] = await Promise.all([
    getPublishedProjects(),
    getServiciosHero(),
    getServiciosKpis(),
  ]);

  const whatsappHref = `https://wa.me/${COMPANY_WHATSAPP}?text=${encodeURIComponent(SERVICIOS_WHATSAPP_TEXT)}`;

  const showcaseNames = new Set(SERVICIOS_SHOWCASE_PROJECT_NAMES.map((n) => n.toLowerCase()));
  const showcaseProjects = projects
    .filter((p) => showcaseNames.has(p.name.toLowerCase()))
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      hero_image_url: p.hero_image_url,
      starting_price_display: p.starting_price_display,
      location_description: p.location_description,
      status: p.status,
      bedroom_range: p.bedroom_range,
      total_units: p.total_units,
      project_type: p.project_type,
      category_tag: p.category_tag ?? null,
    }));

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Marketing, ventas y tecnología para desarrolladores inmobiliarios",
    serviceType: "Comercialización de proyectos inmobiliarios",
    areaServed: { "@type": "Country", name: "Guatemala" },
    provider: {
      "@type": "RealEstateAgent",
      name: "Puerta Abierta Inmobiliaria",
      url: SITE_URL,
    },
    url: `${SITE_URL}/servicios`,
  };

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <ServiciosHero imageUrl={hero?.url || null} whatsappHref={whatsappHref} />
        <ProjectLogosRibbon
          projects={projects.map((p) => ({ slug: p.slug, name: p.name, logo_url: p.logo_url }))}
        />
        <ServiciosReasons />
        <ServiciosPillars />
        <ServiciosApproach />
        <ServiciosKpis kpis={kpis.length > 0 ? kpis : SERVICIOS_DEFAULT_KPIS} />
        <ServiciosShowcase projects={showcaseProjects} />
        <ServiciosForm whatsappHref={whatsappHref} />
      </main>
      <Footer />
      <WhatsAppButton phoneNumber={COMPANY_WHATSAPP} message={SERVICIOS_WHATSAPP_TEXT} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
    </>
  );
}
