"use client";

import Image from "next/image";
import Link from "next/link";
import { Marquee } from "@/components/animations/marquee";

interface ProjectLogo {
  slug: string;
  name: string;
  logo_url: string | null;
}

interface ProjectLogosRibbonProps {
  projects: ProjectLogo[];
}

export function ProjectLogosRibbon({ projects }: ProjectLogosRibbonProps) {
  if (projects.length === 0) return null;

  const logoItems = projects.filter((p) => p.logo_url);

  if (logoItems.length === 0) return null;

  return (
    <section className="border-b border-gray/10 bg-off-white py-6">
      <Marquee speed={40} pauseOnHover className="mx-auto max-w-7xl">
        {logoItems.map((project) => (
          <Link
            key={project.slug}
            href={`/proyectos/${project.slug}`}
            className="flex shrink-0 items-center px-6 opacity-50 transition-opacity duration-300 hover:opacity-100"
          >
            <Image
              src={project.logo_url!}
              alt={project.name}
              width={140}
              height={50}
              className="h-10 w-auto object-contain md:h-12"
            />
          </Link>
        ))}
      </Marquee>
    </section>
  );
}
