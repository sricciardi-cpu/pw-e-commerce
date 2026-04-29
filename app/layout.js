import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProgressBar from "@/components/ProgressBar";
import { CartProvider } from "@/context/CartContext";

export const metadata = {
  title: "Camisetas Zeus",
  description: "Las mejores camisetas de rugby de Argentina",
  manifest: "/manifest.json",
  themeColor: "#f97316",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-black text-white antialiased">
        <CartProvider>
          <ProgressBar />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
