export interface NavItem {
  label: string;
  href: string;
}

/** Main menu, in the order approved in ajustes6. "Cotiza Ahora" is the separate CTA button. */
export const NAV_ITEMS: NavItem[] = [
  { label: "Inicio", href: "/" },
  { label: "Quiénes Somos", href: "/quienes-somos" },
  { label: "Servicios", href: "/servicios" },
  { label: "Proyectos", href: "/proyectos" },
  { label: "Terrenos", href: "/terrenos" },
  { label: "Avances de Obra", href: "/avance-de-obra" },
  { label: "FAQ", href: "/preguntas-frecuentes" },
];

export const NAV_CTA: NavItem = { label: "Cotiza Ahora", href: "/cotizador" };

/** Footer "Navegación" column: main menu + the pages that left the header. */
export const FOOTER_NAV: NavItem[] = [
  ...NAV_ITEMS,
  { label: "Cotizador", href: "/cotizador" },
];

export const BLOG_NAV: NavItem = { label: "Blog y Noticias", href: "/noticias" };

export const LEGAL_NAV: NavItem[] = [
  { label: "Política de Privacidad", href: "/politica-de-privacidad" },
  { label: "Términos y Condiciones", href: "/terminos-y-condiciones" },
];
