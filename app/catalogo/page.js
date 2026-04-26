"use client";

import { useState } from "react";
import Link from "next/link";
import productos from "@/data/productos";
import FadeIn from "@/components/FadeIn";
import { FaChevronDown, FaChevronUp, FaFilter } from "react-icons/fa";

function formatearPrecio(precio) {
  return "$" + precio.toLocaleString("es-AR");
}

const filtrosTipo      = ["Todos", "Naciones", "Clubes"];
const filtrosCategoria = ["Todas", "local", "alternativa", "training"];
const filtrosTalle     = ["Todos", "S", "M", "L", "XL", "2XL", "3XL"];

const tipoValor = { Naciones: "nacion", Clubes: "club" };

const categoriaLabel = {
  Todas:        "Todas",
  local:        "Local",
  alternativa:  "Alternativa",
  training:     "Training",
};

const badgeTipo = {
  nacion: "bg-zinc-700 text-white",
  club:   "bg-orange-500/20 text-orange-400",
};

function BotonFiltro({ label, activo, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 rounded-full text-sm font-medium border transition-colors min-w-[60px] ${
        activo
          ? "bg-orange-500 text-black border-orange-500"
          : "bg-zinc-800 text-gray-200 border-zinc-600 hover:bg-white hover:text-black hover:border-white"
      }`}
    >
      {label}
    </button>
  );
}

export default function CatalogoPage() {
  const [tipo,      setTipo]      = useState("Todos");
  const [categoria, setCategoria] = useState("Todas");
  const [talle,     setTalle]     = useState("Todos");
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  const productosFiltrados = productos.filter((p) => {
    const matchTipo      = tipo      === "Todos" || p.tipo      === tipoValor[tipo];
    const matchCategoria = categoria === "Todas" || p.categoria === categoria;
    const matchTalle     = talle     === "Todos" || p.talle.includes(talle);
    return matchTipo && matchCategoria && matchTalle;
  });

  const hayFiltrosActivos = tipo !== "Todos" || categoria !== "Todas" || talle !== "Todos";
  const cantFiltrosActivos =
    (tipo      !== "Todos"  ? 1 : 0) +
    (categoria !== "Todas"  ? 1 : 0) +
    (talle     !== "Todos"  ? 1 : 0);

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-6 text-white">Catálogo Rugby</h1>

      {/* Panel de filtros — colapsable en mobile */}
      <section className="bg-zinc-900 border border-zinc-700 rounded-xl mb-8 overflow-hidden">
        {/* Header toggle (solo mobile) */}
        <button
          className="w-full flex items-center justify-between px-5 py-4 md:hidden"
          onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
          aria-expanded={filtrosAbiertos}
        >
          <span className="flex items-center gap-2 font-semibold text-white">
            <FaFilter className="text-orange-500" />
            Filtros
            {hayFiltrosActivos && (
              <span className="bg-orange-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cantFiltrosActivos}
              </span>
            )}
          </span>
          {filtrosAbiertos ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
        </button>

        {/* Contenido de filtros */}
        <div
          className={`flex flex-col gap-4 transition-all duration-300 overflow-hidden
            md:px-5 md:pb-5 md:pt-5 md:max-h-none md:overflow-visible
            ${filtrosAbiertos ? "max-h-72 px-5 pb-5" : "max-h-0"}`}
        >
          {/* Fila 1 — Tipo */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-gray-400 w-20">Tipo</span>
            {filtrosTipo.map((f) => (
              <BotonFiltro key={f} label={f} activo={tipo === f} onClick={() => setTipo(f)} />
            ))}
          </div>

          {/* Fila 2 — Categoría */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-gray-400 w-20">Categoría</span>
            {filtrosCategoria.map((f) => (
              <BotonFiltro
                key={f}
                label={categoriaLabel[f]}
                activo={categoria === f}
                onClick={() => setCategoria(f)}
              />
            ))}
          </div>

          {/* Fila 3 — Talle */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-gray-400 w-20">Talle</span>
            {filtrosTalle.map((f) => (
              <BotonFiltro key={f} label={f} activo={talle === f} onClick={() => setTalle(f)} />
            ))}
          </div>

          {hayFiltrosActivos && (
            <button
              onClick={() => { setTipo("Todos"); setCategoria("Todas"); setTalle("Todos"); }}
              className="self-start text-sm text-gray-400 underline hover:text-red-400 transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </section>

      {/* Contador de resultados */}
      <p className="text-sm text-gray-400 mb-4">
        {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? "s" : ""} encontrado{productosFiltrados.length !== 1 ? "s" : ""}
      </p>

      {/* Grilla de productos */}
      <section
        key={`${tipo}-${categoria}-${talle}`}
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-[fadeScaleIn_0.35s_ease-out]"
      >
        {productosFiltrados.map((producto, i) => (
          <FadeIn key={producto.id} delay={i * 60}>
            <article className="bg-zinc-900 rounded-xl border border-zinc-700 shadow-sm overflow-hidden flex flex-col transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg h-full">
              <div className="h-52 bg-white flex items-center justify-center">
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </div>

              <div className="p-3 md:p-4 flex flex-col flex-1 gap-2">
                <span className={`text-xs font-medium px-2 py-1 rounded-full self-start ${badgeTipo[producto.tipo]}`}>
                  {producto.tipo === "nacion" ? "Nación" : "Club"}
                </span>

                <h2 className="font-semibold text-white text-sm md:text-base leading-tight">{producto.nombre}</h2>

                <div className="flex gap-1 flex-wrap">
                  {producto.talle.map((t) => (
                    <span key={t} className="text-xs border border-zinc-600 rounded px-1.5 py-0.5 text-gray-300">
                      {t}
                    </span>
                  ))}
                </div>

                <p className="text-orange-500 font-bold mt-auto text-sm md:text-base">
                  {formatearPrecio(producto.precio)}
                </p>

                <Link
                  href={`/catalogo/${producto.id}`}
                  className="block text-center bg-orange-500 text-black text-sm font-semibold py-2.5 rounded-lg hover:bg-orange-400 transition-colors mt-1 active:scale-95"
                >
                  Ver detalle
                </Link>
              </div>
            </article>
          </FadeIn>
        ))}
      </section>

      {productosFiltrados.length === 0 && (
        <p className="text-center text-gray-400 py-16">
          No hay productos que coincidan con los filtros seleccionados.
        </p>
      )}
    </main>
  );
}
