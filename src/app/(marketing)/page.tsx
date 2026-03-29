import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/sections/contact-form";
import { createClient } from "@/lib/supabase/server";
import ProjectsGallery from "@/components/sections/projects-gallery";
import { Boxes, Wrench, Shuffle } from "lucide-react";

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
    href: "/construccion",
    color: "var(--construction)",
    desc: "Obras e instalación en terreno",
  },
  {
    name: "Espacios",
    href: "/espacios",
    color: "var(--spaces)",
    desc: "Diseño y habilitación de espacios",
  },
  {
    name: "Manufactura",
    href: "/manufactura",
    color: "var(--manufacturing)",
    desc: "Fabricación y soluciones a medida",
  },
  {
    name: "Branding",
    href: "/branding",
    color: "var(--branding)",
    desc: "Merch y productos personalizados",
  },
  {
    name: "Media",
    href: "/media",
    color: "var(--media)",
    desc: "Contenido audiovisual y digital",
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
    <section className="mx-auto flex max-w-6xl flex-col px-6 py-20">
      <div className="mb-12 max-w-2xl">
        <h1 className="mb-4 text-5xl font-semibold tracking-tight md:text-7xl">
          Soluciones para proyectos, espacios y marcas
        </h1>

        <p className="text-lg text-[color:var(--brand)]/70">
          Plataforma base para construir, desarrollar y escalar soluciones
          reales.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {areas.map((area) => (
          <Link
            key={area.name}
            href={area.href}
            className="group cursor-pointer rounded-2xl border border-black/5 bg-white p-7 min-h-[160px] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <h2 className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-slate-700">
              {area.name}
            </h2>

            <div
              className="mt-2 mb-3 h-1.5 w-12 rounded-full transition-all duration-300 group-hover:w-24"
              style={{ backgroundColor: area.color }}
            />

            <p className="mt-2 text-sm text-slate-600">{area.desc}</p>
          </Link>
        ))}
      </div>

      <section className="mt-28">
        <div className="mx-auto max-w-6xl rounded-3xl border border-black/5 bg-white px-8 py-12 shadow-sm md:px-12 md:py-16">
          <div
            className="mb-6 h-1.5 w-24 rounded-full"
            style={{ backgroundColor: "var(--brand)" }}
          />

          <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-[color:var(--brand)]">
            Taller 85
          </p>

          <h2 className="mb-6 text-3xl font-semibold tracking-tight md:text-5xl">
            Unimos ejecución, manufactura y desarrollo creativo
          </h2>

          <p className="max-w-4xl text-lg leading-8 text-slate-600 md:text-xl">
            Taller 85 integra construcción, habilitación de espacios, manufactura,
            branding y media para resolver proyectos reales con una mirada práctica,
            técnica y adaptable.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
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

      <section className="mt-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-2xl font-semibold">Proyectos recientes</h2>

          <ProjectsGallery images={gallery ?? []} />
        </div>
      </section>

      <section id="contacto" className="mt-28">
        <ContactForm />
      </section>
    </section>
  );
}