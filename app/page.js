"use client";

import { useState, useRef, useCallback } from "react";
import { Spinner }          from "@/components/ui/Spinner";
import { Badge }            from "@/components/ui/Badge";
import { ReportSkeleton }   from "@/components/ui/Skeleton";
import { LiveFeed }         from "@/components/ui/LiveFeed";
import { SentimentGauge }   from "@/components/report/SentimentGauge";
import { HealthBar }        from "@/components/report/HealthBar";
import { MoatScore }        from "@/components/report/MoatScore";
import { SwotCard }         from "@/components/report/SwotCard";
import { InsightCards }     from "@/components/report/InsightCards";
import { TrendsChart }      from "@/components/report/TrendsChart";
import { Recommendations }  from "@/components/report/Recommendations";
import { DataSources }      from "@/components/report/DataSources";
import { CriticPanel }      from "@/components/report/CriticPanel";
import { AttackStrategy }   from "@/components/report/AttackStrategy";
import { BattleCard }       from "@/components/report/BattleCard";
import { sentimentVariant, momentumVariant } from "@/lib/utils";
import { DEMO_REPORTS, DEMO_COMPANIES } from "@/lib/demo-data";

const FEED_STEPS = [
  { label: "Submitting 7 Wire source requests…" },
  { label: "Waiting on Reddit, Trustpilot, TechCrunch, Trends, and Product Hunt…" },
  { label: "Groq drafts the report after source data returns…" },
  { label: "Critic pass runs when the draft is ready…" },
];

const BATTLE_FEED = [
  { label: "Submitting 11 Wire requests for both companies…" },
  { label: "Waiting on Reddit, Trustpilot, TechCrunch, Product Hunt, and Trends…" },
  { label: "Groq compares the companies after source data returns…" },
  { label: "Battle report appears as soon as the API completes…" },
];

// [FIX UX-06] Renamed tabs + reordered
const SINGLE_TABS = ["overview","insights","recommendations","swot","ai-validation","sources"];
const TAB_LABELS  = {
  "overview":       "Overview",
  "insights":       "Insights",
  "recommendations":"Recommendations",
  "swot":           "SWOT",
  "ai-validation":  "🔍 AI Validation",
  "sources":        "Sources",
};

export default function Home() {
  const [company,   setCompany]   = useState("");
  const [domain,    setDomain]    = useState("");
  const [report,    setReport]    = useState(null);
  const [battleMode,  setBattleMode]  = useState(false);
  const [companyA,    setCompanyA]    = useState("");
  const [companyB,    setCompanyB]    = useState("");
  const [domainA,     setDomainA]     = useState("");
  const [domainB,     setDomainB]     = useState("");
  const [battle,      setBattle]      = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [feedSteps, setFeedSteps] = useState([]);
  const [error,     setError]     = useState(null);
  const [tab,       setTab]       = useState("overview");
  const reportRef = useRef(null);

  const analyze = useCallback(async (name, demoMode = false) => {
    const q = (name || company).trim();
    if (!q || loading) return;
    if (demoMode && DEMO_REPORTS[q]) {
      setReport(DEMO_REPORTS[q]); setBattle(null); setTab("overview"); setError(null);
      setTimeout(() => reportRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }), 100);
      return;
    }
    setLoading(true); setReport(null); setBattle(null); setError(null); setTab("overview");
    setFeedSteps(FEED_STEPS);
    try {
      const res  = await fetch("/api/analyze", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ company: q, domain: domain.trim() || undefined }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "Analysis failed");
      setReport(json.report);
      setTimeout(() => reportRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }), 100);
    } catch(e) { setError(e.message); }
    finally    { setLoading(false); }
  }, [company, domain, loading]);

  const runBattle = useCallback(async () => {
    const a = companyA.trim(), b = companyB.trim();
    if (!a || !b || loading) return;
    setLoading(true); setBattle(null); setReport(null); setError(null); setTab("battle");
    setFeedSteps(BATTLE_FEED);
    try {
      const res  = await fetch("/api/compare", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          company_a: a,
          company_b: b,
          domain_a: domainA.trim() || undefined,
          domain_b: domainB.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "Battle failed");
      setBattle(json.battle);
      setTimeout(() => reportRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }), 100);
    } catch(e) { setError(e.message); }
    finally    { setLoading(false); }
  }, [companyA, companyB, domainA, domainB, loading]);

  const r        = report;
  const sentVar  = r ? sentimentVariant(r.sentiment_score) : "gray";
  const momVar   = r ? momentumVariant(r.momentum)         : "gray";
  const showHero = !r && !battle && !loading;
  const tabs     = battle ? ["battle"] : SINGLE_TABS;

  // Header trust badges: source count comes from API metadata when available.
  const sourcesVerified = r?._meta
    ? r._meta.sources_verified ?? [
        r._meta.reddit_count > 0,
        r._meta.tp_review_count > 0,
        r._meta.tc_article_count > 0,
        r._meta.trends_available,
        r._meta.ph_votes > 0,
      ].filter(Boolean).length
    : 0;
  const evidencePoints = r?._meta
    ? (r._meta.reddit_count ?? 0)
      + (r._meta.tp_review_count ?? 0)
      + (r._meta.tc_article_count ?? 0)
      + (r._meta.ph_votes ?? 0)
      + (r._meta.trends_timeline?.length ?? 0)
    : 0;

  return (
    <div style={{ minHeight:"100vh", background:"var(--s1)" }}>

      {/* HEADER */}
      <header style={{
        background:"var(--s0)", borderBottom:"1px solid var(--s3)",
        padding:"0 24px", height:52,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        position:"sticky", top:0, zIndex:100,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:28, height:28, background:"var(--brand)", borderRadius:7,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:"#fff", fontSize:14, fontWeight:800, fontFamily:"'Syne',sans-serif" }}>C</span>
          </div>
          <span className="font-display" style={{ fontWeight:800, fontSize:16, letterSpacing:"-.02em" }}>CompetIQ</span>
          <span className="badge badge-brand" style={{ fontSize:9 }}>Wire-powered</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ display:"flex", gap:4, background:"var(--s2)", borderRadius:"var(--r-md)", padding:3 }}>
            {[{ id:false, label:"Single" },{ id:true, label:"⚔ Battle" }].map(m => (
              <button key={String(m.id)} onClick={() => { setBattleMode(m.id); setReport(null); setBattle(null); setError(null); }}
                style={{
                  padding:"4px 12px", borderRadius:"var(--r-sm)", border:"none", fontFamily:"inherit",
                  fontSize:11, fontWeight:600, cursor:"pointer", transition:"all .15s",
                  background: battleMode===m.id ? "var(--s0)" : "transparent",
                  color: battleMode===m.id ? "var(--ink)" : "var(--inkm)",
                  boxShadow: battleMode===m.id ? "var(--shadow-sm)" : "none",
                }}>
                {m.label}
              </button>
            ))}
          </div>
          <span style={{ fontSize:11, color:"var(--inkm)" }}>Anakin Build-a-thon 2026</span>
        </div>
      </header>

      {/* HERO — [FIX UX-04] Reduced padding */}
      {showHero && (
        <section style={{ padding:"28px 24px 20px", maxWidth:640, margin:"0 auto", textAlign:"center" }}>
          <div className="anim-fade-up">
            <span className="badge badge-brand" style={{ marginBottom:14, display:"inline-flex" }}>
              {battleMode ? "⚔ Battle Mode — Compare Two Competitors" : "Live Competitor Intelligence · Anakin Wire"}
            </span>
          </div>

          <h1 className="font-display anim-fade-up" style={{
            fontSize:"clamp(1.6rem,3.5vw,2.4rem)", fontWeight:800, letterSpacing:"-.03em",
            lineHeight:1.15, marginBottom:10, animationDelay:"80ms",
          }}>
            {battleMode
              ? <>Who wins the market?<br /><span style={{ color:"var(--brand)" }}>Compare live market signals.</span></>
              : <>Your competitor's weaknesses,<br /><span style={{ color:"var(--brand)" }}>in 60 seconds.</span></>
            }
          </h1>

          <p className="anim-fade-up" style={{
            fontSize:14, color:"var(--ink2)", lineHeight:1.65,
            maxWidth:460, margin:"0 auto 16px", animationDelay:"140ms",
          }}>
            {battleMode
              ? "11 parallel Wire calls. Live data. Head-to-head analysis across 6 dimensions."
              : "7 live Wire sources. 2 AI agents — drafter + critic — one intelligence report."
            }
          </p>

          {/* ── Stats bar — ABOVE THE FOLD, not hidden ── */}
          {!battleMode && (
            <div className="anim-fade-up" style={{
              display:"flex", gap:0, justifyContent:"center",
              background:"var(--s0)", border:"1px solid var(--s3)", borderRadius:"var(--r-lg)",
              overflow:"hidden", animationDelay:"160ms", maxWidth:480,
              marginLeft:"auto", marginRight:"auto", marginBottom:20,
            }}>
              {[["7","Wire actions"],["2","AI agents"],["5","data sources"],["60s","typical speed"]].map(([v,l], i, arr) => (
                <div key={l} style={{
                  flex:1, textAlign:"center", padding:"10px 8px",
                  borderRight: i < arr.length-1 ? "1px solid var(--s3)" : "none",
                }}>
                  <p className="font-display" style={{ fontSize:18, fontWeight:800, color:"var(--brand)", lineHeight:1 }}>{v}</p>
                  <p style={{ fontSize:10, color:"var(--inkm)", marginTop:2, lineHeight:1.2 }}>{l}</p>
                </div>
              ))}
            </div>
          )}

          <div className="anim-fade-up" style={{ animationDelay:"200ms" }}>
            {battleMode
              ? <BattleSearchBox companyA={companyA} companyB={companyB} domainA={domainA} domainB={domainB} onAChange={setCompanyA} onBChange={setCompanyB} onDomainAChange={setDomainA} onDomainBChange={setDomainB} onSubmit={runBattle} loading={loading} />
              : <SearchBox company={company} domain={domain} loading={loading} onCompanyChange={setCompany} onDomainChange={setDomain} onSubmit={() => analyze()} />
            }
          </div>

          {!battleMode && (
            <div className="anim-fade-up" style={{ display:"flex", gap:7, justifyContent:"center", flexWrap:"wrap", marginTop:14, animationDelay:"260ms" }}>
              <span style={{ fontSize:11, color:"var(--inkm)", alignSelf:"center" }}>⚡ Instant:</span>
              {DEMO_COMPANIES.map(d => (
                <button key={d.label}
                  onClick={() => { setCompany(d.label); analyze(d.label, true); }}
                  style={{ fontSize:12, padding:"4px 12px", borderRadius:99, border:"1px solid var(--s3)",
                    background:"var(--s0)", cursor:"pointer", fontFamily:"inherit", transition:"all .15s",
                    display:"flex", flexDirection:"column", alignItems:"center", gap:1 }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--brand)"; e.currentTarget.style.color="var(--brand)"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--s3)"; e.currentTarget.style.color="var(--ink)"; }}
                >
                  <span style={{ fontWeight:600 }}>{d.label}</span>
                  <span style={{ fontSize:9, color:"var(--inkm)", textTransform:"uppercase", letterSpacing:".04em" }}>{d.subtitle}</span>
                </button>
              ))}
            </div>
          )}


        </section>
      )}

      {/* COMPACT SEARCH */}
      {!showHero && (
        <div style={{ padding:"10px 24px", background:"var(--s0)", borderBottom:"1px solid var(--s3)" }}>
          <div style={{ maxWidth:700, margin:"0 auto" }}>
            {battleMode
              ? <BattleSearchBox companyA={companyA} companyB={companyB} domainA={domainA} domainB={domainB} onAChange={setCompanyA} onBChange={setCompanyB} onDomainAChange={setDomainA} onDomainBChange={setDomainB} onSubmit={runBattle} loading={loading} compact />
              : <SearchBox company={company} domain={domain} loading={loading} onCompanyChange={setCompany} onDomainChange={setDomain} onSubmit={() => analyze()} compact />
            }
          </div>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div style={{ maxWidth:700, margin:"20px auto", padding:"0 24px" }}>
          <div className="card" style={{ padding:"18px 20px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
              <Spinner size={15} color="var(--brand)" />
              <span style={{ fontWeight:600, fontSize:13 }}>
                {battleMode ? "Running Battle Mode — 11 Wire calls in parallel…" : "Extracting intelligence via Anakin Wire…"}
              </span>
            </div>
            <LiveFeed steps={feedSteps} />
            <hr className="divider" style={{ margin:"16px 0" }} />
            <ReportSkeleton />
          </div>
        </div>
      )}

      {/* [FIX BUG-03] Improved error UI with retry */}
      {error && !loading && (
        <div style={{ maxWidth:700, margin:"16px auto", padding:"0 24px" }}>
          <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:"var(--r-lg)",
            padding:"16px 20px", display:"flex", flexDirection:"column", gap:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:16 }}>⚠️</span>
              <p style={{ fontWeight:600, color:"#dc2626", fontSize:14 }}>Analysis could not complete</p>
            </div>
            <p style={{ fontSize:13, color:"#7f1d1d", lineHeight:1.5 }}>{error}</p>
            <button
              onClick={() => { setError(null); battleMode ? runBattle() : analyze(); }}
              style={{ alignSelf:"flex-start", padding:"6px 14px", borderRadius:"var(--r-md)",
                border:"1px solid #dc2626", background:"transparent", color:"#dc2626",
                fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>
              Retry Analysis →
            </button>
          </div>
        </div>
      )}

      {/* BATTLE REPORT */}
      {battle && !loading && (
        <div ref={reportRef} style={{ maxWidth:860, margin:"20px auto", padding:"0 24px 60px" }} className="anim-scale-in">
          <h2 className="font-display" style={{ fontSize:22, fontWeight:800, letterSpacing:"-.025em", marginBottom:8 }}>
            {battle.company_a} <span style={{ color:"var(--inkm)" }}>vs</span> {battle.company_b}
          </h2>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
            <Badge label={`Winner: ${battle.overall_winner}`} variant="brand" dot />
            <Badge label={`${battle._meta?.wire_calls ?? 11} Wire calls`} variant="gray" />
          </div>
          <BattleCard battle={battle} />
        </div>
      )}

      {/* SINGLE REPORT */}
      {r && !loading && (
        <div ref={reportRef} style={{ maxWidth:860, margin:"20px auto", padding:"0 24px 60px" }} className="anim-scale-in">

          {/* Report header */}
          <div style={{ marginBottom:14 }}>
            <h2 className="font-display" style={{ fontSize:24, fontWeight:800, letterSpacing:"-.025em", marginBottom:8 }}>
              {r.company} — Intelligence Report
            </h2>
            <div style={{ display:"flex", gap:7, alignItems:"center", flexWrap:"wrap", marginBottom:10 }}>
              <Badge label={r.sentiment_label ?? "—"} variant={sentVar} dot />
              <Badge label={`Momentum: ${r.momentum ?? "—"}`} variant={momVar} />
              {sourcesVerified > 0 && (
                <Badge label={`${sourcesVerified} sources verified`} variant="green" dot />
              )}
              {evidencePoints > 0 && (
                <Badge label={`${evidencePoints.toLocaleString()} evidence points`} variant="gray" />
              )}
              <Badge label={`${r._meta?.wire_calls ?? 7} Wire calls · ${r._meta?.agent_passes ?? 2} AI agents`} variant="gray" />
              {r._meta?.confidence_degraded && <Badge label="Agent 2 unavailable" variant="amber" />}
            </div>
            <div style={{ fontSize:13, color:"var(--ink2)", lineHeight:1.65, padding:"10px 14px",
              background:"var(--s2)", borderRadius:"var(--r-md)", borderLeft:"3px solid var(--brand)" }}>
              {r.validated_summary ?? r.executive_summary}
            </div>
          </div>

          {/* Tabs — scrollable on mobile with fade indicator */}
          <div className="tabs-scroll-container" style={{ borderBottom:"1px solid var(--s3)", marginBottom:14 }}>
            <div className="tabs-scroll-inner">
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding:"7px 13px", fontSize:12,
                fontWeight: tab===t ? 700 : 400,
                color: tab===t ? "var(--brand)" : "var(--inkm)",
                background:"transparent", border:"none",
                borderBottom:`2px solid ${tab===t ? "var(--brand)" : "transparent"}`,
                cursor:"pointer", textTransform:"capitalize",
                marginBottom:-1, fontFamily:"inherit", transition:"all .15s", whiteSpace:"nowrap",
              }}>
                {TAB_LABELS[t] ?? t}
              </button>
            ))}
            </div>
          </div>

          {/* OVERVIEW */}
          {tab==="overview" && (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <HealthBar score={r.health_score ?? r.sentiment_score ?? 0} label={r.health_label ?? r.sentiment_label ?? "Stable"} />
              <div className="stat-cards-grid">
                {/* [FIX UX-02] StatCard with expandable breakdown */}
                <StatCard label="Sentiment" value={`${r.sentiment_score ?? 0}/100`} sub={r.sentiment_label}
                  color={sentVar==="green" ? "var(--green)" : sentVar==="red" ? "var(--red)" : "var(--amber)"} />
                <StatCard label="Trustpilot"
                  value={r._meta?.tp_rating != null ? `${r._meta.tp_rating} ⭐` : "—"}
                  sub={`${(r._meta?.tp_review_count ?? 0).toLocaleString()} reviews`} />
                <StatCard label="Product Hunt"
                  value={r._meta?.ph_votes != null ? r._meta.ph_votes.toLocaleString() : "—"}
                  sub="Total votes 🏹" />
                <StatCard label="Moat Score" value={`${r.moat_score ?? "—"}/100`}
                  sub="Competitive defensibility"
                  color={r.moat_score >= 70 ? "var(--green)" : r.moat_score >= 50 ? "var(--amber)" : "var(--red)"}
                  breakdown={r.moat_components ? [
                    ["Brand strength",    `${r.moat_components.brand_strength ?? "—"}/100`],
                    ["Community",         `${r.moat_components.community_activity ?? "—"}/100`],
                    ["Funding position",  `${r.moat_components.funding_position ?? "—"}/100`],
                    ["Sentiment quality", `${r.moat_components.sentiment_quality ?? "—"}/100`],
                    ["Growth trend",      `${r.moat_components.growth_trend ?? "—"}/100`],
                  ] : null}
                />
              </div>

              <div className="grid-asymmetric">
                <div className="card" style={{ padding:16, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                  <p className="section-label">Sentiment</p>
                  <SentimentGauge score={r.sentiment_score ?? 50} label={r.sentiment_label ?? ""} />
                </div>
                <div className="card" style={{ padding:16 }}>
                  <p className="section-label">Search Momentum · Google Trends via Wire</p>
                  <TrendsChart timeline={r._meta?.trends_timeline} />
                  <p style={{ fontSize:11, color:"var(--inkm)", marginTop:5 }}>{r.momentum_reason}</p>
                  {r.trend_forecast && (
                    <div style={{ display:"flex", gap:7, alignItems:"center", marginTop:8,
                      padding:"5px 8px", background:"var(--s2)", borderRadius:6 }}>
                      <span style={{ fontSize:12, fontWeight:600,
                        color: r.trend_forecast.direction==="Growing" ? "var(--green)"
                             : r.trend_forecast.direction==="Declining" ? "var(--red)" : "var(--amber)" }}>
                        {r.trend_forecast.direction==="Growing" ? "↗" : r.trend_forecast.direction==="Declining" ? "↘" : "→"}{" "}
                        {r.trend_forecast.direction}
                      </span>
                      <span style={{ fontSize:11, color:"var(--inkm)" }}>
                        {r.trend_forecast.confidence}% confidence · {r.trend_forecast.reasoning}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid-2col">
                <BulletCard title="Customer Pain Points" color="var(--red)"   marker="—" items={r.customer_pain_points} />
                <BulletCard title="What Customers Love"  color="var(--green)" marker="+" items={r.what_customers_love} />
              </div>

              <div className="card" style={{ padding:16 }}>
                <p className="section-label">Competitive Moat</p>
                <MoatScore score={r.moat_score ?? 0} components={r.moat_components ?? {}} />
              </div>

              {/* Funding intel — always shown */}
              <div style={{
                background: r.funding_intel?.last_round !== "Unknown" ? "#fffbeb" : "var(--s2)",
                border: `1px solid ${r.funding_intel?.last_round !== "Unknown" ? "#fde68a" : "var(--s3)"}`,
                borderRadius:"var(--r-lg)", padding:"14px 16px",
              }}>
                <p className="section-label" style={{ color:"#92400e" }}>💰 Funding Intel · TechCrunch via Wire</p>
                {r.funding_intel?.last_round !== "Unknown"
                  ? <div style={{ display:"flex", gap:24, flexWrap:"wrap" }}>
                      <FundingItem label="Last Round" value={r.funding_intel?.last_round ?? "—"} />
                      <FundingItem label="Amount"     value={r.funding_intel?.amount ?? "—"} />
                      <FundingItem label="Investors"  value={(r.funding_intel?.investors ?? []).join(", ") || "—"} />
                    </div>
                  : <p style={{ fontSize:13, color:"var(--ink2)" }}>
                      No public funding data found —{" "}
                      <strong>{r.funding_intel?.tc_mentions ?? 0} TechCrunch mention{r.funding_intel?.tc_mentions !== 1 ? "s" : ""}</strong>{" "}
                      reference this company.
                    </p>
                }
                {r.funding_intel?.source && !["Unknown","No public data found"].includes(r.funding_intel.source) && (
                  <p style={{ fontSize:11, color:"var(--inkm)", marginTop:8 }}>Source: {r.funding_intel.source}</p>
                )}
              </div>
            </div>
          )}

          {/* INSIGHTS */}
          {tab==="insights" && (
            <div>
              <p className="section-label">Key Intelligence Signals</p>
              <InsightCards insights={r.key_insights} />
            </div>
          )}

          {/* RECOMMENDATIONS */}
          {tab==="recommendations" && (
            <div>
              <p className="section-label">Strategic Recommendations</p>
              <Recommendations recs={r.strategic_recommendations} />
            </div>
          )}

          {/* SWOT */}
          {tab==="swot" && (
            <div>
              <p className="section-label">SWOT Analysis · Agent 1 draft, Agent 2 validated</p>
              <div className="card" style={{ padding:16 }}>
                <SwotCard swot={r.swot} />
              </div>
              {/* strategy below SWOT */}
              <p className="section-label" style={{ marginTop:16 }}>⚔ Attack Strategy + Market Gaps</p>
              <AttackStrategy strategy={r.attack_strategy} gaps={r.market_gaps} />
            </div>
          )}

          {/* AI VALIDATION */}
          {tab==="ai-validation" && (
            <div>
              <p className="section-label">🔍 Agent 2 Critic — challenges Agent 1 findings</p>
              <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:12, flexWrap:"wrap" }}>
                {r._meta?.critic_available
                  ? <Badge label={`${r.critic?.confidence_score ?? "—"}% — Agent 2 verified this proportion of claims`} variant={(r.critic?.confidence_score ?? 0) >= 75 ? "green" : (r.critic?.confidence_score ?? 0) >= 55 ? "amber" : "red"} />
                  : <Badge label="Agent 2 unavailable for this report" variant="amber" />
                }
              </div>
              <CriticPanel critic={r.critic} degraded={!r._meta?.critic_available} />
            </div>
          )}

          {/* SOURCES */}
          {tab==="sources" && (
            <div className="card" style={{ padding:16 }}>
              <p className="section-label">Wire Data Provenance</p>
              <DataSources meta={r._meta} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SearchBox({ company, domain, loading, onCompanyChange, onDomainChange, onSubmit, compact=false }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:7, width:"100%" }}>
      <div style={{ display:"flex", gap:8 }}>
        <input className="input-field" value={company}
          onChange={e => onCompanyChange(e.target.value)}
          onKeyDown={e => e.key==="Enter" && onSubmit()}
          placeholder="Company name — e.g. Notion, Linear, Figma…"
          disabled={loading}
          style={{ flex:1, height:compact?38:46, padding:"0 14px" }}
        />
        {/* [FIX UX-05] Updated button text */}
        <button className="btn-primary" onClick={onSubmit}
          disabled={loading || !company.trim()}
          style={{ height:compact?38:46, padding:"0 16px", fontSize:compact?12:13,
            display:"flex", alignItems:"center", gap:7, borderRadius:"var(--r-md)", whiteSpace:"nowrap" }}>
          {loading ? <Spinner size={14} color="#fff" /> : null}
          {loading ? "Analyzing…" : compact ? "Analyze →" : "Generate Intelligence Report →"}
        </button>
      </div>
      <input className="input-field" value={domain}
        onChange={e => onDomainChange(e.target.value)}
        placeholder="Domain for Trustpilot (optional — e.g. notion.so)"
        disabled={loading}
        style={{ height:32, padding:"0 12px", fontSize:12 }}
      />
    </div>
  );
}

function BattleSearchBox({
  companyA, companyB, domainA, domainB,
  onAChange, onBChange, onDomainAChange, onDomainBChange,
  onSubmit, loading, compact=false
}) {
  const h = compact ? 38 : 46;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:7, width:"100%" }}>
      {/* Row 1: inputs + vs + button */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr auto", gap:8, alignItems:"center" }}>
        <input className="input-field" value={companyA} onChange={e=>onAChange(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&onSubmit()} placeholder="Company A" disabled={loading}
          style={{ height:h, padding:"0 14px" }} />
        <span className="font-display vs-label" style={{ fontWeight:800, color:"var(--inkm)", fontSize:13, textAlign:"center", minWidth:22 }}>vs</span>
        <input className="input-field" value={companyB} onChange={e=>onBChange(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&onSubmit()} placeholder="Company B" disabled={loading}
          style={{ height:h, padding:"0 14px" }} />
        <button className="btn-primary battle-btn" onClick={onSubmit}
          disabled={loading || !companyA.trim() || !companyB.trim()}
          style={{ height:h, padding:"0 16px", fontSize:compact?12:13,
            display:"flex", alignItems:"center", gap:7, borderRadius:"var(--r-md)", whiteSpace:"nowrap" }}>
          {loading ? <Spinner size={14} color="#fff" /> : "⚔ Battle →"}
        </button>
      </div>
      {/* Row 2: domain inputs aligned under A and B columns (vs and button cols get spacers) */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr auto", gap:8, alignItems:"center" }}>
        <input className="input-field" value={domainA} onChange={e=>onDomainAChange(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&onSubmit()} placeholder="Domain A (optional)" disabled={loading}
          style={{ height:32, padding:"0 12px", fontSize:12 }} />
        <span style={{ minWidth:22 }} />
        <input className="input-field" value={domainB} onChange={e=>onDomainBChange(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&onSubmit()} placeholder="Domain B (optional)" disabled={loading}
          style={{ height:32, padding:"0 12px", fontSize:12 }} />
        <span style={{ visibility:"hidden", height:32, padding:"0 16px", fontSize:compact?12:13, whiteSpace:"nowrap" }}>
          {loading ? "..." : "⚔ Battle →"}
        </span>
      </div>
    </div>
  );
}

// [FIX UX-02] StatCard with optional expandable breakdown
function StatCard({ label, value, sub, color, breakdown }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ background:"var(--s2)", borderRadius:"var(--r-md)", padding:14,
      cursor: breakdown ? "pointer" : "default",
      border: expanded ? "1px solid var(--brand)" : "1px solid transparent",
      transition:"border-color .15s" }}
      onClick={() => breakdown && setExpanded(!expanded)}>
      <p className="section-label">{label}</p>
      <p className="font-display" style={{ fontSize:20, fontWeight:800, letterSpacing:"-.025em",
        color: color ?? "var(--ink)" }}>{value}</p>
      {sub && <p style={{ fontSize:11, color:"var(--inkm)", marginTop:2 }}>{sub}</p>}
      {breakdown && (
        <p style={{ fontSize:10, color:"var(--brand)", marginTop:5 }}>
          {expanded ? "▲ hide breakdown" : "▼ how calculated"}
        </p>
      )}
      {breakdown && expanded && (
        <div style={{ marginTop:8, borderTop:"1px solid var(--s3)", paddingTop:8 }}>
          {breakdown.map(([comp, score]) => (
            <div key={comp} style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:3 }}>
              <span style={{ color:"var(--ink2)" }}>{comp}</span>
              <span style={{ fontWeight:600, color:"var(--ink)" }}>{score}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BulletCard({ title, color, marker, items }) {
  return (
    <div className="card" style={{ padding:16 }}>
      <p className="section-label" style={{ color }}>{title}</p>
      {(items ?? []).length === 0
        ? <p className="empty-state">No data available for this section.</p>
        : (
          <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:5 }}>
            {items.map((p, i) => (
              <li key={i} style={{ fontSize:12, color:"var(--ink2)", lineHeight:1.5, paddingLeft:12, position:"relative" }}>
                <span style={{ position:"absolute", left:0, color, fontWeight:700 }}>{marker}</span>{p}
              </li>
            ))}
          </ul>
        )
      }
    </div>
  );
}

function FundingItem({ label, value }) {
  return (
    <div>
      <p style={{ fontSize:10, color:"#92400e", textTransform:"uppercase", letterSpacing:".05em", marginBottom:2 }}>{label}</p>
      <p style={{ fontSize:15, fontWeight:700, color:"var(--ink)" }}>{value}</p>
    </div>
  );
}
