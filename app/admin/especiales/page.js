"use client";

import { useState, useEffect } from "react";
import { FaSpinner, FaUpload, FaSave } from "react-icons/fa";

const inputClass =
  "bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors w-full";

function Campo({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-400">{label}</label>
      {children}
    </div>
  );
}

function ImageUploader({ value, onChange }) {
  const [subiendo, setSubiendo] = useState(false);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendo(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) onChange(data.url);
    setSubiendo(false);
  }

  return (
    <div className="flex flex-col gap-2">
      {value && (
        <img src={value} alt="preview" className="h-32 object-contain rounded-lg bg-zinc-800 border border-zinc-700" />
      )}
      <label className="flex items-center gap-2 cursor-pointer bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-gray-300 hover:border-orange-500 transition-colors w-fit">
        {subiendo ? <FaSpinner className="animate-spin text-orange-500" /> : <FaUpload />}
        {subiendo ? "Subiendo..." : "Subir foto"}
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={subiendo} />
      </label>
    </div>
  );
}

function EspecialForm({ id, titulo }) {
  const [form,     setForm]     = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [ok,       setOk]       = useState(false);

  useEffect(() => {
    fetch(`/api/admin/especiales/${id}`)
      .then((r) => r.json())
      .then((data) => { setForm(data); setCargando(false); });
  }, [id]);

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setPack(i, key, value) {
    const packs = [...(form.packs ?? [])];
    packs[i] = { ...packs[i], [key]: key === "precio" ? parseInt(value) || 0 : value };
    setForm((prev) => ({ ...prev, packs }));
  }

  async function handleGuardar() {
    setGuardando(true);
    await fetch(`/api/admin/especiales/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setGuardando(false);
    setOk(true);
    setTimeout(() => setOk(false), 2000);
  }

  if (cargando) return <div className="flex justify-center py-8"><FaSpinner className="text-orange-500 text-2xl animate-spin" /></div>;

  return (
    <section className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 flex flex-col gap-5">
      <h2 className="text-xl font-bold text-white">{titulo}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Campo label="Nombre">
          <input className={inputClass} value={form.nombre ?? ""} onChange={(e) => set("nombre", e.target.value)} />
        </Campo>

        <Campo label="Precio ($)">
          <input type="number" className={inputClass} value={form.precio ?? ""} onChange={(e) => set("precio", parseInt(e.target.value) || 0)} />
        </Campo>

        {id === "mystery_futbox" && (
          <>
            <Campo label="Precio original (tachado)">
              <input type="number" className={inputClass} value={form.precio_original ?? ""} onChange={(e) => set("precio_original", parseInt(e.target.value) || null)} />
            </Campo>
            <Campo label="Etiqueta descuento (ej: 27% OFF)">
              <input className={inputClass} value={form.descuento_label ?? ""} onChange={(e) => set("descuento_label", e.target.value)} />
            </Campo>
          </>
        )}
      </div>

      <Campo label="Descripción">
        <textarea className={`${inputClass} resize-none`} rows={3} value={form.descripcion ?? ""} onChange={(e) => set("descripcion", e.target.value)} />
      </Campo>

      <Campo label="Foto">
        <ImageUploader value={form.imagen} onChange={(url) => set("imagen", url)} />
      </Campo>

      {id === "griptec_spray" && form.packs && (
        <div>
          <p className="text-sm text-gray-400 mb-3">Packs</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {form.packs.map((pack, i) => (
              <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 flex flex-col gap-2">
                <p className="text-white font-semibold text-sm">{pack.label}</p>
                <Campo label="Precio ($)">
                  <input type="number" className={inputClass} value={pack.precio ?? ""} onChange={(e) => setPack(i, "precio", e.target.value)} />
                </Campo>
                <Campo label="Descuento (ej: 5% OFF)">
                  <input className={inputClass} value={pack.descuento ?? ""} onChange={(e) => setPack(i, "descuento", e.target.value || null)} placeholder="Opcional" />
                </Campo>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleGuardar}
        disabled={guardando}
        className={`flex items-center justify-center gap-2 w-full sm:w-fit px-8 py-3 rounded-xl font-semibold transition-all ${ok ? "bg-green-600 text-white" : "bg-orange-500 text-black hover:bg-orange-400"} disabled:opacity-50`}
      >
        {guardando ? <FaSpinner className="animate-spin" /> : <FaSave />}
        {ok ? "¡Guardado!" : guardando ? "Guardando..." : "Guardar cambios"}
      </button>
    </section>
  );
}

// ── Destacados ─────────────────────────────────────────────────────────────────
import { supabase } from "@/lib/supabase";

function DestacadosPanel() {
  const [productos, setProductos] = useState([]);
  const [cargando,  setCargando]  = useState(true);
  const [guardando, setGuardando] = useState(null);

  useEffect(() => {
    supabase
      .from("productos_catalogo")
      .select("id, nombre, imagen, destacado")
      .order("nombre")
      .then(({ data }) => { setProductos(data ?? []); setCargando(false); });
  }, []);

  async function toggleDestacado(id, actual) {
    setGuardando(id);
    await fetch(`/api/admin/productos/catalogo/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destacado: !actual }),
    });
    setProductos((prev) => prev.map((p) => p.id === id ? { ...p, destacado: !actual } : p));
    setGuardando(null);
  }

  const destacados = productos.filter((p) => p.destacado);

  return (
    <section className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold text-white">Productos destacados</h2>
        <p className="text-sm text-gray-400 mt-1">Seleccioná cuáles aparecen en el carrusel de la página de inicio. Se muestran los primeros 4 activos.</p>
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
                    : "border-zinc-700 bg-zinc-800 hover:border-zinc-500"
                }`}
              >
                {p.imagen && (
                  <img src={p.imagen} alt={p.nombre} className="h-20 w-full object-contain rounded-lg bg-white" />
                )}
                <p className="text-xs text-white font-medium leading-tight">{p.nombre}</p>
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
      <h1 className="text-2xl font-extrabold text-white">Páginas especiales</h1>
      <DestacadosPanel />
      <EspecialForm id="mystery_futbox" titulo="Mystery Rugbox" />
      <EspecialForm id="griptec_spray"  titulo="Griptec Spray 200ml" />
    </div>
  );
}
