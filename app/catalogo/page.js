"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import FadeIn from "@/components/FadeIn";
import { FaChevronDown, FaChevronUp, FaFilter } from "react-icons/fa";
import SkeletonCard from "@/components/SkeletonCard";

function formatearPrecio(precio) {
  return "$" + precio.toLocaleString("es-AR");
}

const filtrosTipo      = ["Todos", "Naciones", "Clubes"];
const filtrosCategoria = ["Todas", "local", "alternativa", "training"];
const filtrosTalle     = ["Todos", "S", "M", "L", "XL", "2XL", "3XL"];
const tipoValor        = { Naciones: "nacion", Clubes: "club" };
const categoriaLabel   = { Todas: "Todas", local: "Local", alternativa: "Alternativa", training: "Training" };
const badgeTipo        = { nacion: "bg-zinc-700 text-white", club: "bg-orange-500/20 text-orange-400" };

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
  const [productos, setProductos] = useState([]);
  const [cargando,  setCargando]  = useState(true);
  const [tipo,      setTipo]      = useState("Todos");
  const [categoria, setCategoria] = useState("Todas");
  const [talle,     setTalle]     = useState("Todos");
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  useEffect(() => {
    supabase
      .from("productos_catalogo")
      .select("*")
      .order("creado_at", { ascending: false })
      .then(({ data }) => {
        setProductos(data ?? []);
        setCargando(false);
      });
  }, []);

  const productosFiltrados = productos.filter((p) => {
    const matchTipo      = tipo      === "Todos" || p.tipo      === tipoValor[tipo];
    const matchCategoria = categoria === "Todas" || p.categoria === categoria;
    const matchTalle     = talle     === "Todos" || (p.talle ?? []).includes(talle);
    return matchTipo && matchCategoria && matchTalle;
  });

  const hayFiltrosActivos  = tipo !== "Todos" || categoria !== "Todas" || talle !== "Todos";
  const cantFiltrosActivos =
    (tipo      !== "Todos" ? 1 : 0) +
    (categoria !== "Todas" ? 1 : 0) +
    (talle     !== "Todos" ? 1 : 0);

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-6 text-white">Catálogo Rugby</h1>

      {/* Filtros */}
      <section className="bg-zinc-900 border border-zinc-700 rounded-xl mb-8 overflow-hidden">
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

        <div className={`flex flex-col gap-4 transition-all duration-300 overflow-hidden md:px-5 md:pb-5 md:pt-5 md:max-h-none md:overflow-visible ${filtrosAbiertos ? "max-h-[500px] px-5 pb-5" : "max-h-0"}`}>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-gray-400 w-20">Tipo</span>
            {filtrosTipo.map((f) => <BotonFiltro key={f} label={f} activo={tipo === f} onClick={() => setTipo(f)} />)}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-gray-400 w-20">Categoría</span>
            {filtrosCategoria.map((f) => <BotonFiltro key={f} label={categoriaLabel[f]} activo={categoria === f} onClick={() => setCategoria(f)} />)}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-gray-400 w-20">Talle</span>
            {filtrosTalle.map((f) => <BotonFiltro key={f} label={f} activo={talle === f} onClick={() => setTalle(f)} />)}
          </div>
          {hayFiltrosActivos && (
            <button onClick={() => { setTipo("Todos"); setCategoria("Todas"); setTalle("Todos"); }} className="self-start text-sm text-gray-400 underline hover:text-red-400 transition-colors">
              Limpiar filtros
            </button>
          )}
        </div>
      </section>

      {cargando ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-400 mb-4">
            {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? "s" : ""} encontrado{productosFiltrados.length !== 1 ? "s" : ""}
          </p>

          <section
            key={`${tipo}-${categoria}-${talle}`}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-[fadeScaleIn_0.35s_ease-out]"
          >
            {productosFiltrados.map((producto, i) => (
              <FadeIn key={producto.id} delay={i * 60}>
                <Link href={`/catalogo/${producto.id}`} className="block h-full">
                  <article className="bg-zinc-900 rounded-xl border border-zinc-700 shadow-sm overflow-hidden flex flex-col transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg h-full cursor-pointer">
                    <div className="h-52 bg-white flex items-center justify-center">
                      <img src={producto.imagen} alt={producto.nombre} className="h-full w-full object-contain" loading="lazy" />
                    </div>
                    <div className="p-3 md:p-4 flex flex-col flex-1 gap-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full self-start ${badgeTipo[producto.tipo]}`}>
                        {producto.tipo === "nacion" ? "Nación" : "Club"}
                      </span>
                      <h2 className="font-semibold text-white text-sm md:text-base leading-tight">{producto.nombre}</h2>
                      <div className="flex gap-1 flex-wrap">
                        {(producto.talle ?? []).map((t) => (
                          <span key={t} className="text-xs border border-zinc-600 rounded px-1.5 py-0.5 text-gray-300">{t}</span>
                        ))}
                      </div>
                      <div className="mt-auto flex flex-col gap-0.5">
                        <p className="text-orange-500 font-bold text-sm md:text-base">{formatearPrecio(producto.precio)}</p>
                        {producto.descuento_transferencia > 0 && (
                          <p className="text-green-400 text-xs font-semibold">
                            Transf. {formatearPrecio(Math.round(producto.precio * (1 - producto.descuento_transferencia / 100)))}
                            <span className="text-green-600 ml-1">−{producto.descuento_transferencia}%</span>
                          </p>
                        )}
                      </div>
                      <div className="block text-center bg-orange-500 text-black text-sm font-semibold py-2.5 rounded-lg hover:bg-orange-400 transition-colors mt-1">
                        Ver detalle
                      </div>
                    </div>
                  </article>
                </Link>
              </FadeIn>
            ))}
          </section>

          {productosFiltrados.length === 0 && (
            <p className="text-center text-gray-400 py-16">No hay productos que coincidan con los filtros seleccionados.</p>
          )}
        </>
      )}
    </main>
  );
}
