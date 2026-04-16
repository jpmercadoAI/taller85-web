"use client";

import { FormEvent, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";


export default function LoginPage() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // dentro del componente
  const supabase = useMemo(() => createClient(), []);
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get("reset") === "success";

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const cleanEmail = email.trim().toLowerCase();

      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        console.error("LOGIN ERROR:", error);
        throw error;
      }
      console.log("LOGIN EMAIL:", JSON.stringify(cleanEmail));
      console.log("PASSWORD LENGTH:", password.length);

      router.push("/upload");
      router.refresh();
    } catch (err) {
      console.error(err);
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

          <p className="mt-2 text-sm leading-6 text-black/65">
            Acceso interno Taller 85.
          </p>
          {mounted && resetSuccess ? (
            <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              Contraseña actualizada. Inicia sesión con tu nueva clave.
            </div>
          ) : null}
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Correo
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black"
                placeholder="correo@empresa.cl"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
            <Link
              href="/recuperar-clave"
              className="text-sm text-black/60 underline underline-offset-4 hover:text-black"
            >
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