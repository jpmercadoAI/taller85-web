import { createClient } from "@/lib/supabase/server";
import RegistrosGallery from "@/components/dashboard/registros-gallery";
import { redirect } from "next/navigation";

type ProjectImageRow = {
    id: string;
    image_url: string;
    alt_text: string | null;
    area: string | null;
    created_at: string;
    tags: string[] | null;
    is_visible: boolean | null;
    project_id: string | null;
    projects: {
        title: string | null;
    }[] | null;
};

export default async function RegistrosPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data, error } = await supabase
        .from("project_images")
        .select(`
            id,
            image_url,
            alt_text,
            area,
            created_at,
            tags,
            is_visible,
            project_id,
            projects (
                title
            )
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error Supabase registros:", error);
        return (
            <main className="min-h-screen bg-neutral-50 px-4 py-24 text-black">
                <div className="mx-auto w-full max-w-6xl">
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                        Error cargando registros: {error.message}
                    </div>
                </div>
            </main>
        );
    }

    const registros = (data || []) as ProjectImageRow[];

    return (
        <main className="min-h-screen bg-neutral-50 px-4 py-24 text-black">
            <div className="mx-auto w-full max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Registros
                    </h1>
                    <p className="mt-2 text-sm text-black/60">
                        Evidencia visual registrada desde terreno.
                    </p>
                </div>

                {registros.length === 0 ? (
                    <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-black/60">
                        Aún no hay registros cargados.
                    </div>
                ) : (
                    <RegistrosGallery registros={registros} />
                )}
            </div>
        </main>
    );
}