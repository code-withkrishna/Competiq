"use client";

const PRIORITY = {
  high:   { label: "High",   bg: "#fee2e2", color: "#b91c1c", border: "#fecaca" },
  medium: { label: "Medium", bg: "#fef3c7", color: "#92400e", border: "#fde68a" },
  low:    { label: "Low",    bg: "#dbeafe", color: "#1d4ed8", border: "#bfdbfe" },
};

export function Recommendations({ recs }) {
  if (!recs?.length) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {recs.map((rec, i) => {
        const p = PRIORITY[rec.priority] ?? PRIORITY.low;
        return (
          <div key={i} style={{
            display: "flex", gap: 12, padding: "12px 14px",
            background: "var(--s0)", border: "1px solid var(--s3)",
            borderRadius: "var(--r-md)", alignItems: "flex-start",
          }}>
            <div style={{
              width: 26, height: 26, borderRadius: "50%",
              background: "var(--brand)", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700, flexShrink: 0,
            }}>{i + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                <p style={{ fontWeight: 600, fontSize: 13 }}>{rec.action}</p>
                <span style={{
                  padding: "1px 8px", borderRadius: 99, fontSize: 10, fontWeight: 700,
                  textTransform: "uppercase", background: p.bg,
                  color: p.color, border: `1px solid ${p.border}`,
                }}>{p.label}</span>
              </div>
              <p style={{ fontSize: 12, color: "var(--ink2)", lineHeight: 1.55 }}>{rec.rationale}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
