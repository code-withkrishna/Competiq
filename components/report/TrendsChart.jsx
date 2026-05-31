"use client";

import dynamic from "next/dynamic";

const TrendAreaChart = dynamic(() => import("./TrendAreaChart"), {
  ssr: false,
  loading: () => (
    <div style={{ height: 150, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--inkm)", fontSize: 12 }}>
      Loading trends...
    </div>
  ),
});

export function TrendsChart({ timeline }) {
  if (!timeline?.length) return (
    <div style={{ textAlign: "center", padding: "2rem", color: "var(--inkm)", fontSize: 12 }}>
      Trends data unavailable for this company.
    </div>
  );

  const data = timeline.map((d) => ({
    date: d.date ? d.date.slice(5) : d.formattedAxisTime ?? "",
    value: d.value ?? 0,
  }));

  return <TrendAreaChart data={data} />;
}
