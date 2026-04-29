import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabaseAdmin()
    .from("configuracion")
    .select("clave, valor");

  if (error) return Response.json({ error: error.message }, { status: 500 });

  const config = Object.fromEntries((data ?? []).map(({ clave, valor }) => [clave, valor]));
  return Response.json(config);
}

export async function PUT(request) {
  const body = await request.json();

  for (const [clave, valor] of Object.entries(body)) {
    const valorStr = String(valor);

    // Intentar UPDATE primero
    const { data: updated, error: updateError } = await supabaseAdmin()
      .from("configuracion")
      .update({ valor: valorStr })
      .eq("clave", clave)
      .select("clave");

    if (updateError) {
      console.error("[config] PUT update error:", updateError.message);
      return Response.json({ error: updateError.message }, { status: 500 });
    }

    // Si no existía la fila, INSERT
    if (!updated || updated.length === 0) {
      const { error: insertError } = await supabaseAdmin()
        .from("configuracion")
        .insert({ clave, valor: valorStr });

      if (insertError) {
        console.error("[config] PUT insert error:", insertError.message);
        return Response.json({ error: insertError.message }, { status: 500 });
      }
    }

    console.log(`[config] PUT ok — ${clave} = ${valorStr}`);
  }

  return Response.json({ ok: true });
}
