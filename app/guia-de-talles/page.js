import FadeIn from "@/components/FadeIn";

const thClass = "px-4 py-3 text-left text-sm font-semibold text-white bg-zinc-800";
const tdClass = "px-4 py-3 text-sm text-gray-300";
const trEven  = "bg-zinc-900";
const trOdd   = "bg-zinc-800/50";

const rugby = [
  { talle: "S",   hombros: 45, pecho: 52, largo: 71, manga: 36.5 },
  { talle: "M",   hombros: 47, pecho: 54, largo: 73, manga: 38.5 },
  { talle: "L",   hombros: 49, pecho: 56, largo: 75, manga: 40.5 },
  { talle: "XL",  hombros: 51, pecho: 58, largo: 77, manga: 42.5 },
  { talle: "2XL", hombros: 53, pecho: 60, largo: 79, manga: 44.5 },
  { talle: "3XL", hombros: 55, pecho: 62, largo: 81, manga: 46.5 },
  { talle: "4XL", hombros: 57, pecho: 64, largo: 83, manga: 48.5 },
  { talle: "5XL", hombros: 59, pecho: 66, largo: 85, manga: 50.5 },
];

export default function GuiaDeTallesPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <FadeIn>
        <h1 className="text-3xl font-extrabold mb-2 text-white">Guía de Talles</h1>
        <p className="text-gray-300 mb-10">
          Todas las medidas están expresadas en centímetros. Si tenés dudas, consultanos por WhatsApp.
        </p>
      </FadeIn>

      {/* Sección 1: Rugby */}
      <FadeIn delay={80}>
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4 border-l-4 border-orange-500 pl-3 text-white">
          Camisetas de Rugby
        </h2>
        <div className="overflow-x-auto rounded-xl border border-zinc-700">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={thClass}>Talle</th>
                <th className={thClass}>Ancho hombros (cm)</th>
                <th className={thClass}>Ancho pecho (cm)</th>
                <th className={thClass}>Largo (cm)</th>
                <th className={thClass}>Manga (cm)</th>
              </tr>
            </thead>
            <tbody>
              {rugby.map((row, i) => (
                <tr key={row.talle} className={i % 2 === 0 ? trEven : trOdd}>
                  <td className={`${tdClass} font-semibold text-white`}>{row.talle}</td>
                  <td className={tdClass}>{row.hombros}</td>
                  <td className={tdClass}>{row.pecho}</td>
                  <td className={tdClass}>{row.largo}</td>
                  <td className={tdClass}>{row.manga}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      </FadeIn>
    </main>
  );
}
