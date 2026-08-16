"use client";

import ProductCard from "@/modules/products/components/ProductCard";
import { MOCK_PRODUCTS } from "@/lib/mock-products";
import { COLOR_PAPER } from "@/lib/design-tokens";

export default function ProductsPage() {
  return (
    <section
      className="layout-container page-top-offset"
      style={{
        paddingBottom: 64,
        backgroundColor: COLOR_PAPER,
        minHeight: "calc(100vh - 56px)",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-space-grotesk), sans-serif",
          fontSize: 30,
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        Our Bikes
      </h1>
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
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 24,
        }}
        className="product-grid"
      >
        {MOCK_PRODUCTS.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .product-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
