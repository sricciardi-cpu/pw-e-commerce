"use client";

import { useState } from "react";

const camposIniciales = { nombre: "", email: "", telefono: "", mensaje: "" };
const erroresIniciales = { nombre: "", email: "", telefono: "", mensaje: "" };

// Valida cada campo y devuelve un objeto con los mensajes de error
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

    // Formulario válido: mostrar mensaje de éxito y resetear
    setEnviado(true);
    setCampos(camposIniciales);
    setErrores(erroresIniciales);
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-2">Contacto</h1>
      <p className="text-gray-600 mb-8">
        ¿Tenés alguna pregunta? Completá el formulario y te respondemos a la brevedad.
      </p>

      {/* Mensaje de éxito tras envío correcto */}
      {enviado && (
        <div className="bg-orange-50 border border-orange-400 text-orange-800 rounded-xl px-5 py-4 mb-6">
          ¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

        {/* Nombre */}
        <div className="flex flex-col gap-1">
          <label htmlFor="nombre" className="text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={campos.nombre}
            onChange={handleChange}
            aria-describedby="nombre-error"
            className={`border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black ${
              errores.nombre ? "border-red-400" : "border-gray-300"
            }`}
            placeholder="Tu nombre completo"
          />
          {/* Mensaje de error accesible via aria-describedby */}
          <p id="nombre-error" className="text-red-500 text-xs min-h-[1rem]">
            {errores.nombre}
          </p>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={campos.email}
            onChange={handleChange}
            aria-describedby="email-error"
            className={`border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black ${
              errores.email ? "border-red-400" : "border-gray-300"
            }`}
            placeholder="tu@email.com"
          />
          <p id="email-error" className="text-red-500 text-xs min-h-[1rem]">
            {errores.email}
          </p>
        </div>

        {/* Teléfono */}
        <div className="flex flex-col gap-1">
          <label htmlFor="telefono" className="text-sm font-medium text-gray-700">
            Teléfono
          </label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            value={campos.telefono}
            onChange={handleChange}
            aria-describedby="telefono-error"
            className={`border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black ${
              errores.telefono ? "border-red-400" : "border-gray-300"
            }`}
            placeholder="Ej: 2213530494"
          />
          <p id="telefono-error" className="text-red-500 text-xs min-h-[1rem]">
            {errores.telefono}
          </p>
        </div>

        {/* Mensaje */}
        <div className="flex flex-col gap-1">
          <label htmlFor="mensaje" className="text-sm font-medium text-gray-700">
            Mensaje
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            rows={5}
            value={campos.mensaje}
            onChange={handleChange}
            aria-describedby="mensaje-error"
            className={`border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none ${
              errores.mensaje ? "border-red-400" : "border-gray-300"
            }`}
            placeholder="Escribí tu consulta (mínimo 20 caracteres)"
          />
          <p id="mensaje-error" className="text-red-500 text-xs min-h-[1rem]">
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
    </main>
  );
}
