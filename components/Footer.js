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
    <footer className="w-full bg-black text-white py-16">
      <div className="max-w-5xl mx-auto px-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start text-left">

          {/* Left column: brand */}
          <div className="flex flex-col gap-3 items-start">
            <div className="flex items-center gap-2 mb-1">
              <img src="/logo.png" alt="Camisetas Zeus" className="h-6 w-auto" />
              <span className="text-sm font-semibold uppercase tracking-widest text-gray-400">
                Camisetas Zeus
              </span>
            </div>
            <a
              href="https://www.google.com/maps/place/La+Plata,+Buenos+Aires"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm text-gray-400 hover:text-orange-400 transition-colors"
            >
              La Plata, Buenos Aires
            </a>
            <p className="text-sm text-gray-400">Envíos a todo el país</p>
            <p className="text-sm text-gray-400">Transferencia · Efectivo · Mercado Pago</p>
          </div>

          {/* Middle column: links */}
          <div className="flex flex-col gap-3 items-start">
            <p className="text-sm uppercase tracking-widest text-gray-400 mb-1">
              Enlaces
            </p>
            {enlaces.map((e) => (
              <Link
                key={e.href}
                href={e.href}
                className="inline-block text-sm text-gray-400 hover:text-orange-400 transition-colors"
              >
                {e.label}
              </Link>
            ))}
          </div>

          {/* Right column: social */}
          <div className="flex flex-col gap-3 items-start">
            <p className="text-sm uppercase tracking-widest text-gray-400 mb-1">
              Seguinos
            </p>
            <a
              href="https://instagram.com/camisetaszeus"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-orange-400 transition-colors"
            >
              <FaInstagram className="text-xl shrink-0" />
              @camisetaszeus
            </a>
            <a
              href="https://tiktok.com/@camisetaszeus8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-orange-400 transition-colors"
            >
              <FaTiktok className="text-xl shrink-0" />
              @camisetaszeus
            </a>
            <a
              href="https://wa.me/5492216220145"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-orange-400 transition-colors"
            >
              <FaWhatsapp className="text-xl shrink-0" />
              +54 9 221 622 0145
            </a>
          </div>

        </div>

        {/* Orange divider + bottom bar */}
        <div className="border-t border-orange-500 mt-12 pt-6 flex flex-col items-center gap-1 text-center">
          <p className="text-sm text-gray-400">© 2026 Camisetas Zeus</p>
          <a
            href="https://instagram.com/alphasitess"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs text-gray-600 hover:text-orange-400 transition-colors"
          >
            Sitio web desarrollado por AlphaSites
          </a>
        </div>

      </div>
    </footer>
  );
}
