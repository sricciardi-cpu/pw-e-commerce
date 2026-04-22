"use client";

import { useState } from "react";
import Link from "next/link";
import productos from "@/data/productos";

function formatearPrecio(precio) {
  return "$" + precio.toLocaleString("es-AR");
}

// Opciones de cada filtro
const filtrosDeporte = ["Todos", "Fútbol", "Rugby"];
const filtrosTipo   = ["Todos", "Naciones", "Clubes"];
const filtrosTalle  = ["Todos", "S", "M", "L", "XL"];

// Mapeo de label legible → valor en datos
const deporteValor = { Fútbol: "futbol", Rugby: "rugby" };
const tipoValor    = { Naciones: "nacion", Clubes: "club" };

const badgeDeporte = {
  futbol: "bg-black text-white",
  rugby:  "bg-orange-500 text-black",
};
const badgeTipo = {
  nacion: "bg-gray-800 text-white",
  club:   "bg-orange-100 text-orange-800",
};

// Botón de filtro reutilizable
function BotonFiltro({ label, activo, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
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
  const [deporte, setDeporte] = useState("Todos");
  const [tipo, setTipo]       = useState("Todos");
  const [talle, setTalle]     = useState("Todos");

  // Los tres filtros se aplican en cadena, de forma independiente
  const productosFiltrados = productos.filter((p) => {
    const matchDeporte = deporte === "Todos" || p.deporte === deporteValor[deporte];
    const matchTipo    = tipo    === "Todos" || p.tipo    === tipoValor[tipo];
    const matchTalle   = talle   === "Todos" || p.talle.includes(talle);
    return matchDeporte && matchTipo && matchTalle;
  });

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-6">Catálogo</h1>

      {/* Panel de filtros */}
      <section className="bg-white border border-black rounded-xl p-5 mb-8 flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold text-gray-600 w-16">Deporte</span>
          {filtrosDeporte.map((f) => (
            <BotonFiltro key={f} label={f} activo={deporte === f} onClick={() => setDeporte(f)} />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold text-gray-600 w-16">Tipo</span>
          {filtrosTipo.map((f) => (
            <BotonFiltro key={f} label={f} activo={tipo === f} onClick={() => setTipo(f)} />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold text-gray-600 w-16">Talle</span>
          {filtrosTalle.map((f) => (
            <BotonFiltro key={f} label={f} activo={talle === f} onClick={() => setTalle(f)} />
          ))}
        </div>
      </section>

      {/* Contador de resultados */}
      <p className="text-sm text-gray-500 mb-4">
        {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? "s" : ""} encontrado{productosFiltrados.length !== 1 ? "s" : ""}
      </p>

      {/* Grilla de productos */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {productosFiltrados.map((producto) => (
          <article
            key={producto.id}
            className="bg-white rounded-xl border border-black shadow-sm overflow-hidden flex flex-col"
          >
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full object-cover"
            />

            <div className="p-4 flex flex-col flex-1 gap-2">
              {/* Badges de deporte y tipo */}
              <div className="flex gap-2 flex-wrap">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${badgeDeporte[producto.deporte]}`}>
                  {producto.deporte === "futbol" ? "Fútbol" : "Rugby"}
                </span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${badgeTipo[producto.tipo]}`}>
                  {producto.tipo === "nacion" ? "Nación" : "Club"}
                </span>
              </div>

              <h2 className="font-semibold text-gray-900">{producto.nombre}</h2>

              {/* Talles disponibles como píldoras */}
              <div className="flex gap-1 flex-wrap">
                {producto.talle.map((t) => (
                  <span key={t} className="text-xs border border-gray-400 rounded px-1.5 py-0.5 text-gray-600">
                    {t}
                  </span>
                ))}
              </div>

              <p className="text-orange-500 font-bold mt-auto">
                {formatearPrecio(producto.precio)}
              </p>

              <p className={`text-xs ${producto.stock > 0 ? "text-gray-500" : "text-red-500 font-medium"}`}>
                {producto.stock > 0 ? `Stock: ${producto.stock} unidades` : "Sin stock"}
              </p>

              <Link
                href={`/catalogo/${producto.id}`}
                className="block text-center bg-black text-white text-sm font-medium py-2 rounded-lg hover:bg-gray-800 transition-colors mt-1"
              >
                Ver detalle
              </Link>
            </div>
          </article>
        ))}
      </section>

      {/* Mensaje cuando ningún filtro tiene resultados */}
      {productosFiltrados.length === 0 && (
        <p className="text-center text-gray-500 py-16">
          No hay productos que coincidan con los filtros seleccionados.
        </p>
      )}
    </main>
  );
}
