"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

function formatearPrecio(precio) {
  return "$" + precio.toLocaleString("es-AR");
}

const packs = [
  { label: "1 unidad",  precio: 53000,  descuento: null },
  { label: "Pack x2",   precio: 100700, descuento: "5% OFF" },
  { label: "Pack x3",   precio: 151000, descuento: "5% OFF" },
  { label: "Pack x12",  precio: 572400, descuento: "10% OFF" },
];

export default function GriptecSprayPage() {
  const { agregarAlCarrito } = useCart();
  const [packSeleccionado, setPackSeleccionado] = useState(null);
  // "idle" | "warning" | "success"
  const [estado, setEstado] = useState("idle");

  function handleAgregar() {
    if (!packSeleccionado) {
      setEstado("warning");
      return;
    }
    const pack = packs.find((p) => p.label === packSeleccionado);
    agregarAlCarrito({ id: `griptec-${pack.label}`, nombre: "Griptec Spray 200ml", talle: pack.label, precio: pack.precio });
    setEstado("success");
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-2">Griptec Spray 200ml</h1>
      <p className="text-gray-600 mb-8">
        Spray de agarre instantáneo para rugby, padel, tenis y muchos deportes mas. Mejora el grip en cualquier condición climática.
      </p>

      <article className="bg-white border border-black rounded-2xl overflow-hidden shadow-sm">
        <img
          src="/griptec.png"
          alt="Griptec Spray 200ml"
          className="w-full object-cover"
        />

        <div className="p-6 flex flex-col gap-5">
          {/* Selector de pack */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Seleccioná tu pack:</p>
            <div className="grid grid-cols-2 gap-3">
              {packs.map((pack) => (
                <button
                  key={pack.label}
                  onClick={() => { setPackSeleccionado(pack.label); setEstado("idle"); }}
                  className={`flex flex-col items-start p-4 rounded-xl border text-left transition-colors ${
                    packSeleccionado === pack.label
                      ? "bg-orange-500 text-black border-orange-500"
                      : "bg-white text-gray-700 border-gray-300 hover:border-black"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{pack.label}</span>
                    {pack.descuento && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-black text-white">
                        {pack.descuento}
                      </span>
                    )}
                  </div>
                  <span className="text-lg font-extrabold">{formatearPrecio(pack.precio)}</span>
                </button>
              ))}
            </div>
          </div>

          {estado === "warning" && (
            <p className="text-red-500 text-sm">Seleccioná un pack primero.</p>
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
