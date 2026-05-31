export { guessDomain, guessSlug } from "./domain.mjs";

export function sentimentColor(score) {
  if (score >= 65) return "#10b981";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}

export function sentimentVariant(score) {
  if (score >= 65) return "green";
  if (score >= 40) return "amber";
  return "red";
}

export function momentumVariant(m) {
  if (m === "Rising")    return "green";
  if (m === "Declining") return "red";
  return "amber";
}
