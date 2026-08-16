"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { COLOR_ASPHALT, COLOR_PAPER, COLOR_VOLT, COLOR_STEEL } from "@/lib/design-tokens";

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

  // Add a subtle 1px bottom border once user scrolls — no shadow, per spec
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close panel on outside click
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    if (mobileOpen) document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [mobileOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        backgroundColor: COLOR_ASPHALT,
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
        transition: "border-bottom 200ms ease",
      }}
    >
      {/* ── Inner container ─────────────────────────────────────────────── */}
      <div className="layout-container flex items-center justify-between h-14">

        {/* ── Wordmark (left) ─────────────────────────────────────────── */}
        <Link
          href="/"
          className="flex items-center gap-2 select-none"
          aria-label="SEMY – home"
        >
          {/* Logo mark: a small volt-coloured square — placeholder */}
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              width: 20,
              height: 20,
              backgroundColor: COLOR_VOLT,
              borderRadius: 2,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: 22,
              fontWeight: 700,
              lineHeight: 1,
              color: COLOR_PAPER,
              letterSpacing: "-0.01em",
            }}
          >
            SEMY
          </span>
        </Link>

        {/* ── Desktop nav (right) ─────────────────────────────────────── */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                color: COLOR_PAPER,
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 14,
                fontWeight: 500,
                opacity: 0.85,
                textDecoration: "none",
                letterSpacing: "0.01em",
                transition: "opacity 150ms ease",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* ── Hamburger button (mobile only) ──────────────────────────── */}
        <button
          id="header-hamburger"
          className="flex md:hidden flex-col justify-center items-center gap-[5px] w-10 h-10"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu-panel"
          onClick={() => setMobileOpen((v) => !v)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          {/* Three-line icon that morphs to X */}
          <span
            style={{
              display: "block",
              width: 22,
              height: 1.5,
              background: COLOR_PAPER,
              borderRadius: 1,
              transformOrigin: "center",
              transition: "transform 200ms ease, opacity 200ms ease",
              transform: mobileOpen ? "translateY(6.5px) rotate(45deg)" : "none",
            }}
          />
          <span
            style={{
              display: "block",
              width: 22,
              height: 1.5,
              background: COLOR_PAPER,
              borderRadius: 1,
              transition: "opacity 200ms ease",
              opacity: mobileOpen ? 0 : 1,
            }}
          />
          <span
            style={{
              display: "block",
              width: 22,
              height: 1.5,
              background: COLOR_PAPER,
              borderRadius: 1,
              transformOrigin: "center",
              transition: "transform 200ms ease, opacity 200ms ease",
              transform: mobileOpen ? "translateY(-6.5px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </div>

      {/* ── Mobile slide-down panel ──────────────────────────────────────── */}
      <div
        id="mobile-menu-panel"
        ref={menuRef}
        role="navigation"
        aria-label="Mobile navigation"
        style={{
          backgroundColor: COLOR_ASPHALT,
          overflow: "hidden",
          maxHeight: mobileOpen ? "320px" : "0",
          transition: "max-height 280ms cubic-bezier(0.4, 0, 0.2, 1)",
          borderTop: mobileOpen ? "1px solid rgba(255,255,255,0.08)" : "none",
        }}
        className="md:hidden"
      >
        <nav className="layout-container flex flex-col py-4 gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                color: COLOR_PAPER,
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 16,
                fontWeight: 500,
                padding: "10px 0",
                borderBottom: `1px solid rgba(255,255,255,0.06)`,
                textDecoration: "none",
                display: "block",
                opacity: 0.9,
              }}
            >
              {link.label}
            </a>
          ))}

          {/* Small volt accent line at bottom of panel */}
          <span
            aria-hidden="true"
            style={{
              display: "block",
              marginTop: 16,
              height: 2,
              width: 32,
              backgroundColor: COLOR_VOLT,
              borderRadius: 1,
            }}
          />
        </nav>
      </div>
    </header>
  );
}
