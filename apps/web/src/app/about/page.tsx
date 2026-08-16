import {
  COLOR_PAPER,
  COLOR_ASPHALT,
  COLOR_STEEL,
  COLOR_VOLT,
  COLOR_HAIRLINE,
} from "@/lib/design-tokens";

export default function AboutPage() {
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
            About SEMY
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
            Reimagining urban mobility for India, one electric bike at a time.
          </p>
        </div>
      </section>

      {/* Content sections */}
      <section className="layout-container" style={{ paddingTop: 64, paddingBottom: 64 }}>
        {/* Our Story */}
        <div style={{ marginBottom: 64 }}>
          <h2
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: 28,
              fontWeight: 700,
              color: COLOR_ASPHALT,
              marginBottom: 16,
            }}
          >
            Our Story
          </h2>
          <div
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 16,
              color: COLOR_STEEL,
              lineHeight: 1.8,
              maxWidth: "800px",
            }}
          >
            <p style={{ marginBottom: 20 }}>
              SEMY was born from a simple observation: India's urban commuters
              needed a better way to navigate crowded streets. Traditional
              petrol bikes were expensive to run and maintain, while existing
              electric options either lacked power or broke the bank.
            </p>
            <p style={{ marginBottom: 20 }}>
              We set out to build electric bikes that could handle real Indian
              conditions — potholed roads, steep inclines, monsoon weather, and
              daily 40km commutes. Bikes that didn't compromise on performance,
              reliability, or affordability.
            </p>
            <p style={{ margin: 0 }}>
              Today, SEMY bikes are helping thousands of riders across the
              country save money, reduce emissions, and reclaim time lost in
              traffic. We're just getting started.
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div style={{ marginBottom: 64 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 32,
            }}
          >
            {/* Mission */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                border: `1px solid ${COLOR_HAIRLINE}`,
                borderRadius: 2,
                padding: 32,
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  backgroundColor: COLOR_VOLT,
                  padding: "6px 12px",
                  borderRadius: 2,
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: COLOR_ASPHALT,
                  marginBottom: 16,
                }}
              >
                Mission
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: COLOR_ASPHALT,
                  marginBottom: 12,
                }}
              >
                Accessible Electric Mobility
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 15,
                  color: COLOR_STEEL,
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                Make electric two-wheelers affordable, reliable, and practical
                for every Indian commuter. No compromises on quality,
                performance, or service.
              </p>
            </div>

            {/* Vision */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                border: `1px solid ${COLOR_HAIRLINE}`,
                borderRadius: 2,
                padding: 32,
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  backgroundColor: COLOR_VOLT,
                  padding: "6px 12px",
                  borderRadius: 2,
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: COLOR_ASPHALT,
                  marginBottom: 16,
                }}
              >
                Vision
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: COLOR_ASPHALT,
                  marginBottom: 12,
                }}
              >
                Cleaner, Smarter Cities
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 15,
                  color: COLOR_STEEL,
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                Lead India's transition to sustainable urban transport. Reduce
                emissions, cut commute costs, and prove that electric can be
                better than petrol — not just greener.
              </p>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div>
          <h2
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: 28,
              fontWeight: 700,
              color: COLOR_ASPHALT,
              marginBottom: 24,
            }}
          >
            Our Values
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 24,
            }}
          >
            {[
              {
                title: "Built to Last",
                description:
                  "We design for durability, not disposability. Every bike is tested to handle years of daily use.",
              },
              {
                title: "Honest Pricing",
                description:
                  "No hidden costs, no markup games. Fair prices backed by transparent service and warranty terms.",
              },
              {
                title: "Customer First",
                description:
                  "From booking to delivery to after-sales support, we're here when you need us.",
              },
              {
                title: "Made in India",
                description:
                  "Designed, engineered, and manufactured locally. Supporting Indian jobs and innovation.",
              },
            ].map((value) => (
              <div
                key={value.title}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: `1px solid ${COLOR_HAIRLINE}`,
                  borderRadius: 2,
                  padding: 24,
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: COLOR_ASPHALT,
                    marginBottom: 10,
                  }}
                >
                  {value.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: 14,
                    color: COLOR_STEEL,
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
  );
}
