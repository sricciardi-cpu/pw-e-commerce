export const dynamic = "force-dynamic";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request) {
  try {
    if (!process.env.CLOUDINARY_API_SECRET) {
      return Response.json(
        { error: "Cloudinary no esta configurado en el servidor" },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ error: "No se recibió ningún archivo" }, { status: 400 });
    }

    // Convertir el File a buffer base64 para subirlo via SDK
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    // Subida a Cloudinary
    // - folder: "productos" para organizar los assets
    // - quality: auto -> Cloudinary elige la mejor compresion sin perder calidad
    // - fetch_format: auto -> sirve WebP/AVIF al browser que lo soporte
    // - width: 1200 (max) y crop limit -> no agranda imagenes mas chicas
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "productos",
      resource_type: "image",
      transformation: [
        { width: 1200, crop: "limit" },
        { quality: "auto", fetch_format: "auto" },
      ],
    });

    return Response.json({ url: result.secure_url });
  } catch (err) {
    console.error("Error subiendo imagen a Cloudinary:", err);
    return Response.json({ error: "Error al subir la imagen" }, { status: 500 });
  }
}
