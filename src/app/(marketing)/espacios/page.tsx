import AreaPage from "@/components/sections/area-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Espacios | Taller 85",
  description:
    "Implementación, mantención y equipamiento de espacios públicos, comunitarios y privados.",
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