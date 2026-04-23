"use client";

import { useState } from "react";
import Link from "next/link";
import productos from "@/data/productos";
import FadeIn from "@/components/FadeIn";
import { FaChevronDown, FaChevronUp, FaFilter } from "react-icons/fa";

function formatearPrecio(precio) {
  return "$" + precio.toLocaleString("es-AR");
}

const productosRugby = productos.filter((p) => p.deporte === "rugby");

const filtrosTipo  = ["Todos", "Naciones", "Clubes"];
const filtrosTalle = ["Todos", "S", "M", "L", "XL", "2XL", "3XL"];

const tipoValor = { Naciones: "nacion", Clubes: "club" };

const badgeTipo = {
  nacion: "bg-gray-800 text-white",
  club:   "bg-orange-100 text-orange-800",
};

function BotonFiltro({ label, activo, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 rounded-full text-sm font-medium border transition-colors min-w-[60px] ${
        activo
          ? "bg-orange-500 text-black border-orange-500"
          : "bg-white text-gray-700 border-black hover:bg-black hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

export default function CatalogoPage() {
  const [tipo, setTipo]   = useState("Todos");
  const [talle, setTalle] = useState("Todos");
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  const productosFiltrados = productosRugby.filter((p) => {
    const matchTipo  = tipo  === "Todos" || p.tipo  === tipoValor[tipo];
    const matchTalle = talle === "Todos" || p.talle.includes(talle);
    return matchTipo && matchTalle;
  });

  const hayFiltrosActivos = tipo !== "Todos" || talle !== "Todos";

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-6">Catálogo Rugby</h1>

      {/* Panel de filtros — colapsable en mobile */}
      <section className="bg-white border border-black rounded-xl mb-8 overflow-hidden">
        {/* Header del panel (toggle en mobile) */}
        <button
          className="w-full flex items-center justify-between px-5 py-4 md:hidden"
          onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
          aria-expanded={filtrosAbiertos}
        >
          <span className="flex items-center gap-2 font-semibold text-gray-800">
            <FaFilter className="text-orange-500" />
            Filtros
            {hayFiltrosActivos && (
              <span className="bg-orange-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {(tipo !== "Todos" ? 1 : 0) + (talle !== "Todos" ? 1 : 0)}
              </span>
            )}
          </span>
          {filtrosAbiertos ? <FaChevronUp /> : <FaChevronDown />}
        </button>

        {/* Contenido de filtros */}
        <div
          className={`flex flex-col gap-4 transition-all duration-300 overflow-hidden
            md:px-5 md:pb-5 md:pt-5 md:max-h-none md:overflow-visible
            ${filtrosAbiertos ? "max-h-64 px-5 pb-5" : "max-h-0"}`}
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-gray-600 w-14">Tipo</span>
            {filtrosTipo.map((f) => (
              <BotonFiltro key={f} label={f} activo={tipo === f} onClick={() => setTipo(f)} />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-gray-600 w-14">Talle</span>
            {filtrosTalle.map((f) => (
              <BotonFiltro key={f} label={f} activo={talle === f} onClick={() => setTalle(f)} />
            ))}
          </div>
          {hayFiltrosActivos && (
            <button
              onClick={() => { setTipo("Todos"); setTalle("Todos"); }}
              className="self-start text-sm text-gray-500 underline hover:text-red-500 transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </section>

      {/* Contador de resultados */}
      <p className="text-sm text-gray-500 mb-4">
        {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? "s" : ""} encontrado{productosFiltrados.length !== 1 ? "s" : ""}
      </p>

      {/* Grilla de productos */}
      <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {productosFiltrados.map((producto, i) => (
          <FadeIn key={producto.id} delay={i * 60}>
          <article
            className="bg-white rounded-xl border border-black shadow-sm overflow-hidden flex flex-col transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg h-full"
          >
            <div className="relative">
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="w-full object-cover"
                loading="lazy"
              />
              {producto.masVendido && (
                <span className="absolute top-2 left-2 bg-orange-500 text-black text-xs font-extrabold px-2 py-1 rounded-full">
                  🔥 Más vendido
                </span>
              )}
            </div>

            <div className="p-3 md:p-4 flex flex-col flex-1 gap-2">
              <span className={`text-xs font-medium px-2 py-1 rounded-full self-start ${badgeTipo[producto.tipo]}`}>
                {producto.tipo === "nacion" ? "Nación" : "Club"}
              </span>

              <h2 className="font-semibold text-gray-900 text-sm md:text-base leading-tight">{producto.nombre}</h2>

              <div className="flex gap-1 flex-wrap">
                {producto.talle.map((t) => (
                  <span key={t} className="text-xs border border-gray-400 rounded px-1.5 py-0.5 text-gray-600">
                    {t}
                  </span>
                ))}
              </div>

              <p className="text-orange-500 font-bold mt-auto text-sm md:text-base">
                {formatearPrecio(producto.precio)}
              </p>

              <Link
                href={`/catalogo/${producto.id}`}
                className="block text-center bg-black text-white text-sm font-medium py-2.5 rounded-lg hover:bg-gray-800 transition-colors mt-1 active:scale-95"
              >
                Ver detalle
              </Link>
            </div>
          </article>
          </FadeIn>
        ))}
      </section>

      {productosFiltrados.length === 0 && (
        <p className="text-center text-gray-500 py-16">
          No hay productos que coincidan con los filtros seleccionados.
        </p>
      )}
    </main>
  );
}
