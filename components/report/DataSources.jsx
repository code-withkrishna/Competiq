"use client";

export function DataSources({ meta }) {
  if (!meta) return null;

  const sources = [
    { icon:"🔴", label:"Reddit posts",         value:meta.reddit_count     ?? 0,  action:"rt_search",           key:"reddit" },
    { icon:"⭐", label:"Trustpilot reviews",   value:meta.tp_review_count  ?? 0,  action:"tp_company_reviews",  key:"tp_reviews" },
    { icon:"📰", label:"TechCrunch articles",  value:meta.tc_article_count ?? 0,  action:"tc_tags + tc_search", key:"tc_articles" },
    { icon:"🏹", label:"Product Hunt votes",   value:meta.ph_votes ?? "—",        action:"ph_product_details",  key:"ph" },
    { icon:"📈", label:"Trend data points",    value:meta.trends_timeline?.length ?? 0, action:"gt_interest_over_time", key:"trends" },
  ];

  const diag = meta.wire_diagnostics ?? {};

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

      {/* ── Why Wire? ──────────────────────────────────────────────── */}
      <div style={{
        background:"linear-gradient(135deg, #eef1fd 0%, #f0fdf4 100%)",
        border:"1px solid var(--brand-light)",
        borderRadius:"var(--r-lg)", padding:"16px 18px",
      }}>
        <p style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:".06em",
          color:"var(--brand-dark)", marginBottom:10 }}>
          ⚡ Why Wire? — Speed Comparison
        </p>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
          <div style={{
            background:"#fef2f2", border:"1px solid #fecaca",
            borderRadius:"var(--r-md)", padding:"10px 14px",
          }}>
            <p style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".05em",
              color:"#b91c1c", marginBottom:4 }}>
              ❌ Sequential API calls
            </p>
            <p style={{ fontSize:22, fontWeight:800, color:"#dc2626", fontFamily:"'Syne',sans-serif" }}>~120s</p>
            <p style={{ fontSize:11, color:"#7f1d1d", marginTop:2 }}>
              Reddit → Trustpilot → TechCrunch → Trends → Product Hunt
              called one-by-one
            </p>
          </div>
          <div style={{
            background:"#f0fdf4", border:"1px solid #bbf7d0",
            borderRadius:"var(--r-md)", padding:"10px 14px",
          }}>
            <p style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".05em",
              color:"#15803d", marginBottom:4 }}>
              ✅ Wire parallel jobs
            </p>
            <p style={{ fontSize:22, fontWeight:800, color:"var(--green)", fontFamily:"'Syne',sans-serif" }}>~18s</p>
            <p style={{ fontSize:11, color:"#166534", marginTop:2 }}>
              All 7 sources fired simultaneously via{" "}
              <code style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10 }}>wireAll()</code>{" "}
              — results collected as they return
            </p>
          </div>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:8,
          padding:"8px 12px", background:"rgba(67,97,238,.08)", borderRadius:"var(--r-sm)" }}>
          <span style={{ fontSize:16 }}>🚀</span>
          <p style={{ fontSize:12, color:"var(--brand-dark)", lineHeight:1.5 }}>
            <strong>6.7× faster</strong> — Wire's parallel execution is the reason CompetIQ
            delivers a full competitive brief in 60 seconds instead of 2 minutes.
            Without Wire, this product doesn't exist.
          </p>
        </div>
      </div>

      {/* Wire diagnostics grid */}
      {Object.keys(diag).length > 0 && (
        <div>
          <p style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".06em", color:"var(--inkm)", marginBottom:8 }}>
            Wire Source Status — This Request
          </p>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {Object.entries(diag).map(([key, d]) => (
              <div key={key} style={{
                display:"flex", alignItems:"center", gap:5,
                padding:"3px 10px", borderRadius:99,
                background: d.success ? "#f0fdf4" : "#fef2f2",
                border: `1px solid ${d.success ? "#bbf7d0" : "#fecaca"}`,
              }}>
                <span style={{ fontSize:11, color: d.success ? "var(--green)" : "var(--red)" }}>
                  {d.success ? "✓" : "✗"}
                </span>
                <span style={{ fontSize:11, color:"var(--ink2)" }}>{key}</span>
                {!d.success && d.error && (
                  <span style={{ fontSize:10, color:"var(--red)" }}>— {d.error.slice(0, 40)}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats row */}
      <div>
        <p style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".06em", color:"var(--inkm)", marginBottom:8 }}>
          Evidence Collected
        </p>
        <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
          {sources.map(s => (
            <div key={s.label} style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ fontSize:14 }}>{s.icon}</span>
              <span style={{ fontWeight:700, fontSize:13, color:"var(--ink)" }}>
                {typeof s.value === "number" ? s.value.toLocaleString() : s.value}
              </span>
              <span style={{ fontSize:12, color:"var(--ink2)" }}>{s.label}</span>
              <code style={{ fontSize:10, background:"var(--s2)", padding:"1px 6px", borderRadius:4,
                color:"var(--brand)", fontFamily:"'JetBrains Mono',monospace" }}>{s.action}</code>
            </div>
          ))}
        </div>
      </div>

      {/* Reddit titles */}
      {meta.reddit_titles?.length > 0 && (
        <div>
          <p style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:".05em", color:"var(--inkm)", marginBottom:8 }}>
            Top Reddit Discussions via Wire
          </p>
          {meta.reddit_titles.map((t, i) => (
            <div key={i} style={{ fontSize:12, color:"var(--ink2)", padding:"5px 0", borderBottom:"1px solid var(--s2)", display:"flex", gap:6 }}>
              <span style={{ color:"var(--red)" }}>↗</span>{t}
            </div>
          ))}
        </div>
      )}

      {/* TechCrunch titles */}
      {meta.tc_titles?.length > 0 && (
        <div>
          <p style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:".05em", color:"var(--inkm)", marginBottom:8 }}>
            TechCrunch Coverage via Wire
          </p>
          {meta.tc_titles.map((t, i) => (
            <div key={i} style={{ fontSize:12, color:"var(--ink2)", padding:"5px 0", borderBottom:"1px solid var(--s2)", display:"flex", gap:6 }}>
              <span>📰</span>{t}
            </div>
          ))}
        </div>
      )}

      {/* TP reviews sample */}
      {meta.tp_reviews_sample?.length > 0 && (
        <div>
          <p style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:".05em", color:"var(--inkm)", marginBottom:8 }}>
            Trustpilot Reviews via Wire
          </p>
          {meta.tp_reviews_sample.map((r, i) => (
            <div key={i} style={{ padding:"8px 10px", background:"var(--s1)", borderRadius:"var(--r-sm)", marginBottom:6 }}>
              <div style={{ display:"flex", gap:2, marginBottom:3 }}>
                {"★★★★★".slice(0, Math.round(r.rating ?? 0)).padEnd(5, "☆").split("").map((s, j) => (
                  <span key={j} style={{ color:s==="★"?"#f59e0b":"var(--s3)", fontSize:11 }}>{s}</span>
                ))}
              </div>
              <p style={{ fontSize:12, color:"var(--ink2)", lineHeight:1.5 }}>{r.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
