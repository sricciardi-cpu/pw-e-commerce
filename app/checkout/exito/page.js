"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";
import { useCart } from "@/context/CartContext";

export default function CheckoutExitoPage() {
  const { vaciarCarrito } = useCart();

  useEffect(() => {
    vaciarCarrito();
  }, []);

  return (
    <main className="max-w-xl mx-auto px-4 py-20 text-center">
      <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-6" />
      <h1 className="text-3xl font-extrabold text-white mb-3">¡Pago exitoso!</h1>
      <p className="text-gray-400 mb-2">Tu compra fue procesada correctamente.</p>
      <p className="text-gray-400 mb-10">
        Te enviamos un email de confirmación. Nos ponemos en contacto a la brevedad para coordinar el envío.
      </p>
      <Link
        href="/"
        className="inline-block bg-orange-500 text-black font-semibold px-8 py-4 rounded-xl hover:bg-orange-400 transition-colors"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
