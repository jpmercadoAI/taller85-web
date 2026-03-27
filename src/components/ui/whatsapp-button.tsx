"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function WhatsAppButton() {
    const [showChatHint, setShowChatHint] = useState(false);
    const [hovered, setHovered] = useState(false);
    const pathname = usePathname();
    useEffect(() => {
        setShowChatHint(false);
        setHovered(false);

        const timer = setTimeout(() => {
            setShowChatHint(true);
        }, 2500);

        const hideTimer = setTimeout(() => {
            setShowChatHint(false);
        }, 6500);

        return () => {
            clearTimeout(timer);
            clearTimeout(hideTimer);
        };
    }, [pathname]);

    return (
        <div
            className="fixed bottom-6 right-6 z-50"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {(showChatHint || hovered) && (
                <div className="pointer-events-none absolute bottom-full right-0 mb-3 w-80 rounded-2xl border border-black/5 bg-white p-4 shadow-xl transition duration-300">
                    <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100">
                            <Image
                                src="/logos/avatar-whatsapp.png"
                                alt="Taller 85"
                                width={80}
                                height={80}
                                className="object-contain"
                            />
                        </div>

                        <div className="min-w-0">
                            <p className="text-sm font-semibold leading-none text-slate-900">
                                Taller 85
                            </p>
                            <p className="mt-1 text-lg leading-5 text-slate-600">
                                Hola, ¿quieres cotizar un proyecto o resolver una duda?
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <a
                href="https://wa.me/56957269426?text=Hola,%20estoy%20evaluando%20un%20proyecto%20y%20me%20interesa%20cotizar%20con%20Taller%2085.%20¿Me%20puedes%20orientar?"
                target="_blank"
                rel="noreferrer"
                className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-lg transition hover:scale-105"
            >
                <svg viewBox="0 0 24 24" fill="white" className="h-6 w-6">
                    <path d="M20.52 3.48A11.91 11.91 0 0012.06 0C5.46 0 .1 5.36.1 11.96c0 2.11.55 4.17 1.6 5.99L0 24l6.23-1.63a11.9 11.9 0 005.83 1.48h.01c6.6 0 11.96-5.36 11.96-11.96 0-3.19-1.24-6.19-3.51-8.41zM12.07 21.7h-.01a9.8 9.8 0 01-5-1.38l-.36-.21-3.7.97.99-3.6-.24-.37a9.77 9.77 0 01-1.5-5.23c0-5.42 4.41-9.83 9.83-9.83 2.62 0 5.08 1.02 6.93 2.87a9.74 9.74 0 012.88 6.96c0 5.42-4.41 9.83-9.82 9.83zm5.43-7.36c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.66.15-.2.3-.76.97-.93 1.17-.17.2-.34.22-.64.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.79-1.67-2.09-.17-.3-.02-.46.13-.6.13-.13.3-.34.45-.5.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.9-2.2-.24-.58-.48-.5-.66-.51h-.56c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.06 2.88 1.21 3.08c.15.2 2.08 3.17 5.05 4.45.7.3 1.25.48 1.67.61.7.22 1.34.19 1.84.12.56-.08 1.77-.72 2.02-1.41.25-.7.25-1.3.17-1.41-.07-.12-.27-.2-.57-.35z" />
                </svg>
            </a>
        </div>
    );
}