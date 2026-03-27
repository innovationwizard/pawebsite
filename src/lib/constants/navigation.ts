export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Inicio", href: "/" },
  { label: "Proyectos", href: "/proyectos" },
  { label: "Noticias", href: "/noticias" },
  { label: "Avance de Obra", href: "/avance-de-obra" },
  { label: "Preguntas Frecuentes", href: "/preguntas-frecuentes" },
];
