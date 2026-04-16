"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

declare global {
    interface Window {
        turnstile?: {
            render: (
                container: HTMLElement,
                options: {
                    sitekey: string;
                    callback?: (token: string) => void;
                    "expired-callback"?: () => void;
                    "error-callback"?: () => void;
                    theme?: "light" | "dark" | "auto";
                }
            ) => string;
            remove: (widgetId: string) => void;
        };
    }
}

type TurnstileWidgetProps = {
    onVerify: (token: string) => void;
    onExpire?: () => void;
    onError?: () => void;
};

export default function TurnstileWidget({
    onVerify,
    onExpire,
    onError,
}: TurnstileWidgetProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const widgetIdRef = useRef<string | null>(null);

    useEffect(() => {
        const interval = window.setInterval(() => {
            if (
                window.turnstile &&
                containerRef.current &&
                !widgetIdRef.current &&
                process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
            ) {
                widgetIdRef.current = window.turnstile.render(containerRef.current, {
                    sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
                    theme: "auto",
                    callback: (token) => onVerify(token),
                    "expired-callback": () => onExpire?.(),
                    "error-callback": () => onError?.(),
                });
            }
        }, 250);

        return () => {
            window.clearInterval(interval);

            if (window.turnstile && widgetIdRef.current) {
                window.turnstile.remove(widgetIdRef.current);
                widgetIdRef.current = null;
            }
        };
    }, [onVerify, onExpire, onError]);

    return (
        <>
            <Script
                src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
                strategy="afterInteractive"
            />
            <div ref={containerRef} />
        </>
    );
}