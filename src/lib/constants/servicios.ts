/**
 * Copy for the /servicios (developer marketing & sales services) landing.
 * Source: "Optimizaciones Website PAI" (ajustes6). Marketing can revise the
 * wording here; numbers live in site_settings.servicios_kpis.
 */

export const SERVICIOS_CTA_LABEL = "Sí, quiero llevar mis ventas a otro nivel";

export const SERVICIOS_WHATSAPP_TEXT =
  "Hola, soy desarrollador y quiero información sobre los servicios de marketing y ventas de Puerta Abierta.";

export interface ServiciosReason {
  icon: "operators" | "performance" | "team" | "technology";
  title: string;
  description: string;
  highlighted?: boolean;
}

/** "¿Cómo lo hacemos?" cards — copy from the client's reference image. */
export const SERVICIOS_REASONS: ServiciosReason[] = [
  {
    icon: "operators",
    title: "Operadores, no teóricos",
    description:
      "Probamos cada estrategia vendiendo nuestros propios proyectos antes de aplicarla al tuyo.",
  },
  {
    icon: "performance",
    title: "Enfoque a performance",
    description:
      "Cada quetzal de pauta se mide contra leads, citas y cierres. Decisiones por datos, no por intuición.",
  },
  {
    icon: "team",
    title: "Equipo y procesos listos",
    description:
      "Manuales, fuerza comercial y metodología que se adaptan a tu proyecto desde la semana uno.",
  },
  {
    icon: "technology",
    title: "Tecnología propia",
    description:
      "CRM integrado y una app única en el mercado que conecta todo el giro inmobiliario.",
    highlighted: true,
  },
];

export interface ServiciosPillar {
  icon: "marketing" | "sales" | "technology";
  title: string;
  description: string;
  bullets: string[];
}

export const SERVICIOS_PILLARS: ServiciosPillar[] = [
  {
    icon: "marketing",
    title: "Marketing",
    description:
      "Estrategia mercadológica y performance marketing que llena el embudo de ventas de leads calificados, con optimización constante.",
    bullets: [
      "Ecosistema digital completo: pauta + content management",
      "IA aplicada a marketing y analítica",
      "Optimización constante del embudo",
    ],
  },
  {
    icon: "sales",
    title: "Ventas",
    description:
      "Fuerza comercial estructurada y un enfoque integral que convierte interés en cierres.",
    bullets: ["Equipo comercial", "Cartera calificada", "Cierres"],
  },
  {
    icon: "technology",
    title: "Tecnología",
    description:
      "La operación completa sobre nuestra propia plataforma: CRM integrado, herramientas de IA y PAI App.",
    bullets: ["CRM integrado", "Herramientas de IA", "PAI App"],
  },
];

export interface ServiciosStep {
  number: string;
  title: string;
  description: string;
}

/** "Enfoque integral basado en datos: asesoramos, no presionamos." */
export const SERVICIOS_APPROACH: ServiciosStep[] = [
  {
    number: "01",
    title: "Análisis de la competencia",
    description:
      "Estudiamos el mercado y los proyectos con los que compites antes de definir la estrategia.",
  },
  {
    number: "02",
    title: "Asesoría con expertise",
    description:
      "Te asesoramos con la experiencia de más de 22 años comercializando proyectos inmobiliarios en Guatemala.",
  },
  {
    number: "03",
    title: "Conversión y cierres",
    description:
      "Convertimos el interés en cierres con un equipo comercial y un proceso medido de punta a punta.",
  },
];

/**
 * Default KPIs (client-provided figures, ajustes6). Overridden by
 * site_settings.servicios_kpis once Marketing saves values from the admin.
 */
export const SERVICIOS_DEFAULT_KPIS = [
  { value: "8%", label: "Tasa de conversión promedio", note: "" },
  { value: "1,200", label: "Leads promedio por proyecto", note: "Basados en optimización digital" },
  { value: "Q15", label: "Costo por lead promedio", note: "Dependiendo del target del proyecto" },
];

/** Projects showcased as "ya confiaron en el método Puerta Abierta", matched by name. */
export const SERVICIOS_SHOWCASE_PROJECT_NAMES = [
  "Boulevard 5",
  "Benestare",
  "Bosque Las Tapias",
  "Santa Elena",
];
