import Link from "next/link";
import {
  COLOR_ASPHALT,
  COLOR_PAPER,
  COLOR_VOLT,
} from "@/lib/design-tokens";

// Footer is a Server Component — no event handlers; hover via CSS class

const QUICK_LINKS = [
  { label: "Products",      href: "/products" },
  { label: "Manufacturing", href: "/manufacturing" },
  { label: "About",         href: "/about" },
  { label: "Contact",       href: "/contact" },
];

const CURRENT_YEAR = new Date().getFullYear();

// ── Reusable column heading ──────────────────────────────────────────────────
function ColHeading({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-space-grotesk), sans-serif",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: COLOR_VOLT,
        marginBottom: 16,
        margin: "0 0 16px",
      }}
    >
      {children}
    </p>
  );
}

// ── Reusable footer link — hover handled by .footer-link CSS class ────────────
function FooterLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const sharedStyle: React.CSSProperties = {
    color: COLOR_PAPER,
    fontFamily: "var(--font-inter), sans-serif",
    fontSize: 14,
    fontWeight: 400,
    textDecoration: "none",
    display: "block",
    marginBottom: 10,
  };

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="footer-link"
        style={sharedStyle}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className="footer-link" style={sharedStyle}>
      {children}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer
      style={{ backgroundColor: COLOR_ASPHALT }}
      aria-label="Site footer"
    >
      <div className="layout-container">
        {/* Top volt accent line */}
        <span
          aria-hidden="true"
          style={{
            display: "block",
            height: 2,
            width: 40,
            backgroundColor: COLOR_VOLT,
            borderRadius: 1,
            marginTop: 56,
            marginBottom: 48,
          }}
        />

        {/* 3-col desktop / 2-col tablet / 1-col mobile via .footer-grid CSS class */}
        <div className="footer-grid" style={{ display: "grid", gap: "40px 48px" }}>

          {/* ── Col 1: Brand blurb ──────────────────────────────────── */}
          <div>
            <p
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: 20,
                fontWeight: 700,
                color: COLOR_PAPER,
                margin: "0 0 12px",
                letterSpacing: "-0.01em",
              }}
            >
              SEMY
            </p>
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 14,
                lineHeight: "22px",
                color: COLOR_PAPER,
                opacity: 0.6,
                maxWidth: 280,
                margin: 0,
              }}
            >
              Urban mobility, reimagined for Indian roads. Built tough, designed
              sharp — electric two-wheelers that earn their keep every kilometre.
            </p>
          </div>

          {/* ── Col 2: Quick links ──────────────────────────────────── */}
          <div>
            <ColHeading>Quick Links</ColHeading>
            {QUICK_LINKS.map((l) => (
              <FooterLink key={l.href} href={l.href}>
                {l.label}
              </FooterLink>
            ))}
          </div>

          {/* ── Col 3: Contact ──────────────────────────────────────── */}
          <div>
            <ColHeading>Contact</ColHeading>
            <FooterLink href="tel:+917358110762">+91 73581 10762</FooterLink>
            <FooterLink href="mailto:hello@semy.in" external>
              hello@semy.in
            </FooterLink>
            <FooterLink href="https://wa.me/917358110762" external>
              WhatsApp Us ↗
            </FooterLink>
          </div>
        </div>

        {/* ── Bottom copyright bar ──────────────────────────────────────── */}
        <div
          style={{
            marginTop: 48,
            paddingTop: 20,
            paddingBottom: 28,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 12,
              color: COLOR_PAPER,
              opacity: 0.4,
              margin: 0,
            }}
          >
            © {CURRENT_YEAR} SEMY Electric. All rights reserved.
          </p>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 12,
              color: COLOR_PAPER,
              opacity: 0.4,
              margin: 0,
            }}
          >
            Made in India 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  );
}
