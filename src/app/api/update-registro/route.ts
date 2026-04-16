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
        const { id, alt_text, area, tags } = body;

        if (!id) {
            return NextResponse.json({ error: "Falta ID" }, { status: 400 });
        }

        const { error } = await supabase
            .from("project_images")
            .update({
                alt_text,
                area,
                tags,
            })
            .eq("id", id);

        if (error) {
            console.error(error);
            return NextResponse.json(
                { error: "Error actualizando registro" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Error interno" },
            { status: 500 }
        );
    }
}