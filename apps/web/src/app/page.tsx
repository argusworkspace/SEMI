import Link from "next/link";
import ProductCard from "@/modules/products/components/ProductCard";
import { MOCK_PRODUCTS } from "@/lib/mock-products";
import FadeIn from "@/modules/shared/components/FadeIn";
import {
  COLOR_ASPHALT,
  COLOR_PAPER,
  COLOR_VOLT,
  COLOR_AMBER,
  COLOR_STEEL,
  COLOR_HAIRLINE,
} from "@/lib/design-tokens";

// ── Icons for the Feature Strip ───────────────────────────────────────────────
const IconLeaf = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

const IconCpu = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
    <rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="4" />
    <line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" />
    <line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" />
    <line x1="20" y1="14" x2="23" y2="14" />
    <line x1="1" y1="9" x2="4" y2="9" />
    <line x1="1" y1="14" x2="4" y2="14" />
  </svg>
);

const IconShield = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export default function Home() {
  return (
    <>
      {/* ── 1. Hero Section (Split Layout) ─────────────────────────────────── */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          // Approx height to fill viewport below header on desktop
          minHeight: "calc(100vh - 72px)",
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
          }}
          className="md:flex-row" // Tailwind utility for desktop row layout
        >
          {/* Left: Copy & CTAs (Asphalt) */}
          <div
            style={{
              flex: 1,
              backgroundColor: COLOR_ASPHALT,
              color: COLOR_PAPER,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "64px 8%",
            }}
          >
            <FadeIn>
              <h1
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: 48,
                  lineHeight: 1.1,
                  fontWeight: 700,
                  marginBottom: 24,
                  maxWidth: 600,
                }}
              >
                Urban Mobility, Reimagined
              </h1>
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 18,
                  lineHeight: 1.5,
                  opacity: 0.8,
                  marginBottom: 40,
                  maxWidth: 480,
                }}
              >
                Built tough, designed sharp — electric two-wheelers that earn
                their keep every kilometre.
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 16,
                }}
              >
                <Link
                  href="#our-bikes"
                  style={{
                    backgroundColor: COLOR_VOLT,
                    color: COLOR_ASPHALT,
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontSize: 15,
                    fontWeight: 700,
                    padding: "14px 28px",
                    textDecoration: "none",
                    borderRadius: 2,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "opacity 150ms ease",
                  }}
                  className="hover:opacity-90"
                >
                  Explore Our Range
                </Link>
                <Link
                  href="#our-bikes"
                  style={{
                    backgroundColor: "transparent",
                    color: COLOR_AMBER,
                    border: `1px solid ${COLOR_AMBER}`,
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: 15,
                    fontWeight: 500,
                    padding: "14px 28px",
                    textDecoration: "none",
                    borderRadius: 2,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background-color 150ms ease",
                  }}
                  className="hover:bg-[rgba(232,119,46,0.08)]"
                >
                  Book with ₹2,000 Advance
                </Link>
              </div>
            </FadeIn>
          </div>

          {/* Right: Full-height Product Image */}
          <div
            style={{
              flex: 1,
              backgroundColor: "#F0EEE9",
              position: "relative",
              minHeight: "45vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/products/xpro.png"
              alt="SEMY Xpro"
              style={{
                width: "100%",
                height: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>
        </div>
      </section>

      {/* ── 2. Feature Strip ─────────────────────────────────────────────────── */}
      <section
        style={{
          borderBottom: `1px solid ${COLOR_HAIRLINE}`,
          backgroundColor: COLOR_PAPER,
        }}
      >
        <div className="layout-container">
          <div
            style={{
              display: "grid",
              // Use tailwind classes for grid responsiveness
              gridTemplateColumns: "repeat(1, 1fr)",
            }}
            className="md:grid-cols-3"
          >
            {[
              {
                icon: <IconLeaf />,
                title: "Eco-Friendly",
                caption: "Zero emissions, silent operation, and high-efficiency battery tech.",
              },
              {
                icon: <IconCpu />,
                title: "Advanced Manufacturing",
                caption: "Precision-engineered frames and intelligent powertrain management.",
              },
              {
                icon: <IconShield />,
                title: "Premium Quality",
                caption: "Rigorous testing and high-grade materials for lasting durability.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                style={{
                  padding: "48px 32px",
                  borderBottom: `1px solid ${COLOR_HAIRLINE}`,
                }}
                className="md:border-b-0 md:border-r last:border-r-0 md:border-[var(--color-hairline)]"
              >
                <FadeIn delay={i * 100}>
                  <div
                    style={{
                      color: COLOR_STEEL,
                      marginBottom: 16,
                    }}
                  >
                    {feature.icon}
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-space-grotesk), sans-serif",
                      fontSize: 18,
                      fontWeight: 700,
                      color: COLOR_ASPHALT,
                      marginBottom: 8,
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: 14,
                      lineHeight: 1.5,
                      color: COLOR_STEEL,
                      margin: 0,
                    }}
                  >
                    {feature.caption}
                  </p>
                </FadeIn>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Featured Range ────────────────────────────────────────────────── */}
      <section id="our-bikes" style={{ backgroundColor: COLOR_PAPER, padding: "96px 0" }}>
        <div className="layout-container">
          <FadeIn>
            <h2
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: 32,
                fontWeight: 700,
                color: COLOR_ASPHALT,
                marginBottom: 12,
              }}
            >
              Our Featured Range
            </h2>
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 16,
                color: COLOR_STEEL,
                marginBottom: 48,
              }}
            >
              Built to perform. Designed to endure.
            </p>
          </FadeIn>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 32,
            }}
          >
            {MOCK_PRODUCTS.map((p, i) => (
              <FadeIn key={p.id} delay={i * 150}>
                <ProductCard product={p} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Advance Payment, Simply ───────────────────────────────────────── */}
      <section
        style={{
          borderTop: `1px solid ${COLOR_HAIRLINE}`,
          backgroundColor: COLOR_PAPER,
          padding: "96px 0",
        }}
      >
        <div className="layout-container">
          <FadeIn>
            <div style={{ maxWidth: 800 }}>
              <h2
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: 32,
                  fontWeight: 700,
                  color: COLOR_ASPHALT,
                  marginBottom: 12,
                }}
              >
                Advance Payment, Simply
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 16,
                  color: COLOR_STEEL,
                  marginBottom: 48,
                }}
              >
                Reserve your ride today without the hassle.
              </p>
            </div>
          </FadeIn>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(1, 1fr)",
              gap: 40,
            }}
            className="md:grid-cols-3"
          >
            {[
              {
                step: "1. Reserve",
                title: "Pay a small advance",
                desc: "A fully refundable ₹2,000 advance secures your booking instantly.",
              },
              {
                step: "2. Confirm",
                title: "We call you",
                desc: "Our team contacts you within 24 hours to confirm colour and delivery slot.",
              },
              {
                step: "3. Complete",
                title: "Pay on delivery",
                desc: "The remaining balance is collected in cash or UPI when your bike arrives.",
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: COLOR_VOLT,
                      marginBottom: 12,
                      display: "inline-block",
                      padding: "4px 8px",
                      backgroundColor: COLOR_ASPHALT,
                      alignSelf: "flex-start",
                      borderRadius: 2,
                    }}
                  >
                    {item.step}
                  </span>
                  <h3
                    style={{
                      fontFamily: "var(--font-space-grotesk), sans-serif",
                      fontSize: 20,
                      fontWeight: 700,
                      color: COLOR_ASPHALT,
                      marginBottom: 10,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: 15,
                      lineHeight: 1.6,
                      color: COLOR_STEEL,
                      margin: 0,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
