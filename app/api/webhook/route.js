import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request) {
  try {
    const { type, data } = await request.json();

    if (type !== "payment") return Response.json({ received: true });

    const paymentId = data?.id;
    if (!paymentId) return Response.json({ received: true });

    // Verificar estado del pago con MP
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
    });
    const payment = await mpRes.json();

    if (payment.status !== "approved") return Response.json({ received: true });

    const items = payment.additional_info?.items ?? [];

    // Descontar stock por cada producto vendido (ignora el item de envío)
    for (const item of items) {
      if (item.id === "envio") continue;

      await supabaseAdmin().rpc("decrementar_stock", {
        producto_id: item.id,
        cantidad: item.quantity,
      });
    }

    // TODO: enviar email de confirmación con Resend cuando tengas la API key
    // import { Resend } from "resend";
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({ ... });

    console.log(`Pago aprobado ${paymentId} — stock actualizado`);
    return Response.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return Response.json({ error: "Webhook error" }, { status: 500 });
  }
}
