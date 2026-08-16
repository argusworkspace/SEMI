import {
  COLOR_VOLT,
  COLOR_STEEL,
  COLOR_HAIRLINE,
} from "@/lib/design-tokens";

export default function AboutPage() {
  return (
    <>
      <style>{`
        .about-story-card {
          background: #FFFFFF;
          border: 1.5px solid #E2DDD6;
          border-radius: 8px;
          padding: 32px;
          transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
          box-shadow: 0 4px 12px rgba(15,27,45,0.03);
        }
        .about-story-card:hover {
          transform: translateY(-4px); border-color: #D4A843;
          box-shadow: 0 8px 24px rgba(15,27,45,0.08);
        }

        .about-value-card {
          background: #FFFFFF;
          border: 1.5px solid #E2DDD6;
          border-radius: 8px;
          padding: 24px;
          transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
          box-shadow: 0 2px 8px rgba(15,27,45,0.02);
        }
        .about-value-card:hover {
          transform: translateY(-4px); border-color: #D4A843;
          box-shadow: 0 8px 24px rgba(15,27,45,0.08);
        }
      `}</style>

      <div style={{ backgroundColor: "#F7F3EE", paddingBottom: 64 }}>
        {/* Hero */}
        <section
          className="page-top-offset"
          style={{
            backgroundColor: "#0F1B2D",
            paddingLeft: 16,
            paddingRight: 16,
            paddingBottom: 48,
            textAlign: "center",
          }}
        >
          <div className="anim-fade-up visible" style={{ maxWidth: "700px", margin: "0 auto" }}>
            <h1
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: "clamp(32px, 5vw, 56px)",
                fontWeight: 700,
                color: "#FFFFFF",
                marginBottom: 16,
                lineHeight: 1.2,
              }}
            >
              About <span style={{ color: "#D4A843" }}>SEMY</span>
            </h1>
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "clamp(15px, 2.5vw, 18px)",
                color: "#8896A5",
                maxWidth: "580px",
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              Reimagining urban mobility for India, one electric bike at a time.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="layout-container" style={{ paddingTop: 56 }}>
          {/* Our Story */}
          <div className="anim-fade-up visible" style={{ marginBottom: 56 }}>
            <h2
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: "clamp(26px, 4vw, 36px)",
                fontWeight: 700,
                color: "#0F1B2D",
                marginBottom: 20,
              }}
            >
              Our Story
            </h2>
            <div
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "clamp(15px, 2.5vw, 16px)",
                color: "#4A5568",
                lineHeight: 1.8,
                maxWidth: "800px",
              }}
            >
              <p style={{ marginBottom: 16 }}>
                SEMY was born from a simple observation: India&apos;s urban commuters
                needed a better way to navigate crowded streets. Traditional
                petrol bikes were expensive to run and maintain, while existing
                electric options either lacked power or broke the bank.
              </p>
              <p style={{ marginBottom: 16 }}>
                We set out to build electric bikes that could handle real Indian
                conditions — potholed roads, steep inclines, monsoon weather, and
                daily 40km commutes. Bikes that didn&apos;t compromise on performance,
                reliability, or affordability.
              </p>
              <p style={{ margin: 0 }}>
                Today, SEMY bikes are helping thousands of riders across the
                country save money, reduce emissions, and reclaim time lost in
                traffic. We&apos;re just getting started.
              </p>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="anim-fade-up visible" style={{ marginBottom: 56 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
                gap: 20,
              }}
            >
              {[
                {
                  label: "Mission",
                  title: "Accessible Electric Mobility",
                  description: "Make electric two-wheelers affordable, reliable, and practical for every Indian commuter. No compromises on quality, performance, or service.",
                },
                {
                  label: "Vision",
                  title: "Cleaner, Smarter Cities",
                  description: "Lead India's transition to sustainable urban transport. Reduce emissions, cut commute costs, and prove that electric can be better than petrol — not just greener.",
                },
              ].map((item) => (
                <div key={item.label} className="about-story-card">
                  <div
                    style={{
                      display: "inline-block",
                      background: "linear-gradient(135deg, #D4A843, #F0C060)",
                      padding: "4px 12px",
                      borderRadius: 4,
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#0F1B2D",
                      marginBottom: 16,
                    }}
                  >
                    {item.label}
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-space-grotesk), sans-serif",
                      fontSize: 22,
                      fontWeight: 700,
                      color: "#0F1B2D",
                      marginBottom: 12,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: 15,
                      color: "#4A5568",
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Our Values */}
          <div className="anim-fade-up visible">
            <h2
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: "clamp(26px, 4vw, 36px)",
                fontWeight: 700,
                color: "#0F1B2D",
                marginBottom: 24,
              }}
            >
              Our Values
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))",
                gap: 20,
              }}
            >
              {[
                { title: "Built to Last", description: "We design for durability, not disposability. Every bike is tested to handle years of daily use." },
                { title: "Honest Pricing", description: "No hidden costs, no markup games. Fair prices backed by transparent service and warranty terms." },
                { title: "Customer First", description: "From booking to delivery to after-sales support, we're here when you need us." },
                { title: "Made in India", description: "Designed, engineered, and manufactured locally. Supporting Indian jobs and innovation." },
              ].map((value) => (
                <div key={value.title} className="about-value-card">
                  <h3
                    style={{
                      fontFamily: "var(--font-space-grotesk), sans-serif",
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#0F1B2D",
                      marginBottom: 10,
                    }}
                  >
                    {value.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: 14,
                      color: "#4A5568",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
