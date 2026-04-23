"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/sale", label: "Sale" },
  { href: "/mystery-futbox", label: "Mystery Futbox" },
  { href: "/griptec-spray", label: "Griptec Spray" },
  { href: "/guia-de-talles", label: "Guía de Talles" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const { cantidadTotal } = useCart();
  const pathname = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <nav className="bg-black text-white sticky top-0 z-50">
      <div className="px-8 py-6 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold tracking-wide hover:text-orange-400 transition-colors"
        >
          <img src="/logo.png" alt="Camisetas Zeus" className="h-10 w-auto" />
          Camisetas Zeus
        </Link>

        {/* Desktop: links + carrito */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex gap-6 list-none">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-lg transition-colors ${
                    pathname === link.href
                      ? "text-orange-500 font-semibold"
                      : "text-white hover:text-orange-400"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/carrito" className="flex items-center gap-1 hover:text-orange-400 transition-colors">
            <span className="text-lg">🛒</span>
            <span className="bg-orange-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cantidadTotal}
            </span>
          </Link>
        </div>

        {/* Mobile: carrito + hamburger */}
        <div className="flex md:hidden items-center gap-4">
          <Link href="/carrito" className="flex items-center gap-1 hover:text-orange-400 transition-colors">
            <span className="text-lg">🛒</span>
            <span className="bg-orange-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cantidadTotal}
            </span>
          </Link>
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="text-2xl hover:text-orange-400 transition-colors"
            aria-label="Abrir menú"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuAbierto && (
        <div className="md:hidden bg-black w-full border-t border-gray-800">
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuAbierto(false)}
                  className={`block px-8 py-4 text-lg transition-colors ${
                    pathname === link.href
                      ? "text-orange-500 font-semibold"
                      : "text-white hover:text-orange-400"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
