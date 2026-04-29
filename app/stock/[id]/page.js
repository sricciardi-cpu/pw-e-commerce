"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import { FaChevronRight, FaSpinner } from "react-icons/fa";

function formatearPrecio(precio) {
  return "$" + precio.toLocaleString("es-AR");
}

const badgeTipo = { nacion: "bg-zinc-700 text-white", club: "bg-orange-500/20 text-orange-400" };

export default function StockDetallePage({ params }) {
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const { agregarAlCarrito, cantidadEnCarrito } = useCart();

  const [imagenActiva,      setImagenActiva]      = useState(0);
  const [talleSeleccionado, setTalleSeleccionado] = useState(null);
  const [cantidad,          setCantidad]          = useState(1);
  const [estado,            setEstado]            = useState("idle");

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    supabase
      .from("productos_stock")
      .select("*")
      .eq("id", params.id)
      .single()
      .then(({ data }) => { setProducto(data); setCargando(false); });
  }, [params.id]);

  useEffect(() => {
    if (estado === "success") {
      const t = setTimeout(() => setEstado("idle"), 1500);
      return () => clearTimeout(t);
    }
  }, [estado]);

  if (cargando) {
    return (
      <main className="flex items-center justify-center py-20">
        <FaSpinner className="text-orange-500 text-3xl animate-spin" />
      </main>
    );
  }

  if (!producto) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-8 text-center">
        <p className="text-xl font-semibold text-gray-400">Producto no encontrado.</p>
        <Link href="/stock" className="mt-6 inline-block text-orange-500 underline">Volver al stock</Link>
      </main>
    );
  }

  const imagenes = [producto.imagen, producto.imagen_espalda].filter(Boolean);

  const stockTalle = talleSeleccionado && producto.stock_por_talle?.[talleSeleccionado] !== undefined
    ? producto.stock_por_talle[talleSeleccionado]
    : producto.stock ?? 0;

  const yaEnCarrito = talleSeleccionado ? cantidadEnCarrito(producto.id, talleSeleccionado) : 0;
  const disponible  = Math.max(0, stockTalle - yaEnCarrito);

  function handleAgregar() {
    if (!talleSeleccionado) { setEstado("warning"); return; }
    if (disponible === 0) return;
    agregarAlCarrito({
      id: producto.id, nombre: producto.nombre, talle: talleSeleccionado,
      precio: producto.precio, cantidad, imagen: producto.imagen,
      stock: stockTalle, tabla: "productos_stock",
    });
    setCantidad(1);
    setEstado("success");
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-4">
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-3">
        <Link href="/" className="hover:text-orange-500 transition-colors">Inicio</Link>
        <FaChevronRight className="text-xs" />
        <Link href="/stock" className="hover:text-orange-500 transition-colors">Stock</Link>
        <FaChevronRight className="text-xs" />
        <span className="text-white font-medium truncate max-w-[180px]">{producto.nombre}</span>
      </nav>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Galería */}
        <div className="w-full md:w-2/5 flex flex-col gap-2">
          <div className="h-80 w-full rounded-xl overflow-hidden bg-zinc-900 flex items-center justify-center">
            <img key={imagenActiva} src={imagenes[imagenActiva]} alt={producto.nombre} className="h-full w-full object-contain animate-[fadeIn_0.3s_ease-out]" loading="lazy" />
          </div>
          {imagenes.length > 1 && (
            <div className="flex gap-2">
              {imagenes.map((src, i) => (
                <button key={i} onClick={() => setImagenActiva(i)} className={`flex-1 h-20 rounded-lg overflow-hidden border-2 transition-colors bg-zinc-900 flex items-center justify-center ${imagenActiva === i ? "border-orange-500" : "border-zinc-700 hover:border-zinc-500"}`}>
                  <img src={src} alt={`Vista ${i + 1}`} className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="w-full md:w-3/5 flex flex-col gap-3">
          <div className="flex gap-2 flex-wrap">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${badgeTipo[producto.tipo]}`}>
              {producto.tipo === "nacion" ? "Nación" : "Club"}
            </span>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-orange-500 text-black capitalize">{producto.categoria}</span>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-600 text-white">
              En stock · {producto.stock} disponible{producto.stock !== 1 ? "s" : ""}
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-white leading-tight">{producto.nombre}</h1>
          <p className="text-orange-500 text-2xl font-bold">{formatearPrecio(producto.precio)}</p>
          <p className="text-gray-300 text-sm leading-relaxed">{producto.descripcion}</p>

          <div>
            <p className="text-sm font-semibold text-gray-300 mb-2">Seleccioná tu talle:</p>
            <div className="flex gap-2 flex-wrap">
              {(producto.talle ?? []).map((t) => {
                const stockT  = producto.stock_por_talle?.[t] !== undefined ? producto.stock_por_talle[t] : null;
                const sinStock = stockT !== null && stockT === 0;
                return (
                  <button key={t} onClick={() => { if (!sinStock) { setTalleSeleccionado(t); setCantidad(1); setEstado("idle"); } }}
                    className={`w-12 h-12 rounded-xl border-2 text-sm font-bold transition-colors active:scale-95 ${
                      sinStock
                        ? "opacity-40 cursor-not-allowed bg-zinc-800 text-gray-500 border-zinc-700"
                        : talleSeleccionado === t
                          ? "bg-orange-500 text-black border-orange-500"
                          : "bg-zinc-800 text-gray-200 border-zinc-600 hover:border-white hover:text-white"
                    }`}>
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-300 mb-2">Cantidad:</p>
            <div className="flex items-center w-fit">
              <button onClick={() => setCantidad(c => Math.max(1, c - 1))} disabled={cantidad === 1} className="w-10 h-10 rounded-l-xl bg-orange-500 text-black font-bold text-lg hover:bg-orange-400 disabled:opacity-40 transition-colors">−</button>
              <span className="w-12 h-10 flex items-center justify-center bg-zinc-900 border-y border-zinc-600 text-white font-bold text-sm">{cantidad}</span>
              <button onClick={() => setCantidad(c => Math.min(disponible, c + 1))} disabled={cantidad >= disponible} className="w-10 h-10 rounded-r-xl bg-orange-500 text-black font-bold text-lg hover:bg-orange-400 disabled:opacity-40 transition-colors">+</button>
            </div>
            {yaEnCarrito > 0 && <p className="text-xs text-gray-400 mt-1">Ya tenés {yaEnCarrito} en el carrito</p>}
          </div>

          {estado === "warning" && <p className="text-red-400 text-sm">Seleccioná un talle primero.</p>}

          <button onClick={handleAgregar} disabled={disponible === 0} className={`w-full font-semibold py-3 rounded-xl text-base active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${estado === "success" ? "bg-green-600 text-white scale-95" : "bg-orange-500 text-black hover:bg-orange-400"}`}>
            {disponible === 0 ? "Sin stock para este talle" : estado === "success" ? "✓ Agregado al carrito" : "Agregar al carrito"}
          </button>

          <Link href="/guia-de-talles" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">Ver guía de talles →</Link>
        </div>
      </div>
    </main>
  );
}
