import Link from "next/link";
import productos from "@/data/productos";

function formatearPrecio(precio) {
  return "$" + precio.toLocaleString("es-AR");
}

// Badges en negro/naranja según deporte
const badgeDeporte = {
  futbol: "bg-black text-white",
  rugby:  "bg-orange-500 text-black",
};

// Valores de la marca para la sección Quiénes Somos
const valores = [
  { emoji: "🏉", titulo: "Pasión por el deporte", texto: "Vivimos el fútbol y el rugby desde adentro." },
  { emoji: "⚡", titulo: "Calidad garantizada",   texto: "Solo vendemos lo que nosotros mismos usaríamos." },
  { emoji: "📦", titulo: "Entrega rápida",         texto: "Stock disponible y envíos a todo el país." },
];

export default function HomePage() {
  const destacados = productos.slice(0, 4);

  return (
    <main>
      {/* Hero — Background ready for image or video */}
      <section className="w-full bg-black text-white min-h-[500px] flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl font-extrabold mb-4">Camisetas Zeus</h1>
        <p className="text-xl text-orange-500 font-semibold mb-8">
          Las mejores camisetas de fútbol y rugby de Argentina
        </p>
        <Link
          href="/catalogo"
          className="inline-block bg-orange-500 text-black font-semibold px-8 py-3 rounded-full hover:bg-orange-400 transition-colors"
        >
          Ver catálogo
        </Link>
      </section>

      {/* Contenido con contenedor centrado */}
      <div className="max-w-5xl mx-auto px-4 py-12">

      {/* Quiénes Somos */}
      <section className="bg-black rounded-2xl text-white p-10 mb-16">
        <h2 className="text-3xl font-extrabold mb-4">Quiénes Somos</h2>
        <p className="text-gray-300 mb-8 max-w-2xl">
          Camisetas Zeus nació en La Plata con una idea simple: acercar las mejores camisetas de fútbol y rugby
          a quienes realmente las viven. Somos un emprendimiento familiar que combina la pasión por el deporte
          con el compromiso de ofrecer productos de calidad a precios accesibles.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {valores.map((v) => (
            <div key={v.titulo} className="border border-gray-700 rounded-xl p-5">
              <span className="text-3xl">{v.emoji}</span>
              <h3 className="text-lg font-semibold mt-3 mb-1">{v.titulo}</h3>
              <p className="text-gray-400 text-sm">{v.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Productos destacados */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Productos destacados</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destacados.map((producto) => (
            <article
              key={producto.id}
              className="bg-white rounded-xl shadow-sm border border-black overflow-hidden flex flex-col"
            >
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="w-full object-cover"
              />

              <div className="p-4 flex flex-col flex-1 gap-2">
                {/* Badge de deporte */}
                <span className={`text-xs font-medium px-2 py-1 rounded-full self-start capitalize ${badgeDeporte[producto.deporte]}`}>
                  {producto.deporte === "futbol" ? "Fútbol" : "Rugby"}
                </span>

                <h3 className="font-semibold text-gray-900">{producto.nombre}</h3>

                <p className="text-orange-500 font-bold mt-auto">
                  {formatearPrecio(producto.precio)}
                </p>

                <Link
                  href="/catalogo"
                  className="block text-center bg-black text-white text-sm font-medium py-2 rounded-lg hover:bg-gray-800 transition-colors mt-2"
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
