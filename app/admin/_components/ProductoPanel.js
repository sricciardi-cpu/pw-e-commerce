"use client";

import { useState, useEffect, useRef } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaUpload, FaSpinner } from "react-icons/fa";

const TALLES = ["S", "M", "L", "XL", "2XL", "3XL"];
const CATEGORIAS = ["local", "alternativa", "training"];
const TIPOS = ["nacion", "club"];

const FORM_INICIAL = {
  nombre: "", precio: "", stock: "0", categoria: "local",
  tipo: "nacion", talle: [], descripcion: "",
  imagen: "", imagenEspalda: "", stockPorTalle: {},
  descuentoTransferencia: "0",
};

function formatearPrecio(precio) {
  return "$" + Number(precio).toLocaleString("es-AR");
}

function ImageUploader({ label, value, onChange }) {
  const [subiendo, setSubiendo] = useState(false);
  const inputRef = useRef();

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setSubiendo(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    onChange(data.url ?? "");
    setSubiendo(false);
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-400">{label}</label>
      <div
        onClick={() => !subiendo && inputRef.current?.click()}
        className={`relative h-32 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-colors overflow-hidden ${
          value ? "border-zinc-600 bg-white" : "border-zinc-600 bg-zinc-800 hover:border-orange-500"
        }`}
      >
        {subiendo ? (
          <FaSpinner className="text-orange-500 text-2xl animate-spin" />
        ) : value ? (
          <>
            <img src={value} alt={label} className="h-full w-full object-contain" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(""); }}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-500"
            >
              <FaTimes />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1 text-gray-500">
            <FaUpload className="text-xl" />
            <span className="text-xs">Subir imagen</span>
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </div>
  );
}

export default function ProductoPanel({ tabla, titulo }) {
  const [productos,  setProductos]  = useState([]);
  const [cargando,   setCargando]   = useState(true);
  const [form,       setForm]       = useState(FORM_INICIAL);
  const [editandoId, setEditandoId] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [guardando,  setGuardando]  = useState(false);
  const [error,      setError]      = useState(null);
  const formRef = useRef();

  useEffect(() => { fetchProductos(); }, []);

  async function fetchProductos() {
    setCargando(true);
    const res = await fetch(`/api/admin/productos/${tabla}`);
    const data = await res.json();
    setProductos(Array.isArray(data) ? data : []);
    setCargando(false);
  }

  function abrirNuevo() {
    setForm(FORM_INICIAL);
    setEditandoId(null);
    setFormVisible(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }

  function abrirEditar(p) {
    setForm({
      nombre:                 p.nombre,
      precio:                 String(p.precio),
      stock:                  String(p.stock),
      categoria:              p.categoria,
      tipo:                   p.tipo,
      talle:                  p.talle ?? [],
      descripcion:            p.descripcion ?? "",
      imagen:                 p.imagen ?? "",
      imagenEspalda:          p.imagen_espalda ?? "",
      stockPorTalle:          p.stock_por_talle ?? {},
      descuentoTransferencia: String(p.descuento_transferencia ?? 0),
    });
    setEditandoId(p.id);
    setFormVisible(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }

  function cerrarForm() {
    setFormVisible(false);
    setEditandoId(null);
    setError(null);
  }

  function toggleTalle(t) {
    setForm(prev => ({
      ...prev,
      talle: prev.talle.includes(t)
        ? prev.talle.filter(x => x !== t)
        : [...prev.talle, t],
    }));
  }

  async function handleEliminar(id, nombre) {
    if (!confirm(`¿Eliminás "${nombre}"? Esta acción no se puede deshacer.`)) return;
    await fetch(`/api/admin/productos/${tabla}/${id}`, { method: "DELETE" });
    fetchProductos();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setGuardando(true);
    setError(null);

    const body = {
      ...form,
      precio: parseInt(form.precio),
      stock: parseInt(form.stock),
      stockPorTalle: form.stockPorTalle,
      descuentoTransferencia: parseInt(form.descuentoTransferencia) || 0,
    };
    const url  = editandoId
      ? `/api/admin/productos/${tabla}/${editandoId}`
      : `/api/admin/productos/${tabla}`;
    const method = editandoId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      cerrarForm();
      fetchProductos();
    } else {
      const data = await res.json();
      setError(data.error ?? "Error al guardar");
    }
    setGuardando(false);
  }

  const inputClass = "bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors w-full";

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-white">{titulo}</h1>
        <button
          onClick={abrirNuevo}
          className="flex items-center gap-2 bg-orange-500 text-black font-semibold px-4 py-2.5 rounded-xl hover:bg-orange-400 transition-colors text-sm"
        >
          <FaPlus />
          Nuevo producto
        </button>
      </div>

      {/* Formulario de alta/edición */}
      {formVisible && (
        <div ref={formRef} className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white">
              {editandoId ? "Editar producto" : "Nuevo producto"}
            </h2>
            <button onClick={cerrarForm} className="text-gray-400 hover:text-white transition-colors">
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Imágenes */}
            <div className="grid grid-cols-2 gap-4">
              <ImageUploader
                label="Imagen frente"
                value={form.imagen}
                onChange={(url) => setForm(p => ({ ...p, imagen: url }))}
              />
              <ImageUploader
                label="Imagen espalda"
                value={form.imagenEspalda}
                onChange={(url) => setForm(p => ({ ...p, imagenEspalda: url }))}
              />
            </div>

            {/* Nombre, precio, stock */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1 flex flex-col gap-1">
                <label className="text-xs text-gray-400">Nombre *</label>
                <input
                  value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                  required placeholder="Argentina Local"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400">Precio (ARS) *</label>
                <input
                  type="number" value={form.precio}
                  onChange={e => setForm(p => ({ ...p, precio: e.target.value }))}
                  required placeholder="70000"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400">Stock</label>
                <input
                  type="number" value={form.stock}
                  onChange={e => setForm(p => ({ ...p, stock: e.target.value }))}
                  min="0" placeholder="0"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Descuento transferencia */}
            <div className="flex flex-col gap-1 sm:w-1/3">
              <label className="text-xs text-gray-400">Descuento transferencia (%)</label>
              <input
                type="number" min="0" max="100"
                value={form.descuentoTransferencia}
                onChange={e => setForm(p => ({ ...p, descuentoTransferencia: e.target.value }))}
                placeholder="0"
                className={inputClass}
              />
            </div>

            {/* Categoría y tipo */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400">Categoría *</label>
                <select
                  value={form.categoria}
                  onChange={e => setForm(p => ({ ...p, categoria: e.target.value }))}
                  className={inputClass}
                >
                  {CATEGORIAS.map(c => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400">Tipo *</label>
                <select
                  value={form.tipo}
                  onChange={e => setForm(p => ({ ...p, tipo: e.target.value }))}
                  className={inputClass}
                >
                  {TIPOS.map(t => (
                    <option key={t} value={t}>{t === "nacion" ? "Nación" : "Club"}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Talles */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-400">Talles disponibles</label>
              <div className="flex gap-2 flex-wrap">
                {TALLES.map(t => (
                  <button
                    key={t} type="button" onClick={() => toggleTalle(t)}
                    className={`w-12 h-10 rounded-lg border-2 text-sm font-bold transition-colors ${
                      form.talle.includes(t)
                        ? "bg-orange-500 text-black border-orange-500"
                        : "bg-zinc-800 text-gray-300 border-zinc-600 hover:border-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock por talle */}
            {form.talle.length > 0 && (
              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-400">Stock por talle</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {form.talle.map((t) => (
                    <div key={t} className="flex flex-col gap-1 items-center">
                      <span className="text-xs text-gray-500">{t}</span>
                      <input
                        type="number" min="0"
                        value={form.stockPorTalle[t] ?? 0}
                        onChange={(e) => setForm((p) => ({
                          ...p,
                          stockPorTalle: { ...p.stockPorTalle, [t]: parseInt(e.target.value) || 0 },
                        }))}
                        className={`${inputClass} text-center px-1`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Descripción */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Descripción</label>
              <textarea
                value={form.descripcion}
                onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))}
                rows={3} placeholder="Descripción del producto..."
                className={`${inputClass} resize-none`}
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="submit" disabled={guardando}
                className="flex-1 bg-orange-500 text-black font-bold py-3 rounded-xl hover:bg-orange-400 transition-colors disabled:opacity-50"
              >
                {guardando ? "Guardando..." : editandoId ? "Guardar cambios" : "Crear producto"}
              </button>
              <button
                type="button" onClick={cerrarForm}
                className="px-6 border border-zinc-600 text-gray-300 rounded-xl hover:bg-zinc-800 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de productos */}
      {cargando ? (
        <div className="flex items-center justify-center py-20">
          <FaSpinner className="text-orange-500 text-3xl animate-spin" />
        </div>
      ) : productos.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg mb-4">No hay productos todavía.</p>
          <button onClick={abrirNuevo} className="text-orange-500 underline hover:text-orange-400">
            Agregá el primero
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {productos.map(p => (
            <article key={p.id} className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 flex items-center gap-4">
              {/* Imagen */}
              <div className="shrink-0 w-16 h-16 rounded-lg bg-white overflow-hidden">
                {p.imagen
                  ? <img src={p.imagen} alt={p.nombre} className="w-full h-full object-contain" />
                  : <div className="w-full h-full bg-zinc-700 flex items-center justify-center text-gray-500 text-xs">Sin img</div>
                }
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{p.nombre}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {p.categoria} · {p.tipo === "nacion" ? "Nación" : "Club"} · Talles: {(p.talle ?? []).join(", ") || "—"}
                </p>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="text-orange-500 font-bold text-sm">{formatearPrecio(p.precio)}</span>
                  {p.descuento_transferencia > 0 && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-900/50 text-green-400">
                      Transf. −{p.descuento_transferencia}%
                    </span>
                  )}
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.stock > 0 ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}`}>
                    Stock: {p.stock}
                  </span>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => abrirEditar(p)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-zinc-800 text-gray-300 hover:bg-orange-500 hover:text-black transition-colors"
                  title="Editar"
                >
                  <FaEdit className="text-sm" />
                </button>
                <button
                  onClick={() => handleEliminar(p.id, p.nombre)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-zinc-800 text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
                  title="Eliminar"
                >
                  <FaTrash className="text-sm" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
