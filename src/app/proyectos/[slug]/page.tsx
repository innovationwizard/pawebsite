import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { ProjectHero } from "@/components/projects/project-hero";
import { ProjectOverview } from "@/components/projects/project-overview";
import { UnitTypesTable } from "@/components/projects/unit-types-table";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { FinancialSummary } from "@/components/projects/financial-summary";
import { ProjectLocationMap } from "@/components/projects/project-location-map";
import { ProjectCTA } from "@/components/projects/project-cta";
import { getPublishedProjectSlugs, getProjectBySlug, getProjectUnitTypes } from "@/lib/queries/projects";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return await getPublishedProjectSlugs();
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Proyecto no encontrado" };
  }

  return {
    title: project.meta_title ?? project.name,
    description:
      project.meta_description ??
      `${project.name} — ${project.total_units} unidades${project.location_description ? ` en ${project.location_description}` : ""}. ${project.starting_price_display ? `Desde ${project.starting_price_display}.` : ""}`,
    openGraph: {
      title: project.meta_title ?? project.name,
      description: project.meta_description ?? project.description ?? undefined,
      images: project.og_image_url ?? project.hero_image_url ?? undefined,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const unitTypes = await getProjectUnitTypes(project.id);

  // Gallery images are from Supabase Storage — placeholder until images are uploaded
  const galleryImages: { url: string; alt: string }[] = [];

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <ProjectHero
          name={project.name}
          hero_image_url={project.hero_image_url}
          logo_url={project.logo_url}
          status={project.status}
          location_description={project.location_description}
        />

        <ProjectOverview project={project} />

        <UnitTypesTable unitTypes={unitTypes} currency={project.currency} />

        <ProjectGallery images={galleryImages} />

        <FinancialSummary project={project} />

        <ProjectLocationMap
          latitude={project.latitude}
          longitude={project.longitude}
          name={project.name}
          location_description={project.location_description}
        />

        <ProjectCTA projectName={project.name} />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
