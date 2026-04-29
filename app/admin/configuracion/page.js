"use client";

import { useState, useEffect } from "react";
import { FaSpinner, FaSave } from "react-icons/fa";

const inputClass =
  "bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors w-full";

export default function ConfiguracionPage() {
  const [precioEnvio,  setPrecioEnvio]  = useState("");
  const [cargando,     setCargando]     = useState(true);
  const [guardando,    setGuardando]    = useState(false);
  const [guardado,     setGuardado]     = useState(false);
  const [error,        setError]        = useState(null);

  useEffect(() => {
    fetch("/api/admin/config", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setError(d.error); setCargando(false); return; }
        setPrecioEnvio(d.precio_envio ?? "");
        setCargando(false);
      })
      .catch((e) => { setError(e.message); setCargando(false); });
  }, []);

  async function handleGuardar(e) {
    e.preventDefault();
    setGuardando(true);
    setError(null);
    setGuardado(false);

    const res = await fetch("/api/admin/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ precio_envio: precioEnvio }),
    });

    if (res.ok) {
      setGuardado(true);
      setTimeout(() => setGuardado(false), 3000);
    } else {
      const d = await res.json();
      setError(d.error ?? "Error al guardar");
    }
    setGuardando(false);
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-white mb-6">Configuración</h1>

      {cargando ? (
        <div className="flex items-center justify-center py-20">
          <FaSpinner className="text-orange-500 text-3xl animate-spin" />
        </div>
      ) : (
        <form onSubmit={handleGuardar} className="max-w-md flex flex-col gap-6">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-base font-bold text-white">Envío</h2>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Precio de envío (ARS)</label>
              <input
                type="number"
                min="0"
                value={precioEnvio}
                onChange={(e) => setPrecioEnvio(e.target.value)}
                placeholder="9000"
                className={inputClass}
              />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={guardando}
            className="flex items-center justify-center gap-2 bg-orange-500 text-black font-bold py-3 rounded-xl hover:bg-orange-400 transition-colors disabled:opacity-50"
          >
            <FaSave />
            {guardando ? "Guardando..." : guardado ? "¡Guardado!" : "Guardar cambios"}
          </button>
        </form>
      )}
    </div>
  );
}
