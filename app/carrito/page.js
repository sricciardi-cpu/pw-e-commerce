"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { FaWhatsapp, FaTrash, FaTimes } from "react-icons/fa";

function formatearPrecio(precio) {
  return "$" + precio.toLocaleString("es-AR");
}

export default function CarritoPage() {
  const { items, quitarDelCarrito, vaciarCarrito, total } = useCart();

  if (items.length === 0) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-16 text-center">
        <p className="text-2xl font-bold text-gray-700 mb-2">Tu carrito está vacío</p>
        <p className="text-gray-500 mb-8">Todavía no agregaste ningún producto.</p>
        <Link
          href="/catalogo"
          className="inline-block bg-black text-white font-semibold px-8 py-4 rounded-xl hover:bg-orange-500 hover:text-black transition-colors text-lg"
        >
          Ver catálogo
        </Link>
      </main>
    );
  }

  const lineasProductos = items
    .map((i) => `${i.nombre} - ${i.talle} x${i.cantidad} - ${formatearPrecio(i.precio * i.cantidad)}`)
    .join(", ");
  const whatsappUrl = `https://wa.me/5492216220145?text=${encodeURIComponent(
    `Hola! Quiero consultar por estos productos: ${lineasProductos} Total: ${formatearPrecio(total)}`
  )}`;

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 pb-40 md:pb-8">
      <h1 className="text-3xl font-extrabold mb-8">Tu carrito</h1>

      {/* Lista de items */}
      <section className="flex flex-col gap-3 mb-8">
        {items.map((item) => (
          <article
            key={`${item.id}-${item.talle}`}
            className="bg-white border border-black rounded-xl p-4 flex items-center gap-4"
          >
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{item.nombre}</p>
              <p className="text-sm text-gray-500">
                Talle {item.talle} · Cantidad: {item.cantidad}
              </p>
              <p className="text-orange-500 font-bold">
                {formatearPrecio(item.precio * item.cantidad)}
              </p>
            </div>

            <button
              onClick={() => quitarDelCarrito(item.id, item.talle)}
              className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              aria-label={`Quitar ${item.nombre}`}
            >
              <FaTimes />
            </button>
          </article>
        ))}
      </section>

      {/* Total y acciones — visible solo en desktop */}
      <div className="hidden md:block">
        <div className="flex justify-between items-center border-t border-black pt-4 mb-6">
          <span className="text-lg font-bold">Total</span>
          <span className="text-2xl font-extrabold text-orange-500">{formatearPrecio(total)}</span>
        </div>

        <div className="flex flex-col gap-3 max-w-sm">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-black text-white font-semibold py-3 rounded-xl hover:bg-orange-500 hover:text-black transition-colors"
          >
            <FaWhatsapp className="text-xl" />
            Consultar por WhatsApp
          </a>

          <button
            onClick={vaciarCarrito}
            className="flex items-center justify-center gap-2 w-full border border-black text-black font-medium py-3 rounded-xl hover:bg-black hover:text-white transition-colors"
          >
            <FaTrash />
            Vaciar carrito
          </button>
        </div>
      </div>

      {/* Sticky footer — solo en mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl p-4 z-40">
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold text-gray-700">Total</span>
          <span className="text-xl font-extrabold text-orange-500">{formatearPrecio(total)}</span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={vaciarCarrito}
            className="w-11 h-11 shrink-0 flex items-center justify-center border border-black rounded-xl hover:bg-black hover:text-white transition-colors"
            aria-label="Vaciar carrito"
          >
            <FaTrash />
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-black text-white font-semibold py-3 rounded-xl hover:bg-orange-500 hover:text-black transition-colors active:scale-95"
          >
            <FaWhatsapp className="text-xl" />
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
