"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/types/product";
import { useCart } from "@/modules/shared/context/CartContext";

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function colorName(hex: string): string {
  const map: Record<string, string> = {
    "#FFFFFF": "Pearl White", "#3B82F6": "Ocean Blue",
    "#EAB308": "Solar Yellow", "#374151": "Charcoal Grey",
  };
  return map[hex.toUpperCase()] ?? hex;
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px dashed #E2DDD6" }}>
      <span style={{ flexShrink: 0, width: 110, fontSize: 11, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "#8896A5", fontFamily: "var(--font-inter), sans-serif" }}>{label}</span>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#0F1B2D", fontFamily: "var(--font-space-grotesk), sans-serif" }}>{value}</span>
    </div>
  );
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const { items, addToCart, updateQuantity, removeFromCart, openDrawer } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.colors[0] ?? "");

  const cartItem = items.find((i) => i.product.id === product.id);
  const quantity = cartItem?.quantity ?? 0;

  function handlePreorder() { if (!product.inStock) return; addToCart(product, 1, selectedColor); }
  function handleIncrement() { if (cartItem) updateQuantity(product.id, quantity + 1); }
  function handleDecrement() {
    if (quantity <= 1) removeFromCart(product.id);
    else updateQuantity(product.id, quantity - 1);
  }

  return (
    <>
      <style>{`
        .pd-preorder-btn {
          width: 100%;
          background: linear-gradient(135deg, #0F1B2D 0%, #162033 100%);
          color: #F7F3EE;
          font-family: var(--font-space-grotesk), sans-serif;
          font-size: 15px; font-weight: 700;
          border: none; border-radius: 10px;
          padding: 15px 20px; cursor: pointer;
          margin-bottom: 10px;
          position: relative; overflow: hidden;
          transition: transform 150ms ease, box-shadow 200ms ease;
          box-shadow: 0 4px 16px rgba(15,27,45,0.25);
          letter-spacing: 0.02em;
        }
        .pd-preorder-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(15,27,45,0.35);
        }
        .pd-preorder-btn:active { transform: scale(0.98); }
        .pd-preorder-btn:disabled {
          background: #E2DDD6; color: #8896A5;
          cursor: not-allowed; box-shadow: none; transform: none;
        }
        .pd-preorder-btn::after {
          content: '';
          position: absolute; inset: 0;
          background: rgba(255,255,255,0.1);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .pd-preorder-btn:active::after { opacity: 1; transition: 0s; }

        .pd-qty-bar {
          width: 100%;
          background: #FFFFFF;
          border: 1.5px solid #00FF66;
          border-radius: 10px; margin-bottom: 10px;
          display: flex; align-items: center; justify-content: space-between;
          overflow: hidden;
          animation: fadeIn 0.3s ease;
          box-shadow: 0 4px 16px rgba(15,27,45,0.05);
        }
        .pd-qty-btn {
          width: 52px; height: 52px; min-height: unset;
          border: none; background: transparent;
          color: #0F1B2D; font-size: 22px; font-weight: 700;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: background 150ms ease;
        }
        .pd-qty-btn:hover { background: rgba(0,255,102,0.1); }
        .pd-qty-btn:active { background: rgba(0,255,102,0.2); transform: scale(0.95); }
        .pd-qty-val { font-family: var(--font-space-grotesk), sans-serif; font-size: 17px; font-weight: 700; color: #0F1B2D; }

        .pd-view-cart-btn {
          width: 100%;
          padding: 13px 20px; text-align: center;
          background: transparent; color: #D4A843;
          font-family: var(--font-inter), sans-serif;
          font-size: 14px; font-weight: 600;
          border: 1.5px solid #D4A843; border-radius: 10px;
          cursor: pointer; box-sizing: border-box;
          margin-bottom: 10px; display: flex;
          align-items: center; justify-content: center; gap: 7px;
          transition: background 150ms ease, color 150ms ease, transform 150ms ease;
        }
        .pd-view-cart-btn:hover { background: #D4A843; color: #0F1B2D; transform: translateY(-1px); }
        .pd-view-cart-btn:active { transform: scale(0.97); }

        .pd-back-btn {
          display: block; width: 100%;
          padding: 13px 20px; text-align: center;
          background: transparent; color: #8896A5;
          font-family: var(--font-inter), sans-serif;
          font-size: 13px; font-weight: 500;
          border: 1px solid #E2DDD6; border-radius: 10px;
          text-decoration: none; box-sizing: border-box;
          transition: border-color 150ms ease, color 150ms ease;
        }
        .pd-back-btn:hover { border-color: #0F1B2D; color: #0F1B2D; }

        .pd-swatch {
          width: 30px; height: 30px; min-height: unset;
          border-radius: 6px; border: 2.5px solid transparent;
          cursor: pointer; outline: none; padding: 0;
          transition: transform 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
        }
        .pd-swatch:hover { transform: scale(1.12); }
        .pd-swatch.active {
          border-color: #D4A843;
          box-shadow: 0 0 0 3px rgba(212,168,67,0.2);
          transform: scale(1.08);
        }
      `}</style>

      <div className="layout-container page-top-offset" style={{ paddingBottom: 56 }}>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: 20 }}>
          <ol style={{ display: "flex", alignItems: "center", gap: 6, listStyle: "none", padding: 0, margin: 0, fontSize: 12, fontFamily: "var(--font-inter), sans-serif", color: "#8896A5", flexWrap: "wrap" }}>
            <li><Link href="/" style={{ color: "#8896A5", textDecoration: "none" }}>Home</Link></li>
            <li aria-hidden="true" style={{ opacity: 0.5 }}>/</li>
            <li><Link href="/#products" style={{ color: "#8896A5", textDecoration: "none" }}>Bikes</Link></li>
            <li aria-hidden="true" style={{ opacity: 0.5 }}>/</li>
            <li aria-current="page" style={{ color: "#D4A843", fontWeight: 600 }}>{product.name}</li>
          </ol>
        </nav>

        <div className="product-detail-grid">
          {/* LEFT: Image */}
          <div style={{ position: "relative", background: "linear-gradient(145deg,#F0ECE5,#E8E2D8)", borderRadius: 16, border: "1.5px solid #E2DDD6", overflow: "hidden", minHeight: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ position: "absolute", top: 14, right: 14, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "5px 12px", borderRadius: 20, backgroundColor: product.inStock ? "rgba(15,27,45,0.85)" : "rgba(136,150,165,0.85)", color: product.inStock ? "#D4A843" : "#FFFFFF", backdropFilter: "blur(4px)", fontFamily: "var(--font-inter), sans-serif", zIndex: 1 }}>
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.imageUrl} alt={product.name} style={{ maxWidth: "85%", maxHeight: 340, objectFit: "contain", display: "block", transition: "transform 400ms ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.04) translateY(-6px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
          </div>

          {/* RIGHT: Details */}
          <div>
            <h1 style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: "clamp(26px,6vw,36px)", fontWeight: 700, color: "#0F1B2D", margin: "0 0 6px", lineHeight: 1.1 }}>
              SEMY {product.name}
            </h1>
            <p style={{ fontSize: 13, color: "#8896A5", fontFamily: "var(--font-inter), sans-serif", margin: "0 0 20px" }}>
              Electric Two-Wheeler · {product.battery}
            </p>

            {/* Specs */}
            <div style={{ border: "1.5px solid #E2DDD6", borderRadius: 10, padding: "0 14px", marginBottom: 20, background: "#FDFAF6" }}>
              <SpecRow label="Battery" value={product.battery} />
              <SpecRow label="Motor" value={product.motor} />
              <SpecRow label="Range" value={`${product.rangeKm} km`} />
              <SpecRow label="Top Speed" value={`${product.topSpeedKmph} km/h`} />
              <SpecRow label="Colours" value={product.colors.map(colorName).join(", ")} />
              <div style={{ padding: "10px 0" }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "#8896A5", fontFamily: "var(--font-inter), sans-serif", display: "block", marginBottom: 8 }}>Key Features</span>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 5 }}>
                  {product.keyFeatures.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "#162033", fontFamily: "var(--font-inter), sans-serif", minHeight: "unset" }}>
                      <span style={{ width: 16, height: 16, minHeight: "unset", borderRadius: "50%", background: "linear-gradient(135deg,#D4A843,#F0C060)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><polyline points="2,5 4,7 8,3" stroke="#0F1B2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Colour swatches */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "#8896A5", fontFamily: "var(--font-inter), sans-serif" }}>Colour</span>
              {product.colors.map((hex) => (
                <button key={hex} title={colorName(hex)} onClick={() => setSelectedColor(hex)}
                  className={`pd-swatch ${selectedColor === hex ? "active" : ""}`}
                  style={{ backgroundColor: hex, borderColor: selectedColor === hex ? "#D4A843" : "#E2DDD6" }}
                  aria-label={`Select ${colorName(hex)}`}
                />
              ))}
            </div>

            {/* Divider */}
            <div style={{ borderTop: "1px dashed #E2DDD6", marginBottom: 18 }} />

            {/* Price */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: "clamp(26px,5vw,32px)", fontWeight: 700, color: "#0F1B2D" }}>{fmt(product.price)}</span>
                <span style={{ fontSize: 12, color: "#8896A5", fontFamily: "var(--font-inter), sans-serif" }}>{product.priceNote}</span>
              </div>
              <p style={{ fontSize: 13, color: "#8896A5", margin: 0, fontFamily: "var(--font-inter), sans-serif" }}>
                Reserve with just <strong style={{ color: "#D4A843" }}>{fmt(product.advanceAmount)}</strong> — pay balance on delivery
              </p>
            </div>

            {/* Preorder / qty */}
            {quantity === 0 ? (
              <button id={`detail-preorder-${product.id}`} className="pd-preorder-btn" onClick={handlePreorder} disabled={!product.inStock}>
                {product.inStock ? "Preorder Now" : "Out of Stock"}
              </button>
            ) : (
              <div className="pd-qty-bar">
                <button className="pd-qty-btn" onClick={handleDecrement} aria-label="Decrease">−</button>
                <span className="pd-qty-val">{quantity}</span>
                <button className="pd-qty-btn" onClick={handleIncrement} aria-label="Increase">+</button>
              </div>
            )}

            {quantity > 0 && (
              <button className="pd-view-cart-btn" onClick={openDrawer}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                View Cart
              </button>
            )}

            <Link href="/#products" id={`detail-back-${product.id}`} className="pd-back-btn">← Back to All Bikes</Link>
          </div>
        </div>

        {/* How It Works */}
        <div style={{ marginTop: 40, padding: "24px 20px", background: "linear-gradient(135deg,rgba(15,27,45,0.04),rgba(15,27,45,0.02))", border: "1.5px solid #E2DDD6", borderRadius: 12 }}>
          <p style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#D4A843", margin: "0 0 14px" }}>
            How Advance Payment Works
          </p>
          <ol style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { step: "Pay a small advance to reserve your e-cycle.", detail: "A fully refundable ₹2,000 advance secures your booking." },
              { step: "We confirm colour & prepare your delivery.", detail: "Our team calls you within 24 hours to confirm." },
              { step: "Pay the balance on delivery.", detail: "Cash or UPI when the bike arrives at your door." },
            ].map(({ step, detail }, i) => (
              <li key={i} style={{ fontSize: 13, fontFamily: "var(--font-inter), sans-serif", color: "#162033", lineHeight: "18px", minHeight: "unset" }}>
                <strong style={{ fontWeight: 600 }}>{step}</strong>{" "}
                <span style={{ color: "#8896A5" }}>{detail}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
}
