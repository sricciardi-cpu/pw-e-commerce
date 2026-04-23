import Link from "next/link";
import productos from "@/data/productos";

function formatearPrecio(precio) {
  return "$" + precio.toLocaleString("es-AR");
}

const badgeDeporte = {
  futbol: "bg-black text-white",
  rugby:  "bg-orange-500 text-black",
};

const valores = [
  { emoji: "🏉", titulo: "Pasión por el deporte", texto: "Vivimos el rugby desde adentro." },
  { emoji: "⚡", titulo: "Calidad garantizada",   texto: "Solo vendemos lo que nosotros mismos usaríamos." },
  { emoji: "📦", titulo: "Entrega rápida",         texto: "Stock disponible y envíos a todo el país." },
];

export default function HomePage() {
  const destacados = productos.slice(0, 4);

  return (
    <main>
      {/* Hero */}
      <section className="w-full bg-black text-white min-h-[60vh] md:min-h-[500px] flex flex-col items-center justify-center text-center px-6 py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">Camisetas Zeus</h1>
        <p className="text-lg md:text-xl text-orange-500 font-semibold mb-10 max-w-xs md:max-w-none">
          Las mejores camisetas de rugby de Argentina
        </p>
        <Link
          href="/catalogo"
          className="inline-block bg-orange-500 text-black font-bold px-10 py-4 rounded-full text-lg hover:bg-orange-400 transition-colors active:scale-95 shadow-lg shadow-orange-500/30"
        >
          Ver catálogo
        </Link>
      </section>

      {/* Contenido */}
      <div className="max-w-5xl mx-auto px-4 py-10 md:py-12">

        {/* Quiénes Somos */}
        <section className="bg-black rounded-2xl text-white p-6 md:p-10 mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4">Quiénes Somos</h2>
          <p className="text-gray-300 mb-8 max-w-2xl text-sm md:text-base leading-relaxed">
            Camisetas Zeus nació en La Plata con una idea simple: acercar las mejores camisetas de rugby
            a quienes realmente las viven. Somos un emprendimiento que combina la pasión por el deporte
            con el compromiso de ofrecer productos de calidad a precios accesibles.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {valores.map((v) => (
              <div key={v.titulo} className="border border-gray-700 rounded-xl p-5">
                <span className="text-3xl">{v.emoji}</span>
                <h3 className="text-base md:text-lg font-semibold mt-3 mb-1">{v.titulo}</h3>
                <p className="text-gray-400 text-sm">{v.texto}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Productos destacados */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl font-bold mb-6">Productos destacados</h2>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {destacados.map((producto) => (
              <article
                key={producto.id}
                className="bg-white rounded-xl shadow-sm border border-black overflow-hidden flex flex-col"
              >
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="w-full object-cover"
                  loading="lazy"
                />

                <div className="p-3 md:p-4 flex flex-col flex-1 gap-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full self-start capitalize ${badgeDeporte[producto.deporte]}`}>
                    {producto.deporte === "futbol" ? "Fútbol" : "Rugby"}
                  </span>

                  <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-tight">{producto.nombre}</h3>

                  <p className="text-orange-500 font-bold mt-auto text-sm md:text-base">
                    {formatearPrecio(producto.precio)}
                  </p>

                  <Link
                    href="/catalogo"
                    className="block text-center bg-black text-white text-sm font-medium py-2.5 rounded-lg hover:bg-gray-800 transition-colors mt-1 active:scale-95"
                  >
                    Ver en catálogo
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
