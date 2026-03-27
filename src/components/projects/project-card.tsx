"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, BedDouble, Building2 } from "lucide-react";
import { ProjectStatusBadge } from "@/components/ui/badge";
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
  project_type,
}: ProjectCardProps) {
  return (
    <Link
      href={`/proyectos/${slug}`}
      className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {hero_image_url ? (
          <Image
            src={hero_image_url}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.07]"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-navy/5">
            <Building2 className="h-12 w-12 text-gray/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute left-4 top-4">
          <ProjectStatusBadge status={status} />
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-heading text-xl font-bold text-navy transition-colors group-hover:text-celeste">
          {name}
        </h3>

        {location_description && (
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-gray">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {location_description}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-gray/10 pt-4">
          <div>
            {starting_price_display && (
              <p className="text-sm text-gray">
                Desde{" "}
                <span className="font-semibold text-navy">
                  {starting_price_display}
                </span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-gray">
            {bedroom_range && (
              <span className="flex items-center gap-1">
                <BedDouble className="h-3.5 w-3.5" />
                {bedroom_range} hab.
              </span>
            )}
            <span className="flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              {total_units} uds.
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
