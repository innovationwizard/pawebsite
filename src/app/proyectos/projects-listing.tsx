"use client";

import { useState, useMemo } from "react";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectFilter, type ProjectFilters } from "@/components/projects/project-filter";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import type { ProjectStatus } from "@/lib/types/database";

interface ProjectData {
  slug: string;
  name: string;
  hero_image_url: string | null;
  starting_price_display: string | null;
  starting_price: number | null;
  location_description: string | null;
  zone: string | null;
  status: ProjectStatus;
  bedroom_range: string | null;
  total_units: number;
  project_type: string;
}

interface ProjectsListingProps {
  projects: ProjectData[];
  zones: string[];
}

const EMPTY_FILTERS: ProjectFilters = {
  keyword: "",
  projectType: "",
  zone: "",
  bedrooms: "",
  priceMax: "",
};

function bedroomsMatch(bedroomRange: string | null, filter: string): boolean {
  if (!bedroomRange) return false;
  const n = parseInt(filter, 10);
  const nums = bedroomRange.match(/\d+/g)?.map(Number) ?? [];
  if (nums.length === 0) return false;
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  if (filter === "4") return max >= 4;
  return min <= n && n <= max;
}

export function ProjectsListing({ projects, zones }: ProjectsListingProps) {
  const [filters, setFilters] = useState<ProjectFilters>(EMPTY_FILTERS);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (filters.keyword) {
        const kw = filters.keyword.toLowerCase();
        const haystack = `${p.name} ${p.location_description ?? ""} ${p.zone ?? ""}`.toLowerCase();
        if (!haystack.includes(kw)) return false;
      }
      if (filters.projectType && p.project_type !== filters.projectType) return false;
      if (filters.zone && p.zone !== filters.zone) return false;
      if (filters.bedrooms && !bedroomsMatch(p.bedroom_range, filters.bedrooms)) return false;
      if (filters.priceMax) {
        const max = parseInt(filters.priceMax, 10);
        if (p.starting_price !== null && p.starting_price > max) return false;
      }
      return true;
    });
  }, [projects, filters]);

  return (
    <>
      <div className="mt-8">
        <ProjectFilter
          zones={zones}
          filters={filters}
          onFiltersChange={setFilters}
          totalResults={filtered.length}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-lg text-gray">No hay proyectos con estos filtros.</p>
          <button
            type="button"
            onClick={() => setFilters(EMPTY_FILTERS)}
            className="mt-4 text-sm font-medium text-celeste hover:underline"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, index) => (
            <ScrollReveal key={project.slug} variant="fade-up" delay={index * 0.1}>
              <ProjectCard {...project} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </>
  );
}
