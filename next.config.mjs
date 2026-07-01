/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permite cargar imágenes desde via.placeholder.com
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "via.placeholder.com" },
      { protocol: "https", hostname: "tqpsuwbktcdoohzxjgdw.supabase.co" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
    // Desactivar totalmente la optimización de Vercel para no consumir
    // transformaciones (free tier: 5K/mes). Las imagenes ya estan
    // pre-optimizadas en origen (WebP/JPG comprimido).
    unoptimized: true,
  },
  // Cache de 1 año SOLO para archivos de imagen (por extensión). Sus URLs
  // son inmutables (nombre único), así que el browser las cachea sin volver
  // a pedirlas, reduciendo Edge Requests. NO cacheamos rutas como
  // /catalogo/[id] (eso congelaba páginas viejas).
  async headers() {
    return [
      {
        source: "/:all*(jpg|jpeg|png|webp|svg|ico|gif|avif)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
