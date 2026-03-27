"use client";

import Image from "next/image";
import { Marquee } from "@/components/animations/marquee";

/**
 * Static project logos served from public/icons/project-logos/.
 * These always appear in the ribbon regardless of Supabase data.
 */
const STATIC_PROJECT_LOGOS = [
  { name: "Bosque Las Tapias", src: "/icons/project-logos/bosque-las-tapias.jpg" },
  { name: "Casa Elisa", src: "/icons/project-logos/casa-elisa.jpg" },
  { name: "Boulevard 5", src: "/icons/project-logos/boulevard-5.jpg" },
  { name: "Santa Elena", src: "/icons/project-logos/santa-elena.jpg" },
  { name: "Benestare Residenciales", src: "/icons/project-logos/benestare.png" },
];

interface ProjectLogo {
  slug: string;
  name: string;
  logo_url: string | null;
}

interface ProjectLogosRibbonProps {
  projects: ProjectLogo[];
}

export function ProjectLogosRibbon({ projects }: ProjectLogosRibbonProps) {
  // Merge: static logos first, then any Supabase-sourced logos not already covered
  const staticNames = new Set(STATIC_PROJECT_LOGOS.map((l) => l.name.toLowerCase()));

  const supabaseLogos = projects
    .filter((p) => p.logo_url && !staticNames.has(p.name.toLowerCase()))
    .map((p) => ({ name: p.name, src: p.logo_url! }));

  const allLogos = [...STATIC_PROJECT_LOGOS, ...supabaseLogos];

  if (allLogos.length === 0) return null;

  return (
    <section className="border-b border-gray/10 bg-off-white py-6">
      <Marquee speed={40} pauseOnHover className="mx-auto max-w-7xl">
        {allLogos.map((logo) => (
          <div
            key={logo.name}
            className="flex shrink-0 items-center px-8 opacity-50 transition-opacity duration-300 hover:opacity-100"
          >
            <Image
              src={logo.src}
              alt={logo.name}
              width={160}
              height={56}
              className="h-10 w-auto object-contain grayscale md:h-12"
            />
          </div>
        ))}
      </Marquee>
    </section>
  );
}
