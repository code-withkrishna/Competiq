import { wireAll, wire, ACTIONS } from "@/lib/wire";
import { buildComparePrompt, COMPARE_SYSTEM_PROMPT } from "@/lib/prompts";
import { guessDomain, guessSlug } from "@/lib/utils";
import { countComparisonQuality, shouldRejectComparisonForNoData } from "@/lib/quality.mjs";
import { DEMO_REPORTS } from "@/lib/demo-data";
import { buildFallbackBattle, normalizeBattleReport, reportToComparisonData } from "@/lib/battle";
import {
  checkRateLimit,
  clientKey,
  groqCall,
  InputValidationError,
  normalizeCompareInput,
  rateLimitResponse,
  readJSONBody,
  sanitizeError,
} from "@/lib/api-helpers";

export const maxDuration = 120;

function demoReportFor(company) {
  const normalized = company.toLowerCase();
  return Object.values(DEMO_REPORTS).find((report) => report.company.toLowerCase() === normalized) ?? null;
}

export async function POST(req) {
  try {
    const rate = checkRateLimit(clientKey(req, "compare"), { limit: 4, windowMs: 60_000 });
    if (!rate.allowed) return rateLimitResponse(rate);

    const { company_a, company_b, domain_a, domain_b } = normalizeCompareInput(await readJSONBody(req));

    const domA = domain_a || guessDomain(company_a);
    const domB = domain_b || guessDomain(company_b);

    // ── [FIX INT-04] GT_COMPARE fired once outside wireAll ────────
    // Company A (5 calls) + Company B (5 calls) + shared GT_COMPARE (1) = 11 ✓
    const [rawA, rawB, compareTrends] = await Promise.all([
      wireAll({
        reddit:      [ACTIONS.REDDIT_SEARCH, { query: company_a, sort: "top", time: "month", limit: 10 }],
        tp_details:  [ACTIONS.TP_DETAILS,    { domain: domA }],
        tp_reviews:  [ACTIONS.TP_REVIEWS,    { domain: domA, page: 1 }],
        tc_articles: [ACTIONS.TC_TAGS,       { tag: company_a, limit: 8 }],
        ph:          [ACTIONS.PH_PRODUCT,    { slug: guessSlug(company_a) }],
      }),
      wireAll({
        reddit:      [ACTIONS.REDDIT_SEARCH, { query: company_b, sort: "top", time: "month", limit: 10 }],
        tp_details:  [ACTIONS.TP_DETAILS,    { domain: domB }],
        tp_reviews:  [ACTIONS.TP_REVIEWS,    { domain: domB, page: 1 }],
        tc_articles: [ACTIONS.TC_TAGS,       { tag: company_b, limit: 8 }],
        ph:          [ACTIONS.PH_PRODUCT,    { slug: guessSlug(company_b) }],
      }),
      wire(ACTIONS.GT_COMPARE, {
        keywords: `${company_a},${company_b}`,
        timeframe: "today 12-m",
      }).catch(() => null),  // don't fail the whole request if trends fails
    ]);

    const normalize = ({ data }) => ({
      reddit:      { posts: data.reddit?.posts ?? data.reddit?.data?.children?.map(c => c.data) ?? [] },
      trustpilot:  { details: data.tp_details ?? {}, reviews: data.tp_reviews?.reviews ?? [] },
      techcrunch:  { articles: data.tc_articles?.articles ?? [] },
      producthunt: data.ph ?? {},
    });

    const dataA = normalize(rawA);
    const dataB = normalize(rawB);

    const liveQualityA = countComparisonQuality(dataA);
    const liveQualityB = countComparisonQuality(dataB);
    const demoA = demoReportFor(company_a);
    const demoB = demoReportFor(company_b);
    const fallbackSources = [];

    if (liveQualityA === 0 && demoA) {
      Object.assign(dataA, reportToComparisonData(demoA));
      fallbackSources.push("company_a_demo");
    }

    if (liveQualityB === 0 && demoB) {
      Object.assign(dataB, reportToComparisonData(demoB));
      fallbackSources.push("company_b_demo");
    }

    // ── [FIX BUG-04] Data quality gate ────────────────────────────
    const qualityA = countComparisonQuality(dataA);
    const qualityB = countComparisonQuality(dataB);

    if (shouldRejectComparisonForNoData(dataA, dataB)) {
      return Response.json({
        error: `Could not retrieve data for either "${company_a}" or "${company_b}". Try exact brand names like "Notion", "Linear", or "Figma".`,
      }, { status: 422 });
    }

    const dataGapNote = qualityA < 2 || qualityB < 2
      ? `\nNOTE: Limited data available (${qualityA}/3 sources for ${company_a}, ${qualityB}/3 for ${company_b}). Only score dimensions where you have clear evidence. Mark others as "Insufficient data".`
      : "";

    // ── Groq Battle Mode ──────────────────────────────────────────
    const useDeterministicFallback = liveQualityA === 0 && liveQualityB === 0 && demoA && demoB;
    let battle = useDeterministicFallback
      ? buildFallbackBattle(company_a, company_b, demoA, demoB)
      : await groqCall(
          COMPARE_SYSTEM_PROMPT,
          buildComparePrompt(company_a, company_b, dataA, dataB) + dataGapNote,
          3500,
          "llama-3.3-70b-versatile",
          0.1
        );

    battle = normalizeBattleReport(battle, company_a, company_b);

    battle._meta = {
      ...(battle._meta ?? {}),
      a_reddit:         dataA.reddit.posts.length,
      b_reddit:         dataB.reddit.posts.length,
      a_tp_rating:      dataA.trustpilot.details?.rating ?? null,
      b_tp_rating:      dataB.trustpilot.details?.rating ?? null,
      compare_timeline: compareTrends?.timeline ?? [],
      wire_calls:       11,  // 5 + 5 + 1 shared — accurate ✓
      quality_a:        qualityA,
      quality_b:        qualityB,
      live_quality_a:   liveQualityA,
      live_quality_b:   liveQualityB,
      data_source:      fallbackSources.length ? "demo_fallback" : "live_wire",
      fallback_sources: fallbackSources,
      wire_diagnostics: {
        company_a: rawA.diagnostics,
        company_b: rawB.diagnostics,
        compare_trends: compareTrends ? { ok: true } : { ok: false },
      },
      ai_model:         "groq/llama-3.3-70b-versatile",
    };

    return Response.json({ success: true, battle, company_a, company_b });
  } catch (err) {
    if (err instanceof InputValidationError) {
      return Response.json({ error: err.message }, { status: 400 });
    }
    console.error("[compare]", err);
    // [FIX BUG-03] Sanitized error
    return Response.json({ error: sanitizeError(err, "Battle analysis could not complete. Please try again.") }, { status: 500 });
  }
}
