const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://puertaabierta.com.gt";

export function HomeStructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Puerta Abierta Inmobiliaria",
    url: SITE_URL,
    logo: `${SITE_URL}/icons/logo.png`,
    description:
      "Desarrollamos proyectos inmobiliarios de alta calidad en Guatemala. Más de 22 años de experiencia.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "15 calle 7-77 zona 10, Edif. Optima Centro de Negocios, 5to Nivel, Of. 504",
      addressLocality: "Guatemala",
      addressRegion: "Guatemala",
      addressCountry: "GT",
    },
    telephone: "+50242403164",
    email: "ventas@puertaabierta.com.gt",
    foundingDate: "2004",
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      value: 33,
    },
    areaServed: {
      "@type": "Country",
      name: "Guatemala",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
