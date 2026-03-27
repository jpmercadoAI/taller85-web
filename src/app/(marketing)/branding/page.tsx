import AreaPage from "@/components/sections/area-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Branding | Taller 85",
  description:
    "Ropa corporativa, merchandising, EPP personalizados y desarrollo de productos de marca.",
};

export default function BrandingPage() {
  return (
    <AreaPage
      areaKey="Branding"
      color="var(--branding)"
      title="Branding"
      description="Desarrollo de productos personalizados y merchandising para empresas, eventos y marcas."
      services={[
        {
          title: "Ropa corporativa",
          description:
            "Desarrollo de prendas personalizadas para equipos de trabajo, empresas y organizaciones con enfoque funcional y visual.",
        },
        {
          title: "Merchandising personalizado",
          description:
            "Producción de artículos promocionales y productos de marca pensados para activaciones, difusión y posicionamiento.",
        },
        {
          title: "EPP con imagen de marca",
          description:
            "Personalización de elementos de protección y vestuario técnico para reforzar identidad y presencia profesional.",
        },
        {
          title: "Impresión y personalización",
          description:
            "Aplicación de gráficas, logos y terminaciones sobre distintos soportes, según requerimientos de uso y presentación.",
        },
        {
          title: "Desarrollo de productos a medida",
          description:
            "Soluciones personalizadas para marcas que necesitan piezas específicas, series cortas o propuestas adaptadas.",
        },
      ]}
    />
  );
}