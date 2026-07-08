"use client";

const members = [
  { name: "Alex M.", city: "New York", emoji: "🗽" },
  { name: "Priya K.", city: "London", emoji: "🇬🇧" },
  { name: "James R.", city: "Toronto", emoji: "🍁" },
  { name: "Sofia L.", city: "Berlin", emoji: "🇩🇪" },
  { name: "Arjun S.", city: "Mumbai", emoji: "🇮🇳" },
  { name: "Mia T.", city: "Sydney", emoji: "🦘" },
  { name: "Carlos B.", city: "São Paulo", emoji: "🇧🇷" },
  { name: "Yuki H.", city: "Tokyo", emoji: "🗼" },
  { name: "Fatima A.", city: "Dubai", emoji: "🇦🇪" },
  { name: "Noah C.", city: "San Francisco", emoji: "🌉" },
  { name: "Lena W.", city: "Amsterdam", emoji: "🇳🇱" },
  { name: "Ryan D.", city: "Chicago", emoji: "🏙️" },
];

// Duplicate for seamless loop
const doubled = [...members, ...members];

export default function MarqueeStrip() {
  return (
    <div
      style={{
        padding: "1.5rem 0",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.015)",
        overflow: "hidden",
      }}
    >
      <div className="marquee-wrap">
        <div className="marquee-track">
          {doubled.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                whiteSpace: "nowrap" as const,
                fontSize: "0.8125rem",
                color: "rgba(255,255,255,0.45)",
                fontWeight: 400,
                letterSpacing: "-0.01em",
              }}
            >
              <span style={{ fontSize: "1rem" }}>{m.emoji}</span>
              <span style={{ color: "rgba(255,255,255,0.70)", fontWeight: 500 }}>{m.name}</span>
              <span>from {m.city}</span>
              <span
                style={{
                  marginLeft: "0.75rem",
                  width: "3px",
                  height: "3px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.20)",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
