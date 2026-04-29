import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const { items, comprador, precioEnvio } = await request.json();

    const subtotal = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
    const total    = subtotal + (parseInt(precioEnvio) || 0);

    const { data, error } = await supabaseAdmin()
      .from("pedidos")
      .insert({
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
        observaciones: comprador.observaciones ?? "",
        items,
        total,
        estado:        "pendiente",
        metodo_pago:   "transferencia",
      })
      .select("id")
      .single();

    if (error) throw error;

    return Response.json({ id: data.id });
  } catch (err) {
    console.error("Error creando pedido transferencia:", err);
    return Response.json({ error: "Error al registrar el pedido" }, { status: 500 });
  }
}
