"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const resetSuccess = searchParams.get("reset") === "success";

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const { error } = await supabase.auth.signInWithPassword({
                email: email.trim().toLowerCase(),
                password,
            });

            if (error) throw error;

            router.push("/upload");
            router.refresh();
        } catch (err) {
            console.error("LOGIN ERROR:", err);
            setError("Correo o contraseña incorrectos.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-neutral-50 px-4 py-6 text-black">
            <div className="mx-auto flex min-h-[80vh] w-full max-w-md items-center">
                <div className="w-full rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Iniciar sesión
                    </h1>

                    {resetSuccess && (
                        <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                            Contraseña actualizada. Inicia sesión con tu nueva clave.
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="mt-6 space-y-4">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="correo@empresa.cl"
                            className="w-full rounded-xl border px-4 py-3"
                            required
                        />

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-xl border px-4 py-3"
                            required
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-black px-4 py-3 text-white"
                        >
                            {loading ? "Ingresando..." : "Ingresar"}
                        </button>

                        <Link href="/recuperar-clave" className="text-sm underline">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </form>

                    {error && (
                        <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}