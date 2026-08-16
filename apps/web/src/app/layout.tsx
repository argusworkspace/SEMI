import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/modules/shared/components/Header";
import Footer from "@/modules/shared/components/Footer";
import CartProviderWrapper from "@/modules/shared/components/CartProviderWrapper";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SEMY — Urban Electric Mobility",
  description: "SEMY electric bikes — built for India's roads. Book with just ₹5,000 advance.",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body
        className="antialiased flex flex-col min-h-screen"
        style={{ backgroundColor: "#F7F3EE", color: "#0F1B2D" }}
      >
        <CartProviderWrapper>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProviderWrapper>
      </body>
    </html>
  );
}
