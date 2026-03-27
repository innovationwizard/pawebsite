import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
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
      <Navbar />
      <main className="flex-1 pt-24">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="font-heading text-4xl font-bold text-navy md:text-5xl">
            Preguntas Frecuentes
          </h1>
          <p className="mt-4 text-lg text-gray">
            Encuentra respuestas a las preguntas más comunes sobre nuestros
            proyectos y procesos.
          </p>

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
                          answer: faq.answer,
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
