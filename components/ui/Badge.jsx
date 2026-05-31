const VARIANTS = {
  green:   "badge-green",
  red:     "badge-red",
  amber:   "badge-amber",
  blue:    "badge-blue",
  gray:    "badge-gray",
  brand:   "badge-brand",
  bullish: "badge-green",
  bearish: "badge-red",
  neutral: "badge-gray",
};

export function Badge({ label, variant = "gray", dot = false }) {
  return (
    <span className={`badge ${VARIANTS[variant] ?? "badge-gray"}`}>
      {dot && (
        <span style={{
          width: 5, height: 5, borderRadius: "50%",
          background: "currentColor", display: "inline-block", flexShrink: 0,
        }} />
      )}
      {label}
    </span>
  );
}
