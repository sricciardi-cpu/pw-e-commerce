"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

const talles = ["S", "M", "L", "XL", "2XL", "3XL"];
const NOMBRE = "Mystery Futbox";
const PRECIO = 50800;

export default function MysteryFutboxPage() {
  const { agregarAlCarrito } = useCart();
  const [talleSeleccionado, setTalleSeleccionado] = useState(null);
  // "idle" | "warning" | "success"
  const [estado, setEstado] = useState("idle");

  function handleAgregar() {
    if (!talleSeleccionado) {
      setEstado("warning");
      return;
    }
    agregarAlCarrito({ id: "mystery-futbox", nombre: NOMBRE, talle: talleSeleccionado, precio: PRECIO });
    setEstado("success");
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-6">Mystery Futbox</h1>

      <article className="bg-white border border-black rounded-2xl overflow-hidden shadow-sm">
        <img
          src="/mysteryfutbox.png"
          alt="Mystery Futbox"
          className="w-full object-cover"
        />

        <div className="p-6 flex flex-col gap-5">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-gray-400 line-through text-lg">$69.980</span>
            <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded-full">27% OFF</span>
          </div>
          <p className="text-orange-500 text-3xl font-extrabold -mt-3">$50.800</p>

          <p className="text-gray-600 text-sm">
            Una caja sorpresa con una camiseta de fútbol o rugby a elección del equipo.
            Indicanos por WhatsApp el parche/estampado que querés.
          </p>

          {/* Selector de talle */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Seleccioná tu talle:</p>
            <div className="flex gap-2 flex-wrap">
              {talles.map((t) => (
                <button
                  key={t}
                  onClick={() => { setTalleSeleccionado(t); setEstado("idle"); }}
                  className={`px-4 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
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
          {estado === "success" && (
            <p className="text-green-600 text-sm font-medium">✓ Agregado al carrito</p>
          )}

          <button
            onClick={handleAgregar}
            className="block w-full text-center bg-black text-white font-semibold py-3 rounded-xl hover:bg-orange-500 hover:text-black transition-colors"
          >
            Agregar al carrito
          </button>
        </div>
      </article>
    </main>
  );
}
