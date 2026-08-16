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

function colorName(hex: string): string {
  const map: Record<string, string> = {
    "#FFFFFF": "Pearl White",
    "#3B82F6": "Ocean Blue",
    "#EAB308": "Solar Yellow",
    "#374151": "Charcoal Grey",
  };
  return map[hex.toUpperCase()] ?? hex;
}

// ── Spec row: key | dashed divider | value ────────────────────────────────────
function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 12,
        padding: "11px 0",
        borderBottom: `1px dashed ${COLOR_HAIRLINE}`,
      }}
    >
      <span
        style={{
          flexShrink: 0,
          width: 130,
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: COLOR_STEEL,
          fontFamily: "var(--font-inter), sans-serif",
        }}
      >
        {label}
      </span>
      <span
        style={{
          flex: 1,
          fontSize: 15,
          fontWeight: 600,
          color: COLOR_ASPHALT,
          fontFamily: "var(--font-space-grotesk), sans-serif",
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ── Main client component ──────────────────────────────────────────────────────
export default function ProductDetailClient({ product }: { product: Product }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        className="layout-container"
        style={{ paddingTop: 40, paddingBottom: 72 }}
      >
        {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: 28 }}>
          <ol
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              listStyle: "none",
              padding: 0,
              margin: 0,
              fontSize: 13,
              fontFamily: "var(--font-inter), sans-serif",
              color: COLOR_STEEL,
            }}
          >
            <li>
              <Link
                href="/"
                style={{ color: COLOR_STEEL, textDecoration: "none" }}
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true" style={{ opacity: 0.5 }}>
              /
            </li>
            <li>
              <Link
                href="/#our-bikes"
                style={{ color: COLOR_STEEL, textDecoration: "none" }}
              >
                Bikes
              </Link>
            </li>
            <li aria-hidden="true" style={{ opacity: 0.5 }}>
              /
            </li>
            <li
              aria-current="page"
              style={{ color: COLOR_ASPHALT, fontWeight: 500 }}
            >
              {product.name}
            </li>
          </ol>
        </nav>

        {/* ── Main two-column layout ──────────────────────────────────────── */}
        <div className="product-detail-grid">

          {/* ── LEFT: Image ────────────────────────────────────────────── */}
          <div
            style={{
              position: "relative",
              backgroundColor: "#F0EEE9",
              borderRadius: 2,
              border: `1px solid ${COLOR_HAIRLINE}`,
              overflow: "hidden",
              minHeight: 340,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Stock badge */}
            <span
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "4px 10px",
                borderRadius: 2,
                backgroundColor: product.inStock
                  ? "rgba(200,241,53,0.15)"
                  : "rgba(200,200,200,0.2)",
                color: product.inStock ? "#5a8a00" : COLOR_STEEL,
                border: `1px solid ${product.inStock ? "rgba(200,241,53,0.4)" : COLOR_HAIRLINE}`,
                fontFamily: "var(--font-inter), sans-serif",
                zIndex: 1,
              }}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{
                maxWidth: "85%",
                maxHeight: 400,
                objectFit: "contain",
                display: "block",
              }}
              onError={(e) => {
                const el = e.currentTarget as HTMLImageElement;
                el.style.display = "none";
                // Show product name as fallback text
                const fb = el.parentElement?.querySelector(
                  ".img-fallback"
                ) as HTMLElement | null;
                if (fb) fb.style.display = "flex";
              }}
            />
            {/* Image fallback */}
            <div
              className="img-fallback"
              style={{
                display: "none",
                position: "absolute",
                inset: 0,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: COLOR_VOLT,
                  borderRadius: 2,
                  display: "block",
                }}
              />
              <p
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: COLOR_STEEL,
                  margin: 0,
                }}
              >
                {product.name}
              </p>
            </div>
          </div>

          {/* ── RIGHT: Spec sheet ───────────────────────────────────────── */}
          <div>
            {/* Product name */}
            <h1
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: 36,
                fontWeight: 700,
                color: COLOR_ASPHALT,
                margin: "0 0 6px",
                lineHeight: 1.1,
              }}
            >
              SEMY {product.name}
            </h1>
            <p
              style={{
                fontSize: 14,
                color: COLOR_STEEL,
                fontFamily: "var(--font-inter), sans-serif",
                margin: "0 0 28px",
              }}
            >
              Electric Two-Wheeler · {product.battery}
            </p>

            {/* Full spec sheet with dashed dividers */}
            <div
              style={{
                border: `1px solid ${COLOR_HAIRLINE}`,
                borderRadius: 2,
                padding: "0 16px",
                marginBottom: 24,
              }}
            >
              <SpecRow label="Battery" value={product.battery} />
              <SpecRow label="Motor" value={product.motor} />
              <SpecRow label="Range" value={`${product.rangeKm} km (claimed)`} />
              <SpecRow label="Top Speed" value={`${product.topSpeedKmph} km/h`} />
              <SpecRow
                label="Colours"
                value={product.colors.map(colorName).join(", ")}
              />
              {/* Last row: no bottom border */}
              <div style={{ padding: "11px 0" }}>
                <span
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: COLOR_STEEL,
                    fontFamily: "var(--font-inter), sans-serif",
                    marginBottom: 10,
                  }}
                >
                  Key Features
                </span>
                {/* All features — uncollapsed on detail page */}
                <ul
                  style={{
                    margin: 0,
                    padding: 0,
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  {product.keyFeatures.map((f) => (
                    <li
                      key={f}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 14,
                        color: COLOR_ASPHALT,
                        fontFamily: "var(--font-inter), sans-serif",
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          color: COLOR_VOLT,
                          fontSize: 15,
                          fontWeight: 700,
                          lineHeight: 1,
                          flexShrink: 0,
                        }}
                      >
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Colour swatches row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 24,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: COLOR_STEEL,
                  fontFamily: "var(--font-inter), sans-serif",
                  marginRight: 4,
                }}
              >
                Available in
              </span>
              {product.colors.map((hex) => (
                <span
                  key={hex}
                  title={colorName(hex)}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 2,
                    backgroundColor: hex,
                    border: `1px solid ${COLOR_HAIRLINE}`,
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>

            {/* Dashed tear-line divider */}
            <div
              style={{
                borderTop: `1px dashed ${COLOR_HAIRLINE}`,
                marginBottom: 20,
              }}
            />

            {/* Price block */}
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontSize: 32,
                    fontWeight: 700,
                    color: COLOR_ASPHALT,
                  }}
                >
                  {fmt(product.price)}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: COLOR_STEEL,
                    fontFamily: "var(--font-inter), sans-serif",
                  }}
                >
                  {product.priceNote}
                </span>
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: COLOR_STEEL,
                  margin: 0,
                  fontFamily: "var(--font-inter), sans-serif",
                }}
              >
                Reserve with just{" "}
                <strong style={{ color: COLOR_ASPHALT }}>
                  {fmt(product.advanceAmount)}
                </strong>{" "}
                — pay balance on delivery
              </p>
            </div>

            {/* CTA buttons */}
            <button
              id={`detail-pay-advance-${product.id}`}
              onClick={() => setModalOpen(true)}
              disabled={!product.inStock}
              style={{
                width: "100%",
                padding: "14px 20px",
                backgroundColor: product.inStock ? COLOR_VOLT : COLOR_HAIRLINE,
                color: product.inStock ? COLOR_ASPHALT : COLOR_STEEL,
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: 15,
                fontWeight: 700,
                border: "none",
                borderRadius: 2,
                cursor: product.inStock ? "pointer" : "not-allowed",
                marginBottom: 10,
                transition: "background-color 150ms ease",
              }}
            >
              Pay Advance — {fmt(product.advanceAmount)}
            </button>

            <Link
              href="/#our-bikes"
              id={`detail-learn-more-${product.id}`}
              style={{
                display: "block",
                width: "100%",
                padding: "13px 20px",
                textAlign: "center",
                backgroundColor: "transparent",
                color: COLOR_AMBER,
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 14,
                fontWeight: 500,
                border: `1px solid ${COLOR_AMBER}`,
                borderRadius: 2,
                textDecoration: "none",
                boxSizing: "border-box",
              }}
            >
              ← Back to All Bikes
            </Link>
          </div>
        </div>

        {/* ── "How Advance Payment Works" info block ──────────────────────── */}
        {/*
          TODO(Ajay): adjust the copy below to match your actual booking
          policy — especially the "confirm colour/stock" step and any
          cancellation / refund terms you want to communicate upfront.
        */}
        <div
          style={{
            marginTop: 48,
            padding: "24px 28px",
            backgroundColor: "rgba(91,100,112,0.06)", // steel-tinted, no shadows
            border: `1px solid ${COLOR_HAIRLINE}`,
            borderRadius: 2,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: COLOR_STEEL,
              margin: "0 0 16px",
            }}
          >
            How Advance Payment Works
          </p>

          <ol
            style={{
              margin: 0,
              paddingLeft: 20,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {[
              {
                step: "Pay a small advance to reserve your e-cycle.",
                detail:
                  "A fully refundable ₹2,000 advance secures your booking. No hidden charges.",
              },
              {
                step: "We confirm colour availability and prepare your delivery.",
                detail:
                  "Our team calls you within 24 hours to confirm your preferred colour and delivery slot.",
              },
              {
                step: "Pay the balance on delivery.",
                detail:
                  "The remaining amount is collected in cash or UPI when the bike arrives at your door.",
              },
            ].map(({ step, detail }, i) => (
              <li
                key={i}
                style={{
                  fontSize: 14,
                  fontFamily: "var(--font-inter), sans-serif",
                  color: COLOR_ASPHALT,
                  lineHeight: "20px",
                }}
              >
                <strong style={{ fontWeight: 600 }}>{step}</strong>{" "}
                <span style={{ color: COLOR_STEEL }}>{detail}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Pay Advance modal — same component reused from the listing */}
      {modalOpen && (
        <PayAdvanceModal
          product={product}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
