import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const NO_CACHE = { "Cache-Control": "no-store, no-cache, must-revalidate" };

export async function GET() {
  const { data, error } = await supabaseAdmin()
    .from("configuracion")
    .select("clave, valor");

  if (error) {
    console.error("[config] GET error:", error.message);
    return Response.json({ error: error.message }, { status: 500, headers: NO_CACHE });
  }

  const config = Object.fromEntries((data ?? []).map(({ clave, valor }) => [clave, valor]));
  return Response.json(config, { headers: NO_CACHE });
}

export async function PUT(request) {
  const body = await request.json();

  for (const [clave, valor] of Object.entries(body)) {
    const valorStr = String(valor);

    // Verificar si ya existe la fila
    const { data: existing, error: selectError } = await supabaseAdmin()
      .from("configuracion")
      .select("clave")
      .eq("clave", clave)
      .maybeSingle();

    if (selectError) {
      console.error("[config] PUT select error:", selectError.message);
      return Response.json({ error: selectError.message }, { status: 500 });
    }

    if (existing) {
      const { error } = await supabaseAdmin()
        .from("configuracion")
        .update({ valor: valorStr })
        .eq("clave", clave);

      if (error) {
        console.error("[config] PUT update error:", error.message);
        return Response.json({ error: error.message }, { status: 500 });
      }
    } else {
      const { error } = await supabaseAdmin()
        .from("configuracion")
        .insert({ clave, valor: valorStr });

      if (error) {
        console.error("[config] PUT insert error:", error.message);
        return Response.json({ error: error.message }, { status: 500 });
      }
    }

    console.log(`[config] PUT ok — ${clave} = ${valorStr}`);
  }

  return Response.json({ ok: true });
}
