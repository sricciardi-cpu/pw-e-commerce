import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Endpoint público — no requiere autenticación admin.
// Solo expone valores que el frontend necesita mostrar (precio_envio, etc.)
export async function GET() {
  const { data, error } = await supabaseAdmin()
    .from("configuracion")
    .select("clave, valor");

  if (error) {
    console.error("[config] Error leyendo configuracion:", error.message);
    return Response.json({ precio_envio: "0" });
  }

  const config = Object.fromEntries((data ?? []).map(({ clave, valor }) => [clave, valor]));
  return Response.json(config);
}
