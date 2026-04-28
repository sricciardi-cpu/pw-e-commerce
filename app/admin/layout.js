"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaBoxOpen, FaTshirt, FaSignOutAlt, FaStar } from "react-icons/fa";

const secciones = [
  { href: "/admin/stock",      label: "Stock",      icon: FaBoxOpen },
  { href: "/admin/catalogo",   label: "Catálogo",   icon: FaTshirt  },
  { href: "/admin/especiales", label: "Especiales", icon: FaStar    },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router   = useRouter();

  // Login page uses its own full-screen layout
  if (pathname === "/admin") return <>{children}</>;

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Zeus" className="h-8" />
          <span className="text-white font-bold text-lg hidden sm:inline">Panel Zeus</span>
        </div>

        <nav className="flex items-center gap-2">
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

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-zinc-800"
        >
          <FaSignOutAlt />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
