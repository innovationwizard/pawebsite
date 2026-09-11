"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Eyebrow } from "@/components/ui/eyebrow";
import { OutlineText } from "@/components/ui/outline-text";
import { ButtonLink } from "@/components/ui/button-link";
import { SERVICIOS_CTA_LABEL } from "@/lib/constants/servicios";

interface ServiciosHeroProps {
  imageUrl: string | null;
  whatsappHref: string;
}

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

export function ServiciosHero({ imageUrl, whatsappHref }: ServiciosHeroProps) {
  return (
    <section
      data-tone="dark"
      className="relative flex min-h-[92vh] w-full items-center overflow-hidden bg-hero-gradient"
    >
      {imageUrl && (
        <div className="absolute inset-0">
          <Image
            src={imageUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-navy-deep/90 via-navy/75 to-navy/60" />
        </div>
      )}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-36 md:pb-28 md:pt-44">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="max-w-3xl"
        >
          <Eyebrow className="mb-5">Servicios para desarrolladores</Eyebrow>
          <h1 className="font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
            Marketing, ventas y tecnología para vender{" "}
            <OutlineText>tu desarrollo</OutlineText> inmobiliario
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75 md:text-xl"
          >
            Sumamos a tu proyecto un equipo de mercadeo y ventas que ya opera en
            el mercado guatemalteco: performance marketing, fuerza comercial
            optimizada y tecnología propia para convertir interés en cierres.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <ButtonLink href="#formulario" variant="primary" size="lg">
              {SERVICIOS_CTA_LABEL}
              <span aria-hidden="true">→</span>
            </ButtonLink>
            <ButtonLink href={whatsappHref} variant="outline-light" size="lg">
              Hablar por WhatsApp
            </ButtonLink>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
