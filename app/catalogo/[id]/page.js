import { supabase } from "@/lib/supabase";
import ProductoDetalleClient from "./ProductoDetalleClient";

export async function generateMetadata({ params }) {
  const { data } = await supabase
    .from("productos_catalogo")
    .select("nombre, descripcion, imagen")
    .eq("id", params.id)
    .single();

  if (!data) return { title: "Producto | Camisetas Zeus" };

  return {
    title: `${data.nombre} | Camisetas Zeus`,
    description: data.descripcion || `Camiseta de rugby ${data.nombre}. Pedido por encargo con envío a todo el país.`,
    openGraph: {
      title: `${data.nombre} | Camisetas Zeus`,
      description: data.descripcion || `Camiseta de rugby ${data.nombre}.`,
      images: data.imagen ? [{ url: data.imagen }] : [],
    },
  };
}

export default function Page({ params }) {
  return <ProductoDetalleClient params={params} />;
}
