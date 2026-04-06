import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { ProgressIndicator } from "@/components/progress/progress-indicator";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { getLatestProgressPerProject } from "@/lib/queries/progress";
import { formatDate } from "@/lib/utils/format-date";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Avance de Obra",
  description:
    "Sigue el avance de construcción de nuestros proyectos inmobiliarios en Guatemala.",
};

export default async function AvanceDeObraPage() {
  const projectProgress = await getLatestProgressPerProject();

  return (
    <>
      <Navbar solid />
      <main className="flex-1 pt-24">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h1 className="font-heading text-4xl font-bold text-navy md:text-5xl">
            Avance de Obra
          </h1>
          <p className="mt-4 text-lg text-gray">
            Conoce el progreso de construcción de nuestros proyectos.
          </p>

          {projectProgress.length === 0 ? (
            <p className="mt-16 text-center text-gray/40">
              Próximamente publicaremos avances de construcción.
            </p>
          ) : (
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              {projectProgress.map(({ project, latestProgress }, index) => (
                <ScrollReveal key={project.slug} variant="fade-up" delay={index * 0.1}>
                  <Link
                    href={`/avance-de-obra/${project.slug}`}
                    className="group block rounded-2xl border border-gray/10 bg-white p-6 transition-all duration-300 hover:shadow-lg hover:border-celeste/20"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="font-heading text-xl font-bold text-navy transition-colors group-hover:text-celeste">
                          {project.name}
                        </h2>
                        {latestProgress && (
                          <p className="mt-1 text-sm text-gray">
                            Última actualización: {formatDate(latestProgress.entry_date)}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray/30 transition-all group-hover:text-celeste group-hover:translate-x-1" />
                    </div>

                    {latestProgress?.progress_percent != null && (
                      <div className="mt-6">
                        <ProgressIndicator
                          percent={latestProgress.progress_percent}
                          label={latestProgress.title}
                        />
                      </div>
                    )}

                    {latestProgress?.description && (
                      <p className="mt-4 text-sm text-gray line-clamp-2">
                        {latestProgress.description}
                      </p>
                    )}
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
