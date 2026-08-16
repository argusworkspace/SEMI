"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/types/product";
import PayAdvanceModal from "@/modules/products/components/PayAdvanceModal";
import {
  COLOR_ASPHALT,
  COLOR_PAPER,
  COLOR_VOLT,
  COLOR_AMBER,
  COLOR_STEEL,
  COLOR_HAIRLINE,
} from "@/lib/design-tokens";

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export default function ProductCard({ product }: { product: Product }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* ── Card ────────────────────────────────────────────────────────── */}
      <article
        style={{
          border: `1px solid ${COLOR_HAIRLINE}`,
          borderRadius: 2,
          backgroundColor: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        aria-label={`${product.name} product card`}
      >
        {/* Image placeholder */}
        <div
          style={{
            backgroundColor: "#F0EEE9",
            height: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{ maxHeight: 180, objectFit: "contain" }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          {/* Stock badge */}
          <span
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "3px 8px",
              borderRadius: 2,
              backgroundColor: product.inStock ? "rgba(200,241,53,0.15)" : "rgba(200,200,200,0.2)",
              color: product.inStock ? "#5a8a00" : COLOR_STEEL,
              border: `1px solid ${product.inStock ? "rgba(200,241,53,0.4)" : COLOR_HAIRLINE}`,
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 20px 0", flex: 1 }}>
          {/* Name — links to detail page */}
          <h3 style={{ margin: "0 0 14px" }}>
            <Link
              href={`/products/${product.id}`}
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: 20,
                fontWeight: 700,
                color: COLOR_ASPHALT,
                textDecoration: "none",
                display: "block",
              }}
            >
              {product.name}
            </Link>
          </h3>

          {/* Spec grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", marginBottom: 16 }}>
            {[
              ["Battery", product.battery],
              ["Motor", product.motor],
              ["Range", `${product.rangeKm} km`],
              ["Top Speed", `${product.topSpeedKmph} km/h`],
            ].map(([k, v]) => (
              <div key={k}>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: COLOR_STEEL,
                    margin: "0 0 2px",
                    fontFamily: "var(--font-inter), sans-serif",
                  }}
                >
                  {k}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: COLOR_ASPHALT,
                    margin: 0,
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                  }}
                >
                  {v}
                </p>
              </div>
            ))}
          </div>

          {/* Colour swatches */}
          <div style={{ display: "flex", gap: 6, marginBottom: 16, alignItems: "center" }}>
            <span
              style={{
                fontSize: 11,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: COLOR_STEEL,
                fontFamily: "var(--font-inter), sans-serif",
                marginRight: 4,
              }}
            >
              Colours
            </span>
            {product.colors.map((hex) => (
              <span
                key={hex}
                title={hex}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 2,
                  backgroundColor: hex,
                  border: `1px solid ${COLOR_HAIRLINE}`,
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
            ))}
          </div>

          {/* Key features — up to 4 */}
          <ul
            style={{
              margin: "0 0 16px",
              padding: 0,
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {product.keyFeatures.slice(0, 4).map((f) => (
              <li
                key={f}
                style={{
                  fontSize: 13,
                  color: COLOR_STEEL,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "var(--font-inter), sans-serif",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{ color: COLOR_VOLT, fontSize: 14, fontWeight: 700, lineHeight: 1 }}
                >
                  ✓
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Dashed tear-line divider — per design spec */}
        <div style={{ borderTop: `1px dashed ${COLOR_HAIRLINE}`, margin: "0 20px" }} />

        {/* Price + CTAs */}
        <div style={{ padding: "16px 20px 20px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
            <span
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: 24,
                fontWeight: 700,
                color: COLOR_ASPHALT,
              }}
            >
              {fmt(product.price)}
            </span>
            <span
              style={{
                fontSize: 12,
                color: COLOR_STEEL,
                fontFamily: "var(--font-inter), sans-serif",
              }}
            >
              {product.priceNote}
            </span>
          </div>
          <p
            style={{
              fontSize: 12,
              color: COLOR_STEEL,
              margin: "0 0 14px",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            Book with just {fmt(product.advanceAmount)} advance
          </p>

          {/* Pay Advance — volt / primary CTA */}
          <button
            id={`pay-advance-${product.id}`}
            onClick={() => setModalOpen(true)}
            disabled={!product.inStock}
            style={{
              width: "100%",
              padding: "12px 16px",
              backgroundColor: product.inStock ? COLOR_VOLT : COLOR_HAIRLINE,
              color: product.inStock ? COLOR_ASPHALT : COLOR_STEEL,
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: 14,
              fontWeight: 700,
              border: "none",
              borderRadius: 2,
              cursor: product.inStock ? "pointer" : "not-allowed",
              marginBottom: 8,
              transition: "background-color 150ms ease",
            }}
          >
            Pay Advance — {fmt(product.advanceAmount)}
          </button>

          {/* Learn More — amber / secondary CTA → navigates to detail page */}
          <Link
            id={`learn-more-${product.id}`}
            href={`/products/${product.id}`}
            style={{
              display: "block",
              width: "100%",
              padding: "11px 16px",
              textAlign: "center",
              backgroundColor: "transparent",
              color: COLOR_AMBER,
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 14,
              fontWeight: 500,
              border: `1px solid ${COLOR_AMBER}`,
              borderRadius: 2,
              cursor: "pointer",
              textDecoration: "none",
              boxSizing: "border-box",
            }}
          >
            Learn More
          </Link>
        </div>
      </article>

      {/* ── Modal (portal-rendered, stays in DOM tree for a11y) ─────────── */}
      {modalOpen && (
        <PayAdvanceModal
          product={product}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
