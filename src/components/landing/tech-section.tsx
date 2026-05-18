import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { AvatarCallCard } from "@/components/landing/avatar-call-card";

interface TechSectionProps {
  licPuertasPhotoUrl: string | null;
  licPuertasName: string;
  licPuertasTitle: string;
}

export function TechSection({
  licPuertasPhotoUrl,
  licPuertasName,
  licPuertasTitle,
}: TechSectionProps) {
  return (
    <section className="bg-off-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <ScrollReveal variant="fade-up">
            <div>
              <h2 className="font-heading text-3xl font-bold text-navy md:text-4xl lg:text-5xl">
                Abrimos las puertas a tecnología de otro nivel
              </h2>
              <p className="mt-4 text-lg font-medium text-celeste">
                Innovación, datos e inteligencia artificial al servicio de
                mejores decisiones
              </p>
              <p className="mt-6 text-lg leading-relaxed text-gray">
                En Puerta Abierta creemos que el futuro de los bienes raíces en
                Guatemala no solo se construye con proyectos, sino con
                inteligencia.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-gray">
                Por eso integramos tecnología de punta e inteligencia artificial
                (IA) en nuestros procesos comerciales, análisis de mercado y
                estrategias de marketing, permitiéndonos anticiparnos a las
                tendencias y ofrecer soluciones más precisas a nuestros clientes.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="fade-up" delay={0.2}>
            <AvatarCallCard
              photoUrl={licPuertasPhotoUrl}
              name={licPuertasName}
              title={licPuertasTitle}
            />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
