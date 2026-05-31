"use client";
import { useEffect, useState } from "react";

const HEALTH = {
  Thriving:  { color:"#10b981", bg:"#f0fdf4", border:"#bbf7d0" },
  Healthy:   { color:"#4361ee", bg:"#eff6ff", border:"#bfdbfe" },
  Stable:    { color:"#f59e0b", bg:"#fef3c7", border:"#fde68a" },
  Struggling:{ color:"#ef4444", bg:"#fef2f2", border:"#fecaca" },
  Critical:  { color:"#b91c1c", bg:"#fee2e2", border:"#fca5a5" },
};

export function HealthBar({ score = 0, label = "Stable" }) {
  const [val, setVal] = useState(0);
  useEffect(() => { const t = setTimeout(() => setVal(score), 200); return () => clearTimeout(t); }, [score]);
  const c = HEALTH[label] ?? HEALTH.Stable;

  return (
    <div style={{ background:c.bg, border:`1px solid ${c.border}`, borderRadius:"var(--r-md)", padding:"14px 16px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:8 }}>
        <div>
          <p style={{ fontSize:10, fontWeight:700, textTransform:"uppercase",
            letterSpacing:".06em", color:c.color, marginBottom:2 }}>Company Health</p>
          <p style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, color:c.color, lineHeight:1 }}>
            {label}
          </p>
        </div>
        <p style={{ fontFamily:"'Syne',sans-serif", fontSize:36, fontWeight:800, color:c.color }}>
          {Math.round(val)}<span style={{ fontSize:16, opacity:.6 }}>/100</span>
        </p>
      </div>
      <div style={{ height:8, background:"rgba(255,255,255,.5)", borderRadius:99, overflow:"hidden" }}>
        <div style={{
          height:"100%", width:`${val}%`, background:c.color, borderRadius:99,
          transition:"width 1.2s cubic-bezier(0.4,0,0.2,1)",
          boxShadow:`0 0 12px ${c.color}60`,
        }}/>
      </div>
    </div>
  );
}
