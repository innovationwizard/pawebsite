import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { TerrenosHero } from "@/components/terrenos/terrenos-hero";
import { TerrenosForm } from "@/components/terrenos/terrenos-form";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { MapPin, ShieldCheck, Clock, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Vende tu Terreno en Guatemala | Puerta Abierta Inmobiliaria",
  description:
    "¿Tienes un terreno en Guatemala? Puerta Abierta Inmobiliaria te ofrece un proceso de compra rápido, transparente y seguro. Con más de 22 años en el mercado, somos el socio ideal para la venta de tu terreno.",
  openGraph: {
    title: "Vende tu Terreno en Guatemala | Puerta Abierta Inmobiliaria",
    description:
      "Proceso rápido, precio justo y cierre seguro. Más de 22 años comprando terrenos en Guatemala.",
    type: "website",
  },
};

const BENEFITS = [
  {
    icon: Clock,
    title: "Proceso rápido",
    description:
      "Evaluamos tu terreno en menos de 72 horas y te presentamos una propuesta concreta sin compromisos.",
  },
  {
    icon: ShieldCheck,
    title: "Cierre seguro",
    description:
      "Operamos con total transparencia legal. Acompañamiento notarial y asesoría desde el primer contacto.",
  },
  {
    icon: MapPin,
    title: "Compramos en toda Guatemala",
    description:
      "Terrenos urbanos, residenciales o comerciales en la Ciudad de Guatemala y municipios del área metropolitana.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Comparte los datos de tu terreno",
    description:
      "Llena el formulario con la información básica: ubicación, área y datos de contacto. Es rápido y sin costo.",
  },
  {
    number: "02",
    title: "Evaluamos y te contactamos",
    description:
      "Nuestro equipo analiza la ubicación y el potencial del terreno. Te llamamos en menos de 24 horas hábiles.",
  },
  {
    number: "03",
    title: "Cierre transparente",
    description:
      "Si llegamos a un acuerdo, gestionamos todo el proceso notarial con acompañamiento completo de nuestra parte.",
  },
];

const FAQS = [
  {
    question: "¿Qué tipo de terrenos compra Puerta Abierta?",
    answer:
      "Compramos terrenos urbanos, residenciales y comerciales en Ciudad de Guatemala y municipios del área metropolitana. El tamaño mínimo requerido depende de la ubicación y uso potencial.",
  },
  {
    question: "¿Cuánto tiempo toma el proceso?",
    answer:
      "La evaluación inicial toma de 24 a 72 horas. Si llegamos a un acuerdo, el proceso de escrituración puede completarse en 30 a 60 días hábiles dependiendo de la documentación.",
  },
  {
    question: "¿Hay algún costo por solicitar una evaluación?",
    answer:
      "No. La evaluación de tu terreno es completamente gratuita y sin ningún compromiso de tu parte.",
  },
];

export default function TerrenosPage() {
  return (
    <>
      <Navbar solid />
      <main className="flex-1">
        {/* 1. Hero */}
        <TerrenosHero />

        {/* 2. Trust Strip */}
        <section className="border-y border-gray/10 bg-white py-8">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
              {[
                { value: "22+", label: "Años en el mercado" },
                { value: "100+", label: "Terrenos adquiridos" },
                { value: "72h", label: "Evaluación rápida" },
                { value: "0", label: "Costo de evaluación" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-heading text-3xl font-bold text-navy">{stat.value}</p>
                  <p className="mt-1 text-sm text-gray">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Benefits */}
        <section className="bg-off-white py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <ScrollReveal variant="fade-up" className="text-center">
              <h2 className="font-heading text-3xl font-bold text-navy md:text-4xl">
                ¿Por qué vender tu terreno con Puerta Abierta?
              </h2>
              <p className="mt-4 text-lg text-gray">
                Más de dos décadas comprando terrenos en Guatemala con total confianza y transparencia.
              </p>
            </ScrollReveal>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {BENEFITS.map((benefit, index) => (
                <ScrollReveal key={benefit.title} variant="fade-up" delay={index * 0.1}>
                  <div className="rounded-2xl bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-lg">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-celeste/10">
                      <benefit.icon className="h-6 w-6 text-celeste" />
                    </div>
                    <h3 className="mt-5 font-heading text-xl font-bold text-navy">
                      {benefit.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-gray">
                      {benefit.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* 4. How It Works + Form */}
        <section id="formulario" className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid items-start gap-16 lg:grid-cols-2">
              {/* Steps */}
              <ScrollReveal variant="fade-up">
                <div>
                  <h2 className="font-heading text-3xl font-bold text-navy md:text-4xl">
                    ¿Cómo funciona?
                  </h2>
                  <p className="mt-4 text-lg text-gray">
                    Sin complicaciones, sin compromisos. Así de simple es vender tu terreno con nosotros.
                  </p>

                  <div className="mt-10 space-y-8">
                    {STEPS.map((step) => (
                      <div key={step.number} className="flex gap-5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-celeste/10">
                          <span className="font-heading text-lg font-bold text-celeste">
                            {step.number}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-heading text-lg font-bold text-navy">
                            {step.title}
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed text-gray">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 rounded-2xl bg-navy p-6">
                    <p className="font-heading text-lg font-bold text-white">
                      Evaluación 100% gratuita
                    </p>
                    <p className="mt-2 text-sm text-white/70">
                      No hay ningún costo ni compromiso al solicitarnos una evaluación de tu terreno.
                    </p>
                    <ul className="mt-4 space-y-2">
                      {[
                        "Sin intermediarios",
                        "Proceso notarial acompañado",
                        "Precio justo de mercado",
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-white/80">
                          <CheckCircle className="h-4 w-4 shrink-0 text-celeste" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollReveal>

              {/* Form */}
              <ScrollReveal variant="fade-up" delay={0.2}>
                <TerrenosForm />
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* 5. FAQ */}
        <section className="bg-off-white py-20 md:py-28">
          <div className="mx-auto max-w-3xl px-6">
            <ScrollReveal variant="fade-up" className="text-center">
              <h2 className="font-heading text-3xl font-bold text-navy md:text-4xl">
                Preguntas frecuentes
              </h2>
            </ScrollReveal>

            <div className="mt-10 space-y-4">
              {FAQS.map((faq, index) => (
                <ScrollReveal key={index} variant="fade-up" delay={index * 0.1}>
                  <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <h3 className="font-heading text-base font-bold text-navy">
                      {faq.question}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-gray">{faq.answer}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
