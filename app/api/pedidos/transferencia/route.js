import { supabaseAdmin } from "@/lib/supabase";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

export async function POST(request) {
  noStore();
  try {
    const { items, comprador, precioEnvio } = await request.json();

    const subtotal = items.reduce((sum, i) => sum + Number(i.precio) * Number(i.cantidad), 0);
    const total    = subtotal + (parseInt(precioEnvio) || 0);

    const fila = {
      nombre:        comprador.nombre,
      email:         comprador.email,
      telefono:      `${comprador.codigoArea ?? ""}${comprador.celular ?? ""}`,
      provincia:     comprador.provincia ?? "",
      localidad:     comprador.localidad ?? "",
      calle:         comprador.calle ?? "",
      numero:        comprador.numero ?? "",
      piso:          comprador.piso ?? "",
      departamento:  comprador.departamento ?? "",
      codigo_postal: comprador.codigoPostal ?? "",
      observaciones: `[TRANSFERENCIA] ${comprador.observaciones ?? ""}`.trim(),
      items,
      total,
      estado:        "pendiente_transferencia",
    };

    let { data, error } = await supabaseAdmin()
      .from("pedidos")
      .insert(fila)
      .select("id")
      .single();

    // Si la columna 'estado' tiene un CHECK constraint que rechaza
    // 'pendiente_transferencia', usamos 'pendiente' como fallback.
    // El admin lo distingue por el prefijo [TRANSFERENCIA] en observaciones.
    if (error) {
      console.error("[transferencia] Insert con pendiente_transferencia falló:", error.message);
      const fallback = { ...fila, estado: "pendiente" };
      const retry = await supabaseAdmin()
        .from("pedidos")
        .insert(fallback)
        .select("id")
        .single();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      console.error("[transferencia] Insert también falló con fallback:", error.message);
      return Response.json({ error: error.message }, { status: 500 });
    }

    console.log("[transferencia] Pedido creado:", data.id);
    return Response.json({ id: data.id });
  } catch (err) {
    console.error("[transferencia] Excepción:", err);
    return Response.json({ error: err.message ?? "Error al registrar el pedido" }, { status: 500 });
  }
}
