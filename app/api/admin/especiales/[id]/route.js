export const dynamic = "force-dynamic";

import { supabaseAdmin } from "@/lib/supabase";

const IDS_VALIDOS = ["mystery_futbox", "griptec_spray"];

export async function GET(request, { params }) {
  if (!IDS_VALIDOS.includes(params.id)) {
    return Response.json({ error: "ID inválido" }, { status: 400 });
  }
  const { data, error } = await supabaseAdmin()
    .from("paginas_especiales")
    .select("*")
    .eq("id", params.id)
    .single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function PUT(request, { params }) {
  if (!IDS_VALIDOS.includes(params.id)) {
    return Response.json({ error: "ID inválido" }, { status: 400 });
  }
  const body = await request.json();
  const { data, error } = await supabaseAdmin()
    .from("paginas_especiales")
    .update(body)
    .eq("id", params.id)
    .select()
    .single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}
