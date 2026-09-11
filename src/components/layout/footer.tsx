import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin, Newspaper } from "lucide-react";
import { FOOTER_NAV, LEGAL_NAV, BLOG_NAV } from "@/lib/constants/navigation";
import { ButtonLink } from "@/components/ui/button-link";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
  TiktokIcon,
} from "@/components/ui/social-icons";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Image
              src="/icons/logo.png"
              alt="Puerta Abierta Inmobiliaria"
              width={640}
              height={200}
              className="h-28 w-auto"
            />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
              Desarrollamos proyectos inmobiliarios de alta calidad en Guatemala.
              Más de 22 años de experiencia construyendo hogares y comunidades.
            </p>
            <ButtonLink
              href={BLOG_NAV.href}
              variant="outline-light"
              size="sm"
              className="mt-6"
            >
              <Newspaper className="h-4 w-4" aria-hidden="true" />
              {BLOG_NAV.label}
            </ButtonLink>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.22em] text-celeste">
              Navegación
            </h3>
            <ul className="space-y-3">
              {FOOTER_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/60 transition-colors hover:text-celeste"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.22em] text-celeste">
              Contacto
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-white/60">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-celeste" />
                <span>
                  15 calle 7-77 zona 10, Edif. Optima Centro de Negocios,
                  5to Nivel, Of. 504, Guatemala
                </span>
              </li>
              <li>
                <a
                  href="tel:+50224249388"
                  className="flex items-center gap-3 text-sm text-white/60 transition-colors hover:text-celeste"
                >
                  <Phone className="h-4 w-4 shrink-0 text-celeste" />
                  +502 24249388
                </a>
              </li>
              <li>
                <a
                  href="mailto:ventas@puertaabierta.com.gt"
                  className="flex items-center gap-3 text-sm text-white/60 transition-colors hover:text-celeste"
                >
                  <Mail className="h-4 w-4 shrink-0 text-celeste" />
                  ventas@puertaabierta.com.gt
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.22em] text-celeste">
              Síguenos
            </h3>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.facebook.com/puertaabiertainmobiliaria"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-celeste"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/puertaabierta_inmobiliaria/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-celeste"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href="https://www.tiktok.com/@puerta.abierta.gt"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-celeste"
              >
                <TiktokIcon className="h-5 w-5" />
              </a>
              <a
                href="https://www.youtube.com/@PuertaAbiertaInmobiliaria"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-celeste"
              >
                <YoutubeIcon className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/puerta-abierta-inmobiliaria/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-celeste"
              >
                <LinkedinIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
          <p>&copy; {currentYear} Puerta Abierta Inmobiliaria. Guatemala. Todos los derechos reservados.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/#contacto" className="transition-colors hover:text-white">
                Contacto
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
