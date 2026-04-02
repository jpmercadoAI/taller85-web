import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, phone, message } = body;

    if (!name || !message) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 1. Guardar en Supabase
    const { error: dbError } = await supabase.from("leads").insert([
      {
        name,
        email: email || null,
        phone: phone || null,
        message,
      },
    ]);

    if (dbError) {
      console.error("DB error:", dbError.message);
      return NextResponse.json(
        { error: "Error guardando lead" },
        { status: 500 }
      );
    }

    // 2. Enviar correo
    const { error: mailError } = await resend.emails.send({
      from: "Taller 85 <no-reply@taller85.cl>",
      to: ["hola@taller85.cl"],
      subject: `Nuevo contacto: ${name}`,
      replyTo: email || undefined,
      html: `
        <h2>Nuevo contacto desde la web</h2>
        <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email || "No informado")}</p>
        <p><strong>Teléfono:</strong> ${escapeHtml(phone || "No informado")}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${escapeHtml(message)}</p>
      `,
    });

    if (mailError) {
      console.error("Mail error:", mailError.message);
      return NextResponse.json({
        success: true,
        warning: "Lead guardado pero correo no enviado",
      });
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
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}