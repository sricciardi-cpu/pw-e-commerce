// Keepalive: mantiene activo el proyecto de Supabase.
//
// El plan gratuito de Supabase pausa los proyectos que pasan 7 días sin
// actividad. Este endpoint hace una consulta mínima a la base y lo llama
// un cron de Vercel una vez por día (ver vercel.json), así el proyecto
// nunca llega a ese umbral aunque la tienda tenga días sin visitas.

import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request) {
  // Si CRON_SECRET está configurado en Vercel, exigimos el header que Vercel
  // envía en sus crons. Si no está, el endpoint queda abierto pero es
  // inofensivo: solo hace una lectura mínima y no expone datos.
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return Response.json({ error: "No autorizado" }, { status: 401 });
    }
  }

  try {
    // Consulta más chica posible: una sola fila, una sola columna.
    const { error } = await supabaseAdmin()
      .from("configuracion")
      .select("clave")
      .limit(1);

    if (error) throw error;

    console.log("[keepalive] Supabase OK");
    return Response.json({ ok: true, ts: new Date().toISOString() });
  } catch (err) {
    console.error("[keepalive] Error:", err?.message ?? err);
    return Response.json({ ok: false, error: err?.message ?? "error" }, { status: 500 });
  }
}
