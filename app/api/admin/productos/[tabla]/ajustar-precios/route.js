import { supabaseAdmin } from "@/lib/supabase";

const TABLAS_VALIDAS = ["stock", "catalogo"];

function nombreTabla(tabla) {
  return tabla === "stock" ? "productos_stock" : "productos_catalogo";
}

// PATCH body:
//   { tipo: "precio",                 valor: number }  → fija el precio de TODOS los productos a ese valor
//   { tipo: "descuento_transferencia", valor: number }  → fija el descuento transferencia (%) a todos los productos
export async function PATCH(request, { params }) {
  if (!TABLAS_VALIDAS.includes(params.tabla)) {
    return Response.json({ error: "Tabla inválida" }, { status: 400 });
  }

  try {
    const { tipo, valor } = await request.json();

    if (!["precio", "descuento_transferencia"].includes(tipo)) {
      return Response.json({ error: "tipo debe ser 'precio' o 'descuento_transferencia'" }, { status: 400 });
    }
    const num = Number(valor);
    if (isNaN(num) || num < 0) {
      return Response.json({ error: "valor inválido" }, { status: 400 });
    }

    const tabla = nombreTabla(params.tabla);

    const { error, count } = await supabaseAdmin()
      .from(tabla)
      .update({ [tipo]: Math.round(num) })
      .neq("id", "");  // condición siempre verdadera para actualizar todos

    if (error) throw error;

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Error ajustando precios:", err);
    return Response.json({ error: "Error al ajustar precios" }, { status: 500 });
  }
}
