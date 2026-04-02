import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, company, rut, project, area, message, source, page, timestamp } = body;

    if (!name || !email || !project || !area) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error: dbError } = await supabase.from("contacts").insert([
      {
        name,
        email,
        company: company || null,
        rut: rut || null,
        project,
        area,
        message: message || null,
        source: source || "website",
        page: page || null,
        submitted_at: timestamp || new Date().toISOString(),
      },
    ]);

    if (dbError) {
      console.error("DB error:", dbError.message);
      return NextResponse.json(
        { error: "Error guardando contacto" },
        { status: 500 }
      );
    }

    const { error: mailError } = await resend.emails.send({
      from: "Taller 85 <no-reply@taller85.cl>",
      to: ["hola@taller85.cl"],
      subject: `Nuevo contacto web: ${name}`,
      replyTo: email,
      html: `
        <h2>Nuevo contacto desde taller85.cl</h2>
        <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Empresa:</strong> ${escapeHtml(company || "No informado")}</p>
        <p><strong>RUT:</strong> ${escapeHtml(rut || "No informado")}</p>
        <p><strong>Proyecto:</strong> ${escapeHtml(project)}</p>
        <p><strong>Área:</strong> ${escapeHtml(area)}</p>F
        <p><strong>Origen:</strong> ${escapeHtml(source || "website")}</p>
        <p><strong>Página:</strong> ${escapeHtml(page || "No informada")}</p>
        <p><strong>Fecha:</strong> ${escapeHtml(timestamp || new Date().toISOString())}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${escapeHtml(message || "Sin mensaje")}</p>
      `,
    });

    if (mailError) {
      console.error("Mail error:", mailError.message);
      return NextResponse.json(
        {
          error: "El contacto se guardó, pero no se pudo enviar el correo.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("General error:", error);
    return NextResponse.json(
      { error: "Error inesperado" },
      { status: 500 }
    );
  }
}

function escapeHtml(str: string) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}