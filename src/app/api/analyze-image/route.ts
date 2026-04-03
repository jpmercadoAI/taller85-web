import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

const prompt = [
    "Analiza esta imagen de un trabajo real de la empresa Taller 85 en Chile.",
    "",
    "Taller 85 trabaja en estas áreas:",
    "- Construcción: obras menores, terreno, reparación, mantención, habilitación",
    "- Espacios: mobiliario urbano, juegos, instalación, mantención de espacios",
    "- Manufactura: fabricación en metal, hormigón u otros materiales",
    "- Branding: ropa corporativa, merchandising, impresión, personalización, EPP",
    "- Media: fotografía, video, dron, contenido audiovisual",
    "",
    "Responde SOLO en JSON válido con esta estructura:",
    "",
    "{",
    '  "title": "string",',
    '  "work_description": "string",',
    '  "suggested_area": "Construcción | Espacios | Manufactura | Branding | Media",',
    '  "tags": ["string", "string", "string"]',
    "}",
    "",
    "Reglas:",
    "- No inventes información que no se vea o no sea razonablemente inferible.",
    "- Sé práctico y profesional.",
    "- Elige el área más probable.",
    "- tags debe tener entre 3 y 8 elementos.",
    "- No agregues texto fuera del JSON.",
].join("\n");

export async function POST(req: Request) {
    try {
        const { imageUrl } = await req.json();

        if (!imageUrl || typeof imageUrl !== "string") {
            return NextResponse.json(
                { success: false, error: "imageUrl es requerido" },
                { status: 400 }
            );
        }

        const requestBody: any = {
            model: "gpt-4.1-mini",
            input: [
                {
                    role: "user",
                    content: [
                        {
                            type: "input_text",
                            text: prompt,
                        },
                        {
                            type: "input_image",
                            image_url: imageUrl,
                        },
                    ],
                },
            ],
        };

        const response = await openai.responses.create(requestBody);

        const output = response.output_text;

        if (!output) {
            return NextResponse.json(
                { success: false, error: "La IA no devolvió contenido" },
                { status: 500 }
            );
        }

        const cleanedOutput = output
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/, "")
            .trim();

        return NextResponse.json({
            success: true,
            data: JSON.parse(cleanedOutput),
        });
    } catch (error: any) {
        console.error("analyze-image error:", error);

        return NextResponse.json(
            {
                success: false,
                error: error?.message || "Error al analizar la imagen",
                details: error?.response?.data || null,
            },
            { status: 500 }
        );
    }
}