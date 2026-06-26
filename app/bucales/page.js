"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import FadeIn from "@/components/FadeIn";
import SkeletonCard from "@/components/SkeletonCard";

function formatearPrecio(precio) {
  return "$" + precio.toLocaleString("es-AR");
}

function stockTotal(p) {
  const variantes = p.talle ?? [];
  const porVar = p.stock_por_talle ?? {};
  const hayPorVar = variantes.some((t) => porVar[t] !== undefined);
  if (hayPorVar && variantes.length > 0) {
    return variantes.reduce((s, t) => s + (Number(porVar[t]) || 0), 0);
  }
  return Number(p.stock) || 0;
}

export default function BucalesPage() {
  const [productos, setProductos] = useState([]);
  const [cargando,  setCargando]  = useState(true);

  useEffect(() => {
    supabase
      .from("productos_stock")
      .select("*")
      .order("creado_at", { ascending: false })
      .then(({ data }) => {
        const bucales = (data ?? []).filter((p) => (p.seccion ?? "camiseta") === "bucal");
        setProductos(bucales);
        setCargando(false);
      });
  }, []);

  const disponibles = productos.filter((p) => stockTotal(p) > 0);
  const sinStock = !cargando && disponibles.length === 0;

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Protectores bucales</h1>
        <span className="bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">En stock</span>
      </div>
      <p className="text-gray-500 text-sm mb-6">Protección para tus partidos. Elegí tu color, talle único.</p>

      {cargando ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : sinStock ? (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl py-16 px-6 text-center flex flex-col items-center gap-5">
          <div className="text-orange-500 text-5xl">🦷</div>
          <p className="text-xl font-bold text-gray-900">No hay protectores disponibles por el momento</p>
          <p className="text-gray-500 max-w-md">Volvé pronto o escribinos por WhatsApp para consultar.</p>
          <Link
            href="/stock"
            className="inline-block bg-orange-500 text-black font-semibold px-8 py-4 rounded-xl hover:bg-orange-400 transition-colors mt-2"
          >
            Ver camisetas en stock
          </Link>
        </div>
      ) : (
        <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {disponibles.map((producto, i) => (
            <FadeIn key={producto.id} delay={i * 40}>
              <Link href={`/stock/${producto.id}`} className="block h-full">
                <article className="bg-[#f5f5f0] rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg h-full cursor-pointer">
                  <div className="relative h-40 sm:h-52 bg-[#f5f5f0] overflow-hidden">
                    <Image
                      src={producto.imagen}
                      alt={producto.nombre}
                      fill
                      unoptimized
                      className="object-contain mix-blend-multiply"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3 md:p-4 flex flex-col flex-1 gap-2">
                    <h2 className="font-semibold text-gray-900 text-sm md:text-base leading-tight">{producto.nombre}</h2>
                    {(producto.talle ?? []).length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {(producto.talle ?? []).map((c) => (
                          <span key={c} className="text-xs border border-gray-300 rounded px-1.5 py-0.5 text-gray-600">{c}</span>
                        ))}
                      </div>
                    )}
                    <div className="mt-auto flex flex-col gap-0.5">
                      <p className="text-orange-500 font-bold text-sm md:text-base">{formatearPrecio(producto.precio)}</p>
                      {producto.descuento_transferencia > 0 && (
                        <p className="text-green-700 text-xs font-semibold">
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
      )}
    </main>
  );
}
