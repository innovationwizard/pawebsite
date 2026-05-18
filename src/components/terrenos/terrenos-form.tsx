"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function TerrenosForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const terrainLocation = formData.get("terrain_location") as string;
    const terrainArea = formData.get("terrain_area") as string;
    const userMessage = formData.get("user_message") as string;

    const messageParts = [
      `Zona/Ubicación del terreno: ${terrainLocation}`,
      `Área aproximada: ${terrainArea} m²`,
    ];
    if (userMessage) messageParts.push(`Mensaje: ${userMessage}`);

    const payload = {
      first_name: formData.get("first_name") as string,
      last_name: "",
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      message: messageParts.join(" | "),
      source: "terrenos",
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

      router.push("/graciasportucontacto");
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl bg-off-white p-8 shadow-sm">
      <h2 className="font-heading text-2xl font-bold text-navy">
        Cuéntanos sobre tu terreno
      </h2>
      <p className="mt-2 text-sm text-gray">
        Completa el formulario y un asesor te contactará en menos de 24 horas.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
          <label htmlFor="ter-name" className="block text-sm font-medium text-navy">
            Nombre completo *
          </label>
          <input
            id="ter-name"
            name="first_name"
            type="text"
            required
            minLength={2}
            className="mt-2 w-full rounded-lg border border-gray/20 bg-white px-4 py-3 text-sm text-navy outline-none transition-colors focus:border-celeste focus:ring-2 focus:ring-celeste/20"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="ter-phone" className="block text-sm font-medium text-navy">
              Teléfono *
            </label>
            <input
              id="ter-phone"
              name="phone"
              type="tel"
              required
              minLength={8}
              className="mt-2 w-full rounded-lg border border-gray/20 bg-white px-4 py-3 text-sm text-navy outline-none transition-colors focus:border-celeste focus:ring-2 focus:ring-celeste/20"
              placeholder="+502 0000 0000"
            />
          </div>
          <div>
            <label htmlFor="ter-email" className="block text-sm font-medium text-navy">
              Correo electrónico *
            </label>
            <input
              id="ter-email"
              name="email"
              type="email"
              required
              className="mt-2 w-full rounded-lg border border-gray/20 bg-white px-4 py-3 text-sm text-navy outline-none transition-colors focus:border-celeste focus:ring-2 focus:ring-celeste/20"
            />
          </div>
        </div>

        <div>
          <label htmlFor="ter-location" className="block text-sm font-medium text-navy">
            Zona o municipio del terreno *
          </label>
          <input
            id="ter-location"
            name="terrain_location"
            type="text"
            required
            className="mt-2 w-full rounded-lg border border-gray/20 bg-white px-4 py-3 text-sm text-navy outline-none transition-colors focus:border-celeste focus:ring-2 focus:ring-celeste/20"
            placeholder="Ej. Zona 16, Mixco, Villa Nueva..."
          />
        </div>

        <div>
          <label htmlFor="ter-area" className="block text-sm font-medium text-navy">
            Área aproximada (m²) *
          </label>
          <input
            id="ter-area"
            name="terrain_area"
            type="number"
            required
            min={1}
            className="mt-2 w-full rounded-lg border border-gray/20 bg-white px-4 py-3 text-sm text-navy outline-none transition-colors focus:border-celeste focus:ring-2 focus:ring-celeste/20"
            placeholder="Ej. 500"
          />
        </div>

        <div>
          <label htmlFor="ter-message" className="block text-sm font-medium text-navy">
            Información adicional
          </label>
          <textarea
            id="ter-message"
            name="user_message"
            rows={3}
            className="mt-2 w-full resize-none rounded-lg border border-gray/20 bg-white px-4 py-3 text-sm text-navy outline-none transition-colors focus:border-celeste focus:ring-2 focus:ring-celeste/20"
            placeholder="Cuéntanos más sobre tu terreno: uso actual, acceso, escritura, etc."
          />
        </div>

        {error && (
          <p className="text-sm font-medium text-red-500">{error}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-navy px-6 py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-navy/90 hover:shadow-lg disabled:opacity-50"
        >
          {isSubmitting ? "Enviando..." : "Solicitar evaluación gratuita"}
        </button>

        <p className="text-center text-xs text-gray/60">
          Sin compromiso. Tu información es confidencial.
        </p>
      </form>
    </div>
  );
}
