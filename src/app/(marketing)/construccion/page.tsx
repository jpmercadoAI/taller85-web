import AreaPage from "@/components/sections/area-page";
import type { Metadata } from "next";

const title = "Obras menores y ejecución en terreno | Taller 85";
const description =
  "Ejecución de obras menores, preparación de terrenos, instalación de equipamiento y soluciones técnicas en terreno para espacios públicos y privados.";
const url = "https://www.taller85.cl/construccion";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/construccion",
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

export default function ConstruccionPage() {
  return (
    <AreaPage
      areaKey="Construcción"
      color="var(--construction)"
      title="Construcción"
      description="Ejecución de obras menores, preparación de terrenos e instalación de equipamiento en espacios públicos y privados."
      services={[
        {
          title: "Preparación de terreno y excavaciones",
          description:
            "Trabajos previos de despeje, excavación, acondicionamiento y apoyo para instalaciones o habilitación de espacios.",
        },
        {
          title: "Instalación de equipamiento",
          description:
            "Montaje y apoyo en instalación de elementos urbanos, mobiliario y soluciones que requieren ejecución en terreno.",
        },
        {
          title: "Obras menores de construcción",
          description:
            "Desarrollo de trabajos específicos de construcción con foco en funcionalidad, terminación y cumplimiento del alcance.",
        },
        {
          title: "Reparaciones y mantención",
          description:
            "Intervenciones para recuperar, reforzar o mantener estructuras, superficies y elementos de uso cotidiano.",
        },
        {
          title: "Apoyo técnico en terreno",
          description:
            "Soporte operativo para proyectos que requieren criterio técnico, organización de faena y resolución práctica.",
        },
      ]}
    />
  );
}