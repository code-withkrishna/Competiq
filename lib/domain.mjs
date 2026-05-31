const DOMAIN_OVERRIDES = {
  notion: "notion.so",
  linear: "linear.app",
  vercel: "vercel.com",
  supabase: "supabase.com",
  planetscale: "planetscale.com",
  loom: "loom.com",
  figma: "figma.com",
  replit: "replit.com",
  airtable: "airtable.com",
  webflow: "webflow.com",
};

export function guessDomain(company) {
  const slug = company.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "");
  return DOMAIN_OVERRIDES[slug] ?? `${slug}.com`;
}

export function guessSlug(company) {
  return company.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}
