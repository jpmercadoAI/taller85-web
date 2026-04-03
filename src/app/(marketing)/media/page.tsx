import AreaPage from "@/components/sections/area-page";
import type { Metadata } from "next";

const title = "Fotografía, video y contenido digital para marcas | Taller 85";
const description =
  "Servicios de fotografía, video y contenido digital para proyectos, marcas, espacios y empresas que necesitan comunicación visual profesional.";
const url = "https://www.taller85.cl/media";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/media",
  },
  openGraph: {
    title: `${title} | Taller 85`,
    description,
    url,
    type: "website",
  },
  twitter: {
    title: `${title} | Taller 85`,
    description,
  },
};

export default function MediaPage() {
  return (
    <AreaPage
      areaKey="Media"
      color="var(--media)"
      title="Media"
      description="Generamos fotografía, video y contenido digital para proyectos, marcas, espacios y empresas que necesitan mostrar su trabajo con una presentación visual clara, profesional y coherente."
      services={[
        {
          title: "Fotografía profesional",
          description:
            "Registro visual enfocado en productos, proyectos, eventos y contenido de marca con criterio comercial y estético.",
        },
        {
          title: "Video y contenido audiovisual",
          description:
            "Producción de piezas audiovisuales para difusión, presentación de servicios y comunicación de proyectos.",
        },
        {
          title: "Toma aérea con dron",
          description:
            "Captura de imágenes y video desde perspectiva aérea para mostrar espacios, procesos y resultados con mayor impacto.",
        },
        {
          title: "Desarrollo web",
          description:
            "Creación de sitios y soluciones digitales orientadas a presencia profesional, visibilidad y crecimiento comercial.",
        },
        {
          title: "Soporte y soluciones digitales",
          description:
            "Apoyo técnico y desarrollo de herramientas digitales para mejorar operación, comunicación y presencia online.",
        },
      ]}
    />
  );
}