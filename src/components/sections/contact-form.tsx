"use client";

import { useEffect, useState } from "react";

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

      source: String(data.get("source") || ""),
      page: String(data.get("page") || ""),
      timestamp: String(data.get("timestamp") || ""),
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      console.log("RESPONSE:", text);

      if (!res.ok) {
        console.error("API error:", text);
        setStatus("error");
        setLoading(false);
        return;
      }

      setStatus("success");
      form.reset();
      form.querySelector("input")?.focus();
      setIsValid(false);
    } catch (error) {
      console.error("Submit error:", error);
      setStatus("error");
    }

    setLoading(false);
  };

  const formatRut = (value: string) => {
    // limpiar: solo números + K
    let cleaned = value.replace(/[^0-9kK]/g, "").toUpperCase();

    // 🔴 limitar a 9 caracteres reales
    cleaned = cleaned.slice(0, 9);

    if (cleaned.length <= 1) return cleaned;

    let body = cleaned.slice(0, -1);
    let dv = cleaned.slice(-1);

    body = body
      .split("")
      .reverse()
      .join("")
      .replace(/(\d{3})(?=\d)/g, "$1.")
      .split("")
      .reverse()
      .join("");

    return `${body}-${dv}`;
  };

  return (
    <section className="w-full bg-slate-50 px-6 py-20 md:px-10 lg:px-16">
      <div className="grid items-start gap-12 md:grid-cols-2">
        {/* COLUMNA IZQUIERDA */}
        <div>
          <div
            className="mb-6 h-1.5 w-24 rounded-full"
            style={{ backgroundColor: "var(--brand)" }}
          />

          <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-[color:var(--brand)]">
            Contacto
          </p>

          <h2 className="mb-6 text-4xl font-semibold tracking-tight text-slate-900 md:text-6xl">
            Hablemos de tu proyecto
          </h2>

          <p className="max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
            Cuéntanos qué necesitas y te contactaremos para evaluar tu proyecto,
            resolver dudas y definir el mejor camino para avanzar.
          </p>

          <div className="mt-10 grid gap-4">
            <div className="rounded-2xl bg-white px-5 py-5 shadow-sm ring-1 ring-black/5">
              <p className="text-sm font-semibold text-slate-900">
                Respuesta inicial clara
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Revisamos tu solicitud y te respondemos con un siguiente paso concreto.
              </p>
            </div>

            <div className="rounded-2xl bg-white px-5 py-5 shadow-sm ring-1 ring-black/5">
              <p className="text-sm font-semibold text-slate-900">
                Contacto según tu necesidad
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Podemos continuar por correo o WhatsApp según lo que más te acomode.
              </p>
            </div>

            <div className="rounded-2xl bg-white px-5 py-5 shadow-sm ring-1 ring-black/5">
              <p className="text-sm font-semibold text-slate-900">
                Sin formularios eternos
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Pedimos solo la información necesaria para entender tu caso y avanzar.
              </p>
            </div>
          </div>
          <div><p><br></br></p></div>
          <div className="rounded-2xl bg-[color:var(--brand)] px-6 py-6 text-white shadow-sm">
            <p className="text-sm font-semibold">¿Prefieres contacto directo?</p>
            <p className="mt-2 text-sm leading-6 text-white/80">
              También puedes escribirnos por WhatsApp o al correo hola@taller85.cl y te responderemos a la brevedad.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="https://wa.me/56957269426?text=Hola%20Taller%2085,%20quiero%20cotizar%20un%20proyecto."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-[color:var(--brand)] transition hover:bg-white/90"
              >
                WhatsApp
              </a>

              <a
                href="mailto:hola@taller85.cl"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Escribir correo
              </a>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">
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
              className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none transition focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand)]/10"
            />

            <input
              name="email"
              type="email"
              placeholder="Correo"
              required
              autoComplete="email"
              pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
              title="Ingresa un correo válido, por ejemplo: nombre@empresa.cl"
              className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none transition focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand)]/10"
            />

            <input
              name="company"
              type="text"
              placeholder="Empresa o razón social (opcional)"
              className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none transition focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand)]/10"
            />

            <input
              name="rut"
              type="text"
              placeholder="RUT empresa (opcional)"
              onChange={(e) => {
                const formatted = formatRut(e.target.value);
                e.target.value = formatted;
              }}
              className="w-full rounded-lg border border-black/10 px-4 py-3 outline-none transition focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand)]/10"
            />

            <input
              name="project"
              type="text"
              placeholder="Proyecto"
              required
              className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none transition focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand)]/10"
            />

            <select
              name="area"
              required
              defaultValue=""
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-slate-600 outline-none transition focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand)]/10"
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
              rows={5}
              className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none transition focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand)]/10"
            />

            <button
              type="submit"
              disabled={loading || !isValid}
              className={`rounded-xl px-6 py-4 text-base font-semibold text-white transition disabled:opacity-50 ${status === "success"
                  ? "bg-green-600"
                  : "bg-[color:var(--brand)] hover:opacity-90"
                }`}
            >
              {loading ? "Enviando..." : status === "success" ? "Solicitud enviada" : "Solicitar contacto"}
            </button>
            <p className="mt-3 text-xs text-slate-500">
              Te responderemos a la brevedad (normalmente dentro del mismo día).
            </p>

            {status === "success" && (
              <div className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
                ✔ Tu solicitud fue enviada correctamente. Te contactaremos pronto.
              </div>
            )}

            {status === "error" && (
              <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                Ocurrió un error al enviar el formulario. Intenta nuevamente.
              </div>
            )}

            <p className="mt-2 text-xs text-slate-400">
              Al enviar este formulario aceptas que nos pongamos en contacto contigo
              respecto a tu solicitud.
            </p>
            <input type="hidden" name="source" value="website" />
            <input type="hidden" name="page" value={typeof window !== "undefined" ? window.location.pathname : ""} />
            <input type="hidden" name="timestamp" value={new Date().toISOString()} />
          </form>
        </div>
      </div>
    </section>
  );
}