"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type GalleryImage = {
    id: string;
    image_url: string;
    alt_text: string | null;
    area: string | null;
};

type ProjectsGalleryProps = {
    images: GalleryImage[];
};

function shuffleArray<T>(array: T[]): T[] {
    const result = [...array];

    for (let i = result.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}

export default function ProjectsGallery({ images }: ProjectsGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const [showAll, setShowAll] = useState(false);

    const shuffledImages = useMemo(() => {
        return shuffleArray(images);
    }, [images]);

    const visibleImages = showAll ? shuffledImages : shuffledImages.slice(0, 6);
    const hasMoreThanSix = shuffledImages.length > 6;

    return (
        <>
            <div className="grid gap-4 md:grid-cols-3">
                {visibleImages.map((image) => (
                    <button
                        key={image.id}
                        type="button"
                        onClick={() => setSelectedImage(image)}
                        className="group relative overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm transition hover:scale-[1.01] hover:shadow-md"
                    >
                        <div className="relative aspect-[4/3] w-full">
                            <Image
                                src={image.image_url}
                                alt={image.alt_text || image.area || "Proyecto Taller 85"}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="absolute inset-0 flex items-end bg-black/0 transition group-hover:bg-black/35">
                            <div className="w-full p-4 text-left opacity-0 transition group-hover:opacity-100">
                                <span className="inline-block rounded-md bg-white/90 px-3 py-1 text-sm font-medium text-black">
                                    {image.area}
                                </span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {hasMoreThanSix && (
                <div className="mt-8 flex justify-center">
                    <button
                        type="button"
                        onClick={() => setShowAll((prev) => !prev)}
                        className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-medium text-neutral-900 shadow-sm transition hover:bg-neutral-50"
                    >
                        {showAll ? "Mostrar menos" : "Mostrar todo"}
                    </button>
                </div>
            )}

            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div
                        className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-white"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative aspect-[16/10] w-full">
                            <Image
                                src={selectedImage.image_url}
                                alt={selectedImage.alt_text || selectedImage.area || "Proyecto Taller 85"}
                                fill
                                className="object-contain"
                            />
                        </div>

                        <div className="flex items-center justify-between border-t border-black/10 px-4 py-3">
                            <p className="text-sm text-black/70">{selectedImage.area}</p>

                            <button
                                type="button"
                                onClick={() => setSelectedImage(null)}
                                className="rounded-md border border-black/10 px-3 py-1 text-sm hover:bg-black/5"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}