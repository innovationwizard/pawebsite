import { MessageCircle, ShieldCheck } from "lucide-react";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { OutlineText } from "@/components/ui/outline-text";
import { ButtonLink } from "@/components/ui/button-link";
import { PipedriveWebForm } from "./pipedrive-web-form";

interface ServiciosFormProps {
  whatsappHref: string;
  /** Pipedrive Web Form URL; when absent the card offers WhatsApp instead. */
  pipedriveFormUrl: string | null;
}

/**
 * Lead capture for developers. The form itself is Pipedrive's embedded Web
 * Form (leads land directly in the Pipedrive CRM; the post-submit redirect
 * to /graciasportucontacto?tipo=servicios is configured in Pipedrive).
 */
export function ServiciosForm({ whatsappHref, pipedriveFormUrl }: ServiciosFormProps) {
  return (
    <section id="formulario" className="scroll-mt-24 bg-off-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-start gap-14 lg:grid-cols-[1fr_1.15fr]">
          <ScrollReveal variant="fade-up">
            <SectionHeading
              eyebrow="Hablemos de tu proyecto"
              title={
                <>
                  Cuéntanos qué vas a vender y te decimos{" "}
                  <OutlineText>cómo lo venderíamos</OutlineText>.
                </>
              }
              lead="Completa el formulario y un director comercial de Puerta Abierta te contactará para evaluar tu proyecto."
            />

            <div className="mt-10 rounded-2xl bg-navy p-6 text-white">
              <p className="flex items-center gap-2 font-heading text-lg font-bold">
                <MessageCircle className="h-5 w-5 text-celeste" aria-hidden="true" />
                ¿Prefieres hablar ahora?
              </p>
              <p className="mt-2 text-sm text-white/70">
                Escríbenos por WhatsApp y coordinamos una llamada con nuestro equipo.
              </p>
              <ButtonLink href={whatsappHref} variant="celeste" size="sm" className="mt-5">
                Escribir por WhatsApp
              </ButtonLink>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="fade-up" delay={0.15}>
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-navy/5 md:p-8">
              {pipedriveFormUrl ? (
                <PipedriveWebForm formUrl={pipedriveFormUrl} />
              ) : (
                <div className="py-10 text-center">
                  <p className="font-heading text-lg font-bold text-navy">
                    Formulario temporalmente no disponible
                  </p>
                  <p className="mt-2 text-sm text-gray">
                    Escríbenos por WhatsApp y un director comercial te contactará.
                  </p>
                  <ButtonLink href={whatsappHref} variant="primary" size="sm" className="mt-6">
                    Escribir por WhatsApp
                  </ButtonLink>
                </div>
              )}

              <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-gray/60">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Sin compromiso. Tu información es confidencial.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
