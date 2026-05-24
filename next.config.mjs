/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permite cargar imágenes desde via.placeholder.com
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "via.placeholder.com" },
      { protocol: "https", hostname: "tqpsuwbktcdoohzxjgdw.supabase.co" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
    // Limitar tamaños generados para ahorrar transformaciones en Vercel
    // (free tier: 5K/mes). Cubrimos mobile, tablet, desktop con solo 3 anchos.
    deviceSizes: [640, 1080, 1920],
    imageSizes: [64, 128, 256],
    // Cache de 30 dias para no re-optimizar las mismas imagenes
    minimumCacheTTL: 2592000,
  },
};

export default nextConfig;
