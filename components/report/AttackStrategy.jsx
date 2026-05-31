"use client";

export function AttackStrategy({ strategy, gaps }) {
  if (!strategy) return null;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      {/* Hero positioning */}
      <div style={{ background:"var(--brand)", borderRadius:"var(--r-lg)", padding:"16px 18px", color:"#fff" }}>
        <p style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".1em",
          opacity:.7, marginBottom:6 }}>Recommended Positioning</p>
        <p style={{ fontSize:18, fontWeight:700, lineHeight:1.3 }}>{strategy.recommended_positioning}</p>
      </div>

      {/* Strategy grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:10 }}>
        <StratCard icon="🎯" label="Target Segment" value={strategy.target_segment} />
        <StratCard icon="⚔️" label="Exploit This Weakness" value={strategy.key_weakness_to_exploit} />
        <StratCard icon="💬" label="Core Message" value={strategy.suggested_messaging} />
        <StratCard icon="💰" label="Pricing Strategy" value={strategy.pricing_strategy} />
      </div>

      {/* Growth channels */}
      <div style={{ background:"var(--s2)", borderRadius:"var(--r-md)", padding:12 }}>
        <p style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".06em",
          color:"var(--inkm)", marginBottom:8 }}>🚀 Growth Channels</p>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {(strategy.growth_channels ?? []).map((c,i) => (
            <span key={i} style={{ fontSize:12, padding:"4px 10px", borderRadius:99,
              background:"var(--brand-light)", color:"var(--brand-dark)", fontWeight:500 }}>{c}</span>
          ))}
        </div>
      </div>

      {/* Market gaps */}
      {gaps?.length > 0 && (
        <div>
          <p style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".06em",
            color:"var(--inkm)", marginBottom:8 }}>🔍 Detected Market Gaps</p>
          {gaps.map((g,i) => (
            <div key={i} style={{ padding:"10px 12px", background:"var(--s0)",
              border:"1px solid var(--s3)", borderRadius:"var(--r-md)", marginBottom:8 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:3 }}>
                <p style={{ fontWeight:600, fontSize:13 }}>{g.gap}</p>
                <span style={{
                  fontSize:10, padding:"2px 7px", borderRadius:99, fontWeight:700, flexShrink:0,
                  background: g.opportunity_size==="large" ? "#dcfce7" : g.opportunity_size==="medium" ? "#fef3c7" : "var(--s2)",
                  color: g.opportunity_size==="large" ? "#15803d" : g.opportunity_size==="medium" ? "#92400e" : "var(--ink2)",
                }}>{g.opportunity_size} opportunity</span>
              </div>
              <p style={{ fontSize:12, color:"var(--ink2)" }}>{g.evidence}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StratCard({ icon, label, value }) {
  return (
    <div style={{ background:"var(--s0)", border:"1px solid var(--s3)", borderRadius:"var(--r-md)", padding:12 }}>
      <p style={{ fontSize:11, color:"var(--inkm)", marginBottom:4 }}>{icon} {label}</p>
      <p style={{ fontSize:13, fontWeight:600, lineHeight:1.4 }}>{value}</p>
    </div>
  );
}
