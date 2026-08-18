import Link from "next/link";
import Image from "next/image";
import {
  COLOR_VOLT,
} from "@/lib/design-tokens";

const QUICK_LINKS = [
  { label: "Products",      href: "#products" },
  { label: "Manufacturing", href: "#manufacturing" },
  { label: "About",         href: "#about" },
  { label: "Contact",       href: "#contact" },
];

const CURRENT_YEAR = new Date().getFullYear();

function ColHeading({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-space-grotesk), sans-serif",
        fontSize: 12,
        fontWeight: 700,
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
    color: "#EDE8E0",
    fontFamily: "var(--font-inter), sans-serif",
    fontSize: 14,
    fontWeight: 400,
    textDecoration: "none",
    marginBottom: 10,
    minHeight: 44,
    display: "flex",
    alignItems: "center",
  };

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="footer-link" style={sharedStyle}>
        {children}
      </a>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} className="footer-link" style={sharedStyle}>
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
    <footer style={{ backgroundColor: "#0F1B2D", position: "relative", overflow: "hidden" }} aria-label="Site footer">
      <div className="layout-container">
        {/* Top gold accent line */}
        <span
          aria-hidden="true"
          style={{
            display: "block",
            height: 3,
            width: 48,
            background: "linear-gradient(90deg, #D4A843, #F0C060)",
            borderRadius: 2,
            marginTop: 56,
            marginBottom: 48,
          }}
        />

        <div className="footer-grid">
          {/* ── Col 1: Brand blurb ──────────────────────────────────── */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <Image src="/images/logo-icon-white.png" alt="" aria-hidden="true" width={164} height={99}
                style={{ height: 28, width: "auto", flexShrink: 0 }} />
              <p
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#FFFFFF",
                  margin: 0,
                  letterSpacing: "-0.01em",
                }}
              >
                SEMY
              </p>
            </div>
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 14,
                lineHeight: "24px",
                color: "#8896A5",
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
            <FooterLink href="mailto:semy.office@gmail.com" external>
              semy.office@gmail.com
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
            paddingTop: 24,
            paddingBottom: 32,
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
              color: "#8896A5",
              margin: 0,
            }}
          >
            © {CURRENT_YEAR} SEMY Electric. All rights reserved.
          </p>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 12,
              color: "#8896A5",
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
