"use client";

export default function HeroVideo() {
    return (
        <div className="relative w-full min-h-screen overflow-hidden">
            {/* VIDEO */}
            <video
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
            >
                <source src="/video/hero.mp4" type="video/mp4" />
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