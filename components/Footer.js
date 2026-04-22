import Link from "next/link";

const enlaces = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">

          {/* Columna izquierda: marca */}
          <div className="flex flex-col gap-3">
            <p className="text-xl font-bold flex items-center gap-2">
              <span>⚡</span> Camisetas Zeus
            </p>
            <p className="text-gray-400 text-sm">La Plata, Buenos Aires</p>
            <a
              href="https://wa.me/5492216220145"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 text-sm hover:underline"
            >
              💬 Escribinos por WhatsApp
            </a>
          </div>

          {/* Columna central: enlaces */}
          <div className="flex flex-col gap-3">
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
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Seguinos</p>
            <a
              href="https://instagram.com/camisetaszeus"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-300 hover:text-orange-500 transition-colors"
            >
              📸 Instagram @camisetaszeus
            </a>
            <a
              href="https://wa.me/5492216220145"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-300 hover:text-orange-500 transition-colors"
            >
              💬 +54 9 221 622 0145
            </a>
          </div>
        </div>

        {/* Barra inferior con línea divisora naranja */}
        <div className="border-t border-orange-500 pt-6 flex flex-col items-center gap-1 text-center">
          <p className="text-gray-400 text-xs">© 2026 Camisetas Zeus. Todos los derechos reservados.</p>
          <p className="text-gray-600 text-xs">Sitio web desarrollado por AlphaSites</p>
        </div>

      </div>
    </footer>
  );
}
