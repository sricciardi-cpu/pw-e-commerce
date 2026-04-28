export const dynamic = "force-dynamic";

import { supabaseAdmin } from "@/lib/supabase";

const TABLAS_VALIDAS = ["stock", "catalogo"];

function nombreTabla(tabla) {
  return tabla === "stock" ? "productos_stock" : "productos_catalogo";
}

export async function PUT(request, { params }) {
  if (!TABLAS_VALIDAS.includes(params.tabla)) {
    return Response.json({ error: "Tabla inválida" }, { status: 400 });
  }

  try {
    const body = await request.json();

    const campos = {
      nombre: body.nombre,
      precio: parseInt(body.precio),
      categoria: body.categoria,
      tipo: body.tipo,
      talle: body.talle ?? [],
      descripcion: body.descripcion ?? "",
      imagen: body.imagen ?? "",
      imagen_espalda: body.imagenEspalda ?? "",
      stock: parseInt(body.stock) || 0,
    };

    const { data, error } = await supabaseAdmin()
      .from(nombreTabla(params.tabla))
      .update(campos)
      .eq("id", params.id)
      .select()
      .single();

    if (error) throw error;

    return Response.json(data);
  } catch (err) {
    console.error("Error actualizando producto:", err);
    return Response.json({ error: "Error al actualizar el producto" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  if (!TABLAS_VALIDAS.includes(params.tabla)) {
    return Response.json({ error: "Tabla inválida" }, { status: 400 });
  }

  const { error } = await supabaseAdmin()
    .from(nombreTabla(params.tabla))
    .delete()
    .eq("id", params.id);

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({ ok: true });
}
