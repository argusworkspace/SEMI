/**
 * Home page — renders product grid for end-to-end Pay Advance flow testing.
 * Replace with the real landing page in a subsequent prompt.
 */
import ProductCard from "@/components/products/ProductCard";
import { MOCK_PRODUCTS } from "@/lib/mock-products";

export default function Home() {
  return (
    <section className="layout-container" style={{ paddingTop: 48, paddingBottom: 64 }}>
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
        <strong style={{ color: "#1C1F22" }}>₹2,000 advance</strong> — balance
        collected on delivery.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 24,
        }}
      >
        {MOCK_PRODUCTS.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
