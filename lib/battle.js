function clampScore(value, fallback = 50) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(0, Math.min(100, Math.round(number)));
}

function momentumScore(report) {
  const direction = report?.trend_forecast?.direction || report?.momentum;
  if (["Growing", "Rising"].includes(direction)) return 84;
  if (direction === "Declining") return 38;
  return 64;
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function winnerFor(scoreA, scoreB, companyA, companyB) {
  if (Math.abs(scoreA - scoreB) <= 3) return "Tie";
  return scoreA > scoreB ? companyA : companyB;
}

function dimension(name, scoreA, scoreB, companyA, companyB, insight) {
  return {
    name,
    score_a: clampScore(scoreA),
    score_b: clampScore(scoreB),
    winner: winnerFor(scoreA, scoreB, companyA, companyB),
    insight,
  };
}

function average(scores) {
  if (!scores.length) return 0;
  return clampScore(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

function topStrengths(report) {
  return [
    report?.health_label ? `${report.company} is ${String(report.health_label).toLowerCase()} with a ${report.health_score}/100 health score.` : null,
    ...safeArray(report?.key_insights)
      .filter((item) => item?.signal !== "bearish")
      .map((item) => item.title || item.body),
    ...safeArray(report?.what_customers_love).slice(0, 2),
  ].filter(Boolean).slice(0, 4);
}

function firstGap(report) {
  const gap = safeArray(report?.market_gaps)[0];
  if (!gap) return null;
  return gap.gap || gap.evidence || null;
}

export function reportToComparisonData(report) {
  const meta = report?._meta || {};

  return {
    reddit: {
      posts: safeArray(meta.reddit_titles).map((title) => ({ title })),
    },
    trustpilot: {
      details: {
        rating: meta.tp_rating ?? null,
        reviewCount: meta.tp_review_count ?? 0,
      },
      reviews: safeArray(meta.tp_reviews_sample),
    },
    techcrunch: {
      articles: safeArray(meta.tc_titles).map((title) => ({ title })),
    },
    producthunt: {
      votesCount: meta.ph_votes ?? null,
    },
  };
}

export function buildFallbackBattle(companyA, companyB, reportA, reportB, meta = {}) {
  const moatA = reportA?.moat_components || {};
  const moatB = reportB?.moat_components || {};

  const dimensions = [
    dimension(
      "Customer Sentiment",
      reportA?.sentiment_score,
      reportB?.sentiment_score,
      companyA,
      companyB,
      `${companyA} sentiment is ${reportA?.sentiment_score ?? "unknown"}/100; ${companyB} is ${reportB?.sentiment_score ?? "unknown"}/100.`
    ),
    dimension(
      "Market Momentum",
      momentumScore(reportA),
      momentumScore(reportB),
      companyA,
      companyB,
      `${companyA} momentum is ${reportA?.momentum ?? "unknown"}; ${companyB} momentum is ${reportB?.momentum ?? "unknown"}.`
    ),
    dimension(
      "Community Strength",
      moatA.community_activity ?? reportA?._meta?.reddit_count,
      moatB.community_activity ?? reportB?._meta?.reddit_count,
      companyA,
      companyB,
      `${companyA} has ${reportA?._meta?.reddit_count ?? 0} Reddit signals; ${companyB} has ${reportB?._meta?.reddit_count ?? 0}.`
    ),
    dimension(
      "Funding Position",
      moatA.funding_position,
      moatB.funding_position,
      companyA,
      companyB,
      `${companyA}: ${reportA?.funding_intel?.last_round ?? "unknown funding"}; ${companyB}: ${reportB?.funding_intel?.last_round ?? "unknown funding"}.`
    ),
    dimension(
      "Brand Loyalty",
      average([moatA.brand_strength, moatA.sentiment_quality].filter(Number.isFinite)),
      average([moatB.brand_strength, moatB.sentiment_quality].filter(Number.isFinite)),
      companyA,
      companyB,
      "Brand loyalty blends brand strength and sentiment quality from the cached intelligence reports."
    ),
    dimension(
      "Product Velocity",
      moatA.growth_trend ?? reportA?._meta?.ph_votes,
      moatB.growth_trend ?? reportB?._meta?.ph_votes,
      companyA,
      companyB,
      `${companyA} growth trend scores ${moatA.growth_trend ?? "unknown"}; ${companyB} scores ${moatB.growth_trend ?? "unknown"}.`
    ),
  ];

  const avgA = average(dimensions.map((item) => item.score_a));
  const avgB = average(dimensions.map((item) => item.score_b));
  const overallWinner = winnerFor(avgA, avgB, companyA, companyB);
  const winningReport = overallWinner === companyB ? reportB : reportA;
  const losingReport = overallWinner === companyB ? reportA : reportB;

  const marketGap =
    [firstGap(reportA), firstGap(reportB)].filter(Boolean).join(" / ") ||
    "Both companies leave room for a sharper, more focused competitor.";

  return {
    company_a: companyA,
    company_b: companyB,
    generated_at: new Date().toISOString(),
    battle_summary:
      overallWinner === "Tie"
        ? `${companyA} and ${companyB} are closely matched. ${companyA} averages ${avgA}/100 across the demo intelligence dimensions, while ${companyB} averages ${avgB}/100. Use the dimension scores below to decide which strengths matter most for your market.`
        : `${overallWinner} has the edge in this fallback battle. It averages ${Math.max(avgA, avgB)}/100 across the cached intelligence dimensions versus ${Math.min(avgA, avgB)}/100 for ${overallWinner === companyA ? companyB : companyA}. The biggest difference is visible in the head-to-head scorecard below.`,
    overall_winner: overallWinner,
    win_reason:
      overallWinner === "Tie"
        ? "The two companies are within three points on the blended scorecard."
        : `${overallWinner} leads on the blended scorecard, especially ${winningReport?.moat_score >= losingReport?.moat_score ? "competitive moat" : "sentiment and momentum"}.`,
    battle_narrative: {
      opening:
        overallWinner === "Tie"
          ? `${companyA} and ${companyB} are too close to call on cached intelligence.`
          : `${overallWinner} wins this cached-intelligence comparison.`,
      decisive_factor: "Blended sentiment, moat, community, funding, and product velocity scores",
      company_a_advantage: topStrengths(reportA)[0] || `${companyA} has clearer cached intelligence signals.`,
      company_b_advantage: topStrengths(reportB)[0] || `${companyB} has clearer cached intelligence signals.`,
      final_verdict:
        overallWinner === "Tie"
          ? "Use live Wire evidence when available to break the tie; the cached reports show balanced strengths."
          : `${overallWinner} is the stronger pick on cached intelligence, but live Wire data should be used when upstream sources are available.`,
    },
    dimensions,
    company_a_strengths_vs_b: topStrengths(reportA),
    company_b_strengths_vs_a: topStrengths(reportB),
    market_gap_between_them: marketGap,
    startup_opportunity:
      reportA?.attack_strategy?.recommended_positioning ||
      reportB?.attack_strategy?.recommended_positioning ||
      "Build around the clearest unresolved customer pain in the two cached reports.",
    _meta: {
      ...meta,
      fallback: true,
      fallback_reason: "Live Wire evidence was unavailable, so cached demo intelligence was used.",
      fallback_average_a: avgA,
      fallback_average_b: avgB,
    },
  };
}

export function normalizeBattleReport(battle, companyA, companyB) {
  const normalized = battle && typeof battle === "object" ? { ...battle } : {};

  normalized.company_a = normalized.company_a || companyA;
  normalized.company_b = normalized.company_b || companyB;
  normalized.overall_winner = normalized.overall_winner || "Tie";
  normalized.win_reason = normalized.win_reason || "The available evidence did not identify a decisive winner.";
  normalized.battle_summary = normalized.battle_summary || "Battle analysis completed with limited evidence.";
  normalized.dimensions = safeArray(normalized.dimensions).map((item) => ({
    name: item?.name || "Competitive Dimension",
    score_a: clampScore(item?.score_a, 0),
    score_b: clampScore(item?.score_b, 0),
    winner: item?.winner || winnerFor(item?.score_a ?? 0, item?.score_b ?? 0, companyA, companyB),
    insight: item?.insight || "No specific evidence available for this dimension.",
  }));
  normalized.company_a_strengths_vs_b = safeArray(normalized.company_a_strengths_vs_b);
  normalized.company_b_strengths_vs_a = safeArray(normalized.company_b_strengths_vs_a);

  return normalized;
}
