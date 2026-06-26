"use client";

import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { supabase } from "@/lib/supabase";

function DestacadosPanel() {
  const [productos, setProductos] = useState([]);
  const [cargando,  setCargando]  = useState(true);
  const [guardando, setGuardando] = useState(null);

  useEffect(() => {
    supabase
      .from("productos_stock")
      .select("id, nombre, imagen, destacado, seccion")
      .order("nombre")
      .then(({ data }) => {
        // Solo camisetas pueden ser destacadas en el carrusel del inicio
        const camisetas = (data ?? []).filter((p) => (p.seccion ?? "camiseta") !== "bucal");
        setProductos(camisetas);
        setCargando(false);
      });
  }, []);

  async function toggleDestacado(id, actual) {
    setGuardando(id);
    await fetch(`/api/admin/productos/stock/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destacado: !actual }),
    });
    setProductos((prev) => prev.map((p) => p.id === id ? { ...p, destacado: !actual } : p));
    setGuardando(null);
  }

  const destacados = productos.filter((p) => p.destacado);

  return (
    <section className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Productos destacados</h2>
        <p className="text-sm text-gray-500 mt-1">Seleccioná cuáles aparecen en el carrusel de la página de inicio. Se muestran los primeros 4 activos.</p>
      </div>

      {cargando ? (
        <div className="flex justify-center py-8"><FaSpinner className="text-orange-500 text-2xl animate-spin" /></div>
      ) : (
        <>
          <p className="text-xs text-orange-500 font-semibold">{destacados.length} seleccionado{destacados.length !== 1 ? "s" : ""}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {productos.map((p) => (
              <button
                key={p.id}
                onClick={() => toggleDestacado(p.id, p.destacado)}
                disabled={guardando === p.id}
                className={`relative flex flex-col gap-2 rounded-xl border-2 p-3 transition-all text-left ${
                  p.destacado
                    ? "border-orange-500 bg-orange-500/10"
                    : "border-gray-200 bg-gray-100 hover:border-gray-400"
                }`}
              >
                {p.imagen && (
                  <img src={p.imagen} alt={p.nombre} className="h-20 w-full object-contain rounded-lg bg-white" />
                )}
                <p className="text-xs text-gray-900 font-medium leading-tight">{p.nombre}</p>
                {p.destacado && (
                  <span className="absolute top-2 right-2 bg-orange-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full">★</span>
                )}
                {guardando === p.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                    <FaSpinner className="text-orange-500 animate-spin" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default function EspecialesPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-extrabold text-gray-900">Productos destacados</h1>
      <DestacadosPanel />
    </div>
  );
}
