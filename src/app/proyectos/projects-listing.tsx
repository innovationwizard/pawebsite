"use client";

import { ProjectCard } from "@/components/projects/project-card";
import { ProjectFilter, useProjectFilter } from "@/components/projects/project-filter";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import type { ProjectStatus } from "@/lib/types/database";

interface ProjectData {
  slug: string;
  name: string;
  hero_image_url: string | null;
  starting_price_display: string | null;
  location_description: string | null;
  status: ProjectStatus;
  bedroom_range: string | null;
  total_units: number;
  project_type: string;
}

interface ProjectsListingProps {
  projects: ProjectData[];
}

export function ProjectsListing({ projects }: ProjectsListingProps) {
  const { activeFilter, setActiveFilter } = useProjectFilter();

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.status === activeFilter);

  return (
    <>
      <div className="mt-8">
        <ProjectFilter
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>

      {filteredProjects.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-lg text-gray">
            No hay proyectos con este filtro.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project, index) => (
            <ScrollReveal key={project.slug} variant="fade-up" delay={index * 0.1}>
              <ProjectCard {...project} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </>
  );
}
