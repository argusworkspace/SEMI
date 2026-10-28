"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/modules/shared/context/CartContext";

const NAV_LINKS = [
  { label: "Products",      href: "#products" },
  { label: "Manufacturing", href: "#manufacturing" },
  { label: "About",         href: "#about" },
  { label: "Contact",       href: "#contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // The browser only fires "hashchange" when the hash actually changes, so a
  // plain <a href="#products"> silently does nothing if that section's hash
  // is already active (e.g. clicked once already). Scroll directly when
  // already on the home page; otherwise let the link navigate there normally.
  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (pathname !== "/") return;
    e.preventDefault();
    const id = href.slice(1);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    if (window.location.hash !== href) window.location.hash = id;
  }
  const { totalItems, openDrawer } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMobileOpen(false);
    };
    if (mobileOpen) document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [mobileOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <style>{`
        .nav-link {
          color: rgba(237,232,224,0.8);
          font-family: var(--font-inter), sans-serif;
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          letter-spacing: 0.01em;
          transition: color 150ms ease;
          padding: 4px 0;
          position: relative;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          width: 0; height: 1.5px;
          background: var(--gold);
          transition: width 200ms ease;
        }
        .nav-link:hover { color: #FFFFFF; }
        .nav-link:hover::after { width: 100%; }

        .header-cart-btn {
          position: relative;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 50%;
          width: 32px; height: 32px; min-height: unset;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 150ms ease, border-color 150ms ease, transform 150ms ease;
        }
        .header-cart-btn:hover {
          background: rgba(212,168,67,0.15);
          border-color: var(--gold);
          transform: scale(1.08);
        }
        .header-cart-btn:active { transform: scale(0.95); }

        .hamburger-btn {
          background: none; border: none;
          width: 36px; height: 36px; min-height: unset;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 4px; cursor: pointer; padding: 0;
        }

        .mobile-link {
          color: var(--cream-text, #EDE8E0);
          font-family: var(--font-inter), sans-serif;
          font-size: 15px; font-weight: 500;
          padding: 11px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          text-decoration: none; display: block;
          transition: color 150ms ease, padding-left 150ms ease;
        }
        .mobile-link:hover { color: var(--gold); padding-left: 6px; }

        /* ── Mobile-specific header styles ── */
        @media (max-width: 767px) {
          .site-header {
            /* Fully transparent at top — lets the hero show through */
            background-color: transparent !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            border-bottom: 1px solid transparent !important;
          }
          .site-header.scrolled {
            background-color: rgba(15, 27, 45, 0.82) !important;
            backdrop-filter: blur(16px) saturate(160%) !important;
            -webkit-backdrop-filter: blur(16px) saturate(160%) !important;
            border-bottom: 1px solid rgba(255,255,255,0.07) !important;
          }
          .header-inner {
            height: 44px !important;
          }
        }
      `}</style>

      <header
        className={`fixed top-0 z-50 w-full site-header${scrolled ? " scrolled" : ""}`}
        style={{
          backgroundColor: scrolled ? "rgba(15,27,45,0.98)" : "#0F1B2D",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.08)" : "transparent"}`,
          transition: "background-color 250ms ease, border-color 250ms ease, backdrop-filter 250ms ease",
        }}
      >
        <div className="layout-container flex items-center justify-between header-inner" style={{ height: 56 }}>
          {/* Logo */}
          <Link href="/" aria-label="SEMY – home" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <Image src="/images/logo-full-white.png" alt="SEMY — Urban Mobility, Reimagined" width={451} height={138} priority
              style={{ height: 32, width: "auto" }} />
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} onClick={(e) => handleNavClick(e, link.href)} className="nav-link">{link.label}</a>
            ))}
            <button className="header-cart-btn" id="header-cart-btn" onClick={openDrawer} aria-label={`Cart (${totalItems})`}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#EDE8E0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {totalItems > 0 && (
                <span style={{ position: "absolute", top: -5, right: -5, minWidth: 18, height: 18, borderRadius: 9, background: "var(--gold)", color: "#0F1B2D", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px", fontFamily: "var(--font-space-grotesk)", lineHeight: 1, animation: "badgePop 0.3s ease" }}>
                  {totalItems}
                </span>
              )}
            </button>
          </nav>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-1">
            <button className="header-cart-btn" id="header-cart-btn-mobile" onClick={openDrawer} aria-label={`Cart (${totalItems})`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EDE8E0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {totalItems > 0 && (
                <span style={{ position: "absolute", top: -4, right: -4, minWidth: 15, height: 15, borderRadius: 8, background: "var(--gold)", color: "#0F1B2D", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px", animation: "badgePop 0.3s ease" }}>
                  {totalItems}
                </span>
              )}
            </button>

            <button
              className="hamburger-btn"
              id="header-hamburger"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen(v => !v)}
            >
              {[0, 1, 2].map((i) => (
                <span key={i} style={{
                  display: "block", height: 1.5,
                  background: "#EDE8E0", borderRadius: 2,
                  transformOrigin: "center",
                  transition: "transform 220ms ease, opacity 220ms ease, width 220ms ease",
                  transform: mobileOpen
                    ? i === 0 ? "translateY(5.5px) rotate(45deg)"
                    : i === 2 ? "translateY(-5.5px) rotate(-45deg)"
                    : "none"
                    : "none",
                  opacity: mobileOpen && i === 1 ? 0 : 1,
                  width: !mobileOpen && i === 1 ? 14 : 20,
                }} />
              ))}
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        <div
          id="mobile-menu-panel"
          ref={menuRef}
          style={{
            backgroundColor: "rgba(15,27,45,0.92)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            overflow: "hidden",
            maxHeight: mobileOpen ? "280px" : "0",
            transition: "max-height 280ms cubic-bezier(0.4,0,0.2,1)",
            borderTop: mobileOpen ? "1px solid rgba(255,255,255,0.06)" : "none",
          }}
          className="md:hidden"
        >
          <nav className="layout-container flex flex-col py-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href} href={link.href}
                onClick={(e) => { setMobileOpen(false); handleNavClick(e, link.href); }}
                className="mobile-link"
              >
                {link.label}
              </a>
            ))}
            <span aria-hidden="true" style={{ display: "block", marginTop: 10, marginBottom: 12, height: 2, width: 24, background: "linear-gradient(90deg, #D4A843, #F0C060)", borderRadius: 2 }} />
          </nav>
        </div>
      </header>
    </>
  );
}
