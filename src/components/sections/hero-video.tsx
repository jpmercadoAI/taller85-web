"use client";

import { useEffect, useRef, useState } from "react";

function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];

    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    return newArray;
}

const heroVideos = Array.from(
    { length: 13 },
    (_, i) => `/video/hero-videos/hero-${i}.mp4`
);

const TRANSITION_MS = 700;

export default function HeroVideo() {
    const videoARef = useRef<HTMLVideoElement | null>(null);
    const videoBRef = useRef<HTMLVideoElement | null>(null);

    const [playlist, setPlaylist] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [activeLayer, setActiveLayer] = useState<"A" | "B">("A");
    const [srcA, setSrcA] = useState<string>("");
    const [srcB, setSrcB] = useState<string>("");

    const [showA, setShowA] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const shuffled = shuffleArray(heroVideos).slice(0, 4);
        setPlaylist(shuffled);
    }, []);

    useEffect(() => {
        if (playlist.length === 0) return;

        const first = playlist[0];
        const second = playlist[1] ?? playlist[0];

        setSrcA(first);
        setSrcB(second);
        setShowA(true);
        setActiveLayer("A");
        setCurrentIndex(0);
    }, [playlist]);

    useEffect(() => {
        if (!srcA || !videoARef.current) return;

        videoARef.current.load();
        videoARef.current.play().catch(() => { });
    }, [srcA]);

    useEffect(() => {
        if (!srcB || !videoBRef.current) return;

        videoBRef.current.load();
    }, [srcB]);

    const handleEnded = async () => {
        if (playlist.length === 0 || isTransitioning) return;

        const nextVisibleIndex =
            currentIndex + 1 >= playlist.length ? 0 : currentIndex + 1;

        const preloadIndex =
            nextVisibleIndex + 1 >= playlist.length ? 0 : nextVisibleIndex + 1;

        const incomingRef = activeLayer === "A" ? videoBRef.current : videoARef.current;
        const outgoingRef = activeLayer === "A" ? videoARef.current : videoBRef.current;

        if (!incomingRef || !outgoingRef) return;

        setIsTransitioning(true);

        try {
            incomingRef.currentTime = 0;
            await incomingRef.play();
        } catch {
            // si el navegador se pone exquisito, igual seguimos
        }

        if (activeLayer === "A") {
            setShowA(false);
        } else {
            setShowA(true);
        }

        window.setTimeout(() => {
            outgoingRef.pause();
            outgoingRef.currentTime = 0;

            if (activeLayer === "A") {
                setActiveLayer("B");
                setSrcA(playlist[preloadIndex]);
            } else {
                setActiveLayer("A");
                setSrcB(playlist[preloadIndex]);
            }

            setCurrentIndex(nextVisibleIndex);
            setIsTransitioning(false);
        }, TRANSITION_MS);
    };

    return (
        <div className="relative w-full min-h-screen overflow-hidden">
            {/* VIDEO A */}
            <video
                ref={videoARef}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity ease-linear ${showA ? "opacity-100" : "opacity-0"
                    }`}
                style={{ transitionDuration: `${TRANSITION_MS}ms` }}
                autoPlay
                muted
                playsInline
                preload="auto"
                onEnded={activeLayer === "A" ? handleEnded : undefined}
            >
                {srcA && <source src={srcA} type="video/mp4" />}
            </video>

            {/* VIDEO B */}
            <video
                ref={videoBRef}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity ease-linear ${showA ? "opacity-0" : "opacity-100"
                    }`}
                style={{ transitionDuration: `${TRANSITION_MS}ms` }}
                muted
                playsInline
                preload="auto"
                onEnded={activeLayer === "B" ? handleEnded : undefined}
            >
                {srcB && <source src={srcB} type="video/mp4" />}
            </video>

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/50" />

            {/* CONTENIDO */}
            <div className="relative z-10 flex min-h-screen items-center">
                <div className="w-full max-w-5xl px-6 md:px-10 lg:px-16">
                    <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white md:text-7xl lg:text-8xl">
                        Soluciones para proyectos, espacios y marcas
                    </h1>

                    <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 md:text-lg">
                        Diseñamos, fabricamos e implementamos soluciones reales para empresas, instituciones y espacios que necesitan ejecución técnica con criterio y buena presentación.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <a
                            href="#contacto"
                            className="rounded-xl bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90"
                        >
                            Solicitar cotización
                        </a>

                        <a
                            href="#proyectos"
                            className="rounded-xl border border-white/30 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                        >
                            Ver proyectos
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}