import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { OutlineText } from "@/components/ui/outline-text";
import { ProjectCard } from "@/components/projects/project-card";
import type { ProjectStatus } from "@/lib/types/database";

export interface ShowcaseProject {
  slug: string;
  name: string;
  hero_image_url: string | null;
  starting_price_display: string | null;
  location_description: string | null;
  status: ProjectStatus;
  bedroom_range: string | null;
  total_units: number;
  project_type: string;
  category_tag: string | null;
}

interface ServiciosShowcaseProps {
  projects: ShowcaseProject[];
}

/** "Estos proyectos ya confiaron en el método Puerta Abierta." */
export function ServiciosShowcase({ projects }: ServiciosShowcaseProps) {
  if (projects.length === 0) return null;

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal variant="fade-up">
          <SectionHeading
            eyebrow="Casos reales"
            title={
              <>
                Estos proyectos ya confiaron en el{" "}
                <OutlineText>método Puerta Abierta</OutlineText>.
              </>
            }
            lead="Desarrollos que hoy se comercializan con nuestro equipo de marketing, ventas y tecnología."
          />
        </ScrollReveal>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project, index) => (
            <ScrollReveal key={project.slug} variant="fade-up" delay={index * 0.1}>
              <ProjectCard {...project} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
