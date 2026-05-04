import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProgressBar from "@/components/ProgressBar";
import MetaPixel from "@/components/MetaPixel";
import { CartProvider } from "@/context/CartContext";

export const metadata = {
  title: "Camisetas Zeus",
  description: "Las mejores camisetas de rugby de Argentina",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export const viewport = {
  themeColor: "#f97316",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-black text-white antialiased">
        <MetaPixel />
        <CartProvider>
          <ProgressBar />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </CartProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
