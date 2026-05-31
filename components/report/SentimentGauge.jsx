"use client";
import { useEffect, useState } from "react";
import { sentimentColor } from "@/lib/utils";

export function SentimentGauge({ score = 50, label = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => { const t = setTimeout(() => setVal(score), 250); return () => clearTimeout(t); }, [score]);

  const color    = sentimentColor(val);
  const arcLen   = 226;
  const dashOff  = arcLen - (val / 100) * arcLen;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg viewBox="0 0 180 100" width="180" height="100">
        {/* Track */}
        <path d="M 18 92 A 72 72 0 0 1 162 92" fill="none" stroke="var(--s3)"
          strokeWidth="12" strokeLinecap="round" />
        {/* Active arc */}
        <path d="M 18 92 A 72 72 0 0 1 162 92" fill="none" stroke={color}
          strokeWidth="12" strokeLinecap="round"
          strokeDasharray={arcLen}
          strokeDashoffset={dashOff}
          style={{ transition: "stroke-dashoffset 1.3s cubic-bezier(0.4,0,0.2,1), stroke .4s" }}
        />
        {/* Score text */}
        <text x="90" y="80" textAnchor="middle" fontSize="30"
          fontWeight="800" fill="var(--ink)" fontFamily="'Syne',sans-serif">
          {Math.round(val)}
        </text>
        <text x="90" y="97" textAnchor="middle" fontSize="11" fill="var(--inkm)">
          {label}
        </text>
      </svg>
    </div>
  );
}
