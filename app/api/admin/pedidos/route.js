import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin()
      .from("pedidos")
      .select("*")
      .neq("estado", "pendiente")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching pedidos:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
