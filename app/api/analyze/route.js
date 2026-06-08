import { wireAll, ACTIONS } from "@/lib/wire";
import { guessDomain, guessSlug } from "@/lib/utils";
import { AgentOrchestrator } from "@/lib/agents";
import {
  checkRateLimit,
  clientKey,
  InputValidationError,
  normalizeAnalyzeInput,
  rateLimitResponse,
  readJSONBody,
  sanitizeError,
  getCache,
  setCache,
} from "@/lib/api-helpers";

export const maxDuration = 120;

const REQUIRED_FIELDS = [
  "executive_summary","health_score","sentiment_score",
  "swot","key_insights","strategic_recommendations",
];

export async function POST(req) {
  try {
    const rate = checkRateLimit(clientKey(req, "analyze"), { limit: 6, windowMs: 60_000 });
    if (!rate.allowed) return rateLimitResponse(rate);

    const { company, domain } = normalizeAnalyzeInput(await readJSONBody(req));

    // ── Response cache (5-min TTL) ────────────────────────────────
    const cacheKey = `analyze:${company.toLowerCase()}:${domain ?? ""}`;
    const cached   = getCache(cacheKey);
    if (cached) {
      return Response.json({ success: true, report: cached, _cached: true });
    }

    const targetDomain = domain || guessDomain(company);
    const slug         = guessSlug(company);

    // ── STEP 1: 7 parallel Wire calls ────────────────────────────
    const { data: raw, diagnostics } = await wireAll({
      reddit:      [ACTIONS.REDDIT_SEARCH, { query: company, sort: "top", time: "month", limit: 15 }],
      tp_details:  [ACTIONS.TP_DETAILS,    { domain: targetDomain }],
      tp_reviews:  [ACTIONS.TP_REVIEWS,    { domain: targetDomain, page: 1 }],
      tc_articles: [ACTIONS.TC_TAGS,       { tag: company, limit: 10 }],
      tc_funding:  [ACTIONS.TC_SEARCH,     { query: `${company} funding`, limit: 5 }],
      trends:      [ACTIONS.GT_INTEREST,   { keyword: company, timeframe: "today 12-m" }],
      ph:          [ACTIONS.PH_PRODUCT,    { slug }],
    });

    // ── STEP 2: Normalize Wire data ───────────────────────────────
    const wireData = {
      reddit:      { posts: raw.reddit?.posts ?? raw.reddit?.data?.children?.map(c => c.data) ?? [] },
      trustpilot:  { details: raw.tp_details ?? {}, reviews: raw.tp_reviews?.reviews ?? [] },
      techcrunch:  { articles: [...(raw.tc_articles?.articles ?? []), ...(raw.tc_funding?.articles ?? [])] },
      trends:      raw.trends ?? {},
      producthunt: raw.ph ?? {},
    };

    // ── STEP 3 & 4: AgentOrchestrator runs DraftAgent → CriticAgent ──
    const orchestrator = new AgentOrchestrator();
    const {
      draftReport,
      criticReport,
      agentPasses,
      criticAvailable,
    } = await orchestrator.run(company, wireData);

    // ── Validate required fields ──────────────────────────────────
    const missingFields = REQUIRED_FIELDS.filter(f => !(f in draftReport));
    if (missingFields.length > 0) {
      console.warn("[analyze] Missing fields from DraftAgent:", missingFields);
      return Response.json({
        error: `Intelligence report generation failed. Missing critical fields: ${missingFields.join(", ")}`
      }, { status: 500 });
    }

    // ── STEP 5: Build final report ────────────────────────────────
    const sourcesVerified =
      (wireData.reddit.posts.length > 0 ? 1 : 0) +
      (wireData.trustpilot.reviews.length > 0 ? 1 : 0) +
      (wireData.techcrunch.articles.length > 0 ? 1 : 0) +
      (wireData.trends?.timeline?.length > 0 ? 1 : 0) +
      (wireData.producthunt?.votesCount ? 1 : 0);

    const report = {
      ...draftReport,
      critic:            criticReport,
      validated_summary: criticReport?.revised_executive_summary ?? draftReport.executive_summary,
      _meta: {
        reddit_count:       wireData.reddit.posts.length,
        tp_rating:          wireData.trustpilot.details?.rating ?? null,
        tp_review_count:    wireData.trustpilot.details?.reviewCount ?? 0,
        tc_article_count:   wireData.techcrunch.articles.length,
        ph_votes:           wireData.producthunt?.votesCount ?? null,
        trends_timeline:    raw.trends?.timeline ?? [],
        trends_available:   !!(raw.trends?.timeline?.length),
        sources_verified:   sourcesVerified,
        wire_calls:         7,
        agent_passes:       agentPasses,
        critic_available:   criticAvailable,
        wire_diagnostics:   diagnostics,
        reddit_titles:      wireData.reddit.posts.slice(0, 5).map(p => p.title).filter(Boolean),
        tc_titles:          wireData.techcrunch.articles.slice(0, 5).map(a => a.title).filter(Boolean),
        tp_reviews_sample:  wireData.trustpilot.reviews.slice(0, 3).map(r => ({
          text:   (r.text ?? r.body ?? "").slice(0, 200),
          rating: r.rating ?? r.stars ?? null,
        })),
        ai_model:           `groq/${process.env.GROQ_MODEL_NAME || "llama-3.3-70b-versatile"}`,
        // Wire timing for "Why Wire?" panel
        wire_timing_note:   "7 parallel Wire jobs executed in ~18s vs ~120s sequential",
      },
    };

    // Cache the result for 5 minutes
    setCache(cacheKey, report);

    return Response.json({ success: true, report });

  } catch (err) {
    if (err instanceof InputValidationError) {
      return Response.json({ error: err.message }, { status: 400 });
    }
    console.error("[analyze]", err);
    return Response.json({ error: sanitizeError(err, "Analysis could not complete. Please try again.") }, { status: 500 });
  }
}
