import { supabaseAdmin } from "@/lib/supabase";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

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

    const pedidoId = payment.external_reference;

    // Obtener pedido guardado (tiene items con tabla + talle)
    let pedido = null;
    if (pedidoId) {
      const { data: p } = await supabaseAdmin()
        .from("pedidos")
        .select("*")
        .eq("id", pedidoId)
        .single();
      pedido = p;

      // Actualizar estado del pedido
      await supabaseAdmin()
        .from("pedidos")
        .update({ estado: "pagado", payment_id: String(paymentId) })
        .eq("id", pedidoId);
    }

    // Descontar stock usando updates directos (no depende de RPCs)
    // Si no hay pedido guardado, usa los items de MP como fallback
    const itemsParaStock = pedido?.items?.length
      ? pedido.items
      : (payment.additional_info?.items ?? []).map((i) => ({
          id: i.id,
          cantidad: i.quantity,
          talle: null,
          tabla: null,
        }));

    for (const item of itemsParaStock) {
      if (!item.id || item.id === "envio") continue;
      const cantidad = Number(item.cantidad ?? item.quantity ?? 1);

      // Si sabemos la tabla, actualizamos solo esa. Si no, intentamos ambas.
      const tablas = item.tabla
        ? [item.tabla]
        : ["productos_stock", "productos_catalogo"];

      for (const tabla of tablas) {
        const { data: prod } = await supabaseAdmin()
          .from(tabla)
          .select("stock, stock_por_talle")
          .eq("id", String(item.id))
          .single();

        if (!prod) continue;

        const updates = {
          stock: Math.max(0, (prod.stock ?? 0) - cantidad),
        };

        const talle = item.talle ?? "";
        if (talle && prod.stock_por_talle?.[talle] !== undefined) {
          updates.stock_por_talle = {
            ...prod.stock_por_talle,
            [talle]: Math.max(0, prod.stock_por_talle[talle] - cantidad),
          };
        }

        await supabaseAdmin().from(tabla).update(updates).eq("id", String(item.id));
        break; // encontró el producto, no buscar en la otra tabla
      }
    }

    // Enviar email de confirmación al comprador
    if (!pedido?.email) {
      console.warn("[email] No hay pedido o email — skip");
    } else if (!process.env.RESEND_API_KEY) {
      console.warn("[email] RESEND_API_KEY no está seteada en Vercel — skip");
    } else {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const itemsHtml = (pedido.items ?? [])
          .map((i) => `
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #3f3f46">
                ${i.imagen ? `<img src="${i.imagen}" width="50" height="50" style="object-fit:contain;background:#fff;border-radius:6px;vertical-align:middle;margin-right:10px">` : ""}
                <strong style="color:#f4f4f5">${i.nombre}</strong> — Talle ${i.talle}
              </td>
              <td style="padding:8px 0;border-bottom:1px solid #3f3f46;text-align:right;color:#f97316;font-weight:bold">
                x${i.cantidad} · $${(i.precio * i.cantidad).toLocaleString("es-AR")}
              </td>
            </tr>`)
          .join("");

        const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
        console.log(`[email] Enviando confirmación a ${pedido.email} desde ${fromEmail}`);

        const result = await resend.emails.send({
          from: fromEmail,
          to: pedido.email,
          subject: "¡Tu pedido fue confirmado! — Camisetas Zeus",
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#18181b;color:#f4f4f5;padding:32px;border-radius:12px">
              <img src="${process.env.NEXT_PUBLIC_URL}/logo.png" height="40" alt="Camisetas Zeus" style="margin-bottom:20px">
              <h1 style="color:#f97316;margin:0 0 8px">¡Pago confirmado!</h1>
              <p style="color:#a1a1aa;margin:0 0 24px">Hola <strong style="color:#f4f4f5">${pedido.nombre}</strong>, recibimos tu pago correctamente. Prepararemos tu pedido a la brevedad.</p>
              <table style="width:100%;border-collapse:collapse">${itemsHtml}</table>
              <p style="margin-top:20px;text-align:right;font-size:18px;font-weight:bold;color:#f97316">
                Total: $${Number(pedido.total).toLocaleString("es-AR")}
              </p>
              <div style="margin-top:24px;padding:16px;background:#27272a;border-radius:8px">
                <p style="margin:0 0 6px;color:#a1a1aa;font-size:12px">DIRECCIÓN DE ENVÍO</p>
                <p style="margin:0;font-size:14px">${[pedido.calle, pedido.numero, pedido.piso && `Piso ${pedido.piso}`, pedido.localidad, pedido.provincia].filter(Boolean).join(", ")}</p>
              </div>
              <p style="margin-top:24px;font-size:12px;color:#71717a">Payment ID: ${paymentId}</p>
            </div>
          `,
        });

        if (result.error) {
          console.error("[email] Resend retornó error:", JSON.stringify(result.error));
        } else {
          console.log("[email] Enviado OK — id:", result.data?.id);
        }
      } catch (emailErr) {
        console.error("[email] Excepción:", emailErr?.message ?? emailErr);
      }
    }

    console.log(`Pago aprobado ${paymentId} — pedido ${pedidoId ?? "sin referencia"}`);
    return Response.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return Response.json({ error: "Webhook error" }, { status: 500 });
  }
}
