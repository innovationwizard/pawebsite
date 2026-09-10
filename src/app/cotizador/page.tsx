import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { SectionHeading } from "@/components/ui/section-heading";
import { OutlineText } from "@/components/ui/outline-text";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { getPublishedProjects } from "@/lib/queries/projects";
import { FinancialCalculator } from "@/components/cotizador/financial-calculator";
import { CotizadorContactForm } from "@/components/cotizador/cotizador-contact-form";

export const metadata: Metadata = {
  title: "Cotizador | Puerta Abierta Inmobiliaria",
  description:
    "Calcula tu financiamiento inmobiliario. Ingresa el valor del inmueble, tu enganche y plazo deseado para conocer tu cuota mensual estimada.",
};

export default async function CotizadorPage() {
  const projects = await getPublishedProjects();

  const projectOptions = projects
    .filter((p) => p.status === "active" || p.status === "under_construction" || p.status === "nearly_sold_out")
    .map((p) => ({
      id: p.id,
      name: p.name,
      starting_price: p.starting_price,
      currency: p.currency,
    }));

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative bg-hero-gradient pb-12 pt-40 md:pb-16 md:pt-48">
          <div className="mx-auto max-w-7xl px-6">
            <ScrollReveal variant="fade-up">
              <SectionHeading
                as="h1"
                size="lg"
                tone="dark"
                eyebrow="Cotiza ahora"
                title={
                  <>
                    Cotizador <OutlineText>financiero</OutlineText>.
                  </>
                }
                lead="Calcula tu cuota mensual estimada y planifica la compra de tu nuevo hogar."
              />
            </ScrollReveal>
          </div>
        </section>

        {/* Calculator + Contact */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Financial Calculator */}
              <ScrollReveal variant="fade-up">
                <FinancialCalculator projectOptions={projectOptions} />
              </ScrollReveal>

              {/* Contact Advisor */}
              <ScrollReveal variant="fade-up" delay={0.15}>
                <CotizadorContactForm projectOptions={projectOptions} />
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="border-t border-gray/10 bg-off-white py-10">
          <div className="mx-auto max-w-7xl px-6">
            <p className="text-xs leading-relaxed text-gray/60">
              Los resultados del cotizador son aproximados y tienen fines
              informativos. Las tasas de inter&eacute;s, plazos y condiciones
              finales est&aacute;n sujetos a la aprobaci&oacute;n de la
              instituci&oacute;n financiera. Cont&aacute;ctanos para obtener
              una cotizaci&oacute;n personalizada.
            </p>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
