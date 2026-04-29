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

  const updates = Object.entries(body).map(([clave, valor]) => ({ clave, valor: String(valor) }));

  for (const row of updates) {
    const { error } = await supabaseAdmin()
      .from("configuracion")
      .upsert(row, { onConflict: "clave" });
    if (error) return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
