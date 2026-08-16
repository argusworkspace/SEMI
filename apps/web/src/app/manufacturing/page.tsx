import {
  COLOR_PAPER,
  COLOR_ASPHALT,
  COLOR_STEEL,
  COLOR_VOLT,
  COLOR_HAIRLINE,
} from "@/lib/design-tokens";

export default function ManufacturingPage() {
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
            Manufacturing Excellence
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
            Built with precision, tested for durability. Every SEMY bike is
            engineered to handle Indian road conditions.
          </p>
        </div>
      </section>

      {/* Content sections */}
      <section className="layout-container" style={{ paddingTop: 64, paddingBottom: 64 }}>
        {/* Manufacturing Process */}
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
            Our Manufacturing Process
          </h2>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 16,
              color: COLOR_STEEL,
              lineHeight: 1.7,
              marginBottom: 32,
              maxWidth: "800px",
            }}
          >
            From frame fabrication to final assembly, every step is carefully
            controlled to ensure consistent quality. Our facility combines
            modern automation with skilled craftsmanship.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {[
              {
                title: "Frame Welding",
                description:
                  "High-strength steel frames welded using automated jigs for perfect alignment and durability.",
              },
              {
                title: "Component Integration",
                description:
                  "Battery, motor, and electronics integrated with strict quality checks at each stage.",
              },
              {
                title: "Road Testing",
                description:
                  "Every bike undergoes real-world testing on various terrains before shipment.",
              },
            ].map((step) => (
              <div
                key={step.title}
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
                    marginBottom: 12,
                  }}
                >
                  {step.title}
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
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Standards */}
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
            Quality Standards
          </h2>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 16,
              color: COLOR_STEEL,
              lineHeight: 1.7,
              marginBottom: 32,
              maxWidth: "800px",
            }}
          >
            We maintain rigorous quality control at every production stage.
            Each component is tested to meet or exceed industry standards.
          </p>

          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: `1px solid ${COLOR_HAIRLINE}`,
              borderRadius: 2,
              padding: 32,
            }}
          >
            <ul
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 15,
                color: COLOR_STEEL,
                lineHeight: 1.8,
                paddingLeft: 20,
                margin: 0,
              }}
            >
              <li style={{ marginBottom: 12 }}>
                <strong style={{ color: COLOR_ASPHALT }}>Battery Safety:</strong>{" "}
                LiFePO4 cells with BMS protection and thermal management
              </li>
              <li style={{ marginBottom: 12 }}>
                <strong style={{ color: COLOR_ASPHALT }}>Motor Testing:</strong>{" "}
                Load tests simulating uphill climbs and continuous operation
              </li>
              <li style={{ marginBottom: 12 }}>
                <strong style={{ color: COLOR_ASPHALT }}>Frame Durability:</strong>{" "}
                Stress testing for weight capacity and impact resistance
              </li>
              <li style={{ marginBottom: 12 }}>
                <strong style={{ color: COLOR_ASPHALT }}>Weather Resistance:</strong>{" "}
                Water and dust ingress protection for electronics
              </li>
              <li style={{ margin: 0 }}>
                <strong style={{ color: COLOR_ASPHALT }}>Final Inspection:</strong>{" "}
                Multi-point checklist before every bike ships
              </li>
            </ul>
          </div>
        </div>

        {/* Sustainability */}
        <div>
          <h2
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: 28,
              fontWeight: 700,
              color: COLOR_ASPHALT,
              marginBottom: 16,
            }}
          >
            Sustainable Manufacturing
          </h2>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 16,
              color: COLOR_STEEL,
              lineHeight: 1.7,
              marginBottom: 24,
              maxWidth: "800px",
            }}
          >
            Our commitment extends beyond product quality. We implement
            eco-friendly practices throughout our manufacturing process.
          </p>

          <div
            style={{
              display: "inline-block",
              backgroundColor: COLOR_VOLT,
              color: COLOR_ASPHALT,
              padding: "12px 24px",
              borderRadius: 2,
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            Made in India 🇮🇳
          </div>
        </div>
      </section>
    </div>
  );
}
