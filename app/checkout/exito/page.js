"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import { trackPurchase } from "@/lib/fbpixel";

export default function CheckoutExitoPage() {
  const { vaciarCarrito } = useCart();

  useEffect(() => {
    // Disparar Purchase si veníamos de pagar (resumen guardado en checkout)
    try {
      const raw = localStorage.getItem("pendingPurchase");
      if (raw) {
        const { items, total, ts } = JSON.parse(raw);
        // Solo disparamos si el resumen es reciente (< 1 hora) para evitar
        // duplicados si el usuario abre /checkout/exito directamente.
        if (items && total && ts && Date.now() - ts < 60 * 60 * 1000) {
          const url = new URL(window.location.href);
          const pedidoId = url.searchParams.get("external_reference") ?? null;
          trackPurchase({ items, total, pedidoId });
        }
        localStorage.removeItem("pendingPurchase");
      }
    } catch {}
    vaciarCarrito();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
