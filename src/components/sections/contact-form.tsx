"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (status === "success") {
      const t = setTimeout(() => setStatus("idle"), 3000);
      return () => clearTimeout(t);
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setStatus("idle");

    const form = e.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const project = String(data.get("project") || "").trim();
    const area = String(data.get("area") || "").trim();

    if (!name || !email || !project || !area) {
      setStatus("error");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setStatus("error");
      setLoading(false);
      return;
    }

    const payload = {
      name,
      email,
      company: String(data.get("company") || "").trim(),
      rut: String(data.get("rut") || "").trim(),
      project,
      area,
      message: String(data.get("message") || "").trim(),
    };

    const { error } = await supabase.from("contacts").insert([payload]);

    if (error) {
      setStatus("error");
      console.error(error);
    } else {
      setStatus("success");
      form.reset();
      form.querySelector("input")?.focus();
      setIsValid(false);
    }

    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-md text-center">
      <h2 className="mb-4 text-2xl font-semibold">Hablemos de tu proyecto</h2>

      <p className="mb-6 text-slate-600">
        Cuéntanos qué necesitas y te contactamos.
      </p>

      <form
        onSubmit={handleSubmit}
        onChange={(e) => {
          const form = e.currentTarget;
          const data = new FormData(form);

          const name = String(data.get("name") || "").trim();
          const email = String(data.get("email") || "").trim();
          const project = String(data.get("project") || "").trim();
          const area = String(data.get("area") || "").trim();

          setIsValid(!!name && !!email && !!project && !!area);
        }}
        className="flex flex-col gap-4"
      >
        <input
          name="name"
          type="text"
          placeholder="Nombre"
          required
          className="w-full rounded-lg border border-black/10 px-4 py-3 outline-none transition focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand)]/10"
        />

        <input
          name="email"
          type="email"
          placeholder="Correo"
          required
          className="w-full rounded-lg border border-black/10 px-4 py-3 outline-none transition focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand)]/10"
        />

        <input
          name="company"
          type="text"
          placeholder="Empresa o razón social (opcional)"
          className="w-full rounded-lg border border-black/10 px-4 py-3 outline-none transition focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand)]/10"
        />

        <input
          name="rut"
          type="text"
          placeholder="RUT empresa (opcional)"
          className="w-full rounded-lg border border-black/10 px-4 py-3 outline-none transition focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand)]/10"
        />

        <input
          name="project"
          type="text"
          placeholder="Proyecto"
          required
          className="w-full rounded-lg border border-black/10 px-4 py-3 outline-none transition focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand)]/10"
        />

        <select
          name="area"
          required
          defaultValue=""
          className="w-full rounded-lg border border-black/10 px-4 py-3 text-slate-600 outline-none transition focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand)]/10"
        >
          <option value="" disabled>
            Área de interés
          </option>
          <option>Construcción</option>
          <option>Espacios</option>
          <option>Manufactura</option>
          <option>Branding</option>
          <option>Media</option>
        </select>

        <textarea
          name="message"
          placeholder="Mensaje"
          rows={4}
          className="w-full rounded-lg border border-black/10 px-4 py-3 outline-none transition focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand)]/10"
        />

        <button
          type="submit"
          disabled={loading || !isValid}
          className="rounded-lg bg-[color:var(--brand)] px-6 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>

        <div className="mt-2 h-5">
          {status === "success" && (
            <p className="text-sm text-green-600">✔ Mensaje enviado</p>
          )}

          {status === "error" && (
            <p className="text-sm text-red-600">
              Revisa los campos obligatorios y el correo.
            </p>
          )}
        </div>

        <p className="mt-2 text-xs text-slate-400">
          Al enviar este formulario aceptas que nos pongamos en contacto contigo
          respecto a tu solicitud.
        </p>
      </form>
    </div>
  );
}