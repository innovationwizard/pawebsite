import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://puertaabierta.com.gt";

export const DEFAULT_METADATA: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Puerta Abierta Inmobiliaria",
    template: "%s | Puerta Abierta Inmobiliaria",
  },
  description:
    "Desarrollamos proyectos inmobiliarios de alta calidad en Guatemala. Más de 22 años de experiencia, 30+ proyectos desarrollados y 901 unidades en 5 proyectos activos.",
  keywords: [
    "inmobiliaria Guatemala",
    "apartamentos Guatemala",
    "casas Antigua Guatemala",
    "Puerta Abierta",
    "Grupo Orión",
    "bienes raíces Guatemala",
    "inversión inmobiliaria",
  ],
  authors: [{ name: "Puerta Abierta Inmobiliaria" }],
  creator: "Puerta Abierta Inmobiliaria",
  publisher: "Puerta Abierta Inmobiliaria",
  icons: {
    icon: "/favicon.png",
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "es_GT",
    url: SITE_URL,
    siteName: "Puerta Abierta Inmobiliaria",
    title: "Puerta Abierta Inmobiliaria",
    description:
      "Desarrollamos proyectos inmobiliarios de alta calidad en Guatemala. Más de 22 años de experiencia y 30+ proyectos desarrollados.",
    images: [
      {
        url: "/og/og-image.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Puerta Abierta Inmobiliaria",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Puerta Abierta Inmobiliaria",
    description:
      "Desarrollamos proyectos inmobiliarios de alta calidad en Guatemala.",
    images: ["/og/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
