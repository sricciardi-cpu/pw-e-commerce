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
  // Cache de 1 ano para imagenes estaticas. Las URLs son inmutables (los
  // archivos no cambian bajo el mismo nombre), asi que el browser puede
  // cachearlas para siempre y no volver a pedirlas. Esto reduce los Edge
  // Requests de Vercel drasticamente.
  async headers() {
    return [
      {
        source: "/catalogo/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:all*(jpg|jpeg|png|webp|svg|ico|gif)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
