import { supabaseAdmin } from "@/lib/supabase";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

const NO_CACHE = { "Cache-Control": "no-store, no-cache, must-revalidate" };

export async function GET() {
  noStore();
  const { data, error } = await supabaseAdmin()
    .from("configuracion")
    .select("clave, valor");

  if (error) {
    console.error("[config público] Error:", error.message);
    return Response.json({ precio_envio: "0" }, { headers: NO_CACHE });
  }

  const config = Object.fromEntries((data ?? []).map(({ clave, valor }) => [clave, valor]));
  return Response.json(config, { headers: NO_CACHE });
}
