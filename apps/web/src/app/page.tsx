"use client";

import { useEffect, useRef, useState } from "react";
import ProductCard from "@/modules/products/components/ProductCard";
import AchievementsStrip from "@/modules/shared/components/AchievementsStrip";
import HeroBackground from "@/modules/shared/components/HeroBackground";
import { MOCK_PRODUCTS } from "@/lib/mock-products";
import { COLOR_ASPHALT, COLOR_VOLT, COLOR_PAPER, COLOR_STEEL, COLOR_HAIRLINE } from "@/lib/design-tokens";

// TODO: confirm exact event name/date with client before shipping Card 1 caption.
const ACHIEVEMENTS = [
  {
    image: "/images/acheivements/dignitary-meet.jpeg",
    title: "Appreciated by the Vice President of India",
    // TODO: confirm wording with client — placeholder, do not ship without sign-off
    caption:
      "SEMY was appreciated by Shri C.P. Radhakrishnan, Vice President of India.",
  },
  {
    image: "/images/acheivements/sunset-ride.jpeg",
    title: "Built for the Open Road",
    caption: "A SEMY out on an evening ride — real rides, real roads.",
  },
  {
    image: "/images/acheivements/happy-rider.jpeg",
    title: "Riders Love It",
    caption: "One of our riders with his SEMY — built tough, ridden daily.",
  },
  {
    image: "/images/acheivements/raj.jpeg",
    title: "Recognized by Raj Madhuram, Co-Founder & CTO of C1X Inc",
    caption:
      "SEMY was showcased to Raj Madhuram, Co-Founder & CTO of C1X Inc, as an innovative electric mobility solution bringing sustainable transportation to the community.",
  },
  {
    image: "/images/acheivements/iskcon-swami.jpeg",
    title: "Presented to HH BHAKTI VINOD SWAMI, ISKCON LEADER",
    caption: "Presented to HH BHAKTI VINOD SWAMI, ISKCON LEADER",
  },
];

export default function Home() {
  const productGridRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const cards = productGridRef.current?.querySelectorAll(".product-card-wrapper");
    if (!cards || cards.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute("data-index") || "0");
            setTimeout(() => { entry.target.classList.add("visible"); }, index * 80);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || "home";
      setActiveSection(hash);
      const element = document.getElementById(hash);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    };
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Scroll directly rather than relying on the "hashchange" event — the browser
  // only fires that event when the hash actually changes, so this silently did
  // nothing if the hash was already "#products" (e.g. clicked once already, or
  // arrived via a #products link).
  function scrollToProducts() {
    setActiveSection("products");
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
    if (window.location.hash !== "#products") window.location.hash = "products";
  }

  return (
    <>
      <style>{`
        .hero-btn {
          background: linear-gradient(135deg, #D4A843 0%, #E8BB55 100%);
          color: #0F1B2D;
          font-family: var(--font-space-grotesk), sans-serif;
          font-size: 16px; font-weight: 700;
          padding: 16px 40px; border: none; border-radius: 8px;
          cursor: pointer;
          transition: transform 150ms ease, box-shadow 150ms ease;
          box-shadow: 0 4px 16px rgba(212,168,67,0.3);
          position: relative; overflow: hidden;
        }
        .hero-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(212,168,67,0.4);
        }
        .hero-btn:active { transform: scale(0.98); }
        .hero-btn::after {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 60%);
          transform: scale(0); opacity: 0; transition: transform 0.5s ease, opacity 0.5s ease;
        }
        .hero-btn:active::after { transform: scale(3); opacity: 1; transition: 0s; }

        .mfg-card {
          background: #FFFFFF;
          border: 1.5px solid #E2DDD6;
          border-radius: 8px; padding: 24px;
          transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
        }
        .mfg-card:hover {
          transform: translateY(-4px); border-color: #D4A843;
          box-shadow: 0 8px 24px rgba(15,27,45,0.06);
        }

        .about-card {
          background: #FFFFFF;
          border: 1.5px solid #E2DDD6;
          border-radius: 8px; padding: 28px 24px;
          transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
        }
        .about-card:hover {
          transform: translateY(-4px); border-color: #D4A843;
          box-shadow: 0 8px 24px rgba(15,27,45,0.06);
        }

        .contact-card {
          background: #FFFFFF;
          border: 1.5px solid #E2DDD6;
          border-radius: 8px; padding: 28px 24px; text-decoration: none; display: block;
          transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
        }
        .contact-card:hover {
          transform: translateY(-4px); border-color: #D4A843;
          box-shadow: 0 8px 24px rgba(15,27,45,0.06);
        }
      `}</style>
      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section
        id="home"
        style={{
          /* minHeight is intentionally omitted here — CSS owns it:
             globals.css @media (max-width:767px) → 65svh (reduces portrait crop on mobile)
             globals.css @media (min-width:768px)  → 100svh (full-viewport cinematic on desktop) */
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 16px",
          position: "relative",
          overflow: "hidden",
          /* Pull the section up so it starts at the very top edge, behind the fixed header */
          marginTop: "-56px",
        }}
        className="hero-section"
      >
        {/* Layer 1 — auto-advancing showcase slideshow, all screen sizes */}
        <HeroBackground />

        {/* Layer 2 — dark overlay for text contrast */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0,
            backgroundColor: "rgba(15, 27, 45, 0.70)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* Content — paddingTop clears the fixed header (marginTop:-56px pulls the section
             up behind it, so content needs to push down by the same amount) */}
        <div
          className="anim-fade-up visible hero-content-inner"
          style={{
            maxWidth: "1200px", width: "100%", textAlign: "center",
            position: "relative", zIndex: 10,
            paddingTop: "56px",   /* desktop header height */
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: "clamp(32px, 7vw, 64px)",
              fontWeight: 700, color: "#FFFFFF",
              marginBottom: 16, lineHeight: 1.1, padding: "0 8px",
            }}
          >
            Urban mobility, reimagined
            <br />
            <span style={{ color: "#D4A843" }}>for Indian roads.</span>
          </h1>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "clamp(15px, 3.5vw, 20px)",
              color: "#8896A5",
              marginBottom: 32, maxWidth: "580px", marginInline: "auto",
              lineHeight: 1.6, padding: "0 8px",
            }}
          >
            Electric bikes built for power, range, and everyday reliability.
            Book yours with just ₹5,000 advance.
          </p>
          <button onClick={scrollToProducts} className="hero-btn" style={{ width: "auto", maxWidth: "100%" }}>
            Explore Our Bikes
          </button>
        </div>
      </section>


      {/* ── Products ──────────────────────────────────────────────────────── */}
      <section id="products" className="layout-container" style={{ paddingTop: "clamp(40px, 6vw, 64px)", paddingBottom: "clamp(40px, 6vw, 64px)" }}>
        <h2 style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: "clamp(26px, 5vw, 36px)", fontWeight: 700, marginBottom: 8, color: "#0F1B2D" }}>
          Our Bikes
        </h2>
        <p style={{ fontSize: 15, color: "#8896A5", marginBottom: 32, fontFamily: "var(--font-inter), sans-serif" }}>
          Reserve yours with a <strong style={{ color: "#D4A843" }}>₹5,000 advance</strong> — balance collected on delivery.
        </p>
        <div
          ref={productGridRef} id="product-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))", gap: 20 }}
        >
          {MOCK_PRODUCTS.map((p, index) => (
            <div key={p.id} className="product-card-wrapper anim-fade-up" data-index={index}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Manufacturing ─────────────────────────────────────────────────── */}
      <section id="manufacturing" style={{ backgroundColor: "#F7F3EE", padding: "clamp(40px, 6vw, 64px) 16px" }}>
        <div className="layout-container">
          <h2 style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: "clamp(26px, 5vw, 42px)", fontWeight: 700, color: "#0F1B2D", marginBottom: 16, textAlign: "center" }}>
            Manufacturing Excellence
          </h2>
          <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "clamp(14px, 3vw, 18px)", color: "#8896A5", maxWidth: "580px", margin: "0 auto 40px", textAlign: "center", lineHeight: 1.6 }}>
            Built with precision, tested for durability. Every SEMY bike is engineered to handle Indian road conditions.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 16 }}>
            {[
              { title: "Frame Welding", description: "High-strength steel frames welded using automated jigs for perfect alignment and durability." },
              { title: "Component Integration", description: "Battery, motor, and electronics integrated with strict quality checks at each stage." },
              { title: "Road Testing", description: "Every bike undergoes real-world testing on various terrains before shipment." },
            ].map((step) => (
              <div key={step.title} className="mfg-card">
                <h3 style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: 18, fontWeight: 700, color: "#D4A843", marginBottom: 12 }}>{step.title}</h3>
                <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, color: "#162033", lineHeight: 1.6, margin: 0 }}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Achievements ──────────────────────────────────────────────────── */}
      <AchievementsStrip achievements={ACHIEVEMENTS} />

      {/* ── About ─────────────────────────────────────────────────────────── */}
      <section id="about" className="layout-container" style={{ paddingTop: "clamp(40px, 6vw, 64px)", paddingBottom: "clamp(40px, 6vw, 64px)" }}>
        <h2 style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: "clamp(26px, 5vw, 36px)", fontWeight: 700, color: "#0F1B2D", marginBottom: 40, textAlign: "center" }}>
          About SEMY
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 16, maxWidth: "1000px", margin: "0 auto" }}>
          {[
            { label: "Vision", title: "Leading Sustainable Urban Commuting", description: "We aim to redefine how campuses and cities move, replacing outdated, polluting transport with smart, people-friendly, eco-conscious solutions — one responsible ride at a time." },
            { label: "Mission", title: "Empowering Smart, Sustainable Mobility", description: "We empower communities with innovative electric & pedal-powered cycles offering safe, smart, sustainable mobility — designed for campus and short-distance travel, accessible and affordable for everyone." },
            { label: "SEMY", title: "Reconnect With Your Childhood", description: "Every journey begins with a bicycle — a timeless companion of childhood carrying joy, freedom, and memories. Ride with us and reconnect with the spirit of your childhood." },
            { label: "Values", title: "Built to Last", description: "Honest pricing, customer-first service, and products designed for durability. Made in India 🇮🇳" },
          ].map((item) => (
            <div key={item.label} className="about-card">
              <div style={{ display: "inline-block", background: "linear-gradient(135deg, #D4A843, #F0C060)", padding: "4px 12px", borderRadius: 4, fontFamily: "var(--font-inter), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#0F1B2D", marginBottom: 16 }}>{item.label}</div>
              <h3 style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: 20, fontWeight: 700, color: "#0F1B2D", marginBottom: 12 }}>{item.title}</h3>
              <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, color: "#8896A5", lineHeight: 1.6, margin: 0 }}>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact ───────────────────────────────────────────────────────── */}
      <section id="contact" style={{ backgroundColor: "#0F1B2D", padding: "clamp(40px, 6vw, 64px) 16px" }}>
        <div className="layout-container">
          <h2 style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: "clamp(26px, 5vw, 42px)", fontWeight: 700, color: "#FFFFFF", marginBottom: 16, textAlign: "center" }}>
            Get in Touch
          </h2>
          <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "clamp(14px, 2.5vw, 18px)", color: "#8896A5", maxWidth: "580px", margin: "0 auto 40px", textAlign: "center" }}>
            Questions about our bikes? Ready to book? We&apos;re here to help.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 16, maxWidth: "1000px", margin: "0 auto" }}>
            {[
              { label: "Phone", value: "+91 73581 10762", href: "tel:+917358110762", note: "Mon–Sat, 9 AM – 6 PM IST" },
              { label: "Email", value: "semy.office@gmail.com", href: "mailto:semy.office@gmail.com", note: "We'll respond within 24 hours" },
              { label: "WhatsApp", value: "Message Us ↗", href: "https://wa.me/917358110762", note: "Quick replies during business hours", external: true },
            ].map((contact) => (
              <a
                key={contact.label} href={contact.href}
                target={(contact as {external?: boolean}).external ? "_blank" : undefined}
                rel={(contact as {external?: boolean}).external ? "noopener noreferrer" : undefined}
                className="contact-card"
                style={{ background: "#162033", borderColor: "rgba(255,255,255,0.08)" }}
              >
                <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#D4A843", marginBottom: 12 }}>{contact.label}</div>
                <div style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: 20, fontWeight: 700, color: "#FFFFFF", marginBottom: 8 }}>{contact.value}</div>
                <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "#8896A5" }}>{contact.note}</div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
