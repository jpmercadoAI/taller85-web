import AreaPage from "@/components/sections/area-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manufactura | Taller 85",
  description:
    "Desarrollo y fabricación de productos, piezas y soluciones técnicas según necesidad.",
};

export default function ManufacturaPage() {
  return (
    <AreaPage
      areaKey="Manufactura"
      color="var(--manufacturing)"
      title="Manufactura"
      description="Fabricación de productos y soluciones técnicas con enfoque funcional, adaptable y orientado a requerimientos reales."
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