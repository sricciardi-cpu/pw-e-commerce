import { supabaseAdmin } from "@/lib/supabase";

const TABLAS_VALIDAS = ["stock", "catalogo"];

function nombreTabla(tabla) {
  return tabla === "stock" ? "productos_stock" : "productos_catalogo";
}

export async function GET(request, { params }) {
  if (!TABLAS_VALIDAS.includes(params.tabla)) {
    return Response.json({ error: "Tabla inválida" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin()
    .from(nombreTabla(params.tabla))
    .select("*")
    .order("creado_at", { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json(data);
}

export async function POST(request, { params }) {
  if (!TABLAS_VALIDAS.includes(params.tabla)) {
    return Response.json({ error: "Tabla inválida" }, { status: 400 });
  }

  try {
    const body = await request.json();

    const producto = {
      id: Date.now().toString(),
      nombre: body.nombre,
      precio: parseInt(body.precio),
      categoria: body.categoria,
      tipo: body.tipo,
      talle: body.talle ?? [],
      descripcion: body.descripcion ?? "",
      imagen: body.imagen ?? "",
      imagen_espalda: body.imagenEspalda ?? "",
      stock: parseInt(body.stock) || 0,
      stock_por_talle: body.stockPorTalle ?? {},
    };

    const { data, error } = await supabaseAdmin()
      .from(nombreTabla(params.tabla))
      .insert(producto)
      .select()
      .single();

    if (error) throw error;

    return Response.json(data, { status: 201 });
  } catch (err) {
    console.error("Error creando producto:", err);
    return Response.json({ error: "Error al crear el producto" }, { status: 500 });
  }
}
