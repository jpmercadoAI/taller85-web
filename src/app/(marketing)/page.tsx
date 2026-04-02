import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/sections/contact-form";
import { createClient } from "@/lib/supabase/server";
import ProjectsGallery from "@/components/sections/projects-gallery";
import { Boxes, Wrench, Shuffle } from "lucide-react";
import HeroVideo from "@/components/sections/hero-video";

const title = "Taller 85";
const description =
  "Taller 85 integra construcción, espacios, manufactura, branding y media para desarrollar soluciones reales en proyectos, espacios y marcas.";
const url = "https://www.taller85.cl";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Taller 85 | Soluciones para proyectos, espacios y marcas",
    description,
    url,
    type: "website",
  },
  twitter: {
    title: "Taller 85 | Soluciones para proyectos, espacios y marcas",
    description,
  },
};

const areas = [
  {
    name: "Construcción",
    id: "construccion",
    href: "/construccion",
    color: "var(--construction)",
    desc: "Obras e instalación en terreno",
    image: "/images/areas/construccion.jpg",
  },
  {
    name: "Espacios",
    id: "espacios",
    href: "/espacios",
    color: "var(--spaces)",
    desc: "Diseño y habilitación de espacios",
    image: "/images/areas/espacios.jpg",
  },
  {
    name: "Manufactura",
    id: "manufactura",
    href: "/manufactura",
    color: "var(--manufacturing)",
    desc: "Fabricación y soluciones a medida",
    image: "/images/areas/manufactura.jpg",
  },
  {
    name: "Branding",
    id: "branding",
    href: "/branding",
    color: "var(--branding)",
    desc: "Merch y productos personalizados",
    image: "/images/areas/branding.jpg",
  },
  {
    name: "Media",
    id: "media",
    href: "/media",
    color: "var(--media)",
    desc: "Contenido audiovisual y digital",
    image: "/images/areas/media.jpg",
  },
];

export default async function Home() {
  const supabase = await createClient();

  const { data: allImages } = await supabase
    .from("project_images")
    .select("id, image_url, alt_text, area");

  const gallery = (allImages ?? [])
    .filter((img) => img.image_url)
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);

  return (
    <>
      <HeroVideo />
      <>
        <section className="w-full bg-white px-6 py-20 md:px-10 lg:px-16">
          <div className="grid items-start gap-12 md:grid-cols-2">
            {/* COLUMNA IZQUIERDA */}
            <div>
              <h2 className="mb-6 max-w-4xl text-4xl font-semibold tracking-tight text-slate-900 md:text-6xl">
                Unimos ejecución, manufactura y desarrollo creativo
              </h2>

              <p className="max-w-3xl text-lg leading-8 text-slate-600 md:text-xl">
                Taller 85 integra construcción, habilitación de espacios, manufactura,
                branding y media para resolver proyectos reales con una mirada práctica,
                técnica y adaptable.
              </p>

              <div className="mt-8">
                <div className="flex flex-wrap gap-3">
                  <a
                    href="#contacto"
                    className="inline-flex items-center justify-center rounded-xl bg-[color:var(--brand)] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    Solicitar cotización
                  </a>

                  <a
                    href="#proyectos"
                    className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-6 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50"
                  >
                    Ver proyectos
                  </a>
                </div>

                <p className="mt-3 text-sm text-neutral-500">
                  Respuesta rápida · Evaluación sin compromiso
                </p>
              </div>
            </div>

            {/* COLUMNA DERECHA */}
            <div className="grid gap-4">
              <div className="rounded-2xl bg-slate-50 px-5 py-5">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--brand)]/10">
                    <Boxes className="h-5 w-5 text-[color:var(--brand)]" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    Soluciones integradas
                  </p>
                </div>

                <p className="text-sm leading-6 text-slate-600">
                  Conectamos distintas áreas para resolver proyectos de forma completa.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 px-5 py-5">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--brand)]/10">
                    <Wrench className="h-5 w-5 text-[color:var(--brand)]" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    Enfoque técnico y práctico
                  </p>
                </div>

                <p className="text-sm leading-6 text-slate-600">
                  Priorizamos ejecución real, criterio técnico y soluciones aplicables.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 px-5 py-5">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--brand)]/10">
                    <Shuffle className="h-5 w-5 text-[color:var(--brand)]" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    Adaptabilidad
                  </p>
                </div>

                <p className="text-sm leading-6 text-slate-600">
                  Nos ajustamos al tipo de proyecto, contexto y necesidad de cada cliente.
                </p>
              </div>
            </div>
          </div>
        </section>
        <div>
          {areas.map((area, index) => (
            <section
              key={area.id}
              id={area.id}
              className="relative w-full min-h-[75vh] overflow-hidden"
            >
              {/* FONDO */}
              <img
                src={area.image}
                alt={area.name}
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-black/50" />

              {/* CONTENIDO */}
              <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:px-10 lg:px-16">
                <div
                  className={`grid gap-12 md:grid-cols-2 items-center ${index % 2 !== 0
                    ? "md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1"
                    : ""
                    }`}
                >
                  {/* TEXTO */}
                  <div>
                    <div
                      className="mb-6 h-1.5 w-50 rounded-full"
                      style={{ backgroundColor: area.color }}
                    />
                    <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-6xl">
                      {area.name}
                    </h2>

                    <p className="mt-6 max-w-xl text-lg leading-8 text-white/80">
                      {area.desc}
                    </p>

                    <div className="mt-8">
                      <Link
                        href={area.href}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                      >
                        Explorar área <span>→</span>
                      </Link>
                    </div>
                  </div>

                  {/* COLUMNA VACÍA PARA RESPIRAR */}
                  <div />
                </div>
              </div>
            </section>
          ))}
        </div>
        <section id="proyectos" className="w-full bg-white px-6 py-20 md:px-10 lg:px-16">
          <div
            className="mb-6 h-1.5 w-24 rounded-full"
            style={{ backgroundColor: "var(--brand)" }}
          />

          <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-[color:var(--brand)]">
            Proyectos
          </p>

          <h2 className="mb-6 text-4xl font-semibold tracking-tight text-slate-900 md:text-6xl">
            Proyectos recientes
          </h2>

          <p className="mb-10 max-w-3xl text-lg leading-8 text-slate-600 md:text-xl">
            Una muestra de trabajos, ejecuciones y desarrollos recientes de Taller 85.
          </p>

          <ProjectsGallery images={gallery ?? []} initialLimit={9} />
        </section>

        <section id="contacto" className="mt-28">
          <ContactForm />
        </section>
        /</>
      /</>
  );
}