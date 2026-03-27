import ProjectsGallery from "@/components/sections/projects-gallery";
import { createClient } from "@/lib/supabase/server";

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
    const images = await getImagesByArea(areaKey);

    return (
        <main className="mx-auto max-w-7xl px-6 py-16 md:px-10">
            <section className="mb-14">
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

            <section className="mb-16">
                <div className="-mx-6 overflow-x-auto px-6 pb-4 md:-mx-10 md:px-10">
                    <div className="flex snap-x snap-mandatory gap-5">
                        {services.map((service) => (
                            <article
                                key={service.title}
                                className="group flex min-h-[320px] w-[85%] shrink-0 snap-start flex-col justify-between rounded-3xl border border-black/10 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg md:w-[420px]"
                            >
                                <div>
                                    <h3 className="mt-5 text-2xl font-semibold leading-tight tracking-tight text-neutral-950 md:text-3xl">
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
                </div>
            </section>

            <section>
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
                        Trabajos del área
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
        </main>
    );
}