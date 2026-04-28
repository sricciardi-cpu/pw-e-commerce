import Link from "next/link";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";

const enlaces = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/stock", label: "Stock" },
  { href: "/mystery-futbox", label: "Mystery Futbox" },
  { href: "/griptec-spray", label: "Griptec Spray" },
  { href: "/guia-de-talles", label: "Guía de Talles" },
  { href: "/contacto", label: "Contacto" },
];

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-16 px-6 pt-12 pb-8">
      <div className="max-w-5xl mx-auto">

        {/* Tres columnas */}
        <div className="flex flex-wrap justify-center gap-12 md:gap-20 mb-10 text-center sm:text-left">

          {/* Columna izquierda: marca */}
          <div className="flex flex-col gap-3 items-center sm:items-start">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <img src="/logo.png" alt="Camisetas Zeus" className="h-5 w-auto" />
              Camisetas Zeus
            </p>
            <a
              href="https://www.google.com/maps/place/La+Plata,+Buenos+Aires"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 text-sm hover:text-orange-400 transition-colors"
            >
              La Plata, Buenos Aires
            </a>
            <p className="text-gray-400 text-sm">Envíos a todo el país</p>
            <p className="text-gray-400 text-sm">Transferencia · Efectivo · Mercado Pago</p>
          </div>

          {/* Columna central: enlaces */}
          <div className="flex flex-col gap-3 items-center sm:items-start">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Enlaces</p>
            <ul className="flex flex-col gap-2">
              {enlaces.map((e) => (
                <li key={e.href}>
                  <Link href={e.href} className="text-sm text-gray-300 hover:text-orange-500 transition-colors">
                    {e.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna derecha: redes */}
          <div className="flex flex-col gap-3 items-center sm:items-start">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Seguinos</p>
            <a
              href="https://instagram.com/camisetaszeus"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-orange-400 transition-colors"
            >
              <FaInstagram className="text-xl" />
              @camisetaszeus
            </a>
            <a
              href="https://tiktok.com/@camisetaszeus8"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-orange-400 transition-colors"
            >
              <FaTiktok className="text-xl" />
              @camisetaszeus
            </a>
            <a
              href="https://wa.me/5492216220145"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-orange-400 transition-colors"
            >
              <FaWhatsapp className="text-xl" />
              +54 9 221 622 0145
            </a>
          </div>
        </div>

        {/* Barra inferior con línea divisora naranja */}
        <div className="border-t border-orange-500 pt-6 flex flex-col items-center gap-1 text-center">
          <p className="text-gray-400 text-xs">© 2026 Camisetas Zeus. Todos los derechos reservados.</p>
          <a href="https://instagram.com/alphasitess" target="_blank" rel="noopener noreferrer" className="text-gray-600 text-xs hover:text-orange-500 transition-colors">Sitio web desarrollado por AlphaSites</a>
        </div>

      </div>
    </footer>
  );
}
