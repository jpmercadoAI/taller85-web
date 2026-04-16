"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function validatePassword(password: string): string | null {
    if (password.length < 12) return "La contraseña debe tener al menos 12 caracteres.";
    if (!/[A-Z]/.test(password)) return "Debe incluir al menos una mayúscula.";
    if (!/[a-z]/.test(password)) return "Debe incluir al menos una minúscula.";
    if (!/[0-9]/.test(password)) return "Debe incluir al menos un número.";
    return null;
}

export default function ResetPasswordPage() {
    const supabase = useMemo(() => createClient(), []);
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [ready, setReady] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

        const checkSession = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!active) return;

            if (session) {
                setReady(true);
            }
        };

        checkSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            console.log("AUTH EVENT:", event, session);

            if (
                event === "PASSWORD_RECOVERY" ||
                event === "SIGNED_IN" ||
                (event === "INITIAL_SESSION" && session)
            ) {
                setReady(true);
            }
        });

        return () => {
            active = false;
            subscription.unsubscribe();
        };
    }, [supabase]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        setSubmitting(true);

        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            console.error("UPDATE PASSWORD ERROR:", error);
            setError("No pudimos actualizar la contraseña. Intenta de nuevo.");
            setSubmitting(false);
            return;
        }

        await supabase.auth.signOut();
        router.replace("/login?reset=success");
    }

    return (
        <main className="min-h-screen bg-neutral-50 px-4 py-24 text-black">
            <div className="mx-auto w-full max-w-md rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Nueva contraseña
                    </h1>
                    <p className="mt-2 text-sm text-black/60">
                        Define una contraseña nueva y segura para tu cuenta.
                    </p>
                </div>

                {!ready ? (
                    <div className="rounded-2xl border border-black/10 bg-neutral-50 p-4 text-sm text-black/60">
                        Validando enlace de recuperación...
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-black/80"
                            >
                                Nueva contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none transition focus:border-black/30"
                                placeholder="Mínimo 12 caracteres"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="mb-2 block text-sm font-medium text-black/80"
                            >
                                Confirmar contraseña
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none transition focus:border-black/30"
                                placeholder="Repite la contraseña"
                            />
                        </div>

                        <div className="rounded-2xl border border-black/10 bg-neutral-50 p-4 text-sm text-black/60">
                            Usa al menos 12 caracteres, con mayúsculas, minúsculas y números.
                        </div>

                        {error ? <p className="text-sm text-red-600">{error}</p> : null}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {submitting ? "Actualizando..." : "Actualizar contraseña"}
                        </button>
                    </form>
                )}
            </div>
        </main>
    );
}