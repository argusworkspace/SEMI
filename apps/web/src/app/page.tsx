"use client";

import { useEffect, useRef, useState } from "react";
import ProductCard from "@/modules/products/components/ProductCard";
import AchievementsStrip from "@/modules/shared/components/AchievementsStrip";
import { MOCK_PRODUCTS } from "@/lib/mock-products";
import { COLOR_ASPHALT, COLOR_VOLT, COLOR_PAPER, COLOR_STEEL, COLOR_HAIRLINE } from "@/lib/design-tokens";

// Placeholder achievement data — client will supply real numbers later
const ACHIEVEMENTS = [
  { value: "500+", label: "Bikes Delivered" },
  { value: "50+", label: "Campus Drives Completed" },
  { value: "25+", label: "Cities Served" },
  { value: "98%", label: "Customer Satisfaction" },
];

export default function Home() {
  const productGridRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const cards = productGridRef.current?.querySelectorAll(".product-card-wrapper");
    if (!cards || cards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute("data-index") || "0");
            setTimeout(() => {
              entry.target.classList.add("visible");
            }, index * 80); // 80ms stagger
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  // Handle hash changes for section navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || "home";
      setActiveSection(hash);
      
      // Scroll to section
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    };

    handleHashChange(); // Initial load
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const scrollToProducts = () => {
    window.location.hash = "products";
  };

  return (
    <>
      {/* ── Hero Section ────────────────────────────────────────────────── */}
      <section
        id="home"
        style={{
          backgroundColor: COLOR_ASPHALT,
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 20px",
          position: "relative",
          overflow: "hidden",
        }}
        className="hero-section"
      >
        <div
          style={{
            maxWidth: "1200px",
            width: "100%",
            textAlign: "center",
            animation: "heroFadeSlideUp 0.8s ease-out forwards",
            opacity: 0,
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: "clamp(32px, 8vw, 64px)",
              fontWeight: 700,
              color: "#FFFFFF",
              marginBottom: 20,
              lineHeight: 1.1,
              padding: "0 10px",
            }}
          >
            Urban mobility, reimagined
            <br />
            for Indian roads.
          </h1>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "clamp(15px, 4vw, 20px)",
              color: COLOR_STEEL,
              marginBottom: 32,
              maxWidth: "600px",
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: 1.6,
              padding: "0 10px",
            }}
          >
            Electric bikes built for power, range, and everyday reliability.
            Book yours with just ₹5,000 advance.
          </p>
          <button
            onClick={scrollToProducts}
            style={{
              backgroundColor: COLOR_VOLT,
              color: COLOR_ASPHALT,
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: 16,
              fontWeight: 700,
              padding: "16px 40px",
              border: "none",
              borderRadius: 2,
              cursor: "pointer",
              transition: "transform 150ms ease, opacity 150ms ease",
              width: "auto",
              maxWidth: "100%",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
            className="hero-cta"
          >
            Explore Our Bikes
          </button>
        </div>

        <style jsx>{`
          @keyframes heroFadeSlideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (max-width: 640px) {
            .hero-cta {
              width: 100% !important;
              padding: 18px 24px !important;
            }
          }
        `}</style>
      </section>

      {/* ── Achievements Section ────────────────────────────────────────── */}
      <AchievementsStrip achievements={ACHIEVEMENTS} />

      {/* ── Products Section ────────────────────────────────────────────── */}
      <section
        id="products"
        className="layout-container"
        style={{
          paddingTop: 80,
          paddingBottom: 64,
          backgroundColor: COLOR_PAPER,
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontSize: 30,
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          Our Bikes
        </h2>
        <p
          style={{
            fontSize: 15,
            color: "#5B6470",
            marginBottom: 36,
            fontFamily: "var(--font-inter), sans-serif",
          }}
        >
          Reserve yours with a{" "}
          <strong style={{ color: "#1C1F22" }}>₹5,000 advance</strong> — balance
          collected on delivery.
        </p>

        <div
          ref={productGridRef}
          id="product-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 24,
          }}
          className="product-grid"
        >
          {MOCK_PRODUCTS.map((p, index) => (
            <div
              key={p.id}
              className="product-card-wrapper"
              data-index={index}
              style={{
                opacity: 0,
                transform: "translateY(20px)",
                transition: "opacity 0.6s ease, transform 0.6s ease",
              }}
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>

        <style jsx>{`
          :global(.product-card-wrapper.visible) {
            opacity: 1 !important;
            transform: translateY(0) !important;
          }

          @media (max-width: 640px) {
            .product-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>

      {/* ── Manufacturing Section ───────────────────────────────────────── */}
      <section
        id="manufacturing"
        style={{
          backgroundColor: COLOR_ASPHALT,
          padding: "80px 20px 60px",
        }}
      >
        <div className="layout-container">
          <h2
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: 700,
              color: "#FFFFFF",
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            Manufacturing Excellence
          </h2>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "clamp(14px, 3vw, 18px)",
              color: COLOR_STEEL,
              maxWidth: "600px",
              margin: "0 auto 48px",
              textAlign: "center",
              lineHeight: 1.6,
              padding: "0 10px",
            }}
          >
            Built with precision, tested for durability. Every SEMY bike is
            engineered to handle Indian road conditions.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}
            className="manufacturing-cards"
          >
            {[
              {
                title: "Frame Welding",
                description:
                  "High-strength steel frames welded using automated jigs for perfect alignment and durability.",
              },
              {
                title: "Component Integration",
                description:
                  "Battery, motor, and electronics integrated with strict quality checks at each stage.",
              },
              {
                title: "Road Testing",
                description:
                  "Every bike undergoes real-world testing on various terrains before shipment.",
              },
            ].map((step) => (
              <div
                key={step.title}
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: `1px solid rgba(255,255,255,0.1)`,
                  borderRadius: 2,
                  padding: 24,
                  transition: "border-color 150ms ease, background-color 150ms ease",
                  minHeight: "44px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = COLOR_VOLT;
                  e.currentTarget.style.backgroundColor = "rgba(200,241,53,0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: COLOR_VOLT,
                    marginBottom: 12,
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: 14,
                    color: COLOR_PAPER,
                    lineHeight: 1.6,
                    margin: 0,
                    opacity: 0.8,
                  }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <style jsx>{`
          @media (max-width: 640px) {
            .manufacturing-cards {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>

      {/* ── About Section ───────────────────────────────────────────────── */}
      <section
        id="about"
        className="layout-container"
        style={{
          paddingTop: 80,
          paddingBottom: 80,
          backgroundColor: COLOR_PAPER,
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontSize: 28,
            fontWeight: 700,
            color: COLOR_ASPHALT,
            marginBottom: 48,
            textAlign: "center",
          }}
        >
          About SEMY
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 32,
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          {[
            {
              label: "Mission",
              title: "Accessible Electric Mobility",
              description:
                "Make electric two-wheelers affordable, reliable, and practical for every Indian commuter.",
            },
            {
              label: "Vision",
              title: "Cleaner, Smarter Cities",
              description:
                "Lead India's transition to sustainable urban transport through innovation and quality.",
            },
            {
              label: "Values",
              title: "Built to Last",
              description:
                "Honest pricing, customer-first service, and products designed for durability. Made in India 🇮🇳",
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                backgroundColor: "#FFFFFF",
                border: `1px solid ${COLOR_HAIRLINE}`,
                borderRadius: 2,
                padding: 32,
                transition: "border-color 150ms ease, transform 150ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = COLOR_VOLT;
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = COLOR_HAIRLINE;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  backgroundColor: COLOR_VOLT,
                  padding: "6px 12px",
                  borderRadius: 2,
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: COLOR_ASPHALT,
                  marginBottom: 16,
                }}
              >
                {item.label}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: COLOR_ASPHALT,
                  marginBottom: 12,
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 14,
                  color: COLOR_STEEL,
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact Section ─────────────────────────────────────────────── */}
      <section
        id="contact"
        style={{
          backgroundColor: COLOR_ASPHALT,
          padding: "80px 20px",
        }}
      >
        <div className="layout-container">
          <h2
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: 700,
              color: "#FFFFFF",
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            Get in Touch
          </h2>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "clamp(15px, 2vw, 18px)",
              color: COLOR_STEEL,
              maxWidth: "600px",
              margin: "0 auto 48px",
              textAlign: "center",
            }}
          >
            Questions about our bikes? Ready to book? We're here to help.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
              maxWidth: "900px",
              margin: "0 auto",
            }}
          >
            {[
              {
                label: "Phone",
                value: "+91 73581 10762",
                href: "tel:+917358110762",
                note: "Mon–Sat, 9 AM – 6 PM IST",
              },
              {
                label: "Email",
                value: "hello@semy.in",
                href: "mailto:hello@semy.in",
                note: "We'll respond within 24 hours",
              },
              {
                label: "WhatsApp",
                value: "Message Us ↗",
                href: "https://wa.me/917358110762",
                note: "Quick replies during business hours",
                external: true,
              },
            ].map((contact) => (
              <a
                key={contact.label}
                href={contact.href}
                target={contact.external ? "_blank" : undefined}
                rel={contact.external ? "noopener noreferrer" : undefined}
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: `1px solid rgba(255,255,255,0.1)`,
                  borderRadius: 2,
                  padding: 32,
                  textDecoration: "none",
                  display: "block",
                  transition: "border-color 150ms ease, background-color 150ms ease, transform 150ms ease",
                  minHeight: "44px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = COLOR_VOLT;
                  e.currentTarget.style.backgroundColor = "rgba(200,241,53,0.05)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: COLOR_VOLT,
                    marginBottom: 12,
                  }}
                >
                  {contact.label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontSize: 20,
                    fontWeight: 700,
                    color: COLOR_PAPER,
                    marginBottom: 8,
                  }}
                >
                  {contact.value}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: 14,
                    color: COLOR_STEEL,
                  }}
                >
                  {contact.note}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
