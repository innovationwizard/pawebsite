"use client";

import Image from "next/image";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { Marquee } from "@/components/animations/marquee";

const DELIVERED_BADGES = [
  { name: "Edificio 7-47", src: "/images/insignias/edificio-7-47.png" },
  { name: "Telia", src: "/images/insignias/telia.png" },
  { name: "Casa 3", src: "/images/insignias/casa-3.png" },
  { name: "Santeli", src: "/images/insignias/santeli.png" },
  { name: "Natú", src: "/images/insignias/natu.png" },
  { name: "Casa Elisa", src: "/images/insignias/casa-elisa.png" },
  { name: "Colinas de Castilla", src: "/images/insignias/colinas-de-castilla.png" },
];

const ACTIVE_BADGES = [
  { name: "Benestare", src: "/images/insignias/benestare.png" },
  { name: "Boulevard 5", src: "/images/insignias/boulevard-5.png" },
  { name: "Bosque Las Tapias", src: "/images/insignias/bosque-las-tapias.png" },
  { name: "Santa Elena", src: "/images/insignias/santa-elena.png" },
];

export function ProjectBadges() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal variant="fade-up">
          <h2 className="text-center font-heading text-3xl font-bold text-navy md:text-4xl lg:text-5xl">
            Nuestros proyectos nos respaldan
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-center text-lg leading-relaxed text-gray">
            Ubicación, diseño y plusvalía en cada desarrollo. Trabajamos con
            algunos de los proyectos más relevantes del mercado inmobiliario en
            Guatemala, seleccionados por su calidad, propuesta de valor y
            potencial de crecimiento.
          </p>
          <p className="mx-auto mt-4 max-w-3xl text-center text-lg leading-relaxed text-gray">
            Desde apartamentos modernos en la ciudad hasta desarrollos rodeados
            de naturaleza o proyectos premium, nuestro portafolio está diseñado
            para ofrecer opciones para cada perfil de cliente.
          </p>
        </ScrollReveal>
      </div>

      {/* Row 1: Delivered projects (gold badges) */}
      <div className="mt-12">
        <Marquee speed={30} pauseOnHover>
          {DELIVERED_BADGES.map((badge) => (
            <div
              key={badge.name}
              className="flex shrink-0 items-center px-6"
            >
              <Image
                src={badge.src}
                alt={badge.name}
                width={140}
                height={140}
                className="h-28 w-auto object-contain md:h-36"
              />
            </div>
          ))}
        </Marquee>
      </div>

      {/* Row 2: Active projects (blue badges) */}
      <div className="mt-4">
        <Marquee speed={25} pauseOnHover direction="right">
          {ACTIVE_BADGES.map((badge) => (
            <div
              key={badge.name}
              className="flex shrink-0 items-center px-6"
            >
              <Image
                src={badge.src}
                alt={badge.name}
                width={140}
                height={140}
                className="h-28 w-auto object-contain md:h-36"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
