import type { Metadata, Viewport } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/modules/shared/components/Header";
import Footer from "@/modules/shared/components/Footer";
import CartProviderWrapper from "@/modules/shared/components/CartProviderWrapper";

const headingFont = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk", // retained for backward compatibility with inline styles
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "SEMY — Urban Electric Mobility",
  description: "SEMY electric bikes — built for India's roads. Book with just ₹5,000 advance.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${headingFont.variable} ${inter.variable}`}>
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
