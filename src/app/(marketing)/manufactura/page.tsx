import AreaPage from "@/components/sections/area-page";
import type { Metadata } from "next";

const title = "Fabricación e instalación de mobiliario urbano y juegos infantiles | Taller 85";
const description =
  "Fabricación e instalación de mobiliario urbano, juegos infantiles y equipamiento deportivo para espacios públicos y privados en Santiago y Chile.";
const url = "https://www.taller85.cl/manufactura";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/manufactura",
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

export default function ManufacturaPage() {
  return (
    <AreaPage
      areaKey="Manufactura"
      color="var(--manufacturing)"
      title="Manufactura"
      description="Fabricación de productos y soluciones a medida en metal y hormigón. Incluye desarrollo de juegos infantiles, mobiliario urbano y equipamiento deportivo, así como diseño y homologación de productos."
      services={[
        {
          title: "Fabricación de piezas y estructuras",
          description:
            "Desarrollo de componentes y soluciones fabricadas según necesidad, uso previsto y contexto del proyecto.",
        },
        {
          title: "Soluciones en metal y otros materiales",
          description:
            "Trabajo con distintos soportes y materialidades para resolver requerimientos técnicos o constructivos.",
        },
        {
          title: "Desarrollo de productos funcionales",
          description:
            "Creación de elementos pensados para cumplir una función específica, con criterio práctico y constructivo.",
        },
        {
          title: "Apoyo a proyectos especiales",
          description:
            "Fabricación o adaptación de piezas para iniciativas que necesitan soluciones fuera de catálogo o a medida.",
        },
        {
          title: "Producción según requerimiento",
          description:
            "Capacidad de desarrollar series cortas o soluciones específicas con atención al detalle y a la ejecución.",
        },
      ]}
    />
  );
}