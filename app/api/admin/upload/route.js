import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ error: "No se recibió ningún archivo" }, { status: 400 });
    }

    const extension = file.name.split(".").pop();
    const nombreArchivo = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabaseAdmin()
      .storage
      .from("productos")
      .upload(nombreArchivo, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabaseAdmin()
      .storage
      .from("productos")
      .getPublicUrl(data.path);

    return Response.json({ url: publicUrl });
  } catch (err) {
    console.error("Error subiendo imagen:", err);
    return Response.json({ error: "Error al subir la imagen" }, { status: 500 });
  }
}
