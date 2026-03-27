import Image from "next/image";
import { ProjectStatusBadge } from "@/components/ui/badge";
import type { ProjectStatus } from "@/lib/types/database";
import { Building2 } from "lucide-react";

interface ProjectHeroProps {
  name: string;
  hero_image_url: string | null;
  logo_url: string | null;
  status: ProjectStatus;
  location_description: string | null;
}

export function ProjectHero({
  name,
  hero_image_url,
  logo_url,
  status,
  location_description,
}: ProjectHeroProps) {
  return (
    <section className="relative flex min-h-[40vh] items-end overflow-hidden bg-navy md:min-h-[50vh]">
      {hero_image_url ? (
        <Image
          src={hero_image_url}
          alt={name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy via-navy/90 to-dark">
          <Building2 className="h-24 w-24 text-white/10" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-12 pt-32">
        <ProjectStatusBadge status={status} className="mb-4" />

        {logo_url && (
          <Image
            src={logo_url}
            alt={`${name} logo`}
            width={180}
            height={60}
            className="mb-4 h-12 w-auto object-contain brightness-0 invert md:h-16"
          />
        )}

        <h1 className="font-heading text-4xl font-bold text-white md:text-5xl lg:text-6xl">
          {name}
        </h1>

        {location_description && (
          <p className="mt-3 text-lg text-white/70">{location_description}</p>
        )}
      </div>
    </section>
  );
}
