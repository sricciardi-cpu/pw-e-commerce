/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permite cargar imágenes desde via.placeholder.com
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "via.placeholder.com" },
      { protocol: "https", hostname: "tqpsuwbktcdoohzxjgdw.supabase.co" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
    // Desactivar totalmente la optimización de Vercel para no consumir
    // transformaciones (free tier: 5K/mes). Las imagenes ya estan
    // pre-optimizadas en origen (WebP/JPG comprimido).
    unoptimized: true,
  },
};

export default nextConfig;
