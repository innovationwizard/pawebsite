import { z } from "zod/v4";

export const contactFormSchema = z.object({
  first_name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre es demasiado largo"),
  last_name: z
    .string()
    .max(100, "El apellido es demasiado largo")
    .optional(),
  email: z
    .email("Ingrese un correo electrónico válido"),
  phone: z
    .string()
    .min(8, "Ingrese un número de teléfono válido")
    .max(20, "El número de teléfono es demasiado largo")
    .optional(),
  project_interest_id: z.string().uuid().optional(),
  message: z
    .string()
    .max(1000, "El mensaje es demasiado largo")
    .optional(),
  is_newsletter_subscriber: z.boolean().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  source: z.string().max(50).optional(),
  // B2B fields used by the /servicios (developer services) form
  company: z.string().max(150, "El nombre de la empresa es demasiado largo").optional(),
  job_title: z.string().max(100, "El cargo es demasiado largo").optional(),
  project_name: z.string().max(150, "El nombre del proyecto es demasiado largo").optional(),
  project_location: z.string().max(150, "La ubicación es demasiado larga").optional(),
  project_stage: z.enum(["preventa", "construccion", "entregado"]).optional(),
  project_units: z
    .number()
    .int("Las unidades deben ser un número entero")
    .positive("Las unidades deben ser mayores a 0")
    .max(100000, "Las unidades exceden el máximo permitido")
    .optional(),
  honeypot: z.string().max(0, "Invalid submission").optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const newsletterSchema = z.object({
  email: z.email("Ingrese un correo electrónico válido"),
  full_name: z
    .string()
    .max(200, "El nombre es demasiado largo")
    .optional(),
  phone: z
    .string()
    .max(20)
    .optional(),
  honeypot: z.string().max(0, "Invalid submission").optional(),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;
