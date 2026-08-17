"use client";

import {
  COLOR_PAPER,
  COLOR_ASPHALT,
  COLOR_STEEL,
  COLOR_VOLT,
  COLOR_HAIRLINE,
} from "@/lib/design-tokens";

export default function ContactPage() {
  return (
    <div style={{ backgroundColor: COLOR_PAPER }}>
      {/* Hero section */}
      <section
        style={{
          backgroundColor: COLOR_ASPHALT,
          padding: "80px 20px 60px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 700,
              color: "#FFFFFF",
              marginBottom: 20,
              lineHeight: 1.2,
            }}
          >
            Get in Touch
          </h1>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "clamp(15px, 2vw, 18px)",
              color: COLOR_STEEL,
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Questions about our bikes? Ready to book? We're here to help.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="layout-container" style={{ paddingTop: 64, paddingBottom: 64 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 32,
            marginBottom: 64,
          }}
        >
          {/* Phone */}
          <a
            href="tel:+917358110762"
            style={{
              backgroundColor: "#FFFFFF",
              border: `1px solid ${COLOR_HAIRLINE}`,
              borderRadius: 2,
              padding: 32,
              textDecoration: "none",
              display: "block",
              transition: "border-color 150ms ease",
              minHeight: "44px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = COLOR_VOLT;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = COLOR_HAIRLINE;
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: COLOR_STEEL,
                marginBottom: 12,
              }}
            >
              Phone
            </div>
            <div
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: 20,
                fontWeight: 700,
                color: COLOR_ASPHALT,
                marginBottom: 8,
              }}
            >
              +91 73581 10762
            </div>
            <div
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 14,
                color: COLOR_STEEL,
              }}
            >
              Mon–Sat, 9 AM – 6 PM IST
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:hello@semy.in"
            style={{
              backgroundColor: "#FFFFFF",
              border: `1px solid ${COLOR_HAIRLINE}`,
              borderRadius: 2,
              padding: 32,
              textDecoration: "none",
              display: "block",
              transition: "border-color 150ms ease",
              minHeight: "44px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = COLOR_VOLT;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = COLOR_HAIRLINE;
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: COLOR_STEEL,
                marginBottom: 12,
              }}
            >
              Email
            </div>
            <div
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: 20,
                fontWeight: 700,
                color: COLOR_ASPHALT,
                marginBottom: 8,
              }}
            >
              hello@semy.in
            </div>
            <div
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 14,
                color: COLOR_STEEL,
              }}
            >
              We'll respond within 24 hours
            </div>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/917358110762"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: "#FFFFFF",
              border: `1px solid ${COLOR_HAIRLINE}`,
              borderRadius: 2,
              padding: 32,
              textDecoration: "none",
              display: "block",
              transition: "border-color 150ms ease",
              minHeight: "44px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = COLOR_VOLT;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = COLOR_HAIRLINE;
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: COLOR_STEEL,
                marginBottom: 12,
              }}
            >
              WhatsApp
            </div>
            <div
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: 20,
                fontWeight: 700,
                color: COLOR_ASPHALT,
                marginBottom: 8,
              }}
            >
              Message Us ↗
            </div>
            <div
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 14,
                color: COLOR_STEEL,
              }}
            >
              Quick replies during business hours
            </div>
          </a>
        </div>

        {/* Additional Info */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: `1px solid ${COLOR_HAIRLINE}`,
            borderRadius: 2,
            padding: 40,
            maxWidth: "800px",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: 24,
              fontWeight: 700,
              color: COLOR_ASPHALT,
              marginBottom: 20,
            }}
          >
            How Can We Help?
          </h2>
          <div
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 15,
              color: COLOR_STEEL,
              lineHeight: 1.7,
            }}
          >
            <p style={{ marginBottom: 16 }}>
              Whether you have questions about our bikes, need help with
              booking, or want to discuss bulk orders for your organization,
              we're here to assist.
            </p>
            <p style={{ marginBottom: 16 }}>
              <strong style={{ color: COLOR_ASPHALT }}>Sales & Booking:</strong>{" "}
              Get product details, pricing, and reserve your bike with ₹5,000
              advance.
            </p>
            <p style={{ marginBottom: 16 }}>
              <strong style={{ color: COLOR_ASPHALT }}>After-Sales Support:</strong>{" "}
              Service queries, warranty claims, and technical assistance.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: COLOR_ASPHALT }}>Partnerships:</strong>{" "}
              Corporate orders, fleet deals, and dealer inquiries.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
