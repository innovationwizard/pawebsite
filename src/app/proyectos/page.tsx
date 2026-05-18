import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { ProjectsListing } from "./projects-listing";
import { getPublishedProjects, getProjectZones } from "@/lib/queries/projects";

export const metadata: Metadata = {
  title: "Proyectos y Propiedades",
  description:
    "Explora nuestro portafolio de proyectos y propiedades inmobiliarias en Guatemala. Apartamentos, casas, terrenos y espacios comerciales de alta calidad.",
};

export default async function ProyectosPage() {
  const [projects, zones] = await Promise.all([
    getPublishedProjects(),
    getProjectZones(),
  ]);

  return (
    <>
      <Navbar solid />
      <main className="flex-1 pt-24">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h1 className="font-heading text-4xl font-bold text-navy md:text-5xl">
            Proyectos y Propiedades
          </h1>
          <p className="mt-4 text-lg text-gray">
            Descubre las mejores opciones de inversión inmobiliaria en Guatemala.
          </p>

          <ProjectsListing
            zones={zones}
            projects={projects.map((p) => ({
              slug: p.slug,
              name: p.name,
              hero_image_url: p.hero_image_url,
              starting_price_display: p.starting_price_display,
              starting_price: p.starting_price,
              location_description: p.location_description,
              zone: p.zone ?? null,
              status: p.status,
              bedroom_range: p.bedroom_range,
              total_units: p.total_units,
              project_type: p.project_type,
            }))}
          />
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
