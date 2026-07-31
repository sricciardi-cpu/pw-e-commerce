// Meta Conversions API (server-side) — envía el evento Purchase cuando un
// pedido se confirma como pagado. Es más preciso que el pixel del navegador:
// no lo bloquean los ad-blockers ni se pierde en redirects, y cuenta solo
// pedidos realmente pagados (incluye transferencias marcadas en el admin).
//
// No-op si faltan credenciales (NEXT_PUBLIC_META_PIXEL_ID + META_CONVERSIONS_TOKEN).

import crypto from "crypto";

const GRAPH_VERSION = "v21.0";

function sha256(value) {
  if (!value) return null;
  return crypto.createHash("sha256").update(String(value).trim().toLowerCase()).digest("hex");
}

function hashPhone(value) {
  if (!value) return null;
  const digits = String(value).replace(/\D/g, "");
  if (!digits) return null;
  return crypto.createHash("sha256").update(digits).digest("hex");
}

export async function sendPurchaseEvent(pedido) {
  const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const TOKEN = process.env.META_CONVERSIONS_TOKEN;
  if (!PIXEL_ID || !TOKEN || !pedido) return;

  const items = Array.isArray(pedido.items) ? pedido.items : [];
  const baseUrl = (process.env.NEXT_PUBLIC_URL ?? "https://camisetaszeus.com")
    .replace("://www.", "://")
    .replace(/\/$/, "");

  const user_data = {};
  const em = sha256(pedido.email);
  const ph = hashPhone(pedido.telefono);
  if (em) user_data.em = [em];
  if (ph) user_data.ph = [ph];
  const nombre = (pedido.nombre ?? "").trim().toLowerCase();
  if (nombre) {
    const partes = nombre.split(/\s+/);
    user_data.fn = [sha256(partes[0])];
    if (partes.length > 1) user_data.ln = [sha256(partes[partes.length - 1])];
  }

  const payload = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        // Mismo event_id que el pixel del navegador → Meta deduplica y no
        // cuenta la compra dos veces cuando disparan ambos (caso MercadoPago).
        event_id: String(pedido.id),
        action_source: "website",
        event_source_url: `${baseUrl}/checkout/exito`,
        user_data,
        custom_data: {
          currency: "ARS",
          value: Number(pedido.total) || 0,
          content_type: "product",
          content_ids: items.map((i) => String(i.id)),
          contents: items.map((i) => ({ id: String(i.id), quantity: Number(i.cantidad) || 1 })),
          num_items: items.reduce((s, i) => s + (Number(i.cantidad) || 1), 0),
          order_id: String(pedido.id),
        },
      },
    ],
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) {
      const t = await res.text();
      console.error("[meta-capi] error:", res.status, t.slice(0, 300));
    } else {
      console.log("[meta-capi] Purchase enviado — pedido", pedido.id);
    }
  } catch (e) {
    console.error("[meta-capi] excepción:", e?.message ?? e);
  }
}
