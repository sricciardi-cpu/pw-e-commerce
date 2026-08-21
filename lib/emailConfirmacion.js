// Email de confirmación de pago (Resend). Se envía cuando un pedido queda
// pagado: por el webhook de MercadoPago y al marcar una transferencia como
// pagada en el admin. No-op si falta RESEND_API_KEY o el pedido no tiene email.

import { Resend } from "resend";

export async function enviarConfirmacionPago(pedido) {
  if (!pedido?.email) {
    console.warn("[email] Pedido sin email — skip");
    return;
  }
  if (!process.env.RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY no seteada — skip");
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  const base = (process.env.NEXT_PUBLIC_URL ?? "https://camisetaszeus.com")
    .replace("://www.", "://")
    .replace(/\/$/, "");
  const primerNombre = (pedido.nombre ?? "").trim().split(/\s+/)[0] || "";

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;color:#111827;border-radius:12px;overflow:hidden;border:1px solid #eaeaea">
      <div style="background:#111827;padding:24px;text-align:center">
        <img src="${base}/logo.png" height="44" alt="Camisetas Zeus" />
      </div>
      <div style="padding:28px 24px">
        <h1 style="color:#f97316;font-size:22px;margin:0 0 12px">¡Recibimos tu pago! ⚡</h1>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6">
          ¡Hola${primerNombre ? " " + primerNombre : ""}! Recibimos tu pago y tu pedido ya está <strong>confirmado</strong>. ¡Gracias por elegir Camisetas Zeus! 🖤
        </p>
        <p style="margin:0 0 20px;font-size:15px;line-height:1.6">Te contamos cómo sigue tu compra:</p>

        <div style="background:#f5f5f0;border-radius:10px;padding:16px;margin-bottom:14px">
          <p style="margin:0 0 6px;font-weight:bold;font-size:15px">📦 Pedidos de stock</p>
          <p style="margin:0;font-size:14px;line-height:1.6;color:#374151">
            Se despachan a la brevedad. La demora es de <strong>2 a 5 días hábiles</strong> vía Correo Argentino. El seguimiento del envío te va a llegar de parte de Correo Argentino a este mismo mail 📩
          </p>
        </div>

        <div style="background:#f5f5f0;border-radius:10px;padding:16px;margin-bottom:14px">
          <p style="margin:0 0 6px;font-weight:bold;font-size:15px">🧵 Pedidos por encargo</p>
          <p style="margin:0;font-size:14px;line-height:1.6;color:#374151">
            La demora es de <strong>20 a 40 días</strong>. El pedido se despacha automáticamente cuando llega, sin aviso previo de nuestra parte. Una vez despachado, Correo Argentino te enviará el seguimiento a este mismo mail 📩
          </p>
        </div>

        <p style="margin:16px 0;font-size:14px;line-height:1.6;color:#374151">
          Te pedimos que, si tu pedido está dentro del plazo de demora informado, esperes ese tiempo antes de consultar por el estado. ¡Gracias por tu paciencia! 🙌
        </p>

        <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:16px;margin-top:20px">
          <p style="margin:0 0 8px;font-weight:bold;font-size:14px;color:#c2410c">📲 Importante</p>
          <p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:#374151">
            Este correo no es revisado. Ante cualquier consulta, escribinos por Instagram (<a href="https://instagram.com/camisetaszeus" style="color:#f97316;text-decoration:none">@camisetaszeus</a>) o WhatsApp y te respondemos a la brevedad.
          </p>
          <p style="margin:0;font-size:14px;color:#374151">
            WhatsApp: <strong>2216220145</strong> &middot; <strong>1131100949</strong>
          </p>
        </div>

        <p style="margin:24px 0 0;font-size:15px;font-weight:bold;color:#f97316">¡Gracias por confiar en Zeus! 🔥</p>
      </div>
    </div>
  `;

  try {
    const result = await resend.emails.send({
      from,
      to: pedido.email,
      subject: "¡Recibimos tu pago! Tu pedido está confirmado ⚡",
      html,
    });
    if (result.error) {
      console.error("[email] Resend retornó error:", JSON.stringify(result.error));
    } else {
      console.log("[email] Confirmación enviada a", pedido.email, "— id:", result.data?.id);
    }
  } catch (err) {
    console.error("[email] Excepción:", err?.message ?? err);
  }
}
