import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const ESTADOS_VALIDOS = ["pendiente", "pagado", "enviado", "entregado", "cancelado"];

export async function PATCH(request, { params }) {
  try {
    const { estado } = await request.json();
    if (!ESTADOS_VALIDOS.includes(estado)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin()
      .from("pedidos")
      .update({ estado })
      .eq("id", params.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error updating pedido:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
