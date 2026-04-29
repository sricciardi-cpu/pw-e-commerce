import { Resend } from "resend";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { nombre, email, telefono, mensaje } = await req.json();

    if (!nombre || !email || !telefono || !mensaje) {
      return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
    }

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
      to: "camisetaszeus@hotmail.com",
      replyTo: email,
      subject: `Nuevo mensaje de contacto — ${nombre}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#18181b;color:#f4f4f5;padding:32px;border-radius:12px">
          <h2 style="color:#f97316;margin-top:0">Nuevo mensaje de contacto</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#a1a1aa;width:120px">Nombre</td><td style="padding:8px 0;color:#f4f4f5">${nombre}</td></tr>
            <tr><td style="padding:8px 0;color:#a1a1aa">Email</td><td style="padding:8px 0;color:#f4f4f5"><a href="mailto:${email}" style="color:#f97316">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#a1a1aa">Teléfono</td><td style="padding:8px 0;color:#f4f4f5">${telefono}</td></tr>
          </table>
          <div style="margin-top:20px;padding:16px;background:#27272a;border-radius:8px">
            <p style="margin:0;color:#a1a1aa;font-size:12px;margin-bottom:8px">MENSAJE</p>
            <p style="margin:0;white-space:pre-wrap">${mensaje}</p>
          </div>
          <p style="margin-top:24px;font-size:12px;color:#71717a">Podés responder directamente a este mail para contestarle al cliente.</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("contacto email error:", err);
    return NextResponse.json({ error: "Error al enviar" }, { status: 500 });
  }
}
