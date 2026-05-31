"use client";

const Q = {
  strengths:     { label:"Strengths",     icon:"↑", bg:"#f0fdf4", border:"#bbf7d0", color:"#15803d" },
  weaknesses:    { label:"Weaknesses",    icon:"↓", bg:"#fef2f2", border:"#fecaca", color:"#b91c1c" },
  opportunities: { label:"Opportunities", icon:"◇", bg:"#eff6ff", border:"#bfdbfe", color:"#1d4ed8" },
  threats:       { label:"Threats",       icon:"⚠", bg:"#fffbeb", border:"#fde68a", color:"#92400e" },
};

const SOURCE_COLORS = {
  reddit:       { bg:"#ff45001a", color:"#ff4500" },
  trustpilot:   { bg:"#00b67a1a", color:"#00b67a" },
  techcrunch:   { bg:"#0f9d581a", color:"#0f9d58" },
  trends:       { bg:"#4285f41a", color:"#4285f4" },
  producthunt:  { bg:"#da552f1a", color:"#da552f" },
};

function SwotItem({ item, bulletColor }) {
  // Handle both string (legacy) and object (new schema with source attribution)
  const text     = typeof item === "string" ? item : (item.point ?? item);
  const source   = typeof item === "object" ? item.source   : null;
  const evidence = typeof item === "object" ? item.evidence : null;
  const sc       = source ? (SOURCE_COLORS[source] ?? null) : null;

  return (
    <li style={{ fontSize:12, color:"var(--ink2)", lineHeight:1.5, marginBottom:8, paddingLeft:12, position:"relative" }}>
      <span style={{ position:"absolute", left:0, color:bulletColor, fontWeight:700 }}>•</span>
      <span>{text}</span>
      {sc && source && (
        <span style={{ marginLeft:5, fontSize:9, padding:"1px 6px", borderRadius:99,
          background:sc.bg, color:sc.color, fontWeight:700, textTransform:"uppercase", letterSpacing:".04em" }}>
          {source}
        </span>
      )}
      {evidence && (
        <span style={{ display:"block", fontSize:10, color:"var(--inkm)", marginTop:2, fontStyle:"italic" }}>
          {evidence}
        </span>
      )}
    </li>
  );
}

export function SwotCard({ swot }) {
  if (!swot) return null;
  return (
    <div className="swot-grid">
      {Object.keys(Q).map((key) => {
        const c = Q[key];
        return (
          <div key={key} style={{ background:c.bg, border:`1px solid ${c.border}`, borderRadius:"var(--r-md)", padding:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
              <span style={{ fontSize:16, color:c.color, fontWeight:700 }}>{c.icon}</span>
              <span style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".06em", color:c.color }}>{c.label}</span>
            </div>
            <ul style={{ listStyle:"none" }}>
              {(swot[key] ?? []).map((item, i) => (
                <SwotItem key={i} item={item} bulletColor={c.color} />
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
