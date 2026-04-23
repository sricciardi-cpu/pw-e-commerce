"use client";

// Ruta dinámica: la carpeta se llama [id], lo que le indica a Next.js que
// cualquier segmento en esa posición (ej: /catalogo/3) se captura como params.id.

import { useState, useEffect } from "react";
import Link from "next/link";
import productos from "@/data/productos";
import { useCart } from "@/context/CartContext";
import { FaChevronRight } from "react-icons/fa";

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

  const imagenes = [
    producto?.imagen,
    "https://via.placeholder.com/400x400?text=Vista+Trasera",
  ];
  const [imagenActiva, setImagenActiva] = useState(0);
  const [talleSeleccionado, setTalleSeleccionado] = useState(null);
  const [estado, setEstado] = useState("idle");

  useEffect(() => {
    if (estado === "success") {
      const t = setTimeout(() => setEstado("idle"), 1500);
      return () => clearTimeout(t);
    }
  }, [estado]);

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

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-orange-500 transition-colors">Inicio</Link>
        <FaChevronRight className="text-xs" />
        <Link href="/catalogo" className="hover:text-orange-500 transition-colors">Catálogo</Link>
        <FaChevronRight className="text-xs" />
        <span className="text-gray-900 font-medium truncate max-w-[180px]">{producto.nombre}</span>
      </nav>

      {/* Layout: columnas en desktop, apilado en mobile */}
      <div className="flex flex-col md:flex-row gap-10">

        {/* COLUMNA IZQUIERDA — 40% — galería */}
        <div className="w-full md:w-2/5 flex flex-col gap-3">

          {/* Imagen principal con zoom */}
          <div className="rounded-xl overflow-hidden">
            <img
              key={imagenActiva}
              src={imagenes[imagenActiva]}
              alt={producto.nombre}
              className="w-full object-cover transition-transform duration-500 hover:scale-110 animate-[fadeIn_0.3s_ease-out]"
              loading="lazy"
            />
          </div>

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
                <img src={src} alt={`Vista ${i + 1}`} className="w-full object-cover" />
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
            {producto.masVendido && (
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-orange-500 text-black">
                🔥 Más vendido
              </span>
            )}
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900">{producto.nombre}</h1>

          <p className="text-orange-500 text-3xl font-bold">{formatearPrecio(producto.precio)}</p>

          <p className="text-gray-600 text-sm leading-relaxed">{producto.descripcion}</p>

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

          {estado === "warning" && (
            <p className="text-red-500 text-sm">Seleccioná un talle primero.</p>
          )}
          <button
            onClick={handleAgregar}
            className={`w-full font-semibold py-4 rounded-xl text-base active:scale-95 transition-all duration-200 ${
              estado === "success"
                ? "bg-green-600 text-white scale-95"
                : "bg-black text-white hover:bg-orange-500 hover:text-black"
            }`}
          >
            {estado === "success" ? "✓ Agregado" : "Agregar al carrito"}
          </button>

          <Link href="/guia-de-talles" className="text-sm text-gray-500 hover:text-orange-500 transition-colors">
            Ver guía de talles →
          </Link>

        </div>
      </div>
    </main>
  );
}
