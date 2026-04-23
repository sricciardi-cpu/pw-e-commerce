"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

// Links de navegación del sitio
const links = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/sale", label: "Sale 🔥" },
  { href: "/mystery-futbox", label: "Mystery Futbox" },
  { href: "/griptec-spray", label: "Griptec Spray" },
  { href: "/guia-de-talles", label: "Guía de Talles" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const { cantidadTotal } = useCart();

  return (
    <nav className="bg-black text-white px-8 py-5 sticky top-0 z-50">
      <div className="max-w-full px-8 flex items-center justify-between">
        {/* Logo y nombre de la tienda */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-wide hover:text-orange-500 transition-colors">
          <span>⚡</span>
          Camisetas Zeus
        </Link>

        {/* Links de navegación + carrito */}
        <div className="flex items-center gap-6">
          <ul className="flex gap-6 list-none">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-base font-medium hover:text-orange-500 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Ícono del carrito con contador real desde el contexto */}
          <Link href="/carrito" className="flex items-center gap-1 hover:text-orange-500 transition-colors">
            <span className="text-lg">🛒</span>
            <span className="bg-orange-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cantidadTotal}
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
