"use client";

// Ruta dinámica: la carpeta se llama [id], lo que le indica a Next.js que
// cualquier segmento en esa posición (ej: /catalogo/3) se captura como params.id.

import { useState } from "react";
import Link from "next/link";
import productos from "@/data/productos";
import { useCart } from "@/context/CartContext";

function formatearPrecio(precio) {
  return "$" + precio.toLocaleString("es-AR");
}

const badgeDeporte = {
  futbol: "bg-black text-white",
  rugby:  "bg-orange-500 text-black",
};
const badgeTipo = {
  nacion: "bg-gray-800 text-white",
  club:   "bg-orange-100 text-orange-800",
};

export default function ProductoDetallePage({ params }) {
  const producto = productos.find((p) => p.id === Number(params.id));
  const { agregarAlCarrito } = useCart();

  // Galería: imagen principal + thumbnails
  const imagenes = [
    producto?.imagen,
    "https://via.placeholder.com/400x400?text=Vista+Trasera",
  ];
  const [imagenActiva, setImagenActiva] = useState(0);

  const [talleSeleccionado, setTalleSeleccionado] = useState(null);
  // "idle" | "warning" | "success"
  const [estado, setEstado] = useState("idle");

  if (!producto) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-8 text-center">
        <p className="text-xl font-semibold text-gray-500">Producto no encontrado.</p>
        <Link href="/catalogo" className="mt-6 inline-block text-orange-500 underline">
          Volver al catálogo
        </Link>
      </main>
    );
  }

  function handleAgregar() {
    if (!talleSeleccionado) {
      setEstado("warning");
      return;
    }
    agregarAlCarrito({ id: producto.id, nombre: producto.nombre, talle: talleSeleccionado, precio: producto.precio });
    setEstado("success");
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">

      <Link href="/catalogo" className="inline-flex items-center gap-1 text-sm text-orange-500 hover:underline mb-8">
        ← Volver al catálogo
      </Link>

      {/* Layout: columnas en desktop, apilado en mobile */}
      <div className="flex flex-col md:flex-row gap-10">

        {/* COLUMNA IZQUIERDA — 40% — galería */}
        <div className="w-full md:w-2/5 flex flex-col gap-3">

          {/* Imagen principal */}
          <img
            src={imagenes[imagenActiva]}
            alt={producto.nombre}
            className="w-full object-cover rounded-xl"
            loading="lazy"
          />

          {/* Thumbnails */}
          <div className="flex gap-3">
            {imagenes.map((src, i) => (
              <button
                key={i}
                onClick={() => setImagenActiva(i)}
                className={`flex-1 rounded-lg overflow-hidden border-2 transition-colors ${
                  imagenActiva === i ? "border-orange-500" : "border-transparent hover:border-gray-300"
                }`}
              >
                <img
                  src={src}
                  alt={`Vista ${i + 1}`}
                  className="w-full object-cover"
                />
              </button>
            ))}
          </div>

        </div>

        {/* COLUMNA DERECHA — 60% — información del producto */}
        <div className="w-full md:w-3/5 flex flex-col gap-4">

          {/* Badges */}
          <div className="flex gap-2 flex-wrap">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${badgeDeporte[producto.deporte]}`}>
              {producto.deporte === "futbol" ? "Fútbol" : "Rugby"}
            </span>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${badgeTipo[producto.tipo]}`}>
              {producto.tipo === "nacion" ? "Nación" : "Club"}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900">{producto.nombre}</h1>

          <p className="text-orange-500 text-3xl font-bold">{formatearPrecio(producto.precio)}</p>

          <p className="text-gray-600 text-sm leading-relaxed">{producto.descripcion}</p>

          <p className={`text-sm font-medium ${producto.stock > 0 ? "text-gray-500" : "text-red-500"}`}>
            {producto.stock > 0 ? `Stock disponible: ${producto.stock} unidades` : "Sin stock"}
          </p>

          {/* Selector de talle */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Seleccioná tu talle:</p>
            <div className="flex gap-3 flex-wrap">
              {producto.talle.map((t) => (
                <button
                  key={t}
                  onClick={() => { setTalleSeleccionado(t); setEstado("idle"); }}
                  className={`w-14 h-14 rounded-xl border-2 text-sm font-bold transition-colors active:scale-95 ${
                    talleSeleccionado === t
                      ? "bg-orange-500 text-black border-orange-500"
                      : "bg-white text-gray-700 border-gray-300 hover:border-black hover:text-black"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Mensajes de validación y confirmación */}
          {estado === "warning" && (
            <p className="text-red-500 text-sm">Seleccioná un talle primero.</p>
          )}
          {estado === "success" && (
            <p className="text-green-600 text-sm font-medium">✓ Agregado al carrito</p>
          )}

          <button
            onClick={handleAgregar}
            className="w-full bg-black text-white font-semibold py-4 rounded-xl hover:bg-orange-500 hover:text-black transition-colors text-base active:scale-95"
          >
            Agregar al carrito
          </button>

          <Link href="/guia-de-talles" className="text-sm text-gray-500 hover:text-orange-500 transition-colors">
            Ver guía de talles →
          </Link>

        </div>
      </div>
    </main>
  );
}
