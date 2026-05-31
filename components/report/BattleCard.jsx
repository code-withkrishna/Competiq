"use client";
import { useEffect, useState } from "react";

export function BattleCard({ battle }) {
  if (!battle) return null;
  const winner = battle.overall_winner;
  const isA    = winner === battle.company_a;
  const isTie  = winner === "Tie";

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>

      {/* [FIX BUG-06] Tie = neutral state, never as primary win headline */}
      {isTie ? (
        <div style={{ background:"var(--s2)", borderRadius:"var(--r-xl)", padding:"16px 20px", textAlign:"center" }}>
          <p style={{ fontWeight:700, fontSize:18, color:"var(--ink)", fontFamily:"'Syne',sans-serif" }}>
            Too close to call
          </p>
          <p style={{ fontSize:13, color:"var(--ink2)", marginTop:4 }}>
            {battle.win_reason ?? "Both companies are closely matched across all dimensions."}
          </p>
        </div>
      ) : (
        <div style={{
          background:"var(--brand)", borderRadius:"var(--r-xl)", padding:"16px 20px",
          color:"#fff", display:"flex", alignItems:"center", justifyContent:"space-between",
        }}>
          <div>
            <p style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".1em", opacity:.75, marginBottom:4 }}>Winner</p>
            <p style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800 }}>{winner}</p>
            <p style={{ fontSize:13, opacity:.85, marginTop:4 }}>{battle.win_reason}</p>
          </div>
          <span style={{ fontSize:40 }}>🏆</span>
        </div>
      )}

      {/* Battle summary */}
      <div style={{ fontSize:13, color:"var(--ink2)", lineHeight:1.65, padding:"10px 14px",
        background:"var(--s2)", borderRadius:"var(--r-md)", borderLeft:"3px solid var(--brand)" }}>
        {battle.battle_summary}
      </div>

      {/* [FIX 7.7] Battle narrative panel */}
      {battle.battle_narrative && (
        <div style={{ background:"var(--s0)", border:"1px solid var(--s3)", borderRadius:"var(--r-md)", padding:"14px 16px" }}>
          <p style={{ fontWeight:700, fontSize:15, marginBottom:6 }}>
            {battle.battle_narrative.opening}
          </p>
          <p style={{ fontSize:13, color:"var(--ink2)", lineHeight:1.6, marginBottom:8 }}>
            {battle.battle_narrative.final_verdict}
          </p>
          {battle.battle_narrative.decisive_factor && (
            <p style={{ fontSize:11, color:"var(--brand)", fontWeight:600 }}>
              Decisive factor: {battle.battle_narrative.decisive_factor}
            </p>
          )}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:8, marginTop:10 }}>
            {battle.battle_narrative.company_a_advantage && (
              <div style={{ padding:"8px 10px", background:"#eff6ff", borderRadius:6 }}>
                <p style={{ fontSize:10, fontWeight:700, color:"var(--brand)", marginBottom:3 }}>{battle.company_a} edge</p>
                <p style={{ fontSize:12, color:"var(--ink2)" }}>{battle.battle_narrative.company_a_advantage}</p>
              </div>
            )}
            {battle.battle_narrative.company_b_advantage && (
              <div style={{ padding:"8px 10px", background:"#f0fdf4", borderRadius:6 }}>
                <p style={{ fontSize:10, fontWeight:700, color:"#15803d", marginBottom:3 }}>{battle.company_b} edge</p>
                <p style={{ fontSize:12, color:"var(--ink2)" }}>{battle.battle_narrative.company_b_advantage}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dimension scores */}
      <div>
        <p style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".06em", color:"var(--inkm)", marginBottom:10 }}>
          Head-to-Head Dimensions
        </p>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {(battle.dimensions ?? []).map((dim, i) => {
            const hasData = (dim.score_a ?? 0) > 0 || (dim.score_b ?? 0) > 0;
            // [FIX BUG-05] Guard zero-score dimensions
            if (!hasData) return (
              <div key={i} style={{
                background:"var(--s2)", border:"1px dashed var(--s3)",
                borderRadius:"var(--r-md)", padding:"10px 12px",
                display:"flex", justifyContent:"space-between", alignItems:"center",
              }}>
                <span style={{ fontSize:12, fontWeight:600 }}>{dim.name}</span>
                <span style={{ fontSize:11, color:"var(--inkm)" }}>Insufficient data to score</span>
              </div>
            );
            return <DimensionRow key={i} dim={dim} companyA={battle.company_a} companyB={battle.company_b} />;
          })}
        </div>
      </div>

      {/* Strengths each way */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:10 }}>
        <AdvantageBox company={battle.company_a} items={battle.company_a_strengths_vs_b} color="var(--brand)" />
        <AdvantageBox company={battle.company_b} items={battle.company_b_strengths_vs_a} color="#10b981" />
      </div>

      {battle.startup_opportunity && (
        <div style={{ background:"#fffbeb", border:"1px solid #fde68a", borderRadius:"var(--r-md)", padding:"12px 14px" }}>
          <p style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".06em", color:"#92400e", marginBottom:5 }}>
            💡 Startup Opportunity
          </p>
          <p style={{ fontSize:13, color:"var(--ink)", fontWeight:500 }}>{battle.startup_opportunity}</p>
        </div>
      )}
    </div>
  );
}

function DimensionRow({ dim, companyA, companyB }) {
  const [aVal, setAVal] = useState(0);
  const [bVal, setBVal] = useState(0);
  useEffect(() => { const t = setTimeout(() => { setAVal(dim.score_a ?? 0); setBVal(dim.score_b ?? 0); }, 400); return () => clearTimeout(t); }, [dim]);
  const aWins = (dim.score_a ?? 0) > (dim.score_b ?? 0);
  const bWins = (dim.score_b ?? 0) > (dim.score_a ?? 0);
  return (
    <div style={{ background:"var(--s0)", border:"1px solid var(--s3)", borderRadius:"var(--r-md)", padding:"10px 12px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6, flexWrap:"wrap", gap:4 }}>
        <span style={{ fontSize:12, fontWeight:600 }}>{dim.name}</span>
        <span style={{ fontSize:10, color:"var(--inkm)" }}>{dim.insight}</span>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ fontSize:11, fontWeight:aWins?700:400, color:aWins?"var(--brand)":"var(--ink2)", width:64, textAlign:"right", flexShrink:0 }}>{companyA}</span>
        <div style={{ flex:1, display:"flex", gap:3, alignItems:"center" }}>
          <div style={{ flex:1, height:5, background:"var(--s3)", borderRadius:99, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${aVal}%`, background:"var(--brand)", borderRadius:99, transition:"width 1s cubic-bezier(0.4,0,0.2,1)", marginLeft:"auto" }}/>
          </div>
          <span style={{ fontSize:11, fontWeight:700, color:"var(--brand)", width:22, textAlign:"center" }}>{dim.score_a}</span>
          <span style={{ fontSize:10, color:"var(--s3)" }}>|</span>
          <span style={{ fontSize:11, fontWeight:700, color:"#10b981", width:22, textAlign:"center" }}>{dim.score_b}</span>
          <div style={{ flex:1, height:5, background:"var(--s3)", borderRadius:99, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${bVal}%`, background:"#10b981", borderRadius:99, transition:"width 1s cubic-bezier(0.4,0,0.2,1)" }}/>
          </div>
        </div>
        <span style={{ fontSize:11, fontWeight:bWins?700:400, color:bWins?"#10b981":"var(--ink2)", width:64, flexShrink:0 }}>{companyB}</span>
      </div>
    </div>
  );
}

function AdvantageBox({ company, items, color }) {
  // CSS variable strings like "var(--brand)" can't be concatenated with hex alpha.
  // Derive a safe border color: hex colors support hex-alpha suffix, CSS vars use --s3 fallback.
  const borderColor = color.startsWith("#") ? `${color}30` : "var(--s3)";
  return (
    <div style={{ background:"var(--s0)", border:`1px solid ${borderColor}`, borderRadius:"var(--r-md)", padding:12 }}>
      <p style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".06em", color, marginBottom:8 }}>{company} advantages</p>
      {(items ?? []).length === 0 && (
        <p style={{ fontSize:12, color:"var(--inkm)", fontStyle:"italic" }}>No distinct advantages identified.</p>
      )}
      {(items ?? []).map((item, i) => (
        <p key={i} style={{ fontSize:12, color:"var(--ink2)", marginBottom:5, paddingLeft:10, position:"relative", lineHeight:1.4 }}>
          <span style={{ position:"absolute", left:0, color, fontWeight:700 }}>+</span>{item}
        </p>
      ))}
    </div>
  );
}
