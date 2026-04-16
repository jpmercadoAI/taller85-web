import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const body = await request.json();
        const { id, is_visible } = body;

        if (!id || typeof is_visible !== "boolean") {
            return NextResponse.json(
                { error: "Datos inválidos" },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from("project_images")
            .update({ is_visible })
            .eq("id", id);

        if (error) {
            console.error("Error actualizando visibilidad:", error);
            return NextResponse.json(
                { error: "No se pudo actualizar visibilidad" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error en toggle-visibility:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}