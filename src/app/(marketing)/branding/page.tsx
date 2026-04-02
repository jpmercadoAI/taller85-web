import AreaPage from "@/components/sections/area-page";
import type { Metadata } from "next";

const title = "Branding, merch y ropa corporativa personalizada | Taller 85";
const description =
  "Diseño y producción de ropa corporativa, merchandising y elementos gráficos para marcas, empresas y proyectos con identidad propia.";
const url = "https://www.taller85.cl/branding";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/branding",
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