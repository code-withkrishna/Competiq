"use client";

const SIGNAL = {
  bullish: { bg:"#f0fdf4", border:"#bbf7d0", dot:"var(--green)", labelBg:"var(--green-light)", labelColor:"#15803d", label:"↑ Bullish" },
  bearish: { bg:"#fef2f2", border:"#fecaca", dot:"var(--red)",   labelBg:"var(--red-light)",   labelColor:"#b91c1c", label:"↓ Bearish" },
  neutral: { bg:"var(--s1)", border:"var(--s3)", dot:"var(--inkm)", labelBg:"var(--s2)", labelColor:"var(--ink2)", label:"→ Neutral" },
};

const TYPE_ICON = { sentiment:"💬", funding:"💰", product:"🚀", market:"📊", hiring:"👥" };

export function InsightCards({ insights }) {
  if (!insights?.length) return (
    <p style={{ fontSize:13, color:"var(--inkm)", padding:"1rem 0" }}>No insights available.</p>
  );
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {insights.map((ins, i) => {
        const s = SIGNAL[ins.signal] ?? SIGNAL.neutral;
        return (
          <div key={i} style={{
            background:s.bg, border:`1px solid ${s.border}`,
            borderRadius:"var(--r-md)", padding:"12px 14px",
            display:"flex", gap:12, alignItems:"flex-start",
          }}>
            <span style={{ fontSize:20, flexShrink:0, lineHeight:1 }}>{TYPE_ICON[ins.type] ?? "•"}</span>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontWeight:600, fontSize:13, marginBottom:3 }}>{ins.title}</p>
              <p style={{ fontSize:12, color:"var(--ink2)", lineHeight:1.55 }}>{ins.body}</p>
            </div>
            <div style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"flex-end", gap:3 }}>
              <span style={{
                fontSize:10, padding:"2px 8px", borderRadius:99, fontWeight:700,
                background:s.labelBg, color:s.labelColor,
              }}>
                {s.label}
              </span>
              {/* [FIX POL-04] Confidence % on bullish/bearish */}
              {ins.confidence != null && (
                <span style={{ fontSize:9, color:"var(--inkm)" }}>{ins.confidence}% confidence</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
