export const SYSTEM_PROMPT = `You are CompetIQ — an elite competitive intelligence analyst AI.
You receive raw data extracted from Reddit, Trustpilot, TechCrunch, Google Trends, and Product Hunt via the Anakin Wire API.
Produce a razor-sharp, data-backed competitive intelligence report.
Be specific. Cite exact numbers from the data. Never be generic.
For SWOT items, always include which data source the claim comes from.
Return ONLY valid JSON. No markdown fences, no explanation, no preamble.`;

export const CRITIC_SYSTEM_PROMPT = `You are the CompetIQ Critic Agent — a skeptical second-pass analyst.
You receive a draft intelligence report and must challenge it rigorously.
Your job: find weak claims, identify data gaps, flag speculative conclusions.
Be brutally honest. If evidence is thin, say so explicitly.
Return ONLY valid JSON. No markdown fences, no explanation, no preamble.`;

export const COMPARE_SYSTEM_PROMPT = `You are CompetIQ Battle Mode — a competitive comparison analyst.
You receive intelligence data for TWO companies and must produce a head-to-head battle analysis.
Score each dimension objectively 0-100. Declare a winner per category. Be decisive and data-backed.
If data is insufficient for a dimension, set score_a and score_b both to 0 and winner to "Insufficient data".
Return ONLY valid JSON. No markdown fences, no explanation, no preamble.`;

// ── Analysis prompts ─────────────────────────────────────────────────

export function buildAnalysisPrompt(company, data) {
  const redditPosts = data.reddit?.posts?.slice(0, 10) ?? [];
  const reviews     = data.trustpilot?.reviews?.slice(0, 8) ?? [];
  const articles    = data.techcrunch?.articles?.slice(0, 6) ?? [];
  const tpDetails   = data.trustpilot?.details ?? {};
  const trends      = data.trends ?? {};
  const ph          = data.producthunt ?? {};

  return `Analyze this live competitor intelligence data for: "${company}"

REDDIT (${redditPosts.length} posts):
${JSON.stringify(redditPosts, null, 2)}

TRUSTPILOT (rating: ${tpDetails.rating ?? "N/A"}/5, ${tpDetails.reviewCount ?? 0} reviews):
${JSON.stringify({ details: tpDetails, reviews }, null, 2)}

TECHCRUNCH (${articles.length} articles):
${JSON.stringify(articles, null, 2)}

GOOGLE TRENDS:
${JSON.stringify(trends, null, 2)}

PRODUCT HUNT:
${JSON.stringify(ph, null, 2)}

Return ONLY this JSON:
{
  "company": "${company}",
  "generated_at": "ISO timestamp",
  "executive_summary": "3 sharp sentences with specific data. Lead with health score context.",
  "health_score": <0-100 integer>,
  "health_label": "Thriving|Healthy|Stable|Struggling|Critical",
  "sentiment_score": <0-100>,
  "sentiment_label": "Positive|Neutral|Mixed|Negative",
  "momentum": "Rising|Stable|Declining",
  "momentum_reason": "One data-backed reason",
  "moat_score": <0-100>,
  "moat_components": {
    "brand_strength": <0-100>,
    "community_activity": <0-100>,
    "funding_position": <0-100>,
    "sentiment_quality": <0-100>,
    "growth_trend": <0-100>
  },
  "swot": {
    "strengths": [
      { "point": "claim text citing specific data", "evidence": "e.g. Reddit: 89% positive across 15 posts", "source": "reddit|trustpilot|techcrunch|trends|producthunt" }
    ],
    "weaknesses": [
      { "point": "claim text", "evidence": "data citation", "source": "reddit|trustpilot|techcrunch|trends|producthunt" }
    ],
    "opportunities": [
      { "point": "opportunity text", "evidence": "basis for claim", "source": "reddit|trustpilot|techcrunch|trends|producthunt" }
    ],
    "threats": [
      { "point": "threat text", "evidence": "basis for claim", "source": "reddit|trustpilot|techcrunch|trends|producthunt" }
    ]
  },
  "market_gaps": [
    { "gap": "Specific unmet need", "evidence": "Data citation", "opportunity_size": "large|medium|small" }
  ],
  "attack_strategy": {
    "recommended_positioning": "One sentence positioning",
    "target_segment": "Who to target",
    "key_weakness_to_exploit": "Specific exploitable weakness",
    "suggested_messaging": "Core message under 10 words",
    "pricing_strategy": "Specific pricing recommendation",
    "growth_channels": ["channel 1", "channel 2", "channel 3"]
  },
  "key_insights": [
    { "type": "sentiment|funding|product|market", "title": "Punchy title", "body": "1-2 sentences with data", "signal": "bullish|bearish|neutral", "confidence": <0-100> }
  ],
  "customer_pain_points": ["specific from real reviews"],
  "what_customers_love": ["specific from real reviews"],
  "trend_forecast": {
    "direction": "Growing|Declining|Stable",
    "confidence": <0-100>,
    "reasoning": "Data-backed forecast rationale"
  },
  "funding_intel": {
    "last_round": "Series X or Unknown",
    "amount": "$Xm or Unknown",
    "investors": ["names if found"],
    "source": "TC article title or No public data found",
    "tc_mentions": <number>
  },
  "strategic_recommendations": [
    { "priority": "high|medium|low", "action": "Specific action", "rationale": "Data-backed reason" }
  ]
}`;
}

export function buildCriticPrompt(company, draftReport) {
  return `You are the Critic Agent reviewing a draft intelligence report for "${company}".

DRAFT REPORT:
${JSON.stringify(draftReport, null, 2)}

Challenge this report. For each SWOT item and key insight, assess: Is the evidence specific or speculative? Is it data-backed or inferred? What critical data is MISSING?

Return ONLY this JSON:
{
  "critic_summary": "2-3 sentences on overall report quality and main concerns",
  "confidence_score": <0-100>,
  "swot_challenges": {
    "strengths": [{ "claim": "original point", "challenge": "specific challenge or Validated", "confidence": <0-100> }],
    "weaknesses": [{ "claim": "original point", "challenge": "specific challenge or Validated", "confidence": <0-100> }],
    "opportunities": [{ "claim": "original point", "challenge": "specific challenge or Validated", "confidence": <0-100> }],
    "threats": [{ "claim": "original point", "challenge": "specific challenge or Validated", "confidence": <0-100> }]
  },
  "missing_data_signals": ["What data would strengthen this report?"],
  "validated_insights": ["Which key insights are strongly supported by data"],
  "speculative_flags": ["Which claims lack solid evidence"],
  "revised_executive_summary": "Improved executive summary incorporating critic perspective"
}`;
}

export function buildComparePrompt(companyA, companyB, dataA, dataB) {
  const summarize = (data, company) => ({
    company,
    tp_rating:          data.trustpilot?.details?.rating ?? null,
    tp_reviews:         data.trustpilot?.reviews?.length ?? 0,
    reddit_posts:       data.reddit?.posts?.length ?? 0,
    tc_articles:        data.techcrunch?.articles?.length ?? 0,
    top_reddit_titles:  data.reddit?.posts?.slice(0, 5).map(p => p.title) ?? [],
    top_reviews:        data.trustpilot?.reviews?.slice(0, 4).map(r => ({ rating: r.rating, text: r.text?.slice(0, 100) })) ?? [],
    top_tc:             data.techcrunch?.articles?.slice(0, 3).map(a => a.title) ?? [],
    ph_votes:           data.producthunt?.votesCount ?? null,
  });

  return `Battle mode analysis: "${companyA}" vs "${companyB}"

COMPANY A — ${companyA}:
${JSON.stringify(summarize(dataA, companyA), null, 2)}

COMPANY B — ${companyB}:
${JSON.stringify(summarize(dataB, companyB), null, 2)}

Return ONLY this JSON:
{
  "company_a": "${companyA}",
  "company_b": "${companyB}",
  "generated_at": "ISO timestamp",
  "battle_summary": "3-sentence head-to-head summary",
  "overall_winner": "${companyA} or ${companyB} or Tie",
  "win_reason": "One crisp sentence explaining why",
  "battle_narrative": {
    "opening": "One sentence: who wins and primary reason",
    "decisive_factor": "The single metric that made the difference",
    "company_a_advantage": "What A does definitively better",
    "company_b_advantage": "What B does definitively better",
    "final_verdict": "2-3 sentence recommendation for someone choosing between them"
  },
  "dimensions": [
    { "name": "Customer Sentiment", "score_a": <0-100>, "score_b": <0-100>, "winner": "${companyA} or ${companyB} or Tie or Insufficient data", "insight": "One data-backed sentence" },
    { "name": "Market Momentum",    "score_a": <0-100>, "score_b": <0-100>, "winner": "...", "insight": "..." },
    { "name": "Community Strength", "score_a": <0-100>, "score_b": <0-100>, "winner": "...", "insight": "..." },
    { "name": "Funding Position",   "score_a": <0-100>, "score_b": <0-100>, "winner": "...", "insight": "..." },
    { "name": "Brand Loyalty",      "score_a": <0-100>, "score_b": <0-100>, "winner": "...", "insight": "..." },
    { "name": "Product Velocity",   "score_a": <0-100>, "score_b": <0-100>, "winner": "...", "insight": "..." }
  ],
  "company_a_strengths_vs_b": ["What A does better than B specifically"],
  "company_b_strengths_vs_a": ["What B does better than A specifically"],
  "market_gap_between_them": "What neither company addresses well",
  "startup_opportunity": "Best opportunity to compete against both"
}`;
}
