"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { Send, CheckCircle } from "lucide-react";

interface ProjectOption {
  id: string;
  name: string;
}

interface NewsletterFormProps {
  projects: ProjectOption[];
}

export function NewsletterForm({ projects }: NewsletterFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Honeypot check
    if (formData.get("website")) {
      setIsSubmitting(false);
      return;
    }

    // Capture UTM params from URL
    const searchParams = new URLSearchParams(window.location.search);

    const body = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      project_interest_id: (formData.get("project_interest_id") as string) || undefined,
      message: formData.get("message") as string,
      is_newsletter_subscriber: formData.get("newsletter") === "on",
      utm_source: searchParams.get("utm_source") ?? undefined,
      utm_medium: searchParams.get("utm_medium") ?? undefined,
      utm_campaign: searchParams.get("utm_campaign") ?? undefined,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Error al enviar el formulario");
      }

      setIsSuccess(true);
      form.reset();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al enviar el formulario"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="py-20 md:py-28" id="contacto">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Form */}
          <ScrollReveal variant="fade-up">
            <h2 className="font-heading text-3xl font-bold text-navy md:text-4xl">
              Contáctanos
            </h2>
            <p className="mt-3 text-gray">
              Déjanos tus datos y un asesor se pondrá en contacto contigo.
            </p>

            {isSuccess ? (
              <div className="mt-8 flex flex-col items-center rounded-2xl bg-green-50 p-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-500" />
                <h3 className="mt-4 text-lg font-semibold text-navy">
                  ¡Mensaje enviado!
                </h3>
                <p className="mt-2 text-sm text-gray">
                  Gracias por tu interés. Un asesor te contactará pronto.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-6"
                  onClick={() => setIsSuccess(false)}
                >
                  Enviar otro mensaje
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    id="first_name"
                    name="first_name"
                    label="Nombre *"
                    placeholder="Tu nombre"
                    required
                    minLength={2}
                    maxLength={100}
                  />
                  <Input
                    id="last_name"
                    name="last_name"
                    label="Apellido"
                    placeholder="Tu apellido"
                    maxLength={100}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    label="Correo electrónico *"
                    placeholder="tu@email.com"
                    required
                  />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    label="Teléfono"
                    placeholder="+502 1234 5678"
                  />
                </div>

                {projects.length > 0 && (
                  <Select
                    id="project_interest_id"
                    name="project_interest_id"
                    label="Proyecto de interés"
                    placeholder="Selecciona un proyecto"
                    options={projects.map((p) => ({
                      value: p.id,
                      label: p.name,
                    }))}
                  />
                )}

                <Textarea
                  id="message"
                  name="message"
                  label="Mensaje"
                  placeholder="¿En qué podemos ayudarte?"
                  maxLength={1000}
                  rows={4}
                />

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="newsletter"
                    defaultChecked
                    className="h-4 w-4 rounded border-gray/30 text-celeste focus:ring-celeste"
                  />
                  <span className="text-sm text-gray">
                    Deseo recibir noticias y actualizaciones
                  </span>
                </label>

                {/* Honeypot - hidden from users */}
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </div>

                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}

                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Enviar Mensaje
                </Button>
              </form>
            )}
          </ScrollReveal>

          {/* Map */}
          <ScrollReveal variant="slide-left" className="hidden lg:block">
            <div className="h-full min-h-[400px] overflow-hidden rounded-2xl bg-gray/5">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.9!2d-90.51!3d14.59!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s15+calle+7-77+zona+10+Guatemala!5e0!3m2!1ses!2sgt!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 400 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de Puerta Abierta Inmobiliaria"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
