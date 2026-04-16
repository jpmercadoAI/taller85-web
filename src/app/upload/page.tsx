"use client";

import { ChangeEvent, useRef, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type AiResult = {
    title: string;
    work_description: string;
    suggested_area: string;
    tags: string[];
};

export default function UploadPage() {
    const supabase = useMemo(() => createClient(), []);
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [uploadedUrl, setUploadedUrl] = useState<string>("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [aiResult, setAiResult] = useState<AiResult | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState("");
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const cameraInputRef = useRef<HTMLInputElement | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [area, setArea] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState("");
    const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
    const [projectId, setProjectId] = useState("");
    const [newProjectName, setNewProjectName] = useState("");
    const [newProjectArea, setNewProjectArea] = useState("");
    const [creatingProject, setCreatingProject] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const checkUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                router.push("/login");
            }
        };

        checkUser();
    }, [router, supabase]);
    
    useEffect(() => {
        const fetchProjects = async () => {
            const { data, error } = await supabase
                .from("projects")
                .select("id, title")
                .order("title");

            if (error) {
                console.error("Error cargando proyectos:", error);
                setError(`Error cargando proyectos: ${error.message}`);
                return;
            }

            setProjects(
                (data || []).map((project) => ({
                    id: project.id,
                    name: project.title,
                }))
            );
        };

        fetchProjects();
    }, []);

    const resetForm = () => {
        setFile(null);
        setPreviewUrl("");
        setUploadedUrl("");
        setAiResult(null);
        setError("");
        setTitle("");
        setDescription("");
        setArea("");
        setTags([]);
        setNewTag("");
        setFiles([]);
        setCurrentIndex(0);
    };

    const handleCreateProject = async () => {
        if (!newProjectName.trim() || !newProjectArea) {
            setError("Debes indicar nombre y área para el nuevo proyecto.");
            return;
        }

        try {
            setCreatingProject(true);
            setError("");

            const { data, error } = await supabase
                .from("projects")
                .insert([
                    {
                        title: newProjectName.trim(),
                        area: newProjectArea,
                    },
                ])
                .select()
                .single();

            if (error) {
                console.error("Error creando proyecto:", error);
                setError(`Error creando proyecto: ${error.message}`);
                return;
            }

            setProjects((prev) => [
                ...prev,
                { id: data.id, name: data.title },
            ]);

            setProjectId(data.id);
            setNewProjectName("");
            setNewProjectArea("");
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Error creando proyecto.");
        } finally {
            setCreatingProject(false);
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);

        if (!selectedFiles.length) return;

        const firstFile = selectedFiles[0];

        setFiles(selectedFiles);
        setCurrentIndex(0);
        setFile(firstFile);
        setPreviewUrl(URL.createObjectURL(firstFile));
        setUploadedUrl("");
        setError("");
        setSuccessMessage("");
        setAiResult(null);
        setTitle("");
        setDescription("");
        setArea("");
        setTags([]);
        setNewTag("");
    };

    const handleAnalyze = async () => {
        if (!file) {
            setError("Selecciona una imagen primero.");
            return;
        }

        try {
            setIsUploading(true);
            setIsAnalyzing(true);
            setError("");
            setSuccessMessage("");
            setAiResult(null);
            setUploadedUrl("");


            const fileExt = file.name.split(".").pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `field-upload/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("projects")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: publicUrlData } = supabase.storage
                .from("projects")
                .getPublicUrl(filePath);

            const publicUrl = publicUrlData.publicUrl;
            setUploadedUrl(publicUrl);

            const res = await fetch("/api/analyze-image", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    imageUrl: publicUrl,
                }),
            });

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.error || "Error al analizar la imagen");
            }

            setAiResult(data.data);
            setTitle(data.data.title);
            setDescription(data.data.work_description);
            setArea(data.data.suggested_area);
            setTags(data.data.tags || []);

        } catch (err) {
            console.error(err);
            setError("Error al analizar la imagen.");
        } finally {
            setIsUploading(false);
            setIsAnalyzing(false);
        }
    };

    const handleSave = async () => {
        if (!projectId) {
            setError("Debes seleccionar un proyecto.");
            return;
        }
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
                        project_id: projectId,
                        image_url: uploadedUrl,
                        alt_text: `${title}. ${description}`,
                        area: area,
                        tags: tags,
                        sort_order: 0,
                    },
                ]);

            if (error) throw error;

            setToast("Registro guardado correctamente.");

            // avanzar a la siguiente imagen si existe
            if (files.length > 1 && currentIndex < files.length - 1) {
                const nextIndex = currentIndex + 1;
                const nextFile = files[nextIndex];

                setCurrentIndex(nextIndex);
                setFile(nextFile);
                setPreviewUrl(URL.createObjectURL(nextFile));

                // limpiar estados para siguiente ciclo
                setUploadedUrl("");
                setAiResult(null);
                setTitle("");
                setDescription("");
                setArea("");
                setTags([]);
                setNewTag("");
            } else {
                // si es la última, limpiar todo
                resetForm();
            }

            setTimeout(() => {
                setToast("");
            }, 3000);

        } catch (err) {
            console.error(err);
            setError("Error al guardar.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <main className="min-h-screen bg-neutral-50 px-4 py-6 text-black">
            <div className="mx-auto w-full max-w-5xl">
                <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm md:p-6">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Captura de proyecto
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-black/65">
                        Sube una imagen desde terreno, genera sugerencias con IA y guarda el registro.
                    </p>
                    <div className="mt-6 grid gap-6 lg:grid-cols-2">
                        <div>
                            <div className="mt-4">
                                <label className="mb-2 block text-sm font-medium">
                                    Proyecto
                                </label>

                                <select
                                    value={projectId}
                                    onChange={(e) => setProjectId(e.target.value)}
                                    className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm"
                                >
                                    <option value="">Selecciona un proyecto</option>

                                    {projects.map((project) => (
                                        <option key={project.id} value={project.id}>
                                            {project.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mt-3 space-y-2">
                                <input
                                    type="text"
                                    value={newProjectName}
                                    onChange={(e) => setNewProjectName(e.target.value)}
                                    placeholder="Nuevo proyecto"
                                    className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
                                />

                                <div className="flex gap-2">
                                    <select
                                        value={newProjectArea}
                                        onChange={(e) => setNewProjectArea(e.target.value)}
                                        className="flex-1 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm"
                                    >
                                        <option value="">Selecciona un área</option>
                                        <option value="Construcción">Construcción</option>
                                        <option value="Espacios">Espacios</option>
                                        <option value="Manufactura">Manufactura</option>
                                        <option value="Branding">Branding</option>
                                        <option value="Media">Media</option>
                                    </select>

                                    <button
                                        type="button"
                                        onClick={handleCreateProject}
                                        disabled={creatingProject}
                                        className="rounded-lg bg-black px-3 py-2 text-sm text-white disabled:opacity-50"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className="mt-5">
                                <label className="mb-2 block text-sm font-medium">
                                    Imagen
                                </label>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                    className="hidden"
                                />

                                <input
                                    ref={cameraInputRef}
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    multiple
                                    onChange={handleFileChange}
                                    className="hidden"
                                />

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => cameraInputRef.current?.click()}
                                        className="rounded-xl bg-black px-4 py-3 text-sm font-medium text-white"
                                    >
                                        📷 Foto
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-medium text-black"
                                    >
                                        🖼 Galería
                                    </button>
                                </div>

                                <p className="mt-2 text-xs text-black/50">
                                    {file ? file.name : "Aún no se ha seleccionado ninguna imagen."}
                                </p>
                                {files.length > 1 && (
                                    <p className="mt-1 text-xs text-black/50">
                                        Imagen {currentIndex + 1} de {files.length}
                                    </p>
                                )}
                            </div>
                            <div className="mt-5 space-y-3">
                                <button
                                    type="button"
                                    onClick={handleAnalyze}
                                    disabled={!file || isUploading || isAnalyzing}
                                    className="w-full rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isUploading || isAnalyzing ? "🤖 Analizando con IA..." : "🤖 Analizar con IA"}
                                </button>


                            </div>
                            {aiResult ? (
                                <div className="mt-5 rounded-2xl border border-black/10 bg-white p-4">
                                    <h2 className="text-lg font-semibold">Resultado IA</h2>

                                    <div className="mt-4 space-y-4 text-sm">
                                        <div>
                                            <p className="font-medium text-black/60">Título</p>
                                            <input
                                                type="text"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
                                            />
                                        </div>

                                        <div>
                                            <p className="font-medium text-black/60">Descripción</p>

                                            <textarea
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                rows={4}
                                                className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 text-sm leading-6"
                                            />
                                        </div>

                                        <div>
                                            <p className="font-medium text-black/60">Área sugerida</p>

                                            <select
                                                value={area}
                                                onChange={(e) => setArea(e.target.value)}
                                                className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm"
                                            >
                                                <option value="">Selecciona un área</option>
                                                <option value="Construcción">Construcción</option>
                                                <option value="Espacios">Espacios</option>
                                                <option value="Manufactura">Manufactura</option>
                                                <option value="Branding">Branding</option>
                                                <option value="Media">Media</option>
                                            </select>
                                        </div>

                                        <div>
                                            <p className="font-medium text-black/60">Tags</p>

                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="flex items-center gap-2 rounded-full bg-black/5 px-3 py-1 text-xs"
                                                    >
                                                        {tag}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setTags(tags.filter((_, i) => i !== index))
                                                            }
                                                            className="text-black/50 hover:text-black"
                                                        >
                                                            ✕
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="mt-3 flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newTag}
                                                    onChange={(e) => setNewTag(e.target.value)}
                                                    placeholder="Agregar tag"
                                                    className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (!newTag.trim()) return;
                                                        setTags([...tags, newTag.trim()]);
                                                        setNewTag("");
                                                    }}
                                                    className="rounded-lg bg-black px-3 py-2 text-sm text-white"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-5 rounded-2xl border border-dashed border-black/10 bg-black/5 p-4 text-sm text-black/50">
                                    Aquí aparecerá el resultado del análisis con IA.
                                </div>
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

                        <div>
                            {files.length > 1 && (
                                <div className="mb-4 flex gap-2 overflow-x-auto">
                                    {files.map((fileItem, index) => (
                                        <div
                                            key={index}
                                            className={`h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border ${index === currentIndex
                                                ? "border-black"
                                                : "border-black/10 opacity-60"
                                                }`}
                                        >
                                            <img
                                                src={URL.createObjectURL(fileItem)}
                                                alt="miniatura"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                            {previewUrl && (
                                <div className="mt-5 overflow-hidden rounded-2xl border border-black/10 bg-black/5">
                                    <img
                                        src={previewUrl}
                                        alt="Vista previa"
                                        className="max-h-150 w-full object-contain bg-black/5"
                                    />
                                </div>
                            )}

                        </div>
                    </div>
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
            {toast && (
                <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-xl bg-black px-4 py-3 text-sm text-white shadow-lg">
                    {toast}
                </div>
            )}
        </main>
    );
}