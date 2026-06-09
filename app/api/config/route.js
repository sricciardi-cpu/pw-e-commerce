import { supabaseAdmin } from "@/lib/supabase";

// Cacheamos 5 minutos en el edge + browser. La config (precio de envio,
// precio de estampa) casi nunca cambia, asi que evitamos miles de hits
// por dia a Supabase y reducimos Edge Requests.
const CACHE = { "Cache-Control": "public, s-maxage=300, max-age=300, stale-while-revalidate=600" };

export async function GET() {
  const { data, error } = await supabaseAdmin()
    .from("configuracion")
    .select("clave, valor");

  if (error) {
    console.error("[config público] Error:", error.message);
    return Response.json({ precio_envio: "0" }, { headers: { "Cache-Control": "no-store" } });
  }

  const config = Object.fromEntries((data ?? []).map(({ clave, valor }) => [clave, valor]));
  return Response.json(config, { headers: CACHE });
}
