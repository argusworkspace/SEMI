import type { Metadata, Viewport } from "next";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "./globals.css";
import Header from "@/modules/shared/components/Header";
import Footer from "@/modules/shared/components/Footer";
import CartProviderWrapper from "@/modules/shared/components/CartProviderWrapper";

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
    <html lang="en">
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
