import type { Metadata } from "next";
import { Quicksand, Pacifico, Caveat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Candies from "@/components/Candies";
import ClickBurst from "@/components/ClickBurst";

const quicksand = Quicksand({ variable: "--font-quicksand", subsets: ["latin"] });
const pacifico = Pacifico({ variable: "--font-pacifico", subsets: ["latin"], weight: "400" });
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "La Casa del Postre",
  description: "Tortas, cheesecakes, cuchareables y más. Postres que hacen la vida más dulce. Pide y paga con Yape.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${quicksand.variable} ${pacifico.variable} ${caveat.variable}`}>
      <body suppressHydrationWarning className="relative flex min-h-screen flex-col">
        <CartProvider>
          <Candies />
          <ClickBurst />
          <Header />
          <main className="relative z-10 flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
