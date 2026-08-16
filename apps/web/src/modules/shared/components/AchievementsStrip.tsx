interface AchievementCard {
  /** Absolute-from-public path, e.g. "/images/acheivements/dignitary-meet.jpeg" */
  image: string;
  title: string;
  caption: string;
}

interface AchievementsStripProps {
  achievements: AchievementCard[];
}

export default function AchievementsStrip({ achievements }: AchievementsStripProps) {
  return (
    <>
      <style>{`
        .achievements-card {
          background: #FFFFFF;
          border: 1.5px solid #E2DDD6;
          border-radius: 8px;
          overflow: hidden;
          transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
          box-shadow: 0 2px 8px rgba(15,27,45,0.04);
        }
        .achievements-card:hover {
          transform: translateY(-4px);
          border-color: #D4A843;
          box-shadow: 0 8px 24px rgba(15,27,45,0.08);
        }
        .achievements-card-img {
          width: 100%;
          aspect-ratio: 4 / 3;
          object-fit: cover;
          display: block;
        }
        .achievements-card-body {
          padding: 20px 20px 24px;
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
          className="layout-container"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 24,
          }}
        >
          {achievements.map((card, index) => (
            <div key={index} className="achievements-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.image}
                alt={card.title}
                className="achievements-card-img"
              />
              <div className="achievements-card-body">
                <div
                  style={{
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontSize: 17,
                    fontWeight: 700,
                    color: "#0F1B2D",
                    lineHeight: 1.3,
                    marginBottom: 8,
                  }}
                >
                  {card.title}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: 13,
                    color: "#8896A5",
                    lineHeight: 1.6,
                  }}
                >
                  {card.caption}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

