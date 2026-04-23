"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    if (estado === "success") {
      const t = setTimeout(() => setEstado("idle"), 1500);
      return () => clearTimeout(t);
    }
  }, [estado]);

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-2">Griptec Spray 200ml</h1>
      <p className="text-gray-600 mb-6">
        Spray de agarre instantáneo para rugby y fútbol. Mejora el grip en cualquier condición climática.
      </p>

      <article className="bg-white border border-black rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row">

        {/* Imagen — full width en mobile, mitad izquierda en desktop */}
        <div className="md:w-1/2 bg-white flex items-center justify-center p-6">
          <img
            src="/griptec.png"
            alt="Griptec Spray 200ml"
            className="w-full object-contain max-h-72 md:max-h-96"
          />
        </div>

        {/* Contenido — derecha en desktop */}
        <div className="md:w-1/2 p-6 flex flex-col gap-5 justify-center border-t md:border-t-0 md:border-l border-black">
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
          <button
            onClick={handleAgregar}
            className={`w-full text-center font-semibold py-3 rounded-xl transition-all duration-200 ${
              estado === "success"
                ? "bg-green-600 text-white scale-95"
                : "bg-black text-white hover:bg-orange-500 hover:text-black"
            }`}
          >
            {estado === "success" ? "✓ Agregado" : "Agregar al carrito"}
          </button>
        </div>
      </article>
    </main>
  );
}
