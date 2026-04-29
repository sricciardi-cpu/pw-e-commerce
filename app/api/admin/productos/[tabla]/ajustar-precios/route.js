import { supabaseAdmin } from "@/lib/supabase";

const TABLAS_VALIDAS = ["stock", "catalogo"];

function nombreTabla(tabla) {
  return tabla === "stock" ? "productos_stock" : "productos_catalogo";
}

// PATCH body: { tipo: "porcentaje" | "fijo", valor: number, ids?: string[] }
// Si ids está vacío o ausente, aplica a todos los productos de la tabla.
export async function PATCH(request, { params }) {
  if (!TABLAS_VALIDAS.includes(params.tabla)) {
    return Response.json({ error: "Tabla inválida" }, { status: 400 });
  }

  try {
    const { tipo, valor, ids } = await request.json();

    if (!["porcentaje", "fijo"].includes(tipo)) {
      return Response.json({ error: "tipo debe ser 'porcentaje' o 'fijo'" }, { status: 400 });
    }
    if (typeof valor !== "number" || isNaN(valor)) {
      return Response.json({ error: "valor inválido" }, { status: 400 });
    }

    const tabla = nombreTabla(params.tabla);

    // Traer los productos a actualizar
    let query = supabaseAdmin().from(tabla).select("id, precio");
    if (ids && ids.length > 0) query = query.in("id", ids);

    const { data: productos, error: fetchError } = await query;
    if (fetchError) throw fetchError;

    // Calcular nuevos precios y actualizar de a uno
    // (Supabase no soporta UPDATE con expresión por fila, así que actualizamos individualmente)
    for (const p of productos) {
      const nuevoPrecio =
        tipo === "porcentaje"
          ? Math.round(p.precio * (1 + valor / 100))
          : Math.max(0, p.precio + valor);

      const { error } = await supabaseAdmin()
        .from(tabla)
        .update({ precio: nuevoPrecio })
        .eq("id", p.id);

      if (error) throw error;
    }

    return Response.json({ ok: true, actualizados: productos.length });
  } catch (err) {
    console.error("Error ajustando precios:", err);
    return Response.json({ error: "Error al ajustar precios" }, { status: 500 });
  }
}
