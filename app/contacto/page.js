"use client";

import { useState } from "react";
import FadeIn from "@/components/FadeIn";

const camposIniciales = { nombre: "", email: "", telefono: "", mensaje: "" };
const erroresIniciales = { nombre: "", email: "", telefono: "", mensaje: "" };

function validar(campos) {
  const errores = { nombre: "", email: "", telefono: "", mensaje: "" };

  if (!campos.nombre.trim()) {
    errores.nombre = "El nombre no puede estar vacío.";
  }
  if (!campos.email.includes("@") || !campos.email.includes(".")) {
    errores.email = "Ingresá un email válido (debe contener @ y punto).";
  }
  if (!/^\d{10}$/.test(campos.telefono)) {
    errores.telefono = "Ingresá un teléfono válido de 10 dígitos (ej: 2213530494)";
  }
  if (campos.mensaje.trim().length < 20) {
    errores.mensaje = "El mensaje debe tener al menos 20 caracteres.";
  }

  return errores;
}

function hayErrores(errores) {
  return Object.values(errores).some((e) => e !== "");
}

export default function ContactoPage() {
  const [campos, setCampos] = useState(camposIniciales);
  const [errores, setErrores] = useState(erroresIniciales);
  const [enviado, setEnviado] = useState(false);

  function handleChange(e) {
    setCampos({ ...campos, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nuevosErrores = validar(campos);
    setErrores(nuevosErrores);

    if (hayErrores(nuevosErrores)) return;

    setEnviado(true);
    setCampos(camposIniciales);
    setErrores(erroresIniciales);
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <FadeIn>
        <h1 className="text-3xl font-extrabold mb-2 text-white">Contacto</h1>
        <p className="text-gray-300 mb-8">
          ¿Tenés alguna pregunta? Completá el formulario y te respondemos a la brevedad.
        </p>
      </FadeIn>

      {enviado && (
        <div className="bg-orange-900/30 border border-orange-500 text-orange-300 rounded-xl px-5 py-4 mb-6">
          ¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.
        </div>
      )}

      <FadeIn delay={100}>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

        {/* Nombre */}
        <div className="flex flex-col gap-1">
          <label htmlFor="nombre" className="text-sm font-medium text-gray-300">
            Nombre
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={campos.nombre}
            onChange={handleChange}
            aria-describedby="nombre-error"
            className={`bg-zinc-900 text-white placeholder-gray-500 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errores.nombre ? "border-red-400" : "border-zinc-600"
            }`}
            placeholder="Tu nombre completo"
          />
          <p id="nombre-error" className="text-red-400 text-xs min-h-[1rem]">
            {errores.nombre}
          </p>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-300">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={campos.email}
            onChange={handleChange}
            aria-describedby="email-error"
            className={`bg-zinc-900 text-white placeholder-gray-500 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errores.email ? "border-red-400" : "border-zinc-600"
            }`}
            placeholder="tu@email.com"
          />
          <p id="email-error" className="text-red-400 text-xs min-h-[1rem]">
            {errores.email}
          </p>
        </div>

        {/* Teléfono */}
        <div className="flex flex-col gap-1">
          <label htmlFor="telefono" className="text-sm font-medium text-gray-300">
            Teléfono
          </label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            value={campos.telefono}
            onChange={handleChange}
            aria-describedby="telefono-error"
            className={`bg-zinc-900 text-white placeholder-gray-500 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errores.telefono ? "border-red-400" : "border-zinc-600"
            }`}
            placeholder="Ej: 2213530494"
          />
          <p id="telefono-error" className="text-red-400 text-xs min-h-[1rem]">
            {errores.telefono}
          </p>
        </div>

        {/* Mensaje */}
        <div className="flex flex-col gap-1">
          <label htmlFor="mensaje" className="text-sm font-medium text-gray-300">
            Mensaje
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            rows={5}
            value={campos.mensaje}
            onChange={handleChange}
            aria-describedby="mensaje-error"
            className={`bg-zinc-900 text-white placeholder-gray-500 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none ${
              errores.mensaje ? "border-red-400" : "border-zinc-600"
            }`}
            placeholder="Escribí tu consulta (mínimo 20 caracteres)"
          />
          <p id="mensaje-error" className="text-red-400 text-xs min-h-[1rem]">
            {errores.mensaje}
          </p>
        </div>

        <button
          type="submit"
          className="bg-orange-500 text-black font-semibold py-3 rounded-lg hover:bg-orange-400 transition-colors"
        >
          Enviar mensaje
        </button>
      </form>
      </FadeIn>
    </main>
  );
}
