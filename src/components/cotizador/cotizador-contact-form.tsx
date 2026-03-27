"use client";

import { useState, type FormEvent } from "react";
import type { Currency } from "@/lib/types/database";

interface ProjectOption {
  id: string;
  name: string;
  starting_price: number | null;
  currency: Currency;
}

interface CotizadorContactFormProps {
  projectOptions: ProjectOption[];
}

export function CotizadorContactForm({ projectOptions }: CotizadorContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const payload = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      project_interest_id: (formData.get("project_interest_id") as string) || undefined,
      message: formData.get("message") as string,
      source_detail: "cotizador",
      honeypot: formData.get("honeypot") as string,
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

      setIsSuccess(true);
    } catch {
      setError("Error de conexi\u00f3n. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl bg-off-white p-8">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-celeste/10">
            <svg
              className="h-8 w-8 text-celeste"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>
          <h3 className="mt-4 font-heading text-xl font-bold text-navy">
            Solicitud Enviada
          </h3>
          <p className="mt-2 text-sm text-gray">
            Un asesor se comunicar&aacute; contigo pronto para brindarte una
            cotizaci&oacute;n personalizada.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-off-white p-8">
      <h2 className="font-heading text-2xl font-bold text-navy">
        Contacta un Asesor
      </h2>
      <p className="mt-2 text-sm text-gray">
        Recibe una cotizaci&oacute;n personalizada de uno de nuestros asesores.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {/* Honeypot */}
        <input
          type="text"
          name="honeypot"
          tabIndex={-1}
          autoComplete="off"
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="cot-first-name" className="block text-sm font-medium text-navy">
              Nombre *
            </label>
            <input
              id="cot-first-name"
              name="first_name"
              type="text"
              required
              minLength={2}
              className="mt-2 w-full rounded-lg border border-gray/20 bg-white px-4 py-3 text-sm text-navy outline-none transition-colors focus:border-celeste focus:ring-2 focus:ring-celeste/20"
            />
          </div>
          <div>
            <label htmlFor="cot-last-name" className="block text-sm font-medium text-navy">
              Apellido
            </label>
            <input
              id="cot-last-name"
              name="last_name"
              type="text"
              className="mt-2 w-full rounded-lg border border-gray/20 bg-white px-4 py-3 text-sm text-navy outline-none transition-colors focus:border-celeste focus:ring-2 focus:ring-celeste/20"
            />
          </div>
        </div>

        <div>
          <label htmlFor="cot-email" className="block text-sm font-medium text-navy">
            Correo electr&oacute;nico *
          </label>
          <input
            id="cot-email"
            name="email"
            type="email"
            required
            className="mt-2 w-full rounded-lg border border-gray/20 bg-white px-4 py-3 text-sm text-navy outline-none transition-colors focus:border-celeste focus:ring-2 focus:ring-celeste/20"
          />
        </div>

        <div>
          <label htmlFor="cot-phone" className="block text-sm font-medium text-navy">
            Tel&eacute;fono
          </label>
          <input
            id="cot-phone"
            name="phone"
            type="tel"
            className="mt-2 w-full rounded-lg border border-gray/20 bg-white px-4 py-3 text-sm text-navy outline-none transition-colors focus:border-celeste focus:ring-2 focus:ring-celeste/20"
          />
        </div>

        {projectOptions.length > 0 && (
          <div>
            <label htmlFor="cot-project" className="block text-sm font-medium text-navy">
              Proyecto de inter&eacute;s
            </label>
            <select
              id="cot-project"
              name="project_interest_id"
              className="mt-2 w-full rounded-lg border border-gray/20 bg-white px-4 py-3 text-sm text-navy outline-none transition-colors focus:border-celeste focus:ring-2 focus:ring-celeste/20"
            >
              <option value="">Selecciona un proyecto</option>
              {projectOptions.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="cot-message" className="block text-sm font-medium text-navy">
            Mensaje
          </label>
          <textarea
            id="cot-message"
            name="message"
            rows={3}
            className="mt-2 w-full resize-none rounded-lg border border-gray/20 bg-white px-4 py-3 text-sm text-navy outline-none transition-colors focus:border-celeste focus:ring-2 focus:ring-celeste/20"
            placeholder="Cu&eacute;ntanos sobre tu proyecto ideal..."
          />
        </div>

        {error && (
          <p className="text-sm font-medium text-red-500">{error}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-navy px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-navy/90 hover:shadow-lg disabled:opacity-50"
        >
          {isSubmitting ? "Enviando..." : "Solicitar Cotizaci\u00f3n"}
        </button>
      </form>
    </div>
  );
}
