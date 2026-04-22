"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

function formatearPrecio(precio) {
  return "$" + precio.toLocaleString("es-AR");
}

export default function CarritoPage() {
  const { items, quitarDelCarrito, vaciarCarrito, total } = useCart();

  if (items.length === 0) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-8 text-center">
        <p className="text-2xl font-bold text-gray-700 mb-2">Tu carrito está vacío</p>
        <p className="text-gray-500 mb-6">Todavía no agregaste ningún producto.</p>
        <Link href="/catalogo" className="inline-block bg-black text-white font-semibold px-6 py-3 rounded-xl hover:bg-orange-500 hover:text-black transition-colors">
          Ver catálogo
        </Link>
      </main>
    );
  }

  // Construye el mensaje de WhatsApp listando cada item
  const lineasProductos = items
    .map((i) => `${i.nombre} - ${i.talle} x${i.cantidad} - ${formatearPrecio(i.precio * i.cantidad)}`)
    .join(", ");
  const whatsappUrl = `https://wa.me/5492216220145?text=${encodeURIComponent(
    `Hola! Quiero consultar por estos productos: ${lineasProductos} Total: ${formatearPrecio(total)}`
  )}`;

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-8">Tu carrito</h1>

      {/* Lista de items */}
      <section className="flex flex-col gap-4 mb-8">
        {items.map((item) => (
          <article
            key={`${item.id}-${item.talle}`}
            className="bg-white border border-black rounded-xl p-4 flex items-center justify-between gap-4"
          >
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-gray-900">{item.nombre}</p>
              <p className="text-sm text-gray-500">
                {item.talle} · cantidad: {item.cantidad}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <p className="text-orange-500 font-bold whitespace-nowrap">
                {formatearPrecio(item.precio * item.cantidad)}
              </p>
              <button
                onClick={() => quitarDelCarrito(item.id, item.talle)}
                className="text-sm text-gray-400 hover:text-red-500 transition-colors"
                aria-label={`Quitar ${item.nombre}`}
              >
                ✕
              </button>
            </div>
          </article>
        ))}
      </section>

      {/* Total */}
      <div className="flex justify-between items-center border-t border-black pt-4 mb-6">
        <span className="text-lg font-bold">Total</span>
        <span className="text-2xl font-extrabold text-orange-500">{formatearPrecio(total)}</span>
      </div>

      {/* Acciones */}
      <div className="flex flex-col gap-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center bg-black text-white font-semibold py-3 rounded-xl hover:bg-orange-500 hover:text-black transition-colors"
        >
          💬 Consultar por WhatsApp
        </a>

        <button
          onClick={vaciarCarrito}
          className="block w-full text-center border border-black text-black font-medium py-3 rounded-xl hover:bg-black hover:text-white transition-colors"
        >
          Vaciar carrito
        </button>
      </div>
    </main>
  );
}
