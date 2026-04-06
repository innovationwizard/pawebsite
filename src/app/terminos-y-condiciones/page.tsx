import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getSiteSetting } from "@/lib/queries/settings";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  robots: { index: false },
};

export default async function TerminosYCondicionesPage() {
  const content = await getSiteSetting<{ html: string }>("terms_and_conditions");

  return (
    <>
      <Navbar solid />
      <main className="flex-1 pt-24">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="font-heading text-3xl font-bold text-navy md:text-4xl">
            Términos y Condiciones
          </h1>
          {content?.html ? (
            <div
              className="prose prose-lg mt-8 max-w-none prose-headings:font-heading prose-headings:text-navy prose-p:text-gray"
              dangerouslySetInnerHTML={{ __html: content.html }}
            />
          ) : (
            <p className="mt-8 text-gray/40">
              [ Contenido de términos y condiciones — administrable desde Configuración en el CMS ]
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
