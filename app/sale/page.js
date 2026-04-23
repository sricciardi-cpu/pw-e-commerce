"use client";

import Link from "next/link";
import productos from "@/data/productos";
import FadeIn from "@/components/FadeIn";

function formatearPrecio(precio) {
  return "$" + precio.toLocaleString("es-AR");
}

const badgeTipo = {
  nacion: "bg-gray-800 text-white",
  club:   "bg-orange-100 text-orange-800",
};

// Solo productos en liquidación
const productosSale = productos.filter((p) => p.liquidacion === true);

export default function SalePage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-1">Sale 🔥</h1>
      <p className="text-gray-500 mb-8">Últimas unidades disponibles</p>

      <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {productosSale.map((producto, i) => (
          <FadeIn key={producto.id} delay={i * 60}>
          <article
            className="bg-white rounded-xl border border-black shadow-sm overflow-hidden flex flex-col h-full transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg"
          >
            {/* Imagen con badge SALE superpuesto */}
            <div className="relative">
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="w-full object-cover"
                loading="lazy"
              />
              <span className="absolute top-2 left-2 bg-orange-500 text-black text-xs font-extrabold px-2 py-1 rounded-full">
                SALE
              </span>
            </div>

            <div className="p-3 md:p-4 flex flex-col flex-1 gap-2">
              <span className={`text-xs font-medium px-2 py-1 rounded-full self-start ${badgeTipo[producto.tipo]}`}>
                {producto.tipo === "nacion" ? "Nación" : "Club"}
              </span>

              <h2 className="font-semibold text-gray-900">{producto.nombre}</h2>

              {/* Talles disponibles como píldoras */}
              <div className="flex gap-1 flex-wrap">
                {producto.talle.map((t) => (
                  <span key={t} className="text-xs border border-gray-400 rounded px-1.5 py-0.5 text-gray-600">
                    {t}
                  </span>
                ))}
              </div>

              <p className="text-orange-500 font-bold mt-auto">
                {formatearPrecio(producto.precio)}
              </p>

              <Link
                href={`/catalogo/${producto.id}`}
                className="block text-center bg-black text-white text-sm font-medium py-2 rounded-lg hover:bg-orange-500 hover:text-black transition-colors mt-1"
              >
                Ver detalle
              </Link>
            </div>
          </article>
          </FadeIn>
        ))}
      </section>
    </main>
  );
}
