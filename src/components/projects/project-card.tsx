"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";
import { ProjectStatusBadge, CategoryTag } from "@/components/ui/badge";
import type { ProjectStatus } from "@/lib/types/database";

interface ProjectCardProps {
  slug: string;
  name: string;
  hero_image_url: string | null;
  starting_price_display: string | null;
  location_description: string | null;
  status: ProjectStatus;
  bedroom_range: string | null;
  total_units: number;
  project_type: string;
  category_tag?: string | null;
}

export function ProjectCard({
  slug,
  name,
  hero_image_url,
  starting_price_display,
  location_description,
  status,
  bedroom_range,
  total_units,
  category_tag,
}: ProjectCardProps) {
  const meta = [location_description, bedroom_range ? `${bedroom_range} hab.` : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={`/proyectos/${slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-navy/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy/10"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {hero_image_url ? (
          <Image
            src={hero_image_url}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-navy/5">
            <Building2 className="h-12 w-12 text-gray/20" />
          </div>
        )}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <CategoryTag label={category_tag} />
          <ProjectStatusBadge status={status} className="ml-auto bg-white/90 backdrop-blur" />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-xl font-bold leading-tight text-navy">{name}</h3>
        {meta && <p className="mt-1.5 text-sm text-gray">{meta}</p>}

        <div className="mt-auto flex items-center justify-between border-t border-navy/10 pt-4">
          {starting_price_display ? (
            <p className="text-sm font-semibold text-primary">Desde {starting_price_display}</p>
          ) : (
            <p className="text-sm font-semibold text-primary">Consultar disponibilidad</p>
          )}
          <span className="flex items-center gap-2 text-xs text-gray">
            <span className="hidden sm:inline">{total_units} uds.</span>
            <ArrowRight
              className="h-4 w-4 text-navy transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
