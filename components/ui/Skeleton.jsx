export function Skeleton({ width = "100%", height = 16, rounded = false, className = "" }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius: rounded ? 99 : "var(--r-sm)" }}
    />
  );
}

export function ReportSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Skeleton height={40} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <Skeleton height={72} />
        <Skeleton height={72} />
        <Skeleton height={72} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Skeleton height={140} />
        <Skeleton height={140} />
      </div>
      <Skeleton height={100} />
      <Skeleton height={100} />
    </div>
  );
}
