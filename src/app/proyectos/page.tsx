import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { ProjectsListing } from "./projects-listing";
import { getPublishedProjects } from "@/lib/queries/projects";

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Explora nuestro portafolio de proyectos inmobiliarios en Guatemala. Apartamentos, casas y espacios comerciales de alta calidad.",
};

export default async function ProyectosPage() {
  const projects = await getPublishedProjects();

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h1 className="font-heading text-4xl font-bold text-navy md:text-5xl">
            Nuestros Proyectos
          </h1>
          <p className="mt-4 text-lg text-gray">
            Descubre las mejores opciones de inversión inmobiliaria en Guatemala.
          </p>

          <ProjectsListing
            projects={projects.map((p) => ({
              slug: p.slug,
              name: p.name,
              hero_image_url: p.hero_image_url,
              starting_price_display: p.starting_price_display,
              location_description: p.location_description,
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
