export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Inicio", href: "/" },
  { label: "Quiénes Somos", href: "/quienes-somos" },
  { label: "Proyectos", href: "/proyectos" },
  { label: "Avances de Obra", href: "/avance-de-obra" },
  { label: "Blog y Noticias", href: "/noticias" },
  { label: "Preguntas Frecuentes", href: "/preguntas-frecuentes" },
];
