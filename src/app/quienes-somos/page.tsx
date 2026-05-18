import type { Metadata } from "next";
import Image from "next/image";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { getBrandHighlights, getTeamMembers } from "@/lib/queries/settings";
import { CounterAnimation } from "@/components/animations/counter-animation";

export const metadata: Metadata = {
  title: "Quiénes Somos | Puerta Abierta Inmobiliaria",
  description:
    "Conoce a Puerta Abierta Inmobiliaria. Más de 22 años desarrollando proyectos inmobiliarios de alta calidad en Guatemala, creando comunidades donde las familias pueden crecer y prosperar.",
};

export default async function QuienesSomosPage() {
  const [highlights, teamMembers] = await Promise.all([
    getBrandHighlights(),
    getTeamMembers(),
  ]);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative bg-navy pb-20 pt-40 md:pb-28 md:pt-48">
          <div className="mx-auto max-w-7xl px-6">
            <ScrollReveal variant="fade-up">
              <h1 className="font-heading text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                Quiénes Somos
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
                Somos una empresa guatemalteca dedicada al desarrollo de
                proyectos inmobiliarios de alta calidad. Nuestra misión es
                transformar la vida de las familias guatemaltecas a través de
                hogares y comunidades excepcionales.
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
                  Desarrollar proyectos inmobiliarios que superen las
                  expectativas de nuestros clientes, generando valor sostenible
                  para las comunidades y contribuyendo al desarrollo urbano de
                  Guatemala con los más altos estándares de calidad.
                </p>
              </ScrollReveal>

              <ScrollReveal variant="fade-up" delay={0.15}>
                <h2 className="font-heading text-3xl font-bold text-navy md:text-4xl">
                  Nuestra Visión
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-gray">
                  Ser la inmobiliaria líder en Guatemala, reconocida por la
                  excelencia en cada proyecto, la innovación en nuestros
                  diseños y el compromiso genuino con el bienestar de las
                  familias que confían en nosotros.
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
              {[
                {
                  title: "Calidad",
                  description:
                    "Cada detalle importa. Desde los materiales hasta el diseño, buscamos la excelencia en todo lo que hacemos.",
                },
                {
                  title: "Transparencia",
                  description:
                    "Operamos con honestidad y claridad en cada paso del proceso, construyendo relaciones de confianza con nuestros clientes.",
                },
                {
                  title: "Innovación",
                  description:
                    "Incorporamos las últimas tendencias en diseño y construcción para ofrecer espacios modernos y funcionales.",
                },
                {
                  title: "Compromiso",
                  description:
                    "Acompañamos a nuestros clientes desde la primera consulta hasta la entrega de su hogar y más allá.",
                },
              ].map((value, index) => (
                <ScrollReveal
                  key={value.title}
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
        {highlights && (
          <section className="bg-navy py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-6">
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    value: highlights.projects_count,
                    prefix: "+",
                    suffix: "",
                    label: "Proyectos Desarrollados",
                  },
                  {
                    value: highlights.sqm_developed,
                    prefix: "",
                    suffix: "",
                    label: "Mil m\u00b2 Desarrollados",
                  },
                  {
                    value: highlights.years_experience,
                    prefix: "+",
                    suffix: "",
                    label: "A\u00f1os de Experiencia",
                  },
                  {
                    value: highlights.historical_sales_millions,
                    prefix: "$",
                    suffix: "M",
                    label: "Millones Hist\u00f3ricos",
                  },
                ].map((item) => (
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
                Con m&aacute;s de dos d&eacute;cadas de experiencia en el mercado
                inmobiliario guatemalteco, hemos desarrollado proyectos que han
                transformado comunidades y brindado hogares de calidad a miles
                de familias. Cada proyecto refleja nuestro compromiso con la
                excelencia y la innovaci&oacute;n.
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
