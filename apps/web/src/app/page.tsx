"use client";

import { useEffect, useRef } from "react";
import ProductCard from "@/modules/products/components/ProductCard";
import AchievementsStrip from "@/modules/shared/components/AchievementsStrip";
import { MOCK_PRODUCTS } from "@/lib/mock-products";
import { COLOR_ASPHALT, COLOR_VOLT, COLOR_PAPER, COLOR_STEEL } from "@/lib/design-tokens";

// Placeholder achievement data — client will supply real numbers later
const ACHIEVEMENTS = [
  { value: "500+", label: "Bikes Delivered" },
  { value: "50+", label: "Campus Drives Completed" },
  { value: "25+", label: "Cities Served" },
  { value: "98%", label: "Customer Satisfaction" },
];

export default function Home() {
  const productGridRef = useRef<HTMLDivElement>(null);

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

  const scrollToProducts = () => {
    document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* ── Hero Section ────────────────────────────────────────────────── */}
      <section
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
        id="products-section"
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
    </>
  );
}
