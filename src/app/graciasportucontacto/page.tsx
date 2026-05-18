import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { DataLayerPush } from "@/components/analytics/data-layer-push";

export const metadata: Metadata = {
  title: "¡Gracias por tu contacto! | Puerta Abierta Inmobiliaria",
  description: "Hemos recibido tu mensaje. Un asesor te contactará en menos de 24 horas.",
  robots: { index: false, follow: false },
};

export default function GraciasPorTuContactoPage() {
  return (
    <>
      <DataLayerPush event="lead_form_submitted" />
      <Navbar solid />
      <main className="flex min-h-[calc(100vh-80px)] flex-col">
        <section className="flex flex-1 items-center justify-center bg-off-white px-6 py-24">
          <div className="mx-auto max-w-lg text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-celeste/10">
              <svg
                className="h-10 w-10 text-celeste"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </div>

            <h1 className="mt-6 font-heading text-3xl font-bold text-navy md:text-4xl">
              ¡Gracias por contactarnos!
            </h1>

            <p className="mt-4 text-lg leading-relaxed text-gray">
              Hemos recibido tu mensaje. Un asesor de Puerta Abierta se
              comunicará contigo en{" "}
              <strong className="text-navy">menos de 24 horas</strong> por
              correo electrónico o teléfono.
            </p>

            <p className="mt-3 text-sm text-gray/70">
              Si tienes una consulta urgente, puedes escribirnos directamente
              por WhatsApp.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/proyectos"
                className="rounded-full bg-navy px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-navy/90 hover:shadow-lg"
              >
                Ver Proyectos
              </Link>
              <Link
                href="/"
                className="rounded-full border border-gray/20 px-8 py-3.5 text-sm font-semibold text-navy transition-all duration-300 hover:border-navy hover:shadow-sm"
              >
                Volver al Inicio
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
