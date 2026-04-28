import Link from "next/link";
import { FaTimesCircle, FaWhatsapp } from "react-icons/fa";

export default function CheckoutErrorPage() {
  return (
    <main className="max-w-xl mx-auto px-4 py-20 text-center">
      <FaTimesCircle className="text-red-500 text-6xl mx-auto mb-6" />
      <h1 className="text-3xl font-extrabold text-white mb-3">Hubo un problema con el pago</h1>
      <p className="text-gray-400 mb-10">
        No se procesó ningún cobro. Podés intentarlo de nuevo o consultarnos directamente por WhatsApp.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/carrito"
          className="inline-block bg-orange-500 text-black font-semibold px-8 py-4 rounded-xl hover:bg-orange-400 transition-colors"
        >
          Volver al carrito
        </Link>
        <a
          href="https://wa.me/5492216220145"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 border border-zinc-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white hover:text-black transition-colors"
        >
          <FaWhatsapp />
          Consultar por WhatsApp
        </a>
      </div>
    </main>
  );
}
