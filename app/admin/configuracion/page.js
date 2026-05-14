"use client";

import { useState, useEffect } from "react";
import { FaSpinner, FaSave } from "react-icons/fa";

const inputClass =
  "bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors w-full";

export default function ConfiguracionPage() {
  const [precioEnvio,    setPrecioEnvio]    = useState("");
  const [precioEnvioDB,  setPrecioEnvioDB]  = useState(null);
  const [cargando,       setCargando]       = useState(true);
  const [guardando,      setGuardando]      = useState(false);
  const [guardado,       setGuardado]       = useState(false);
  const [error,          setError]          = useState(null);

  async function cargarDesdeDB() {
    const res = await fetch(`/api/admin/config?t=${Date.now()}`, { cache: "no-store" });
    const d = await res.json();
    if (d.error) { setError(d.error); return null; }
    const valor = d.precio_envio ?? "";
    setPrecioEnvio(valor);
    setPrecioEnvioDB(valor);
    return valor;
  }

  useEffect(() => {
    cargarDesdeDB().finally(() => setCargando(false));
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
      const valorEnDB = await cargarDesdeDB();
      if (valorEnDB === String(precioEnvio)) {
        setGuardado(true);
        setTimeout(() => setGuardado(false), 3000);
      } else {
        setError(`Guardó ${valorEnDB ?? "(vacío)"} en lugar de ${precioEnvio}. Revisá los logs del servidor.`);
      }
    } else {
      const d = await res.json();
      setError(d.error ?? "Error al guardar");
    }
    setGuardando(false);
  }

  const sinGuardar = precioEnvioDB !== null && String(precioEnvio) !== String(precioEnvioDB);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Configuración</h1>

      {cargando ? (
        <div className="flex items-center justify-center py-20">
          <FaSpinner className="text-orange-500 text-3xl animate-spin" />
        </div>
      ) : (
        <form onSubmit={handleGuardar} className="max-w-md flex flex-col gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-base font-bold text-gray-900">Envío</h2>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-600">Precio de envío (ARS)</label>
              <input
                type="number"
                min="0"
                value={precioEnvio}
                onChange={(e) => setPrecioEnvio(e.target.value)}
                placeholder="9000"
                className={inputClass}
              />
              <p className="text-xs text-gray-500 mt-1">
                Valor guardado en base de datos: <strong className={sinGuardar ? "text-yellow-600" : "text-green-700"}>${precioEnvioDB ?? "—"}</strong>
                {sinGuardar && <span className="text-yellow-600 ml-2">· cambios sin guardar</span>}
              </p>
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
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
