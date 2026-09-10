"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { getUtmParams } from "@/lib/utils/utm-params";
import { SectionHeading } from "@/components/ui/section-heading";
import { OutlineText } from "@/components/ui/outline-text";

interface ProjectContactFormProps {
  projectId: string;
  projectName: string;
}

const BENEFITS = [
  "Atención personalizada de un asesor experto",
  "Información sobre disponibilidad y precios",
  "Opciones de financiamiento a tu medida",
  "Agenda una visita sin compromiso",
];

export function ProjectContactForm({ projectId, projectName }: ProjectContactFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const payload = {
      first_name: formData.get("first_name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      message: formData.get("message") as string,
      project_interest_id: projectId,
      source: "pagina_web",
      honeypot: formData.get("honeypot") as string,
      ...getUtmParams(),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al enviar. Intenta de nuevo.");
        return;
      }

      router.push("/graciasportucontacto?tipo=proyecto");
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="bg-off-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          {/* Left — copy */}
          <div>
            <SectionHeading
              eyebrow="Solicita información"
              title={
                <>
                  ¿Te interesa <OutlineText>{projectName}</OutlineText>?
                </>
              }
              lead="Completa el formulario y un asesor de Puerta Abierta te contactará en menos de 24 horas con toda la información que necesitas."
            />

            <ul className="mt-8 space-y-3">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-celeste" />
                  <span className="text-sm leading-relaxed text-gray">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — form */}
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-navy/5">
            <h3 className="font-heading text-xl font-bold text-navy">
              Solicitar información
            </h3>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {/* Honeypot */}
              <input
                type="text"
                name="honeypot"
                tabIndex={-1}
                autoComplete="off"
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
                aria-hidden="true"
              />

              <div>
                <label htmlFor={`pcf-name-${projectId}`} className="block text-sm font-medium text-navy">
                  Nombre *
                </label>
                <input
                  id={`pcf-name-${projectId}`}
                  name="first_name"
                  type="text"
                  required
                  minLength={2}
                  className="mt-2 w-full rounded-lg border border-gray/20 bg-off-white px-4 py-3 text-sm text-navy outline-none transition-colors focus:border-celeste focus:ring-2 focus:ring-celeste/20"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor={`pcf-phone-${projectId}`} className="block text-sm font-medium text-navy">
                    Teléfono *
                  </label>
                  <input
                    id={`pcf-phone-${projectId}`}
                    name="phone"
                    type="tel"
                    required
                    minLength={8}
                    className="mt-2 w-full rounded-lg border border-gray/20 bg-off-white px-4 py-3 text-sm text-navy outline-none transition-colors focus:border-celeste focus:ring-2 focus:ring-celeste/20"
                    placeholder="+502 0000 0000"
                  />
                </div>
                <div>
                  <label htmlFor={`pcf-email-${projectId}`} className="block text-sm font-medium text-navy">
                    Correo electrónico *
                  </label>
                  <input
                    id={`pcf-email-${projectId}`}
                    name="email"
                    type="email"
                    required
                    className="mt-2 w-full rounded-lg border border-gray/20 bg-off-white px-4 py-3 text-sm text-navy outline-none transition-colors focus:border-celeste focus:ring-2 focus:ring-celeste/20"
                  />
                </div>
              </div>

              <div>
                <label htmlFor={`pcf-msg-${projectId}`} className="block text-sm font-medium text-navy">
                  Mensaje
                </label>
                <textarea
                  id={`pcf-msg-${projectId}`}
                  name="message"
                  rows={3}
                  className="mt-2 w-full resize-none rounded-lg border border-gray/20 bg-off-white px-4 py-3 text-sm text-navy outline-none transition-colors focus:border-celeste focus:ring-2 focus:ring-celeste/20"
                  placeholder="¿Tienes alguna pregunta sobre el proyecto?"
                />
              </div>

              {error && (
                <p className="text-sm font-medium text-red-500">{error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-sweep w-full rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-primary/90 hover:shadow-lg disabled:opacity-50 [--sweep-color:var(--color-celeste)]"
              >
                {isSubmitting ? "Enviando..." : "Solicitar información"}
              </button>

              <p className="text-center text-xs text-gray/50">
                Tu información es confidencial y nunca será compartida.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
