import { supabaseAdmin } from "@/lib/supabase";
import { sendPurchaseEvent } from "@/lib/metaConversions";
import { enviarConfirmacionPago } from "@/lib/emailConfirmacion";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

export async function POST(request) {
  noStore();
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

      // Actualizar estado del pedido. Marcamos stock_descontado para que un
      // cambio manual posterior en el admin no vuelva a descontar el stock.
      await supabaseAdmin()
        .from("pedidos")
        .update({ estado: "pagado", payment_id: String(paymentId), stock_descontado: true })
        .eq("id", pedidoId);

      // Purchase server-side a Meta (deduplica con el pixel del navegador
      // por event_id = pedido.id).
      await sendPurchaseEvent(pedido);
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
      if (!item.id || item.id === "envio" || item.id === "estampa") continue;
      // Solo se descuenta stock de la sección "Stock". El catálogo es por
      // encargo (sin stock real), así que esos items se ignoran.
      if (item.tabla && item.tabla !== "productos_stock") continue;
      const cantidad = Number(item.cantidad ?? item.quantity ?? 1);

      {
        const { data: prod } = await supabaseAdmin()
          .from("productos_stock")
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

        await supabaseAdmin().from("productos_stock").update(updates).eq("id", String(item.id));
      }
    }

    // Enviar email de confirmación al comprador
    await enviarConfirmacionPago(pedido);

    console.log(`Pago aprobado ${paymentId} — pedido ${pedidoId ?? "sin referencia"}`);
    return Response.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return Response.json({ error: "Webhook error" }, { status: 500 });
  }
}
