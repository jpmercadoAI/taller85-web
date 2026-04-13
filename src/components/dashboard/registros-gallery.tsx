"use client";

import Image from "next/image";
import { useEffect, useState } from "react";


type RegistroItem = {
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

type RegistrosGalleryProps = {
    registros: RegistroItem[];
};

export default function RegistrosGallery({
    registros,
}: RegistrosGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const selectedRegistro =
        selectedIndex !== null ? registros[selectedIndex] : null;

    const goToPrevious = () => {
        if (selectedIndex === null) return;
        setSelectedIndex((selectedIndex - 1 + registros.length) % registros.length);
    };

    const goToNext = () => {
        if (selectedIndex === null) return;
        setSelectedIndex((selectedIndex + 1) % registros.length);
    };

    const toggleVisibility = async (index: number) => {
        const item = registros[index];
        const newValue = !item.is_visible;

        await fetch("/api/toggle-visibility", {
            method: "POST",
            body: JSON.stringify({
                id: item.id,
                is_visible: newValue,
            }),
        });

        // update local inmediato
        registros[index].is_visible = newValue;
    };

    useEffect(() => {
        if (selectedIndex === null) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setSelectedIndex(null);
            }

            if (event.key === "ArrowLeft") {
                goToPrevious();
            }

            if (event.key === "ArrowRight") {
                goToNext();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedIndex]);

    useEffect(() => {
        if (selectedIndex === null) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [selectedIndex]);

    useEffect(() => {
        if (selectedIndex === null) return;

        const nextIndex = (selectedIndex + 1) % registros.length;
        const prevIndex = (selectedIndex - 1 + registros.length) % registros.length;

        const preload = (src: string) => {
            const img = new window.Image();
            img.src = src;
        };

        preload(registros[nextIndex].image_url);
        preload(registros[prevIndex].image_url);
    }, [selectedIndex, registros]);

    return (
        <>
            <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white">
                <table className="min-w-full text-left text-sm">
                    <thead className="border-b border-black/10 bg-black/[0.03]">
                        <tr>
                            <th className="px-4 py-3 font-medium text-black/70">Imagen</th>
                            <th className="px-4 py-3 font-medium text-black/70">Título</th>
                            <th className="px-4 py-3 font-medium text-black/70">Proyecto</th>
                            <th className="px-4 py-3 font-medium text-black/70">Área</th>
                            <th className="px-4 py-3 font-medium text-black/70">Fecha</th>
                            <th className="px-4 py-3 font-medium text-black/70">Tags</th>
                            <th className="px-4 py-3 font-medium text-black/70">Visible</th>
                            <th className="px-4 py-3 font-medium text-black/70">Editar</th>
                        </tr>
                    </thead>

                    <tbody>
                        {registros.map((item, index) => (
                            <tr key={item.id} className="border-b border-black/10 last:border-b-0">
                                <td className="px-4 py-3 text-center">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedIndex(index)}
                                        className="block"
                                    >
                                        <div className="h-10 w-14 overflow-hidden rounded-md bg-black/5">
                                            <img
                                                src={item.image_url}
                                                alt={item.alt_text || "Registro de proyecto"}
                                                className="h-full w-full object-cover"
                                                style={{ imageOrientation: "from-image" }}
                                            />
                                        </div>
                                    </button>
                                </td>

                                <td className="px-4 py-3 text-black">
                                    {item.alt_text || "Sin título"}
                                </td>

                                <td className="px-4 py-3 text-black/60">
                                    {item.projects?.[0]?.title || "Sin proyecto"}
                                </td>

                                <td className="px-4 py-3 text-black/70">
                                    {item.area || "—"}
                                </td>

                                <td className="px-4 py-3 text-black/70">
                                    {new Date(item.created_at).toLocaleDateString("es-CL")}
                                </td>

                                <td className="px-4 py-3 text-black/70">
                                    {item.tags?.length ? item.tags.join(", ") : "—"}
                                </td>

                                <button
                                    type="button"
                                    onClick={() => toggleVisibility(index)}
                                    className="mx-auto flex items-center justify-center text-black/70 hover:text-black"
                                >
                                    {item.is_visible ? (
                                        // ojo abierto
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={1.5}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M2.25 12s3.75-7.5 9.75-7.5S21.75 12 21.75 12s-3.75 7.5-9.75 7.5S2.25 12 2.25 12z"
                                            />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    ) : (
                                        // ojo cerrado
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={1.5}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M3 3l18 18M10.58 10.58A3 3 0 0113.42 13.42M9.88 5.09A9.77 9.77 0 0112 4.5c6 0 9.75 7.5 9.75 7.5a16.6 16.6 0 01-3.06 4.24M6.53 6.53C4.06 8.34 2.25 12 2.25 12s3.75 7.5 9.75 7.5c1.61 0 3.08-.35 4.39-.96"
                                            />
                                        </svg>
                                    )}
                                </button>
                                <td className="px-4 py-3 text-center">
                                    <button
                                        type="button"
                                        onClick={() => console.log("editar", item.id)}
                                        className="rounded-lg border border-black/10 px-3 py-1 text-xs text-black/70 hover:bg-black/5"
                                    >
                                        Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedRegistro && (
                <div
                    className="fixed inset-0 z-[100] bg-black/80"
                    onClick={() => setSelectedIndex(null)}
                >
                    <div
                        className="flex h-full w-full flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-6 py-4 text-white">
                            <div>
                                <h2 className="text-xl font-semibold">Detalle del registro</h2>
                                <p className="mt-1 text-sm text-white/70">
                                    {selectedRegistro.projects?.[0]?.title || "Sin proyecto"}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedIndex(null)}
                                className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10"
                            >
                                Cerrar
                            </button>
                        </div>

                        <div className="flex flex-1 items-center justify-center px-6 py-4 overflow-hidden">
                            <div className="flex w-full max-w-6xl items-center justify-center gap-6">
                                <button
                                    type="button"
                                    onClick={goToPrevious}
                                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-3xl text-white transition hover:bg-white/20"
                                >
                                    ←
                                </button>

                                <div className="flex h-[65vh] w-full items-center justify-center overflow-hidden rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                                    <img
                                        src={selectedRegistro.image_url}
                                        alt={selectedRegistro.alt_text || "Registro de proyecto"}
                                        className="block max-h-full max-w-full object-contain"
                                        style={{ imageOrientation: "from-image" }}
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={goToNext}
                                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-3xl text-white transition hover:bg-white/20"
                                >
                                    →
                                </button>
                            </div>
                        </div>

                        <div className="h-[120px] border-t border-white/10 bg-black/20 px-6 py-4 text-white">
                            <div className="grid h-full gap-4 overflow-hidden md:grid-cols-3">
                                <div>
                                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
                                        Título
                                    </p>
                                    <p className="mt-1 line-clamp-2 text-sm font-medium text-white/95">
                                        {selectedRegistro.alt_text || "Sin título"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
                                        Área
                                    </p>
                                    <p className="mt-1 line-clamp-2 text-sm font-medium text-white/95">
                                        {selectedRegistro.area || "Sin área"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
                                        Fecha
                                    </p>
                                    <p className="mt-1 line-clamp-2 text-sm font-medium text-white/95">
                                        {new Date(selectedRegistro.created_at).toLocaleString("es-CL")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}