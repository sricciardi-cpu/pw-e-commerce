"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import productosLocales from "@/data/productos";
import FadeIn from "@/components/FadeIn";
import { FaHeart, FaStar, FaShippingFast, FaChevronLeft, FaChevronRight } from "react-icons/fa";

function formatearPrecio(precio) {
  return "$" + precio.toLocaleString("es-AR");
}

const valores = [
  { icon: FaHeart,        titulo: "Pasión por el deporte", texto: "Vivimos el rugby desde adentro." },
  { icon: FaStar,         titulo: "Calidad garantizada",   texto: "Solo vendemos lo que nosotros mismos usaríamos." },
  { icon: FaShippingFast, titulo: "Entrega rápida",        texto: "Stock disponible y envíos a todo el país." },
];

// Contador animado. Si el target cambia después de que la animación terminó
// (porque llega data fresca del servidor), actualiza el número directamente.
function AnimatedCounter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const animatedTo = useRef(null); // target al que ya se animó (null = sin animar todavía)

  useEffect(() => {
    // Si ya animamos antes y target cambió, actualizar sin re-animar.
    if (animatedTo.current !== null && animatedTo.current !== target) {
      setCount(target);
      animatedTo.current = target;
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && animatedTo.current === null) {
        animatedTo.current = target;
        const duration = 1500;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            setCount(target);
            clearInterval(timer);
          } else {
            setCount(Math.floor(current));
          }
        }, duration / steps);
      }
    }, { threshold: 0.3 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString("es-AR")}{suffix}</span>;
}

// Carrusel con loop bidireccional (prepend último + append primero)
function Carousel({ items }) {
  const total    = items.length;
  // [último, ...todos, primero] — arrancamos en idx=1 (el real primer item)
  const extItems = [items[total - 1], ...items, items[0]];
  const extTotal = extItems.length;

  const [idx,      setIdx]      = useState(1);
  const [offset,   setOffset]   = useState(0);
  const [dragging, setDragging] = useState(false);
  const [animated, setAnimated] = useState(true);
  const jumping = useRef(false);
  const startX  = useRef(0);

  // Cuando llegamos al clon del extremo, saltamos sin animación al real
  useEffect(() => {
    if (jumping.current) return;
    if (idx === 0) {
      jumping.current = true;
      const t = setTimeout(() => {
        setAnimated(false);
        setIdx(total);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setAnimated(true);
            jumping.current = false;
          });
        });
      }, 500);
      return () => clearTimeout(t);
    }
    if (idx === total + 1) {
      jumping.current = true;
      const t = setTimeout(() => {
        setAnimated(false);
        setIdx(1);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setAnimated(true);
            jumping.current = false;
          });
        });
      }, 500);
      return () => clearTimeout(t);
    }
  }, [idx, total]);

  // Autoplay
  useEffect(() => {
    if (dragging) return;
    const t = setInterval(() => {
      if (!jumping.current) { setAnimated(true); setIdx((i) => i + 1); }
    }, 3000);
    return () => clearInterval(t);
  }, [dragging]);

  const onDragStart = (clientX) => { startX.current = clientX; setDragging(true); };
  const onDragMove  = (clientX) => { if (!dragging) return; setOffset(clientX - startX.current); };
  const onDragEnd   = () => {
    const threshold = 60;
    setAnimated(true);
    if      (offset < -threshold) setIdx((i) => i + 1);
    else if (offset > threshold)  setIdx((i) => i - 1);
    setOffset(0);
    setDragging(false);
  };

  // dot activo: idx 1..total mapea a 0..total-1
  const dotIdx = ((idx - 1) % total + total) % total;

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 shadow-sm select-none cursor-grab active:cursor-grabbing"
      onMouseDown={(e) => onDragStart(e.clientX)}
      onMouseMove={(e) => onDragMove(e.clientX)}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
      onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
      onTouchMove={(e) => { e.preventDefault(); onDragMove(e.touches[0].clientX); }}
      onTouchEnd={onDragEnd}
    >
      {/* Track */}
      <div
        className="flex"
        style={{
          width: `${extTotal * 100}%`,
          transform: `translateX(calc(${-idx * (100 / extTotal)}% + ${offset / extTotal}px))`,
          transition: dragging ? "none" : animated ? "transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)" : "none",
        }}
      >
        {extItems.map((producto, i) => (
          <div key={i} style={{ width: `${100 / extTotal}%` }} className="shrink-0">
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full object-contain max-h-64 md:max-h-80 bg-white pointer-events-none"
              loading="lazy"
            />
            <div className="p-4 md:p-6 flex flex-col gap-2">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-orange-500 text-black capitalize self-start">
                Rugby
              </span>
              <h3 className="font-bold text-white text-lg leading-tight">{producto.nombre}</h3>
              <p className="text-orange-500 font-extrabold text-xl">{formatearPrecio(producto.precio)}</p>
              <Link
                href={`/catalogo/${producto.id}`}
                className="mt-2 inline-block text-center bg-black text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-orange-500 hover:text-black transition-colors border border-zinc-600"
                onClick={(e) => { if (Math.abs(offset) > 5) e.preventDefault(); }}
              >
                Ver detalle
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Flechas */}
      <button
        onClick={() => { if (!jumping.current) { setAnimated(true); setIdx((i) => i - 1); } }}
        className="absolute top-1/3 left-2 bg-black/50 hover:bg-black text-white rounded-full p-2 transition-colors z-10"
      >
        <FaChevronLeft />
      </button>
      <button
        onClick={() => { if (!jumping.current) { setAnimated(true); setIdx((i) => i + 1); } }}
        className="absolute top-1/3 right-2 bg-black/50 hover:bg-black text-white rounded-full p-2 transition-colors z-10"
      >
        <FaChevronRight />
      </button>

      {/* Dots */}
      <div className="flex justify-center gap-2 pb-4">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => { if (!jumping.current) { setAnimated(true); setIdx(i + 1); } }}
            className={`w-2 h-2 rounded-full transition-colors ${i === dotIdx ? "bg-orange-500" : "bg-zinc-600"}`}
          />
        ))}
      </div>
    </div>
  );
}

// Base de "camisetas vendidas" (marketing) — las ventas reales se suman a este número.
const VENDIDAS_BASE = 500;
const MODELOS_FALLBACK = 19;

export default function HomePage() {
  const [destacados,     setDestacados]     = useState([]);
  const [modelosCount,   setModelosCount]   = useState(MODELOS_FALLBACK);
  const [vendidasCount,  setVendidasCount]  = useState(VENDIDAS_BASE);

  useEffect(() => {
    supabase
      .from("productos_catalogo")
      .select("id, nombre, precio, imagen")
      .eq("destacado", true)
      .limit(4)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setDestacados(data);
        } else {
          // fallback a los primeros 4 productos locales hasta que se configuren en el admin
          setDestacados(productosLocales.slice(0, 4));
        }
      });

    // Cuenta dinámica de modelos en catálogo. Traemos solo los IDs y
    // contamos el array — evita problemas con el header de count en Supabase.
    // Si la query falla o devuelve vacío, queda el MODELOS_FALLBACK.
    console.log("[home v2] Consultando modelos del catálogo...");
    supabase
      .from("productos_catalogo")
      .select("id")
      .then(({ data, error }) => {
        console.log("[home v2] Resultado modelos:", { count: data?.length, error: error?.message });
        if (error) {
          console.warn("[home v2] No se pudo contar modelos:", error.message);
          return;
        }
        if (Array.isArray(data) && data.length > 0) {
          setModelosCount(data.length);
        }
      });

    // Camisetas vendidas: BASE + suma de cantidad de items en pedidos confirmados.
    // Si la query falla, queda el VENDIDAS_BASE.
    supabase
      .from("pedidos")
      .select("items, estado")
      .neq("estado", "pendiente")
      .then(({ data, error }) => {
        if (error || !Array.isArray(data)) return;
        const sumaReal = data.reduce((acc, pedido) => {
          const items = Array.isArray(pedido.items) ? pedido.items : [];
          const subtotal = items.reduce((s, i) => s + (Number(i?.cantidad) || 0), 0);
          return acc + subtotal;
        }, 0);
        setVendidasCount(VENDIDAS_BASE + sumaReal);
      });
  }, []);

  return (
    <main>
      {/* Hero + Stats */}
      <section
        className="relative w-full text-white -mt-16 md:-mt-20 flex flex-col items-center text-center px-6"
        style={{ backgroundImage: "url('/fondo_inicio.png')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-black/60" />

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center pt-24 md:pt-32 pb-10 md:pb-16 min-h-[300px] md:min-h-[400px] justify-center w-full">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">Camisetas Zeus</h1>
          <p className="text-sm md:text-xl text-orange-500 font-semibold mb-10 max-w-xs md:max-w-none">
            Las mejores camisetas de rugby de Argentina
          </p>
          <Link
            href="/catalogo"
            className="inline-block bg-orange-500 text-black font-bold px-6 md:px-8 py-3 rounded-full text-sm md:text-base hover:bg-orange-400 transition-colors active:scale-95 shadow-lg shadow-orange-500/30"
          >
            Ver catálogo
          </Link>
        </div>

        {/* Stats */}
        <FadeIn>
          <div className="relative z-10 w-full border-t border-white/20">
            <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl md:text-3xl font-extrabold text-orange-500">
                  <AnimatedCounter target={vendidasCount} suffix="+" />
                </p>
                <p className="text-xs md:text-sm text-gray-300 mt-1">Camisetas vendidas</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-extrabold text-orange-500">
                  <AnimatedCounter target={modelosCount} />
                </p>
                <p className="text-xs md:text-sm text-gray-300 mt-1">Modelos disponibles</p>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10 md:py-12">

        {/* Quiénes Somos */}
        <FadeIn>
          <section className="bg-zinc-900 rounded-2xl text-white p-6 md:p-10 mb-12 md:mb-16 transition-transform duration-300 hover:-translate-y-1 border border-zinc-700">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4">Quiénes Somos</h2>
            <p className="text-gray-300 mb-8 max-w-2xl text-sm md:text-base leading-relaxed">
              Camisetas Zeus nació en La Plata con una idea simple: acercar las mejores camisetas de rugby
              a quienes realmente las viven. Somos un emprendimiento que combina la pasión por el deporte
              con el compromiso de ofrecer productos de calidad a precios accesibles.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              {valores.map(({ icon: Icon, titulo, texto }, i) => (
                <FadeIn key={titulo} delay={i * 100}>
                  <div className="border border-zinc-700 rounded-xl p-5 transition-transform duration-300 hover:-translate-y-2 cursor-default h-full">
                    <Icon className="text-3xl text-orange-500" />
                    <h3 className="text-base md:text-lg font-semibold mt-3 mb-1">{titulo}</h3>
                    <p className="text-gray-400 text-sm">{texto}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* Carrusel de productos destacados */}
        {destacados.length > 0 && (
        <FadeIn>
          <section className="mb-12 md:mb-16">
            <h2 className="text-2xl font-bold mb-6 text-white">Productos destacados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {destacados.slice(0, 2).length > 0 && <Carousel items={destacados.slice(0, 2)} />}
              {destacados.slice(2, 4).length > 0 && <Carousel items={destacados.slice(2, 4)} />}
            </div>
            <div className="mt-6 text-center">
              <Link href="/catalogo" className="inline-block bg-zinc-900 text-white border border-zinc-600 font-semibold px-8 py-3 rounded-full hover:bg-orange-500 hover:text-black hover:border-orange-500 transition-colors">
                Ver catálogo completo
              </Link>
            </div>
          </section>
        </FadeIn>
        )}

      </div>
    </main>
  );
}
