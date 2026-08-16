"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/modules/shared/context/CartContext";

export default function FloatingCart() {
  const { totalItems, openDrawer, addPulse } = useCart();
  const [bounce, setBounce] = useState(false);
  const prevPulse = useRef(addPulse);

  useEffect(() => {
    if (addPulse > 0 && addPulse !== prevPulse.current) {
      prevPulse.current = addPulse;
      setBounce(true);
      const t = setTimeout(() => setBounce(false), 600);
      return () => clearTimeout(t);
    }
  }, [addPulse]);

  if (totalItems === 0) return null;

  return (
    <>
      <style>{`
        .fc-btn {
          position: fixed; bottom: 22px; right: 18px; z-index: 100;
          width: 54px; height: 54px; min-height: unset; border-radius: 50%;
          background: linear-gradient(135deg, #0F1B2D 0%, #162033 100%);
          border: 2px solid rgba(212,168,67,0.4);
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          animation: cartFadeIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards;
          transition: border-color 150ms ease, transform 150ms ease, box-shadow 150ms ease;
          box-shadow: 0 4px 20px rgba(15,27,45,0.3);
        }
        .fc-btn:hover {
          border-color: #D4A843;
          transform: scale(1.08);
          box-shadow: 0 8px 28px rgba(15,27,45,0.4);
        }
        .fc-btn:active { transform: scale(0.94); }
        .fc-btn.bounce { animation: cartBounce 0.55s cubic-bezier(0.34,1.56,0.64,1); }

        .fc-badge {
          position: absolute; top: -5px; right: -5px;
          min-width: 20px; height: 20px; border-radius: 10px;
          background: linear-gradient(135deg, #D4A843, #F0C060);
          color: #0F1B2D;
          font-family: var(--font-space-grotesk), sans-serif;
          font-size: 10px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          padding: 0 5px; line-height: 1;
          animation: badgePop 0.35s cubic-bezier(0.34,1.56,0.64,1);
          border: 2px solid #F7F3EE;
        }

        /* Pulse ring behind btn */
        .fc-ring {
          position: fixed; bottom: 22px; right: 18px; z-index: 99;
          width: 54px; height: 54px; border-radius: 50%;
          border: 2px solid rgba(212,168,67,0.5);
          pointer-events: none;
        }
        .fc-ring.active {
          animation: pulse-ring 0.8s ease-out forwards;
        }
      `}</style>

      <span className={`fc-ring ${bounce ? "active" : ""}`} aria-hidden="true" />
      <button
        id="floating-cart-btn"
        className={`fc-btn${bounce ? " bounce" : ""}`}
        onClick={openDrawer}
        aria-label={`Cart — ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EDE8E0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <span className="fc-badge" key={totalItems}>{totalItems}</span>
      </button>
    </>
  );
}
