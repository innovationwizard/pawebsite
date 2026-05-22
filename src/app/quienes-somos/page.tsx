import type { Metadata } from "next";
import Image from "next/image";
import {
  Shuffle,
  Lightbulb,
  Leaf,
  ShieldCheck,
  Award,
  Handshake,
  Route,
  Eye,
  Wallet,
  Brain,
  Building2,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import {
  getBrandHighlights,
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

const VALUES = [
  {
    key: "adaptabilidad",
    icon: Shuffle,
    title: "Adaptabilidad",
    description:
      "Evolucionamos con cada desafío y nos ajustamos a un mercado en constante cambio sin perder de vista lo que importa: las familias que confían en nosotros.",
  },
  {
    key: "innovacion",
    icon: Lightbulb,
    title: "Innovación",
    description:
      "Buscamos siempre mejores formas de construir, vender y acompañar. La curiosidad es el motor que nos lleva a transformar el sector inmobiliario en Guatemala.",
  },
  {
    key: "sostenibilidad",
    icon: Leaf,
    title: "Sostenibilidad",
    description:
      "Construimos pensando en las generaciones que vienen, integrando prácticas responsables que cuidan el entorno y fortalecen las comunidades donde trabajamos.",
  },
  {
    key: "integridad",
    icon: ShieldCheck,
    title: "Integridad",
    description:
      "Hacemos lo correcto, incluso cuando nadie nos observa. Honestidad y transparencia son la base de cada decisión y cada relación que construimos.",
  },
  {
    key: "excelencia",
    icon: Award,
    title: "Excelencia",
    description:
      "No nos conformamos con lo suficiente. Elevamos el estándar en cada detalle, desde la primera conversación hasta la entrega de llaves.",
  },
  {
    key: "responsabilidad",
    icon: Handshake,
    title: "Responsabilidad",
    description:
      "Asumimos cada compromiso con seriedad. Nuestra palabra es nuestro contrato y respondemos por cada promesa hecha a clientes, equipos y socios.",
  },
];

const DIFERENCIADORES = [
  {
    key: "acompanamiento",
    icon: Route,
    title: "Acompañamiento de Principio a Fin",
    description:
      "Desde la primera conversación hasta el día que recibes tus llaves, tienes un equipo dedicado que responde tus dudas, gestiona los trámites y te mantiene informado del avance de tu proyecto. No te dejamos solo en ningún paso — porque sabemos que comprar tu apartamento es una de las decisiones más importantes de tu vida.",
  },
  {
    key: "transparencia",
    icon: Eye,
    title: "Transparencia Total",
    description:
      "Sin costos ocultos, sin sorpresas, sin letra pequeña. Te explicamos cada número, cada plazo y cada condición antes de que tomes una decisión. Creemos que un cliente bien informado es un cliente que compra con confianza — y eso nos conviene a todos.",
  },
  {
    key: "financiamiento",
    icon: Wallet,
    title: "Financiamiento a Tu Medida",
    description:
      "Trabajamos con múltiples opciones de crédito, programas de vivienda accesible y esquemas de enganche flexibles para encontrar el plan que se adapta a tu realidad financiera — no al revés. Tu asesor te guía entre las opciones hasta encontrar la que te funciona.",
  },
  {
    key: "datos-ia",
    icon: Brain,
    title: "Decisiones Respaldadas por Datos e IA",
    description:
      "Usamos inteligencia artificial y análisis de datos para entender el mercado en tiempo real, identificar las mejores oportunidades y darte recomendaciones precisas según tu perfil. No vendemos por intuición — vendemos con evidencia.",
  },
  {
    key: "respaldo",
    icon: Building2,
    title: "+5 Años y 12 Proyectos de Respaldo",
    description:
      "No somos nuevos en esto. Más de dos décadas entregando hogares en Guatemala nos dieron algo que no se puede comprar: experiencia real, relaciones sólidas con desarrolladores de primer nivel y la reputación de cumplir lo que prometemos.",
  },
  {
    key: "respuesta",
    icon: Zap,
    title: "Respuesta Inmediata, Siempre",
    description:
      "Tu tiempo vale. Por eso respondemos rápido — con asesores disponibles por WhatsApp, teléfono y chat, respaldados por herramientas digitales que agilizan cotizaciones, comparaciones y trámites. Nada de \"te llamo la próxima semana\".",
  },
];

export default async function QuienesSomosPage() {
  const [highlights, heroMedia, content] = await Promise.all([
    getBrandHighlights(),
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

            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {VALUES.map((value, index) => {
                const Icon = value.icon;
                return (
                  <ScrollReveal
                    key={value.key}
                    variant="fade-up"
                    delay={index * 0.1}
                  >
                    <div className="h-full rounded-2xl bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-lg">
                      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-celeste/10 text-celeste">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-heading text-xl font-bold text-navy">
                        {value.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-gray">
                        {value.description}
                      </p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Diferenciadores */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <ScrollReveal variant="fade-up" className="text-center">
              <h2 className="font-heading text-3xl font-bold text-navy md:text-4xl lg:text-5xl">
                Nuestros Diferenciadores
              </h2>
            </ScrollReveal>

            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {DIFERENCIADORES.map((item, index) => {
                const Icon = item.icon;
                return (
                  <ScrollReveal
                    key={item.key}
                    variant="fade-up"
                    delay={index * 0.1}
                  >
                    <div className="h-full rounded-2xl border border-gray/10 bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-lg">
                      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-navy/5 text-navy">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-heading text-xl font-bold text-navy">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-gray">
                        {item.description}
                      </p>
                    </div>
                  </ScrollReveal>
                );
              })}
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
