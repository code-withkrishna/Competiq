"use client";

import {
  AreaChart, Area, XAxis, YAxis,
  Tooltip, ResponsiveContainer,
} from "recharts";

export default function TrendAreaChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={150}>
      <AreaChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: -24 }}>
        <defs>
          <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4361ee" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#4361ee" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date"
          tick={{ fontSize: 10, fill: "var(--inkm)" }}
          tickLine={false} axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 10, fill: "var(--inkm)" }}
          tickLine={false} axisLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "var(--s0)", border: "1px solid var(--s3)",
            borderRadius: 8, fontSize: 12, boxShadow: "var(--shadow-sm)",
          }}
          cursor={{ stroke: "var(--brand)", strokeWidth: 1, strokeDasharray: "4 2" }}
        />
        <Area
          type="monotone" dataKey="value"
          stroke="#4361ee" strokeWidth={2}
          fill="url(#trendGrad)" dot={false}
          activeDot={{ r: 4, fill: "#4361ee", stroke: "#fff", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
