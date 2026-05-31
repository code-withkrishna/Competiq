export function Spinner({ size = 18, color = "currentColor" }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      style={{ animation: "spin .7s linear infinite", display: "block", flexShrink: 0 }}
    >
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2.5" opacity=".2"/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}
