import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { ProgressGallery } from "@/components/progress/progress-gallery";
import { ProgressIndicator } from "@/components/progress/progress-indicator";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { getPublishedProjectSlugs, getProjectBySlug } from "@/lib/queries/projects";
import { getProgressByProject } from "@/lib/queries/progress";
import { formatDate } from "@/lib/utils/format-date";

interface ProgressPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return await getPublishedProjectSlugs();
}

export async function generateMetadata({ params }: ProgressPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Proyecto no encontrado" };
  }

  return {
    title: `Avance de Obra — ${project.name}`,
    description: `Sigue el avance de construcción de ${project.name}.`,
  };
}

export default async function ProjectProgressPage({ params }: ProgressPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const progressEntries = await getProgressByProject(project.id);

  return (
    <>
      <Navbar solid />
      <main className="flex-1 pt-24">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <Link
            href="/avance-de-obra"
            className="inline-flex items-center gap-2 text-sm text-gray transition-colors hover:text-navy"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Avance de Obra
          </Link>

          <h1 className="mt-6 font-heading text-3xl font-bold text-navy md:text-4xl">
            Avance de Obra — {project.name}
          </h1>

          {progressEntries.length === 0 ? (
            <p className="mt-16 text-center text-gray/40">
              Aún no hay actualizaciones de avance para este proyecto.
            </p>
          ) : (
            <div className="mt-10 space-y-12">
              {progressEntries.map((entry, index) => (
                <ScrollReveal key={entry.id} variant="fade-up" delay={index * 0.05}>
                  <div className="rounded-2xl border border-gray/10 bg-white p-6 md:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="font-heading text-xl font-bold text-navy">
                          {entry.title}
                        </h2>
                        <p className="mt-1 text-sm text-gray">
                          {formatDate(entry.entry_date)}
                        </p>
                      </div>
                      {entry.progress_percent != null && (
                        <div className="w-full sm:w-48">
                          <ProgressIndicator percent={entry.progress_percent} />
                        </div>
                      )}
                    </div>

                    {entry.description && (
                      <p className="mt-4 text-gray leading-relaxed">
                        {entry.description}
                      </p>
                    )}

                    {entry.construction_progress_photos.length > 0 && (
                      <div className="mt-6">
                        <ProgressGallery
                          photos={entry.construction_progress_photos.map((p) => ({
                            id: p.id,
                            photo_url: p.photo_url,
                            caption: p.caption,
                          }))}
                          title={entry.title}
                        />
                      </div>
                    )}
                  </div>
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
