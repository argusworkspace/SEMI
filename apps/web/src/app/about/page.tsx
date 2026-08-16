import { Metadata } from "next";
import FadeIn from "@/modules/shared/components/FadeIn";
import { COLOR_ASPHALT, COLOR_PAPER, COLOR_STEEL, COLOR_HAIRLINE } from "@/lib/design-tokens";

export const metadata: Metadata = {
  title: "About SEMY",
  description: "Our company was founded with the primary goal of becoming a trusted partner in the field of design and technology.",
};

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: COLOR_PAPER, paddingBottom: 120 }}>
      {/* ── 1. Page Header & Intro ─────────────────────────────────────────── */}
      <section
        style={{
          paddingTop: 80,
          paddingBottom: 64,
          borderBottom: `1px solid ${COLOR_HAIRLINE}`,
        }}
        className="layout-container text-center"
      >
        <FadeIn>
          <h1
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: 44,
              lineHeight: 1.2,
              fontWeight: 700,
              color: COLOR_ASPHALT,
              marginBottom: 32,
            }}
          >
            About SEMY
          </h1>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 18,
              lineHeight: 1.6,
              color: COLOR_STEEL,
              maxWidth: 800,
              marginInline: "auto",
            }}
            className="text-balance"
          >
            Our company was founded with the primary goal of becoming a trusted
            partner in the field of design and technology. We manufacture bicycles,
            e-cycles especially for in-campus drives for MNCs. We make sure the
            quality of each product we make and the customer satisfaction is our
            utmost priority than anything. We make the urban mobility easy, green
            and clean with our products.
          </p>
        </FadeIn>
      </section>

      {/* ── 2. Mission & Vision (Spec-sheet Layout) ────────────────────────── */}
      <section
        className="layout-container"
        style={{ paddingTop: 64 }}
      >
        <div
          style={{
            display: "grid",
            gap: 48,
          }}
          className="md:grid-cols-2"
        >
          {/* Mission Column */}
          <FadeIn delay={100}>
            <div
              style={{
                borderTop: `1px solid ${COLOR_HAIRLINE}`,
                paddingTop: 32,
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: 24,
                  fontWeight: 700,
                  color: COLOR_ASPHALT,
                  marginBottom: 16,
                }}
              >
                Our Mission
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 16,
                  lineHeight: 1.6,
                  color: COLOR_STEEL,
                  margin: 0,
                }}
              >
                At SEMY, our mission is to empower communities with innovative electric &amp; 
                pedal-powered cycles that offer safe, smart, and sustainable mobility solutions, 
                especially designed for campus and short-distance travel. We aim to make eco-friendly 
                transport accessible, affordable, and enjoyable for everyone
              </p>
            </div>
          </FadeIn>

          {/* Vision Column */}
          <FadeIn delay={200}>
            <div
              style={{
                borderTop: `1px solid ${COLOR_HAIRLINE}`,
                paddingTop: 32,
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: 24,
                  fontWeight: 700,
                  color: COLOR_ASPHALT,
                  marginBottom: 16,
                }}
              >
                Our Vision
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 16,
                  lineHeight: 1.6,
                  color: COLOR_STEEL,
                  margin: 0,
                }}
              >
                Our vision is to lead the future of sustainable urban commuting, shaping a world 
                where mobility is smarter, cleaner, and more connected than ever before. We aim to 
                redefine how campuses and cities move, replacing outdated, polluting transport with 
                innovative, people-friendly solutions. Every journey should be seamless, efficient, 
                and eco-conscious fostering healthier communities and a greener planet. At SEMY, we 
                believe in transforming urban mobility, one smart, efficient, and environmentally 
                responsible ride at a time.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
