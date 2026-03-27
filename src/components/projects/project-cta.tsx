import { MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectCTAProps {
  projectName: string;
}

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "50242403164";

export function ProjectCTA({ projectName }: ProjectCTAProps) {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hola, me interesa obtener más información sobre el proyecto ${projectName}.`
  )}`;

  return (
    <section className="bg-navy py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
          ¿Te interesa {projectName}?
        </h2>
        <p className="mt-4 text-lg text-white/60">
          Contacta a un asesor para conocer disponibilidad, opciones de
          financiamiento y agendar una visita.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-[#25D366] hover:bg-[#25D366]/90">
              <MessageCircle className="mr-2 h-5 w-5" />
              WhatsApp
            </Button>
          </a>
          <a href="tel:+50242403164">
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-navy">
              <Phone className="mr-2 h-5 w-5" />
              Llamar
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
