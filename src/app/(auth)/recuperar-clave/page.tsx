"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function RecuperarClavePage() {
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle"
  );
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus("loading");
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error("resetPasswordForEmail:", error.message);

        if (error.message.toLowerCase().includes("rate limit")) {
          setStatus("error");
          setMessage("Has solicitado demasiados correos en poco tiempo. Espera un momento antes de volver a intentarlo.");
          return;
        }

        setStatus("error");
        setMessage("No pudimos procesar la solicitud en este momento. Intenta de nuevo más tarde.");
        return;
      }

      setStatus("sent");
      setMessage(
        "Si el correo existe, te enviaremos instrucciones para restablecer la contraseña."
      );

      setStatus("sent");
      setMessage(
        "Si el correo existe, te enviaremos instrucciones para restablecer la contraseña."
      );
    } catch (error) {
      console.error("recuperar-clave:", error);
      setStatus("error");
      setMessage(
        "No pudimos procesar la solicitud en este momento. Intenta de nuevo."
      );
    }
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-24 text-black">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            Recuperar contraseña
          </h1>
          <p className="mt-2 text-sm text-black/60">
            Ingresa tu correo y te enviaremos un enlace seguro para restablecer
            tu acceso.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-black/80"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none transition focus:border-black/30"
              placeholder="tu@correo.com"
            />
          </div>

          {message ? (
            <p
              className={`text-sm ${status === "error" ? "text-red-600" : "text-black/70"
                }`}
            >
              {message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "loading" ? "Enviando..." : "Enviar instrucciones"}
          </button>
        </form>

        <div className="mt-6 text-sm text-black/60">
          <Link href="/login" className="underline underline-offset-4">
            Volver al login
          </Link>
        </div>
      </div>
    </main>
  );
}