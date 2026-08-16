import {
  COLOR_PAPER,
  COLOR_ASPHALT,
  COLOR_STEEL,
  COLOR_HAIRLINE,
} from "@/lib/design-tokens";

interface Achievement {
  value: string;
  label: string;
}

interface AchievementsStripProps {
  achievements: Achievement[];
}

export default function AchievementsStrip({ achievements }: AchievementsStripProps) {
  return (
    <section
      style={{
        backgroundColor: COLOR_PAPER,
        padding: "64px 20px",
      }}
    >
      <div
        className="layout-container"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 24,
        }}
      >
        {achievements.map((achievement, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#FFFFFF",
              border: `1px solid ${COLOR_HAIRLINE}`,
              borderRadius: 2,
              padding: "32px 24px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: "clamp(36px, 5vw, 48px)",
                fontWeight: 700,
                color: COLOR_ASPHALT,
                lineHeight: 1.1,
                marginBottom: 8,
              }}
            >
              {achievement.value}
            </div>
            <div
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: "0.02em",
                color: COLOR_STEEL,
                lineHeight: 1.4,
              }}
            >
              {achievement.label}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: Add horizontal scroll hint on small screens */}
      <style jsx>{`
        @media (max-width: 640px) {
          .layout-container {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scroll-snap-type: x mandatory;
            display: flex !important;
            gap: 16px;
            padding-bottom: 8px;
          }
          .layout-container > div {
            scroll-snap-align: start;
            flex: 0 0 280px;
          }
        }
      `}</style>
    </section>
  );
}
