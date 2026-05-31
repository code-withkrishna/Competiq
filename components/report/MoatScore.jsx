"use client";
import { useEffect, useState } from "react";

export function MoatScore({ score = 0, components = {} }) {
  const [val, setVal] = useState(0);
  useEffect(() => { const t = setTimeout(() => setVal(score), 300); return () => clearTimeout(t); }, [score]);

  const color = score >= 70 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
  const label = score >= 70 ? "Strong Moat" : score >= 50 ? "Moderate Moat" : "Vulnerable";

  const dims = [
    { key: "brand_strength",    label: "Brand" },
    { key: "community_activity", label: "Community" },
    { key: "funding_position",  label: "Funding" },
    { key: "sentiment_quality", label: "Sentiment" },
    { key: "growth_trend",      label: "Growth" },
  ];

  return (
    <div>
      {/* Big score */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
        <div style={{ position: "relative" }}>
          <svg viewBox="0 0 80 80" width="80" height="80">
            <circle cx="40" cy="40" r="32" fill="none" stroke="var(--s3)" strokeWidth="8"/>
            <circle cx="40" cy="40" r="32" fill="none" stroke={color} strokeWidth="8"
              strokeLinecap="round" strokeDasharray="201"
              strokeDashoffset={201 - (val/100)*201}
              transform="rotate(-90 40 40)"
              style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
            />
            <text x="40" y="45" textAnchor="middle" fontSize="20" fontWeight="800"
              fill="var(--ink)" fontFamily="'Syne',sans-serif">{Math.round(val)}</text>
          </svg>
        </div>
        <div>
          <p style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color }}>{label}</p>
          <p style={{ fontSize:12, color:"var(--ink2)" }}>Competitive defensibility score</p>
        </div>
      </div>

      {/* Component bars */}
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        {dims.map(({ key, label }) => {
          const v = components[key] ?? 0;
          const c = v >= 70 ? "#10b981" : v >= 50 ? "#f59e0b" : "#ef4444";
          return (
            <div key={key} style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:11, color:"var(--ink2)", width:72, flexShrink:0 }}>{label}</span>
              <div style={{ flex:1, height:5, background:"var(--s3)", borderRadius:99, overflow:"hidden" }}>
                <div style={{
                  height:"100%", width:`${v}%`, background:c, borderRadius:99,
                  transition:"width 1.2s cubic-bezier(0.4,0,0.2,1)"
                }}/>
              </div>
              <span style={{ fontSize:11, fontWeight:700, color:c, width:28, textAlign:"right" }}>{v}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
