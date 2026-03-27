import AreaPage from "@/components/sections/area-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media | Taller 85",
  description:
    "Producción audiovisual, fotografía, contenido digital y desarrollo web para marcas y proyectos.",
};

export default function MediaPage() {
  return (
    <AreaPage
      areaKey="Media"
      color="var(--media)"
      title="Media"
      description="Producción de contenido audiovisual y desarrollo digital para potenciar marcas y proyectos."
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