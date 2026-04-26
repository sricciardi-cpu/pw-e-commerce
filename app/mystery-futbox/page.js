"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import FadeIn from "@/components/FadeIn";

const talles = ["S", "M", "L", "XL", "2XL", "3XL"];
const NOMBRE = "Mystery Futbox";
const PRECIO = 50800;

export default function MysteryFutboxPage() {
  const { agregarAlCarrito } = useCart();
  const [talleSeleccionado, setTalleSeleccionado] = useState(null);
  const [estado, setEstado] = useState("idle");

  function handleAgregar() {
    if (!talleSeleccionado) {
      setEstado("warning");
      return;
    }
    agregarAlCarrito({ id: "mystery-futbox", nombre: NOMBRE, talle: talleSeleccionado, precio: PRECIO });
    setEstado("success");
  }

  useEffect(() => {
    if (estado === "success") {
      const t = setTimeout(() => setEstado("idle"), 1500);
      return () => clearTimeout(t);
    }
  }, [estado]);

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <FadeIn>
        <h1 className="text-3xl font-extrabold mb-6 text-white">Mystery Futbox</h1>
      </FadeIn>

      <FadeIn delay={100}>
      <article className="bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row">

        {/* Imagen */}
        <div className="md:w-1/2 bg-black flex items-center justify-center">
          <img
            src="/mysteryfutbox.png"
            alt="Mystery Futbox"
            className="w-full object-contain max-h-72 md:max-h-full md:h-full"
          />
        </div>

        {/* Contenido */}
        <div className="md:w-1/2 p-6 flex flex-col gap-5 justify-center">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-gray-400 line-through text-lg">$69.980</span>
            <span className="bg-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full">27% OFF</span>
          </div>
          <p className="text-orange-500 text-3xl font-extrabold -mt-3">$50.800</p>

          <p className="text-gray-300 text-sm">
            Una caja sorpresa con una camiseta de fútbol o rugby a elección del equipo.
            Indicanos por WhatsApp el parche/estampado que querés.
          </p>

          {/* Selector de talle */}
          <div>
            <p className="text-sm font-semibold text-gray-300 mb-2">Seleccioná tu talle:</p>
            <div className="flex gap-2 flex-wrap">
              {talles.map((t) => (
                <button
                  key={t}
                  onClick={() => { setTalleSeleccionado(t); setEstado("idle"); }}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    talleSeleccionado === t
                      ? "bg-orange-500 text-black border-orange-500"
                      : "bg-zinc-800 text-gray-200 border-zinc-600 hover:border-white hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {estado === "warning" && (
            <p className="text-red-400 text-sm">Seleccioná un talle primero.</p>
          )}
          <button
            onClick={handleAgregar}
            className={`w-full text-center font-semibold py-3 rounded-xl transition-all duration-200 ${
              estado === "success"
                ? "bg-green-600 text-white scale-95"
                : "bg-orange-500 text-black hover:bg-orange-400"
            }`}
          >
            {estado === "success" ? "✓ Agregado" : "Agregar al carrito"}
          </button>
        </div>
      </article>
      </FadeIn>
    </main>
  );
}
