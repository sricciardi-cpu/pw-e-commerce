/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permite cargar imágenes desde via.placeholder.com
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "via.placeholder.com" },
      { protocol: "https", hostname: "tqpsuwbktcdoohzxjgdw.supabase.co" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
};

export default nextConfig;
