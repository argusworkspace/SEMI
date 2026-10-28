"use client";

import { useState } from "react";
import Image from "next/image";
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

        @media (max-width: 480px) {
          .pd-whatsapp-cta { flex-direction: column; align-items: stretch; text-align: center; }
          .pd-whatsapp-btn { width: 100%; }
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
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={520}
              height={340}
              priority
              style={{ maxWidth: "85%", maxHeight: 340, objectFit: "contain", display: "block", transition: "transform 400ms ease", width: "auto", height: "auto" }}
              onMouseEnter={(e) => { (e.target as HTMLImageElement).style.transform = "scale(1.04) translateY(-6px)"; }}
              onMouseLeave={(e) => { (e.target as HTMLImageElement).style.transform = ""; }}
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
              { step: "Pay the advance to reserve your bike.", detail: "A ₹5,000 advance via UPI secures your booking." },
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

        {/* More queries? WhatsApp */}
        <div className="pd-whatsapp-cta" style={{ marginTop: 16, padding: "18px 20px", border: "1.5px dashed #E2DDD6", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <p style={{ margin: 0, fontSize: 13, fontFamily: "var(--font-inter), sans-serif", color: "#8896A5" }}>
            Have more queries about this bike?
          </p>
          <a
            href="https://wa.me/917358110762"
            target="_blank"
            rel="noopener noreferrer"
            className="pd-whatsapp-btn"
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
              padding: "10px 18px", background: "#0F1B2D", color: "#F7F3EE",
              fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: 13, fontWeight: 700,
              borderRadius: 8, textDecoration: "none", flexShrink: 0,
              transition: "transform 150ms ease",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#D4A843"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12.001 2C6.478 2 2 6.477 2 12c0 1.876.52 3.633 1.42 5.13L2 22l4.995-1.393A9.947 9.947 0 0 0 12.001 22C17.524 22 22 17.523 22 12S17.524 2 12.001 2zm0 18.062a8.05 8.05 0 0 1-4.109-1.128l-.294-.175-3.055.852.822-3.005-.192-.309A8.056 8.056 0 1 1 20.06 12a8.067 8.067 0 0 1-8.059 8.062z"/></svg>
            Ask on WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
