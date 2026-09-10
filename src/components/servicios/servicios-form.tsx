"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, ShieldCheck } from "lucide-react";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { OutlineText } from "@/components/ui/outline-text";
import { ButtonLink } from "@/components/ui/button-link";
import { LEAD_PROJECT_STAGES } from "@/lib/constants/lead-project-stages";
import { SERVICIOS_CTA_LABEL } from "@/lib/constants/servicios";
import { getUtmParams } from "@/lib/utils/utm-params";

interface ServiciosFormProps {
  whatsappHref: string;
}

const INPUT =
  "mt-2 w-full rounded-lg border border-gray/20 bg-white px-4 py-3 text-sm text-navy outline-none transition-colors placeholder:text-gray/50 focus:border-celeste focus:ring-2 focus:ring-celeste/20";
const LABEL = "block text-sm font-medium text-navy";

export function ServiciosForm({ whatsappHref }: ServiciosFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const text = (name: string) => String(formData.get(name) ?? "").trim();
    const unitsRaw = text("project_units");
    const units = unitsRaw ? Number.parseInt(unitsRaw, 10) : undefined;

    const payload = {
      first_name: text("first_name"),
      last_name: "",
      email: text("email"),
      phone: text("phone"),
      company: text("company"),
      job_title: text("job_title") || undefined,
      project_name: text("project_name"),
      project_location: text("project_location") || undefined,
      project_stage: text("project_stage") || undefined,
      project_units: Number.isFinite(units) ? units : undefined,
      message: text("message") || undefined,
      source: "servicios",
      honeypot: text("honeypot"),
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

      router.push("/graciasportucontacto?tipo=servicios");
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }

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
            <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-8 shadow-sm">
              {/* Honeypot */}
              <input
                type="text"
                name="honeypot"
                tabIndex={-1}
                autoComplete="off"
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
                aria-hidden="true"
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="srv-name" className={LABEL}>Nombre completo *</label>
                  <input id="srv-name" name="first_name" type="text" required minLength={2} maxLength={100} className={INPUT} />
                </div>
                <div>
                  <label htmlFor="srv-company" className={LABEL}>Empresa / Desarrolladora *</label>
                  <input id="srv-company" name="company" type="text" required minLength={2} maxLength={150} className={INPUT} />
                </div>
                <div>
                  <label htmlFor="srv-job" className={LABEL}>Cargo</label>
                  <input id="srv-job" name="job_title" type="text" maxLength={100} className={INPUT} placeholder="Ej. Gerente comercial" />
                </div>
                <div>
                  <label htmlFor="srv-phone" className={LABEL}>Teléfono *</label>
                  <input id="srv-phone" name="phone" type="tel" required minLength={8} maxLength={20} className={INPUT} placeholder="+502 0000 0000" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="srv-email" className={LABEL}>Correo electrónico *</label>
                  <input id="srv-email" name="email" type="email" required className={INPUT} />
                </div>
                <div>
                  <label htmlFor="srv-project" className={LABEL}>Nombre del proyecto *</label>
                  <input id="srv-project" name="project_name" type="text" required minLength={2} maxLength={150} className={INPUT} />
                </div>
                <div>
                  <label htmlFor="srv-location" className={LABEL}>Ubicación del proyecto</label>
                  <input id="srv-location" name="project_location" type="text" maxLength={150} className={INPUT} placeholder="Ej. Zona 10, Ciudad de Guatemala" />
                </div>
                <div>
                  <label htmlFor="srv-stage" className={LABEL}>Etapa del proyecto</label>
                  <select id="srv-stage" name="project_stage" defaultValue="" className={`${INPUT} appearance-none`}>
                    <option value="">Selecciona una etapa</option>
                    {LEAD_PROJECT_STAGES.map((stage) => (
                      <option key={stage.value} value={stage.value}>{stage.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="srv-units" className={LABEL}>Unidades aproximadas</label>
                  <input id="srv-units" name="project_units" type="number" min={1} max={100000} step={1} className={INPUT} placeholder="Ej. 120" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="srv-message" className={LABEL}>Cuéntanos sobre tu proyecto</label>
                  <textarea
                    id="srv-message"
                    name="message"
                    rows={4}
                    maxLength={1000}
                    className={`${INPUT} resize-none`}
                    placeholder="Tipo de producto, estado de la comercialización, qué necesitas resolver primero..."
                  />
                </div>
              </div>

              {error && <p className="mt-4 text-sm font-medium text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-sweep mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-primary/90 hover:shadow-lg disabled:opacity-50 [--sweep-color:var(--color-celeste)]"
              >
                {isSubmitting ? "Enviando..." : SERVICIOS_CTA_LABEL}
                {!isSubmitting && <span aria-hidden="true">→</span>}
              </button>

              <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-gray/60">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Sin compromiso. Tu información es confidencial.
              </p>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
