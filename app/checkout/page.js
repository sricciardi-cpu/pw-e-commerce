"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { FaChevronRight, FaArrowRight } from "react-icons/fa";

const ENVIO_FIJO = 9;

function formatearPrecio(precio) {
  return "$" + precio.toLocaleString("es-AR");
}

function Campo({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-400">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  "bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors";

export default function CheckoutPage() {
  const { items, total } = useCart();

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    codigoArea: "",
    celular: "",
    provincia: "",
    localidad: "",
    calle: "",
    numero: "",
    piso: "",
    departamento: "",
    codigoPostal: "",
    observaciones: "",
  });
  const [cargando, setCargando] = useState(false);
  const [error,    setError]    = useState(null);

  if (items.length === 0) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-16 text-center">
        <p className="text-2xl font-bold text-white mb-2">Tu carrito está vacío</p>
        <p className="text-gray-400 mb-8">Agregá productos desde el stock para continuar.</p>
        <Link
          href="/stock"
          className="inline-block bg-orange-500 text-black font-semibold px-8 py-4 rounded-xl hover:bg-orange-400 transition-colors text-lg"
        >
          Ver stock disponible
        </Link>
      </main>
    );
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setCargando(true);
    setError(null);

    try {
      const res = await fetch("/api/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, comprador: form }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error al procesar el pago");

      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
      setCargando(false);
    }
  }

  const totalConEnvio = total + ENVIO_FIJO;

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-orange-500 transition-colors">Inicio</Link>
        <FaChevronRight className="text-xs" />
        <Link href="/carrito" className="hover:text-orange-500 transition-colors">Carrito</Link>
        <FaChevronRight className="text-xs" />
        <span className="text-white font-medium">Checkout</span>
      </nav>

      <h1 className="text-3xl font-extrabold mb-8 text-white">Finalizar compra</h1>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6">

          {/* Datos personales */}
          <section className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-white">Datos personales</h2>

            <Campo label="Nombre y apellido *">
              <input
                type="text" name="nombre" value={form.nombre}
                onChange={handleChange} required placeholder="Juan García"
                className={inputClass}
              />
            </Campo>

            <Campo label="Email *">
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} required placeholder="juan@email.com"
                className={inputClass}
              />
            </Campo>

            <div className="grid grid-cols-3 gap-4">
              <Campo label="Cód. de área *">
                <input
                  type="tel" name="codigoArea" value={form.codigoArea}
                  onChange={handleChange} required placeholder="11"
                  className={inputClass}
                />
              </Campo>
              <div className="col-span-2">
                <Campo label="Celular *">
                  <input
                    type="tel" name="celular" value={form.celular}
                    onChange={handleChange} required placeholder="1234-5678"
                    className={inputClass}
                  />
                </Campo>
              </div>
            </div>
          </section>

          {/* Dirección */}
          <section className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-white">Dirección de envío</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Campo label="Provincia *">
                <input
                  type="text" name="provincia" value={form.provincia}
                  onChange={handleChange} required placeholder="Buenos Aires"
                  className={inputClass}
                />
              </Campo>
              <Campo label="Localidad *">
                <input
                  type="text" name="localidad" value={form.localidad}
                  onChange={handleChange} required placeholder="Palermo"
                  className={inputClass}
                />
              </Campo>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <Campo label="Calle *">
                  <input
                    type="text" name="calle" value={form.calle}
                    onChange={handleChange} required placeholder="Av. Corrientes"
                    className={inputClass}
                  />
                </Campo>
              </div>
              <Campo label="Número *">
                <input
                  type="text" name="numero" value={form.numero}
                  onChange={handleChange} required placeholder="1234"
                  className={inputClass}
                />
              </Campo>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Campo label="Piso">
                <input
                  type="text" name="piso" value={form.piso}
                  onChange={handleChange} placeholder="3"
                  className={inputClass}
                />
              </Campo>
              <Campo label="Departamento">
                <input
                  type="text" name="departamento" value={form.departamento}
                  onChange={handleChange} placeholder="B"
                  className={inputClass}
                />
              </Campo>
              <Campo label="Código postal *">
                <input
                  type="text" name="codigoPostal" value={form.codigoPostal}
                  onChange={handleChange} required placeholder="1043"
                  className={inputClass}
                />
              </Campo>
            </div>

            <Campo label="Observaciones">
              <textarea
                name="observaciones" value={form.observaciones}
                onChange={handleChange}
                placeholder="Timbre roto, dejar en portería, etc."
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </Campo>
          </section>

          {error && (
            <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 text-black font-bold py-4 rounded-xl text-lg hover:bg-orange-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            <FaArrowRight className="text-base" />
            {cargando ? "Procesando..." : "Ir a pagar con MercadoPago"}
          </button>
        </form>

        {/* Resumen del pedido */}
        <aside className="lg:w-80 shrink-0">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 sticky top-24">
            <h2 className="text-lg font-bold text-white mb-4">Resumen del pedido</h2>

            <div className="flex flex-col gap-3 mb-4">
              {items.map((item) => (
                <div key={`${item.id}-${item.talle}`} className="flex items-center gap-3">
                  {item.imagen && (
                    <div className="shrink-0 w-12 h-12 rounded-lg bg-white overflow-hidden">
                      <img src={item.imagen} alt={item.nombre} className="w-full h-full object-contain" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{item.nombre}</p>
                    <p className="text-xs text-gray-400">Talle {item.talle} · x{item.cantidad}</p>
                  </div>
                  <p className="text-sm text-orange-500 font-bold shrink-0">
                    {formatearPrecio(item.precio * item.cantidad)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-700 pt-3 flex flex-col gap-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Subtotal</span>
                <span>{formatearPrecio(total)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>Envío</span>
                <span>{formatearPrecio(ENVIO_FIJO)}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-base border-t border-zinc-700 pt-2 mt-1">
                <span>Total</span>
                <span className="text-orange-500">{formatearPrecio(totalConEnvio)}</span>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </main>
  );
}
