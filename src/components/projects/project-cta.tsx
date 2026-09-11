import { MessageCircle, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Eyebrow } from "@/components/ui/eyebrow";
import { OutlineText } from "@/components/ui/outline-text";

interface ProjectCTAProps {
  projectName: string;
  /**
   * The project's own WhatsApp/phone line (digits only, full international
   * format, e.g. "50242403164"). Drives both the WhatsApp and call buttons
   * so leads are attributed to the right project in the CRM. Falls back to
   * the global company number only if the project has none set yet.
   */
  whatsappNumber: string | null;
}

const FALLBACK_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "50224249388";

export function ProjectCTA({ projectName, whatsappNumber }: ProjectCTAProps) {
  const number = whatsappNumber || FALLBACK_NUMBER;
  const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent(
    `Hola, me interesa obtener más información sobre el proyecto ${projectName}.`
  )}`;

  return (
    <section data-tone="dark" className="bg-hero-gradient py-20 md:py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Eyebrow className="mb-4">Agenda tu visita</Eyebrow>
        <h2 className="font-heading text-3xl font-extrabold leading-[1.08] tracking-tight text-white md:text-5xl">
          ¿Te interesa <OutlineText>{projectName}</OutlineText>?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">
          Contacta a un asesor para conocer disponibilidad, opciones de
          financiamiento y agendar una visita.
        </p>

        <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <ButtonLink href={whatsappUrl} variant="whatsapp" size="lg">
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            WhatsApp
          </ButtonLink>
          <ButtonLink href={`tel:+${number}`} variant="outline-light" size="lg">
            <Phone className="h-5 w-5" aria-hidden="true" />
            Llamar
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
