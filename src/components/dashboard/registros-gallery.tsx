"use client";

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
    const [items, setItems] = useState(registros);
    const [editingItem, setEditingItem] = useState<RegistroItem | null>(null);
    const [editTags, setEditTags] = useState<string[]>([]);
    const [toast, setToast] = useState("");
    const [newTag, setNewTag] = useState("");
    const [editTitle, setEditTitle] = useState("");
    const [editArea, setEditArea] = useState("");
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [filterArea, setFilterArea] = useState("");
    const [filterVisible, setFilterVisible] = useState("");

    const selectedRegistro =
        selectedIndex !== null ? items[selectedIndex] : null;

    const goToPrevious = () => {
        if (selectedIndex === null) return;
        setSelectedIndex((selectedIndex - 1 + items.length) % items.length);
    };

    const goToNext = () => {
        if (selectedIndex === null) return;
        setSelectedIndex((selectedIndex + 1) % items.length);
    };

    const showToast = (message: string) => {
        setToast(message);
        setTimeout(() => setToast(""), 3000);
    };

    const toggleVisibility = async (index: number) => {
        const item = items[index];
        const newValue = !item.is_visible;

        try {
            const res = await fetch("/api/toggle-visibility", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: item.id,
                    is_visible: newValue,
                }),
            });

            if (!res.ok) {
                throw new Error("No se pudo actualizar visibilidad.");
            }

            setItems((prev) =>
                prev.map((registro, i) =>
                    i === index ? { ...registro, is_visible: newValue } : registro
                )
            );

            showToast("Visibilidad actualizada");
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!editingItem) return;

        setEditTitle(editingItem.alt_text || "");
        setEditArea(editingItem.area || "");
        setEditTags(editingItem.tags || []);
        setNewTag("");
    }, [editingItem]);

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
    }, [selectedIndex, items]);

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

        const nextIndex = (selectedIndex + 1) % items.length;
        const prevIndex = (selectedIndex - 1 + items.length) % items.length;

        const preload = (src: string) => {
            const img = new window.Image();
            img.src = src;
        };

        preload(items[nextIndex].image_url);
        preload(items[prevIndex].image_url);
    }, [selectedIndex, items]);

    const filteredItems = items.filter((item) => {
        const matchArea = filterArea ? item.area === filterArea : true;

        const matchVisible =
            filterVisible === ""
                ? true
                : filterVisible === "visible"
                    ? item.is_visible === true
                    : item.is_visible === false;

        return matchArea && matchVisible;
    });

    return (
        <>
            <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white">
                <div className="mb-4 flex flex-wrap gap-2">
                    <select
                        value={filterArea}
                        onChange={(e) => setFilterArea(e.target.value)}
                        className="rounded-lg border border-black/10 px-3 py-2 text-sm"
                    >
                        <option value="">Todas las áreas</option>
                        <option value="Construcción">Construcción</option>
                        <option value="Espacios">Espacios</option>
                        <option value="Manufactura">Manufactura</option>
                        <option value="Branding">Branding</option>
                        <option value="Media">Media</option>
                    </select>

                    <select
                        value={filterVisible}
                        onChange={(e) => setFilterVisible(e.target.value)}
                        className="rounded-lg border border-black/10 px-3 py-2 text-sm"
                    >
                        <option value="">Todos</option>
                        <option value="visible">Solo visibles</option>
                        <option value="hidden">Solo ocultos</option>
                    </select>
                </div>
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
                            <th className="px-4 py-3 font-medium text-black/70">Eliminar</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredItems.map((item, index) => (
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

                                <td className="px-4 py-3 text-center">
                                    <button
                                        type="button"
                                        onClick={() => toggleVisibility(index)}
                                        className="mx-auto flex items-center justify-center text-black/70 hover:text-black"
                                    >
                                        {item.is_visible ? (
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
                                </td>

                                <td className="px-4 py-3 text-center">
                                    <button
                                        type="button"
                                        onClick={() => setEditingItem(item)}
                                        className="rounded-lg border border-black/10 px-3 py-1 text-xs text-black/70 hover:bg-black/5"
                                    >
                                        Editar
                                    </button>
                                </td>

                                <td className="px-4 py-3 text-center">
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            const confirmed = window.confirm(
                                                "¿Seguro que deseas eliminar este registro?"
                                            );
                                            if (!confirmed) return;

                                            try {
                                                const res = await fetch("/api/delete-registro", {
                                                    method: "POST",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                    },
                                                    body: JSON.stringify({
                                                        id: item.id,
                                                    }),
                                                });

                                                if (!res.ok) {
                                                    throw new Error("No se pudo eliminar el registro.");
                                                }

                                                setItems((prev) =>
                                                    prev.filter((registro) => registro.id !== item.id)
                                                );

                                                if (selectedRegistro?.id === item.id) {
                                                    setSelectedIndex(null);
                                                }

                                                showToast("Registro eliminado");
                                            } catch (error) {
                                                console.error(error);
                                            }
                                        }}
                                        className="rounded-lg border border-red-200 px-3 py-1 text-xs text-red-600 transition hover:bg-red-50"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL IMAGEN SELECCIONADA */}
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

            {/* MODAL EDIT */}
            {editingItem && (
                <div
                    className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 px-4"
                    onClick={() => {
                        setEditingItem(null);
                        setNewTag("");
                    }}
                >
                    <div
                        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-lg font-semibold">Editar registro</h2>

                        <div className="mt-4 space-y-4 text-sm">
                            <div>
                                <label className="block text-black/60">Título</label>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-black/60">Área</label>
                                <select
                                    value={editArea}
                                    onChange={(e) => setEditArea(e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2"
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
                                <label className="block text-black/60">Tags</label>

                                <div className="mt-2 flex flex-wrap gap-2">
                                    {editTags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="flex items-center gap-2 rounded-full bg-black/5 px-3 py-1 text-xs"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setEditTags(editTags.filter((_, i) => i !== index))
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
                                            const tag = newTag.trim();
                                            if (!tag) return;
                                            if (editTags.includes(tag)) return;

                                            setEditTags([...editTags, tag]);
                                            setNewTag("");
                                        }}
                                        className="rounded-lg bg-black px-3 py-2 text-sm text-white"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setEditingItem(null);
                                    setNewTag("");
                                }}
                                className="rounded-lg border border-black/10 px-4 py-2 text-sm"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={async () => {
                                    if (!editingItem) return;

                                    try {
                                        const res = await fetch("/api/update-registro", {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({
                                                id: editingItem.id,
                                                alt_text: editTitle,
                                                area: editArea,
                                                tags: editTags,
                                            }),
                                        });

                                        if (!res.ok) {
                                            throw new Error("Error al guardar");
                                        }

                                        setItems((prev) =>
                                            prev.map((item) =>
                                                item.id === editingItem.id
                                                    ? {
                                                        ...item,
                                                        alt_text: editTitle,
                                                        area: editArea,
                                                        tags: editTags,
                                                    }
                                                    : item
                                            )
                                        );

                                        setEditingItem(null);
                                        setNewTag("");
                                        showToast("Cambios guardados");
                                    } catch (error) {
                                        console.error(error);
                                    }
                                }}
                                className="rounded-lg bg-black px-4 py-2 text-sm text-white"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toast && (
                <div className="fixed left-1/2 top-4 z-[200] -translate-x-1/2 rounded-xl bg-black px-4 py-3 text-sm text-white shadow-lg">
                    {toast}
                </div>
            )}
        </>
    );
}