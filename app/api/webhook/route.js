export const dynamic = "force-dynamic";

import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";
import { emailConfirmacionCompra } from "@/lib/emailTemplate";

const ENVIO_FIJO = 9;

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

    // Descontar stock por cada producto vendido
    for (const item of items) {
      if (item.id === "envio") continue;
      await supabaseAdmin().rpc("decrementar_stock", {
        producto_id: item.id,
        cantidad: Number(item.quantity),
      });
    }

    // Enviar mail de confirmación
    const buyerEmail = payment.payer?.email;
    if (buyerEmail && process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);

        const comprador = {
          nombre: payment.payer?.first_name
            ? `${payment.payer.first_name} ${payment.payer.last_name ?? ""}`.trim()
            : payment.additional_info?.payer?.first_name ?? "Cliente",
          calle:         payment.payer?.address?.street_name ?? "",
          numero:        payment.payer?.address?.street_number ?? "",
          piso:          "",
          departamento:  "",
          localidad:     payment.payer?.address?.city ?? "",
          provincia:     payment.payer?.address?.state_name ?? "",
          codigoPostal:  payment.payer?.address?.zip_code ?? "",
          observaciones: "",
        };

        const productoItems = items.filter((i) => i.id !== "envio");
        const subtotal = productoItems.reduce(
          (acc, i) => acc + Number(i.unit_price) * Number(i.quantity),
          0
        );

        const html = emailConfirmacionCompra({
          comprador,
          items,
          total: subtotal,
          envio: ENVIO_FIJO,
          paymentId,
        });

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
          to: buyerEmail,
          subject: "✓ Confirmación de compra — Zeus Rugby",
          html,
        });

        console.log(`Mail enviado a ${buyerEmail}`);
      } catch (mailErr) {
        console.error("Error enviando mail:", mailErr);
      }
    }

    console.log(`Pago aprobado ${paymentId} — stock actualizado`);
    return Response.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return Response.json({ error: "Webhook error" }, { status: 500 });
  }
}
