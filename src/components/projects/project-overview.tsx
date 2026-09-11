import { Building2, Layers, BedDouble, Ruler, Sparkles, Globe } from "lucide-react";
import { FacebookIcon, InstagramIcon, WhatsappIcon } from "@/components/ui/social-icons";
import type { Database } from "@/lib/types/database";

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];

interface ProjectOverviewProps {
  project: ProjectRow;
}

interface ProjectLink {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const FALLBACK_WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "50224249388";

const LINK_CLASS =
  "btn-sweep inline-flex items-center gap-2 rounded-full border-2 border-navy/15 px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-navy/5 [--sweep-color:var(--color-primary)]";

export function ProjectOverview({ project }: ProjectOverviewProps) {
  const whatsappNumber = project.whatsapp_number || FALLBACK_WHATSAPP;
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hola, me interesa obtener más información sobre el proyecto ${project.name}.`
  )}`;
  const links: ProjectLink[] = [
    ...(project.website_url ? [{ href: project.website_url, label: "Sitio web", Icon: Globe }] : []),
    ...(project.facebook_url ? [{ href: project.facebook_url, label: "Facebook", Icon: FacebookIcon }] : []),
    ...(project.instagram_url ? [{ href: project.instagram_url, label: "Instagram", Icon: InstagramIcon }] : []),
    { href: whatsappHref, label: "WhatsApp", Icon: WhatsappIcon },
  ];

  const specs = [
    project.total_units > 0 && {
      icon: Building2,
      label: "Unidades",
      value: `${project.total_units} unidades`,
    },
    project.towers && {
      icon: Layers,
      label: "Torres",
      value: `${project.towers} torres${project.floors_per_tower ? ` · ${project.floors_per_tower} pisos` : ""}`,
    },
    project.bedroom_range && {
      icon: BedDouble,
      label: "Habitaciones",
      value: `${project.bedroom_range} habitaciones`,
    },
    project.area_range_m2 && {
      icon: Ruler,
      label: "Área",
      value: project.area_range_m2,
    },
    project.special_features &&
      project.special_features.length > 0 && {
        icon: Sparkles,
        label: "Características",
        value: project.special_features.join(", "),
      },
  ].filter(Boolean) as { icon: React.ComponentType<{ className?: string }>; label: string; value: string }[];

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Description */}
          <div>
            <h2 className="font-heading text-2xl font-extrabold tracking-tight text-navy md:text-3xl">
              Acerca del Proyecto
            </h2>
            {project.description ? (
              <p className="mt-4 text-lg leading-relaxed text-gray">
                {project.description}
              </p>
            ) : (
              <p className="mt-4 text-gray/40">
                [ Descripción del proyecto — administrable desde el CMS ]
              </p>
            )}

            {/* Website, social networks and WhatsApp of the project */}
            <div className="mt-8 flex flex-wrap gap-3">
              {links.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK_CLASS}
                >
                  <Icon className="h-4 w-4 text-primary" />
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Key specs */}
          <div className="grid grid-cols-2 gap-4">
            {specs.map((spec) => (
              <div
                key={spec.label}
                className="rounded-2xl bg-off-white p-5"
              >
                <spec.icon className="h-6 w-6 text-celeste" />
                <p className="mt-3 text-xs font-medium uppercase tracking-wider text-gray">
                  {spec.label}
                </p>
                <p className="mt-1 font-heading text-lg font-bold text-navy">
                  {spec.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
