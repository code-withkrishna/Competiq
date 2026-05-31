"use client";

export function CriticPanel({ critic, degraded = false }) {
  if (degraded) return (
    <div style={{ padding:"14px 16px", background:"#fef3c7", border:"1px solid #fde68a", borderRadius:"var(--r-md)" }}>
      <p style={{ fontSize:13, color:"#92400e", fontWeight:600, marginBottom:4 }}>Agent 2 unavailable</p>
      <p style={{ fontSize:12, color:"#92400e" }}>The Critic Agent could not run for this analysis. The report above is based on Agent 1 only.</p>
    </div>
  );
  if (!critic) return null;

  const conf = critic.confidence_score ?? 0;
  const confColor = conf >= 75 ? "var(--green)" : conf >= 55 ? "var(--amber)" : "var(--red)";

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12 }}>
        <div style={{ flex:1, fontSize:13, color:"var(--ink2)", lineHeight:1.6, padding:"10px 12px",
          background:"var(--s2)", borderRadius:"var(--r-md)", borderLeft:"3px solid var(--brand)" }}>
          {critic.critic_summary}
        </div>
        {/* [FIX 7.5] Confidence label with explanation */}
        <div style={{ textAlign:"center", flexShrink:0 }}>
          <div style={{ fontSize:28, fontWeight:800, fontFamily:"'Syne',sans-serif", color:confColor }}>{conf}</div>
          <div style={{ fontSize:10, color:"var(--inkm)", textTransform:"uppercase", letterSpacing:".05em" }}>Agent 2 confidence</div>
          <div style={{ fontSize:9, color:"var(--inkm)", marginTop:2, maxWidth:80 }}>% of Agent 1 claims Agent 2 verified</div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:10 }}>
        <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:"var(--r-md)", padding:12 }}>
          <p style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".06em", color:"#15803d", marginBottom:8 }}>✓ Validated</p>
          {(critic.validated_insights ?? []).map((v, i) => (
            <p key={i} style={{ fontSize:12, color:"var(--ink2)", marginBottom:4, paddingLeft:10, position:"relative" }}>
              <span style={{ position:"absolute", left:0, color:"var(--green)" }}>•</span>{v}
            </p>
          ))}
        </div>
        <div style={{ background:"#fef3c7", border:"1px solid #fde68a", borderRadius:"var(--r-md)", padding:12 }}>
          <p style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".06em", color:"#92400e", marginBottom:8 }}>~ Speculative</p>
          {(critic.speculative_flags ?? []).map((v, i) => (
            <p key={i} style={{ fontSize:12, color:"var(--ink2)", marginBottom:4, paddingLeft:10, position:"relative" }}>
              <span style={{ position:"absolute", left:0, color:"var(--amber)" }}>~</span>{v}
            </p>
          ))}
        </div>
      </div>

      {critic.missing_data_signals?.length > 0 && (
        <div style={{ background:"var(--s2)", border:"1px solid var(--s3)", borderRadius:"var(--r-md)", padding:12 }}>
          <p style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".06em", color:"var(--inkm)", marginBottom:8 }}>📡 Missing Signals</p>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {critic.missing_data_signals.map((s, i) => (
              <span key={i} style={{ fontSize:11, padding:"3px 8px", borderRadius:99,
                background:"var(--s0)", border:"1px solid var(--s3)", color:"var(--ink2)" }}>{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
