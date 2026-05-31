"use client";

export function LiveFeed({ steps }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {(steps ?? []).map((step, i) => (
        <div
          key={i}
          className="feed-step"
          style={{
            display: "flex", alignItems: "center", gap: 8,
            fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
            color: i === 0 ? "var(--brand)" : "var(--ink2)",
            animationDelay: `${i * 0.7}s`,
            animationFillMode: "both",
          }}
        >
          <span style={{ width: 14, textAlign: "center", fontSize: 13, lineHeight: 1 }}>
            {i === 0
              ? <span className="spin" style={{ display: "inline-block" }}>⟳</span>
              : "·"}
          </span>
          <span>{step.label}</span>
        </div>
      ))}
    </div>
  );
}
