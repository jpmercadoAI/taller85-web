import AreaPage from "@/components/sections/area-page";
import type { Metadata } from "next";

const title = "Habilitación de espacios y mobiliario urbano | Taller 85";
const description =
  "Diseño, habilitación e instalación de espacios públicos y privados, incluyendo mobiliario urbano, juegos y equipamiento para uso comunitario.";
const url = "https://www.taller85.cl/espacios";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/espacios",
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

export default function EspaciosPage() {
  return (
    <AreaPage
      areaKey="Espacios"
      color="var(--spaces)"
      title="Espacios"
      description="Soluciones para habilitación, equipamiento y mantención de espacios recreativos, comunitarios y funcionales."
      services={[
        {
          title: "Implementación de áreas recreativas",
          description:
            "Desarrollo y habilitación de espacios pensados para uso comunitario, recreación y encuentro.",
        },
        {
          title: "Instalación de juegos y equipamiento",
          description:
            "Montaje y puesta en servicio de soluciones destinadas a plazas, parques y espacios de uso colectivo.",
        },
        {
          title: "Mobiliario urbano",
          description:
            "Suministro, instalación y apoyo técnico para elementos que mejoran la funcionalidad y experiencia del entorno.",
        },
        {
          title: "Mantención de espacios",
          description:
            "Intervenciones orientadas a conservar, reparar y poner en valor áreas de uso público o privado.",
        },
        {
          title: "Soluciones para comunidades y condominios",
          description:
            "Propuestas prácticas para mejorar espacios comunes, circulación, equipamiento y condiciones de uso.",
        },
      ]}
    />
  );
}