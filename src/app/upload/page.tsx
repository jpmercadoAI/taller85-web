"use client";

import { ChangeEvent, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type AiResult = {
    title: string;
    work_description: string;
    suggested_area: string;
    tags: string[];
};

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [uploadedUrl, setUploadedUrl] = useState<string>("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [aiResult, setAiResult] = useState<AiResult | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] ?? null;

        if (!selected) return;

        setFile(selected);
        setPreviewUrl(URL.createObjectURL(selected));
        setUploadedUrl("");
        setError("");
        setSuccessMessage("");
        setAiResult(null);
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Selecciona una imagen primero.");
            return;
        }

        try {
            setIsUploading(true);
            setError("");
            setSuccessMessage("");
            setAiResult(null);

            const fileExt = file.name.split(".").pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `field-upload/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("projects")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from("projects")
                .getPublicUrl(filePath);

            setUploadedUrl(data.publicUrl);
        } catch (err) {
            console.error(err);
            setError("Error al subir la imagen.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleAnalyze = async () => {
        if (!uploadedUrl) {
            setError("Primero debes subir una imagen.");
            return;
        }

        try {
            setIsAnalyzing(true);
            setError("");
            setSuccessMessage("");
            setAiResult(null);

            const res = await fetch("/api/analyze-image", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    imageUrl: uploadedUrl,
                }),
            });

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.error || "Error al analizar la imagen");
            }

            setAiResult(data.data);
        } catch (err) {
            console.error(err);
            setError("Error al analizar la imagen.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSave = async () => {
        if (!uploadedUrl || !aiResult) {
            setError("Falta información para guardar.");
            return;
        }

        try {
            setIsSaving(true);
            setError("");
            setSuccessMessage("");

            const { error } = await supabase
                .from("project_images")
                .insert([
                    {
                        project_id: "f89e3aa5-03e6-48c8-9d02-707fa4616291",
                        image_url: uploadedUrl,
                        alt_text: `${aiResult.title}. ${aiResult.work_description}`,
                        area: aiResult.suggested_area,
                        tags: aiResult.tags,
                        sort_order: 0,
                    },
                ]);

            if (error) throw error;

            setSuccessMessage("Guardado correctamente.");
        } catch (err) {
            console.error(err);
            setError("Error al guardar.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <main className="min-h-screen bg-neutral-50 px-4 py-6 text-black">
            <div className="mx-auto w-full max-w-md">
                <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Captura de proyecto
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-black/65">
                        Sube una imagen desde terreno, genera sugerencias con IA y guarda el registro.
                    </p>

                    <div className="mt-5">
                        <label className="mb-2 block text-sm font-medium">
                            Imagen
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleFileChange}
                            className="block w-full text-sm"
                        />
                    </div>

                    {previewUrl && (
                        <div className="mt-5 overflow-hidden rounded-2xl border border-black/10 bg-black/5">
                            <img
                                src={previewUrl}
                                alt="Vista previa"
                                className="h-auto w-full object-cover"
                            />
                        </div>
                    )}

                    <div className="mt-5 space-y-3">
                        <button
                            type="button"
                            onClick={handleUpload}
                            disabled={!file || isUploading}
                            className="w-full rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isUploading ? "Subiendo imagen..." : "Subir imagen"}
                        </button>

                        {uploadedUrl && (
                            <button
                                type="button"
                                onClick={handleAnalyze}
                                disabled={isAnalyzing}
                                className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isAnalyzing ? "Analizando..." : "Generar con IA"}
                            </button>
                        )}

                        {aiResult && (
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSaving ? "Guardando..." : "Guardar registro"}
                            </button>
                        )}
                    </div>

                    {uploadedUrl && (
                        <div className="mt-5 rounded-xl bg-green-50 p-3 text-xs text-green-700">
                            Imagen subida correctamente.
                        </div>
                    )}

                    {aiResult && (
                        <div className="mt-5 rounded-2xl border border-black/10 bg-white p-4">
                            <h2 className="text-lg font-semibold">Resultado IA</h2>

                            <div className="mt-4 space-y-4 text-sm">
                                <div>
                                    <p className="font-medium text-black/60">Título</p>
                                    <p className="mt-1">{aiResult.title}</p>
                                </div>

                                <div>
                                    <p className="font-medium text-black/60">Descripción</p>
                                    <p className="mt-1 leading-6">{aiResult.work_description}</p>
                                </div>

                                <div>
                                    <p className="font-medium text-black/60">Área sugerida</p>
                                    <p className="mt-1">{aiResult.suggested_area}</p>
                                </div>

                                <div>
                                    <p className="font-medium text-black/60">Tags</p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {aiResult.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-full bg-black/5 px-3 py-1 text-xs"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {successMessage && (
                        <div className="mt-5 rounded-xl bg-green-50 p-3 text-sm text-green-700">
                            {successMessage}
                        </div>
                    )}

                    {error && (
                        <div className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}