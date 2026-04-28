"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import {
  FaHome,
  FaTshirt,
  FaBox,
  FaSprayCan,
  FaRuler,
  FaEnvelope,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaStore,
} from "react-icons/fa";

const links = [
  { href: "/",               label: "Inicio",          icon: FaHome },
  { href: "/catalogo",       label: "Catálogo",        icon: FaTshirt },
  { href: "/stock",          label: "Stock",           icon: FaStore },
  { href: "/mystery-futbox", label: "Mystery Futbox",  icon: FaBox },
  { href: "/griptec-spray",  label: "Griptec Spray",   icon: FaSprayCan },
  { href: "/guia-de-talles", label: "Guía de Talles",  icon: FaRuler },
  { href: "/contacto",       label: "Contacto",        icon: FaEnvelope },
];

export default function Navbar() {
  const { cantidadTotal } = useCart();
  const pathname = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [pop, setPop] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);
  const prevCantidad = useRef(cantidadTotal);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 0);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAbierto(false);
      }
    }
    if (menuAbierto) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [menuAbierto]);

  useEffect(() => {
    if (cantidadTotal > prevCantidad.current) {
      setPop(true);
      const t = setTimeout(() => setPop(false), 300);
      prevCantidad.current = cantidadTotal;
      return () => clearTimeout(t);
    }
    prevCantidad.current = cantidadTotal;
  }, [cantidadTotal]);

  // Close menu on route change
  useEffect(() => {
    setMenuAbierto(false);
  }, [pathname]);

  return (
    <nav className={`text-white sticky top-0 z-50 transition-all duration-300 ${scrolled || menuAbierto ? "bg-black" : "bg-transparent"}`} ref={menuRef}>
      <div className="px-4 md:px-8 py-4 md:py-6 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl md:text-2xl font-bold tracking-wide hover:text-orange-400 transition-colors"
        >
          <img src="/logo.png" alt="Camisetas Zeus" className="h-9 md:h-10 w-auto" />
          <span className="hidden sm:inline">Camisetas Zeus</span>
        </Link>

        {/* Desktop: links + carrito */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex gap-6 list-none">
            {links.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`text-lg transition-colors ${
                    pathname === href
                      ? "text-orange-500 font-semibold"
                      : "text-white hover:text-orange-400"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/carrito" className="flex items-center gap-1.5 hover:text-orange-400 transition-colors">
            <FaShoppingCart className="text-xl" />
            <span className={`bg-orange-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center transition-transform duration-150 ${pop ? "scale-150" : "scale-100"}`}>
              {cantidadTotal}
            </span>
          </Link>
        </div>

        {/* Mobile: carrito + hamburger */}
        <div className="flex md:hidden items-center gap-4">
          <Link href="/carrito" className="flex items-center gap-1.5 hover:text-orange-400 transition-colors">
            <FaShoppingCart className="text-xl" />
            <span className={`bg-orange-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center transition-transform duration-150 ${pop ? "scale-150" : "scale-100"}`}>
              {cantidadTotal}
            </span>
          </Link>
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="text-2xl hover:text-orange-400 transition-colors p-1"
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
          >
            {menuAbierto ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown con animación */}
      <div
        className={`md:hidden bg-black w-full border-t border-gray-800 overflow-hidden transition-all duration-300 ease-in-out ${
          menuAbierto ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col py-2">
          {links.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className={`flex items-center gap-3 px-6 py-4 text-lg transition-colors active:bg-gray-900 ${
                  pathname === href
                    ? "text-orange-500 font-semibold bg-gray-900"
                    : "text-white hover:text-orange-400 hover:bg-gray-900"
                }`}
              >
                <Icon className="text-xl shrink-0" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
