import type { Metadata } from "next";
import Image from "next/image";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import {
  getBrandHighlights,
  getTeamMembers,
  getQuienesSomosHero,
  getQuienesSomosContent,
  parseHighlightValue,
} from "@/lib/queries/settings";
import { CounterAnimation } from "@/components/animations/counter-animation";

export const metadata: Metadata = {
  title: "Quiénes Somos | Puerta Abierta Inmobiliaria",
  description:
    "Conoce a Puerta Abierta Inmobiliaria. Más de 22 años desarrollando proyectos inmobiliarios de alta calidad en Guatemala, creando comunidades donde las familias pueden crecer y prosperar.",
};

const DEFAULT_VALUES = [
  {
    key: "value_1",
    title: "Calidad",
    description:
      "Cada detalle importa. Desde los materiales hasta el diseño, buscamos la excelencia en todo lo que hacemos.",
  },
  {
    key: "value_2",
    title: "Transparencia",
    description:
      "Operamos con honestidad y claridad en cada paso del proceso, construyendo relaciones de confianza con nuestros clientes.",
  },
  {
    key: "value_3",
    title: "Innovación",
    description:
      "Incorporamos las últimas tendencias en diseño y construcción para ofrecer espacios modernos y funcionales.",
  },
  {
    key: "value_4",
    title: "Compromiso",
    description:
      "Acompañamos a nuestros clientes desde la primera consulta hasta la entrega de su hogar y más allá.",
  },
];

export default async function QuienesSomosPage() {
  const [highlights, teamMembers, heroMedia, content] = await Promise.all([
    getBrandHighlights(),
    getTeamMembers(),
    getQuienesSomosHero(),
    getQuienesSomosContent(),
  ]);

  const heroH1 = content?.hero_h1 || "Quiénes Somos";
  const heroSubtext =
    content?.hero_subtext ||
    "Somos una empresa guatemalteca dedicada al desarrollo de proyectos inmobiliarios de alta calidad. Nuestra misión es transformar la vida de las familias guatemaltecas a través de hogares y comunidades excepcionales.";
  const mission =
    content?.mission ||
    "Desarrollar proyectos inmobiliarios que superen las expectativas de nuestros clientes, generando valor sostenible para las comunidades y contribuyendo al desarrollo urbano de Guatemala con los más altos estándares de calidad.";
  const vision =
    content?.vision ||
    "Ser la inmobiliaria líder en Guatemala, reconocida por la excelencia en cada proyecto, la innovación en nuestros diseños y el compromiso genuino con el bienestar de las familias que confían en nosotros.";
  const trayectoria =
    content?.trayectoria ||
    "Con más de dos décadas de experiencia en el mercado inmobiliario guatemalteco, hemos desarrollado proyectos que han transformado comunidades y brindado hogares de calidad a miles de familias. Cada proyecto refleja nuestro compromiso con la excelencia y la innovación.";

  const values = [
    {
      key: "value_1",
      title: content?.value_1_title || DEFAULT_VALUES[0].title,
      description: content?.value_1_desc || DEFAULT_VALUES[0].description,
    },
    {
      key: "value_2",
      title: content?.value_2_title || DEFAULT_VALUES[1].title,
      description: content?.value_2_desc || DEFAULT_VALUES[1].description,
    },
    {
      key: "value_3",
      title: content?.value_3_title || DEFAULT_VALUES[2].title,
      description: content?.value_3_desc || DEFAULT_VALUES[2].description,
    },
    {
      key: "value_4",
      title: content?.value_4_title || DEFAULT_VALUES[3].title,
      description: content?.value_4_desc || DEFAULT_VALUES[3].description,
    },
  ];

  const hasHeroMedia = heroMedia?.url && heroMedia.url.trim() !== "";

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-navy pb-20 pt-40 md:pb-28 md:pt-48">
          {/* Hero background media */}
          {hasHeroMedia && heroMedia!.type === "image" && (
            <Image
              src={heroMedia!.url}
              alt=""
              fill
              className="object-cover"
              priority
            />
          )}
          {hasHeroMedia && heroMedia!.type === "video" && (
            <video
              src={heroMedia!.url}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          {hasHeroMedia && (
            <div className="absolute inset-0 bg-navy/70" />
          )}

          <div className="relative mx-auto max-w-7xl px-6">
            <ScrollReveal variant="fade-up">
              <h1 className="font-heading text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                {heroH1}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
                {heroSubtext}
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-16 md:grid-cols-2">
              <ScrollReveal variant="fade-up">
                <h2 className="font-heading text-3xl font-bold text-navy md:text-4xl">
                  Nuestra Misión
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-gray">
                  {mission}
                </p>
              </ScrollReveal>

              <ScrollReveal variant="fade-up" delay={0.15}>
                <h2 className="font-heading text-3xl font-bold text-navy md:text-4xl">
                  Nuestra Visión
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-gray">
                  {vision}
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-off-white py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <ScrollReveal variant="fade-up" className="text-center">
              <h2 className="font-heading text-3xl font-bold text-navy md:text-4xl lg:text-5xl">
                Nuestros Valores
              </h2>
            </ScrollReveal>

            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => (
                <ScrollReveal
                  key={value.key}
                  variant="fade-up"
                  delay={index * 0.1}
                >
                  <div className="rounded-2xl bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-lg">
                    <h3 className="font-heading text-xl font-bold text-navy">
                      {value.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-gray">
                      {value.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Highlights / Stats */}
        {highlights.length > 0 && (
          <section className="bg-navy py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-6">
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {highlights
                  .map((h) => {
                    const { prefix, end, suffix } = parseHighlightValue(h.value);
                    return { value: end, prefix, suffix, label: h.label };
                  })
                  .map((item) => (
                  <ScrollReveal key={item.label} variant="fade-up">
                    <div className="text-center">
                      <p className="font-heading text-4xl font-bold text-white md:text-5xl">
                        <CounterAnimation
                          end={item.value}
                          prefix={item.prefix}
                          suffix={item.suffix}
                        />
                      </p>
                      <p className="mt-2 text-sm text-white/60">{item.label}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Team Members */}
        {teamMembers.length > 0 && (
          <section className="py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-6">
              <ScrollReveal variant="fade-up" className="text-center">
                <h2 className="font-heading text-3xl font-bold text-navy md:text-4xl lg:text-5xl">
                  Nuestro Equipo
                </h2>
              </ScrollReveal>

              <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {teamMembers.map((member, index) => (
                  <ScrollReveal key={index} variant="fade-up" delay={index * 0.1}>
                    <div className="flex flex-col items-center rounded-2xl bg-white p-6 text-center shadow-sm transition-shadow duration-300 hover:shadow-lg">
                      {member.photo_url ? (
                        <Image
                          src={member.photo_url}
                          alt={member.name}
                          width={120}
                          height={120}
                          className="h-28 w-28 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-celeste/10">
                          <span className="font-heading text-3xl font-bold text-celeste">
                            {member.name
                              .split(" ")
                              .slice(0, 2)
                              .map((w: string) => w[0])
                              .join("")
                              .toUpperCase()}
                          </span>
                        </div>
                      )}
                      <h3 className="mt-4 font-heading text-lg font-bold text-navy">
                        {member.name}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-celeste">{member.title}</p>
                      {member.bio && (
                        <p className="mt-3 text-sm leading-relaxed text-gray">{member.bio}</p>
                      )}
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Trayectoria */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <ScrollReveal variant="fade-up" className="mx-auto max-w-3xl text-center">
              <h2 className="font-heading text-3xl font-bold text-navy md:text-4xl lg:text-5xl">
                Nuestra Trayectoria
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-gray">
                {trayectoria}
              </p>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
