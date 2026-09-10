import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { SectionHeading } from "@/components/ui/section-heading";
import { OutlineText } from "@/components/ui/outline-text";
import { ButtonLink } from "@/components/ui/button-link";
import { Accordion } from "@/components/ui/accordion";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { getPublishedFAQs } from "@/lib/queries/faqs";

export const metadata: Metadata = {
  title: "Preguntas Frecuentes",
  description:
    "Resuelve tus dudas sobre nuestros proyectos inmobiliarios, procesos de compra, financiamiento y más.",
};

export default async function PreguntasFrecuentesPage() {
  const faqCategories = await getPublishedFAQs();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqCategories.flatMap((cat) =>
      cat.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      }))
    ),
  };

  return (
    <>
      <Navbar solid />
      <main className="flex-1 pt-24">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <SectionHeading
            as="h1"
            size="lg"
            eyebrow="FAQ"
            title={
              <>
                Preguntas <OutlineText>frecuentes</OutlineText>.
              </>
            }
            lead="Todo lo que necesitas saber para comprar tu apartamento en Guatemala."
          />

          {faqCategories.length === 0 ? (
            <p className="mt-16 text-center text-gray/40">
              Próximamente publicaremos preguntas frecuentes.
            </p>
          ) : (
            <div className="mt-12 space-y-12">
              {faqCategories.map((category, catIndex) => (
                <ScrollReveal key={category.id} variant="fade-up" delay={catIndex * 0.1}>
                  <div>
                    <h2 className="font-heading text-xl font-bold text-navy md:text-2xl">
                      {category.name}
                    </h2>
                    <div className="mt-4">
                      <Accordion
                        items={category.faqs.map((faq) => ({
                          question: faq.question,
                          answer: (
                            <>
                              <p>{faq.answer}</p>
                              {faq.cta_text && faq.cta_url && (
                                <ButtonLink href={faq.cta_url} variant="primary" size="sm" className="mt-3">
                                  {faq.cta_text}
                                  <span aria-hidden="true">→</span>
                                </ButtonLink>
                              )}
                            </>
                          ),
                        }))}
                      />
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>

        {/* FAQ structured data */}
        {faqCategories.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
