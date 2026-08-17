"use client";

import { useState, useEffect, useRef } from "react";
import { useCart } from "@/modules/shared/context/CartContext";
import type { Product } from "@/types/product";
import PayAdvanceModal from "@/modules/products/components/PayAdvanceModal";

function fmt(n: number) { return "₹" + n.toLocaleString("en-IN"); }
function colorName(hex: string) {
  return ({ "#FFFFFF": "Pearl White", "#3B82F6": "Ocean Blue", "#EAB308": "Solar Yellow", "#374151": "Charcoal Grey" } as Record<string, string>)[hex.toUpperCase()] ?? hex;
}

const ADVANCE_PER_ITEM = 5000;

export default function CartDrawer() {
  const { items, totalItems, isDrawerOpen, closeDrawer, removeFromCart, updateQuantity, clearCart } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);
  const [bookingProduct, setBookingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!isDrawerOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeDrawer(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isDrawerOpen, closeDrawer]);

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [isDrawerOpen]);

  const totalUnits = items.reduce((s, i) => s + i.quantity, 0);
  const totalAdvance = totalUnits * ADVANCE_PER_ITEM;

  function handleCheckout() {
    if (items.length === 0) return;
    closeDrawer();
    setBookingProduct(items[0].product);
  }

  return (
    <>
      <style>{`
        .cd-overlay {
          position: fixed; inset: 0; z-index: 150;
          background: rgba(15,27,45,0.55);
          backdrop-filter: blur(5px);
          animation: overlayIn 0.22s ease forwards;
        }
        .cd-panel {
          position: fixed; top: 0; right: 0; bottom: 0; z-index: 151;
          width: 100vw; max-width: 400px;
          background: #FDFAF6;
          display: flex; flex-direction: column;
          animation: drawerIn 0.3s cubic-bezier(0.4,0,0.2,1) forwards;
          border-left: 1px solid #E2DDD6;
        }
        .cd-item { display: flex; gap: 12px; padding: 14px 0; border-bottom: 1px dashed #E2DDD6; }
        .cd-item:last-child { border-bottom: none; }

        .cd-qty-btn {
          width: 28px; height: 28px; min-height: unset;
          border: 1.5px solid #E2DDD6; border-radius: 6px;
          background: #F7F3EE; color: #0F1B2D;
          font-size: 14px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; line-height: 1;
          transition: background 150ms ease, border-color 150ms ease, transform 150ms ease;
        }
        .cd-qty-btn:hover { border-color: #D4A843; background: rgba(212,168,67,0.1); }
        .cd-qty-btn:active { transform: scale(0.88); }
        .cd-qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        .cd-remove-btn {
          background: none; border: none; color: #8896A5;
          font-size: 11px; font-family: var(--font-inter), sans-serif;
          cursor: pointer; padding: 2px 0; min-height: unset;
          transition: color 150ms ease;
        }
        .cd-remove-btn:hover { color: #C0392B; }

        .cd-checkout-btn {
          width: 100%;
          padding: 14px 20px;
          background: linear-gradient(135deg, #0F1B2D 0%, #162033 100%);
          color: #F7F3EE;
          font-family: var(--font-space-grotesk), sans-serif;
          font-size: 14px; font-weight: 700;
          border: none; border-radius: 10px;
          cursor: pointer; margin-bottom: 8px;
          transition: transform 150ms ease, box-shadow 200ms ease;
          box-shadow: 0 4px 16px rgba(15,27,45,0.25);
          position: relative; overflow: hidden;
        }
        .cd-checkout-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(15,27,45,0.35); }
        .cd-checkout-btn:active { transform: scale(0.98); }
        .cd-checkout-btn::after {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 60%);
          transform: scale(0); opacity: 0; transition: transform 0.5s ease, opacity 0.5s ease;
        }
        .cd-checkout-btn:active::after { transform: scale(3); opacity: 1; transition: 0s; }

        .cd-clear-btn {
          width: 100%; padding: 10px 20px;
          background: transparent; color: #8896A5;
          font-family: var(--font-inter), sans-serif;
          font-size: 12px; font-weight: 500;
          border: 1px solid #E2DDD6; border-radius: 10px;
          cursor: pointer;
          transition: border-color 150ms ease, color 150ms ease;
        }
        .cd-clear-btn:hover { border-color: #C0392B; color: #C0392B; }
      `}</style>

      {isDrawerOpen && (
        <>
          <div className="cd-overlay" onClick={closeDrawer} aria-hidden="true" />
          <div ref={drawerRef} className="cd-panel" role="dialog" aria-modal="true" aria-label="Shopping cart">
            {/* Header */}
            <div style={{ background: "linear-gradient(135deg, #0F1B2D 0%, #162033 100%)", padding: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EDE8E0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                <span style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: 16, fontWeight: 700, color: "#FFFFFF" }}>Your Cart</span>
                {totalItems > 0 && (
                  <span style={{ background: "linear-gradient(135deg,#D4A843,#F0C060)", color: "#0F1B2D", fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, lineHeight: "16px" }}>
                    {totalItems}
                  </span>
                )}
              </div>
              <button onClick={closeDrawer} aria-label="Close cart" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "50%", width: 30, height: 30, minHeight: "unset", color: "#EDE8E0", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 150ms ease" }}>×</button>
            </div>

            {items.length === 0 ? (
              /* Empty */
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 20px", textAlign: "center" }}>
                <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg,rgba(212,168,67,0.1),rgba(212,168,67,0.05))", border: "1.5px solid #E2DDD6", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8896A5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                </div>
                <p style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: 17, fontWeight: 700, color: "#0F1B2D", margin: "0 0 6px" }}>Cart is empty</p>
                <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "#8896A5", margin: "0 0 22px", lineHeight: "18px" }}>Add a bike to get started.</p>
                <a href="/#products" onClick={closeDrawer} style={{ display: "inline-block", padding: "12px 28px", background: "linear-gradient(135deg,#0F1B2D,#162033)", color: "#F7F3EE", fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: 13, fontWeight: 700, borderRadius: 8, textDecoration: "none" }}>Browse Bikes</a>
              </div>
            ) : (
              <>
                {/* Items */}
                <div style={{ flex: 1, overflowY: "auto", padding: "6px 16px", WebkitOverflowScrolling: "touch" }}>
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.selectedColor}`} className="cd-item">
                      <div style={{ width: 64, height: 64, flexShrink: 0, background: "linear-gradient(145deg,#F0ECE5,#E8E2D8)", borderRadius: 8, border: "1px solid #E2DDD6", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.product.imageUrl} alt={item.product.name} style={{ maxWidth: "90%", maxHeight: "90%", objectFit: "contain" }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6, marginBottom: 4 }}>
                          <p style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: 16, fontWeight: 700, color: "#0F1B2D", margin: 0, lineHeight: "20px" }}>{item.product.name}</p>
                          <p style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: 15, fontWeight: 700, color: "#D4A843", margin: 0, whiteSpace: "nowrap" }}>{fmt(item.product.price * item.quantity)}</p>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "2px 10px", marginBottom: 6 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#162033", fontFamily: "var(--font-inter), sans-serif" }}>{item.product.battery}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                          <span style={{ width: 14, height: 14, borderRadius: 4, backgroundColor: item.selectedColor, border: "1.5px solid #E2DDD6", display: "inline-block" }} />
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#162033", fontFamily: "var(--font-inter), sans-serif" }}>{colorName(item.selectedColor)}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <button className="cd-qty-btn" onClick={() => updateQuantity(item.product.id, item.quantity - 1)} disabled={item.quantity <= 1} aria-label="Decrease">−</button>
                            <span style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: 13, fontWeight: 700, color: "#0F1B2D", minWidth: 18, textAlign: "center" }}>{item.quantity}</span>
                            <button className="cd-qty-btn" onClick={() => updateQuantity(item.product.id, item.quantity + 1)} aria-label="Increase">+</button>
                          </div>
                          <button className="cd-remove-btn" onClick={() => removeFromCart(item.product.id)} aria-label={`Remove ${item.product.name}`}>Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div style={{ borderTop: "1px solid #E2DDD6", padding: "14px 16px 18px", flexShrink: 0, background: "#FDFAF6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 12, color: "#8896A5" }}>Advance per bike</span>
                    <span style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: 13, fontWeight: 600, color: "#162033" }}>₹5,000</span>
                  </div>
                  {totalUnits > 1 && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 12, color: "#8896A5" }}>× {totalUnits} bikes</span>
                      <span style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: 13, fontWeight: 600, color: "#8896A5" }}>{fmt(totalAdvance)}</span>
                    </div>
                  )}
                  <div style={{ borderTop: "1px dashed #E2DDD6", margin: "8px 0 12px" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                    <span style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: 14, fontWeight: 700, color: "#0F1B2D" }}>Pay now</span>
                    <span style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: 22, fontWeight: 700, color: "#D4A843" }}>{fmt(totalAdvance)}</span>
                  </div>
                  <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, color: "#8896A5", margin: "0 0 12px" }}>Balance payable on delivery</p>
                  <button id="cart-checkout-btn" className="cd-checkout-btn" onClick={handleCheckout}>
                    Book with {fmt(totalAdvance)} Advance
                  </button>
                  <button className="cd-clear-btn" onClick={clearCart}>Clear Cart</button>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {bookingProduct && (
        <PayAdvanceModal
          product={bookingProduct}
          onClose={() => setBookingProduct(null)}
        />
      )}
    </>
  );
}
