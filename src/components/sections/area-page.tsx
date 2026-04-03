import ProjectsGallery from "@/components/sections/projects-gallery";
import { createClient } from "@/lib/supabase/server";

function shuffleArray<T>(array: T[]): T[] {
    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}

type ServiceItem = {
    title: string;
    description: string;
};

type AreaPageProps = {
    areaKey: string;
    color: string;
    title: string;
    description: string;
    services: ServiceItem[];
};

type GalleryImage = {
    id: string;
    image_url: string;
    alt_text: string | null;
    area: string | null;
};

async function getImagesByArea(area: string): Promise<GalleryImage[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("project_images")
        .select("id, image_url, alt_text, area")
        .eq("area", area)
        .order("created_at", { ascending: false });

    if (error) {
        console.error(`Error loading images for area "${area}":`, error.message);
        return [];
    }

    return data ?? [];
}

export default async function AreaPage({
    areaKey,
    color,
    title,
    description,
    services,
}: AreaPageProps) {
    const rawImages = await getImagesByArea(areaKey);
    const images = shuffleArray(rawImages);

    return (
        <div className="mx-auto max-w-6xl px-6 py-16 md:px-10">
            <section className="mb-14">
                <div
                    className="mb-6 h-1.5 w-24 rounded-full"
                    style={{ backgroundColor: color }}
                />

                <p
                    className="mb-3 text-sm font-medium uppercase tracking-[0.2em]"
                    style={{ color }}
                >
                    Área
                </p>

                <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 md:text-5xl">
                    {title}
                </h1>

                <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-600 md:text-lg">
                    {description}
                </p>
            </section>

            <section className="mb-16" aria-labelledby="services-heading">
                <div className="mb-6">
                    <h2
                        id="services-heading"
                        className="text-2xl font-semibold tracking-tight text-neutral-950"
                    >
                        Servicios del <span style={{ color }}>área</span>
                    </h2>

                    <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600 md:text-base">
                        Soluciones y capacidades vinculadas a esta línea de trabajo.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {services.map((service) => (
                        <article
                            key={service.title}
                            className="group flex min-h-[280px] flex-col justify-between rounded-3xl border border-black/10 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div>
                                <h3 className="text-2xl font-semibold leading-tight tracking-tight text-neutral-950">
                                    {service.title}
                                </h3>

                                <p className="mt-4 text-base leading-7 text-neutral-600">
                                    {service.description}
                                </p>
                            </div>

                            <div className="mt-10">
                                <div
                                    className="h-1.5 w-16 rounded-full transition-all duration-300 group-hover:w-24"
                                    style={{ backgroundColor: color }}
                                />
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section aria-labelledby="gallery-heading">
                <div className="mb-6">
                    <h2
                        id="gallery-heading"
                        className="text-2xl font-semibold tracking-tight text-neutral-950"
                    >
                        Proyectos ejecutados
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-neutral-600">
                        Referencias visuales y proyectos vinculados a esta línea de trabajo.
                    </p>
                </div>

                {images.length > 0 ? (
                    <ProjectsGallery images={images} />
                ) : (
                    <div className="rounded-2xl border border-dashed border-black/10 bg-neutral-50 px-6 py-12 text-center">
                        <p className="text-neutral-600">
                            Aún no hay imágenes publicadas para esta área.
                        </p>
                    </div>
                )}
            </section>
            <section className="mt-20 rounded-3xl border border-black/10 bg-white px-8 py-10 text-center shadow-sm">
                <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
                    ¿Tienes un proyecto en esta área?
                </h2>

                <p className="mt-3 mx-auto max-w-2xl text-neutral-600">
                    Cuéntanos qué necesitas y evaluamos la mejor forma de desarrollarlo.
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <a
                        href="/#contacto"
                        className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
                        style={{ backgroundColor: color }}
                    >
                        Solicitar cotización
                    </a>

                    <a
                        href="https://wa.me/56957269426?text=Hola%20Taller%2085,%20quiero%20cotizar%20un%20proyecto."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-6 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50"
                    >
                        WhatsApp
                    </a>
                </div>
            </section>
        </div>
    );
}