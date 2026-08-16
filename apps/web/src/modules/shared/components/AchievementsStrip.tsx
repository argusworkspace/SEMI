import {
  COLOR_VOLT,
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
    <>
      <style>{`
        .achievements-card {
          background: #FFFFFF;
          border: 1.5px solid #E2DDD6;
          border-radius: 8px;
          padding: 32px 24px;
          text-align: center;
          transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
          box-shadow: 0 2px 8px rgba(15,27,45,0.04);
        }
        .achievements-card:hover {
          transform: translateY(-4px);
          border-color: #D4A843;
          box-shadow: 0 8px 24px rgba(15,27,45,0.08);
        }
      `}</style>
      <section
        style={{
          background: "linear-gradient(135deg, #F7F3EE 0%, #EAE4D9 100%)",
          padding: "64px 16px",
          borderTop: "1px solid #E2DDD6",
          borderBottom: "1px solid #E2DDD6",
        }}
      >
        <div
          className="layout-container achievements-scroll"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
          }}
        >
          {achievements.map((achievement, index) => (
            <div key={index} className="achievements-card">
              <div
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: "clamp(32px, 5vw, 48px)",
                  fontWeight: 700,
                  color: "#0F1B2D",
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
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                  color: "#8896A5",
                  lineHeight: 1.4,
                  textTransform: "uppercase",
                }}
              >
                {achievement.label}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
