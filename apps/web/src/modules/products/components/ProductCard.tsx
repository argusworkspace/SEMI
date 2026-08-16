"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/types/product";
import { useCart } from "@/modules/shared/context/CartContext";

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export default function ProductCard({ product }: { product: Product }) {
  const { items, addToCart, updateQuantity, removeFromCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.colors[0] ?? "");

  const cartItem = items.find((i) => i.product.id === product.id);
  const quantity = cartItem?.quantity ?? 0;

  function handlePreorder() {
    if (!product.inStock) return;
    addToCart(product, 1, selectedColor);
  }
  function handleIncrement() { if (cartItem) updateQuantity(product.id, quantity + 1); }
  function handleDecrement() {
    if (quantity <= 1) removeFromCart(product.id);
    else updateQuantity(product.id, quantity - 1);
  }

  return (
    <>
      <style>{`
        .pc-root {
          border: 1.5px solid #E2DDD6;
          border-radius: 12px;
          background: #FFFFFF;
          display: flex; flex-direction: column;
          overflow: hidden;
          transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
          box-shadow: 0 1px 4px rgba(15,27,45,0.06);
        }
        .pc-root:hover {
          transform: translateY(-5px);
          border-color: #D4A843;
          box-shadow: 0 8px 28px rgba(15,27,45,0.12);
        }

        .pc-img-wrap {
          background: linear-gradient(145deg, #F0ECE5 0%, #EAE4D9 100%);
          height: 180px;
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
        }
        .pc-img {
          max-height: 160px; object-fit: contain;
          transition: transform 320ms ease;
        }
        .pc-root:hover .pc-img { transform: scale(1.05) translateY(-4px); }

        /* Gold shimmer on image bg hover */
        .pc-img-wrap::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(120deg, transparent 30%, rgba(212,168,67,0.08) 50%, transparent 70%);
          background-size: 200% 100%;
          opacity: 0;
          transition: opacity 220ms ease;
        }
        .pc-root:hover .pc-img-wrap::after {
          opacity: 1;
          animation: shimmer 1.2s ease infinite;
        }

        .pc-stock {
          position: absolute; top: 10px; right: 10px;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 4px 10px; border-radius: 20px;
          font-family: var(--font-inter), sans-serif;
        }

        .pc-btn-preorder {
          width: 100%;
          background: linear-gradient(135deg, #0F1B2D 0%, #162033 100%);
          color: #F7F3EE;
          font-family: var(--font-space-grotesk), sans-serif;
          font-size: 14px; font-weight: 700;
          border: none; border-radius: 8px;
          padding: 13px 16px;
          cursor: pointer; margin-bottom: 8px;
          position: relative; overflow: hidden;
          transition: transform 150ms ease, background 200ms ease, box-shadow 200ms ease;
          box-shadow: 0 2px 8px rgba(15,27,45,0.2);
          letter-spacing: 0.02em;
        }
        .pc-btn-preorder:hover {
          transform: translateY(-2px);
          background: linear-gradient(135deg, #162033 0%, #1E2E45 100%);
          box-shadow: 0 6px 20px rgba(15,27,45,0.3);
        }
        .pc-btn-preorder:active { transform: translateY(0) scale(0.98); }
        .pc-btn-preorder:disabled {
          background: #E2DDD6; color: #8896A5;
          cursor: not-allowed; box-shadow: none; transform: none;
        }
        .pc-btn-preorder::after {
          content: '';
          position: absolute; inset: 0;
          background: rgba(255,255,255,0.1);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .pc-btn-preorder:active::after {
          opacity: 1; transition: 0s;
        }

        .pc-qty-bar {
          width: 100%;
          background: #FFFFFF;
          border: 1.5px solid #00FF66;
          border-radius: 8px; margin-bottom: 8px;
          display: flex; align-items: center; justify-content: space-between;
          overflow: hidden;
          animation: fadeIn 0.3s ease;
        }
        .pc-qty-btn {
          width: 46px; height: 46px; min-height: unset;
          border: none; background: transparent;
          color: #0F1B2D;
          font-size: 20px; font-weight: 700;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: background 150ms ease;
          line-height: 1;
        }
        .pc-qty-btn:hover { background: rgba(0,255,102,0.1); }
        .pc-qty-btn:active { background: rgba(0,255,102,0.2); transform: scale(0.95); }

        .pc-qty-val {
          font-family: var(--font-space-grotesk), sans-serif;
          font-size: 15px; font-weight: 700;
          color: #0F1B2D;
          min-width: 28px; text-align: center;
        }

        .pc-learn-btn {
          display: block; width: 100%;
          padding: 11px 16px; text-align: center;
          background: transparent;
          color: #D4A843;
          font-family: var(--font-inter), sans-serif;
          font-size: 13px; font-weight: 600;
          border: 1.5px solid #D4A843;
          border-radius: 8px;
          text-decoration: none; box-sizing: border-box;
          transition: background 150ms ease, color 150ms ease, transform 150ms ease;
        }
        .pc-learn-btn:hover {
          background: #D4A843; color: #0F1B2D;
          transform: translateY(-1px);
        }
        .pc-learn-btn:active { transform: scale(0.97); }

        .pc-swatch {
          width: 20px; height: 20px; min-height: unset;
          border-radius: 4px; border: 2px solid transparent;
          cursor: pointer; outline: none; padding: 0;
          transition: transform 150ms ease, border-color 150ms ease;
        }
        .pc-swatch:hover { transform: scale(1.15); }
        .pc-swatch.active { border-color: #D4A843; transform: scale(1.1); }
      `}</style>

      <article className="pc-root" aria-label={`${product.name} product card`}>
        {/* Image */}
        <div className="pc-img-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl} alt={product.name} className="pc-img"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
          <span
            className="pc-stock"
            style={{
              backgroundColor: product.inStock ? "rgba(15,27,45,0.85)" : "rgba(136,150,165,0.85)",
              color: product.inStock ? "#D4A843" : "#FFFFFF",
              backdropFilter: "blur(4px)",
            }}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        {/* Body */}
        <div style={{ padding: "16px 16px 0", flex: 1 }}>
          <h3 style={{ margin: "0 0 10px" }}>
            <Link href={`/products/${product.id}`} style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: 18, fontWeight: 700, color: "#0F1B2D", textDecoration: "none", display: "block" }}>
              {product.name}
            </Link>
          </h3>

          {/* Specs */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px", marginBottom: 12 }}>
            {[["Battery", product.battery], ["Motor", product.motor], ["Range", `${product.rangeKm} km`], ["Top Speed", `${product.topSpeedKmph} km/h`]].map(([k, v]) => (
              <div key={k}>
                <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "#8896A5", margin: "0 0 1px", fontFamily: "var(--font-inter), sans-serif" }}>{k}</p>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#162033", margin: 0, fontFamily: "var(--font-space-grotesk), sans-serif" }}>{v}</p>
              </div>
            ))}
          </div>

          {/* Colours */}
          <div style={{ display: "flex", gap: 5, marginBottom: 10, alignItems: "center" }}>
            <span style={{ fontSize: 10, letterSpacing: "0.07em", textTransform: "uppercase", color: "#8896A5", fontFamily: "var(--font-inter), sans-serif", marginRight: 2 }}>Colour</span>
            {product.colors.map((hex) => (
              <button key={hex} title={hex} onClick={() => setSelectedColor(hex)}
                className={`pc-swatch ${selectedColor === hex ? "active" : ""}`}
                style={{ backgroundColor: hex, borderColor: selectedColor === hex ? "#D4A843" : "#E2DDD6" }}
                aria-label={`Select ${hex}`}
              />
            ))}
          </div>

          {/* Features */}
          <ul style={{ margin: "0 0 12px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 3 }}>
            {product.keyFeatures.slice(0, 4).map((f) => (
              <li key={f} style={{ fontSize: 12, color: "#8896A5", display: "flex", alignItems: "center", gap: 5, fontFamily: "var(--font-inter), sans-serif", minHeight: "unset" }}>
                <span style={{ width: 14, height: 14, minHeight: "unset", borderRadius: "50%", background: "linear-gradient(135deg,#D4A843,#F0C060)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="7" height="7" viewBox="0 0 10 10" fill="none"><polyline points="2,5 4,7 8,3" stroke="#0F1B2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px dashed #E2DDD6", margin: "0 16px" }} />

        {/* Price + CTAs */}
        <div style={{ padding: "12px 16px 16px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 2 }}>
            <span style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: 22, fontWeight: 700, color: "#0F1B2D" }}>{fmt(product.price)}</span>
            <span style={{ fontSize: 11, color: "#8896A5", fontFamily: "var(--font-inter), sans-serif" }}>{product.priceNote}</span>
          </div>
          <p style={{ fontSize: 11, color: "#8896A5", margin: "0 0 12px", fontFamily: "var(--font-inter), sans-serif" }}>
            Book with just <strong style={{ color: "#D4A843" }}>{fmt(product.advanceAmount)}</strong>
          </p>

          {quantity === 0 ? (
            <button id={`preorder-${product.id}`} className="pc-btn-preorder" onClick={handlePreorder} disabled={!product.inStock}>
              {product.inStock ? "Preorder" : "Out of Stock"}
            </button>
          ) : (
            <div className="pc-qty-bar">
              <button className="pc-qty-btn" onClick={handleDecrement} aria-label="Decrease">−</button>
              <span className="pc-qty-val">{quantity}</span>
              <button className="pc-qty-btn" onClick={handleIncrement} aria-label="Increase">+</button>
            </div>
          )}

          <Link id={`learn-more-${product.id}`} href={`/products/${product.id}`} className="pc-learn-btn">
            Learn More →
          </Link>
        </div>
      </article>
    </>
  );
}
