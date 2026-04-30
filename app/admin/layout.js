"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaBoxOpen, FaTshirt, FaSignOutAlt, FaStar, FaClipboardList, FaCog } from "react-icons/fa";

// Script síncrono que se ejecuta al parsear el HTML, ANTES de que React
// hidrate y antes de que el navegador muestre el prompt de "instalar app".
// Cambia el manifest del sitio público al del admin y agrega los meta tags
// necesarios para "Agregar a pantalla de inicio" en iOS.
const PWA_ADMIN_INIT = `
(function(){
  try {
    var l = document.querySelector('link[rel="manifest"]');
    if (l) l.href = '/manifest-admin.json';
    function ensureMeta(name, content){
      if (document.querySelector('meta[name="'+name+'"]')) return;
      var m = document.createElement('meta');
      m.setAttribute('name', name);
      m.setAttribute('content', content);
      document.head.appendChild(m);
    }
    function ensureLink(rel, href){
      var existing = document.querySelector('link[rel="'+rel+'"]');
      if (existing) { existing.href = href; return; }
      var el = document.createElement('link');
      el.setAttribute('rel', rel);
      el.setAttribute('href', href);
      document.head.appendChild(el);
    }
    ensureMeta('apple-mobile-web-app-capable', 'yes');
    ensureMeta('apple-mobile-web-app-title', 'Zeus Admin');
    ensureMeta('apple-mobile-web-app-status-bar-style', 'black-translucent');
    ensureLink('apple-touch-icon', '/logo.png');
  } catch(e) {}
})();
`;

// Restaura el manifest del sitio cuando el usuario sale del panel admin
// (navegación interna de Next.js no recarga la página).
function usePwaAdminCleanup() {
  useEffect(() => {
    return () => {
      const manifest = document.head.querySelector('link[rel="manifest"]');
      if (manifest) manifest.setAttribute("href", "/manifest.json");
    };
  }, []);
}

const secciones = [
  { href: "/admin/stock",          label: "Stock",      icon: FaBoxOpen       },
  { href: "/admin/catalogo",       label: "Catálogo",   icon: FaTshirt        },
  { href: "/admin/especiales",     label: "Especiales", icon: FaStar          },
  { href: "/admin/pedidos",        label: "Pedidos",    icon: FaClipboardList },
  { href: "/admin/configuracion",  label: "Config",     icon: FaCog           },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router   = useRouter();

  usePwaAdminCleanup();

  if (pathname === "/admin") {
    return (
      <>
        <script dangerouslySetInnerHTML={{ __html: PWA_ADMIN_INIT }} />
        {children}
      </>
    );
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <script dangerouslySetInnerHTML={{ __html: PWA_ADMIN_INIT }} />
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-700 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Zeus" className="h-8" />
          <span className="text-white font-bold text-lg hidden sm:inline">Panel Zeus</span>
        </div>

        {/* Nav — desktop */}
        <nav className="hidden sm:flex items-center gap-2">
          {secciones.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith(href)
                  ? "bg-orange-500 text-black"
                  : "text-gray-300 hover:bg-zinc-800"
              }`}
            >
              <Icon />
              {label}
            </Link>
          ))}
        </nav>

        {/* Cerrar sesión — desktop */}
        <button
          onClick={handleLogout}
          className="hidden sm:flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-zinc-800"
        >
          <FaSignOutAlt />
          Salir
        </button>

        {/* Cerrar sesión — mobile (solo icono) */}
        <button
          onClick={handleLogout}
          className="sm:hidden flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-white hover:bg-zinc-800 transition-colors"
          aria-label="Cerrar sesión"
        >
          <FaSignOutAlt />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 pb-24 sm:pb-8">
        {children}
      </main>

      {/* Bottom nav — solo mobile */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-700 flex z-10">
        {secciones.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
              pathname.startsWith(href)
                ? "text-orange-500"
                : "text-gray-400"
            }`}
          >
            <Icon className="text-lg" />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
