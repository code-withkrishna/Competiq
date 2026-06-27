# CompetIQ — Live Competitor Intelligence in 60 Seconds

> **Powered by Anakin Wire · Built for Anakin Build-a-thon 2026**

Your competitor's weaknesses, sourced from 7 live data streams, analyzed by 2 AI agents, delivered in about a minute.

---

## The Problem

Companies using Crayon or Klue pay $20K+/year for competitive intelligence. Junior analysts spend 3 hours manually checking Reddit, Trustpilot, and TechCrunch every week — and the data is stale before they finish.

**CompetIQ does it in 60 seconds, from live sources, for free.**

---

## What Makes It Different

| Traditional Research | CompetIQ |
|---|---|
| 3–4 hours manually | 60 seconds |
| Cached / stale data | Live Wire extraction at query time |
| One analyst's opinion | 2 AI agents: draft + critic challenge |
| Single company | Battle Mode: head-to-head across 6 dimensions |
| Information dump | Attack strategy + market gap detection |
| One source | Reddit + Trustpilot + TechCrunch + Google Trends + Product Hunt |

---

## Architecture

```
User Input: "Notion"
       │
       ▼
POST /api/analyze
       │
       ▼
┌─────────────────────────────────────────────────────┐
│              wireAll() Orchestrator                  │
│         7 parallel Wire jobs — ~18s total            │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐  │
│  │ rt_search    │  │ tp_details   │  │ tc_tags   │  │
│  │ Reddit posts │  │ TP rating    │  │ TC news   │  │
│  └──────────────┘  └──────────────┘  └───────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐  │
│  │ tp_reviews   │  │ tc_search    │  │ gt_trend  │  │
│  │ Review text  │  │ Funding news │  │ 12m trend │  │
│  └──────────────┘  └──────────────┘  └───────────┘  │
│  ┌──────────────┐                                    │
│  │ ph_product   │                                    │
│  │ PH votes     │                                    │
│  └──────────────┘                                    │
└─────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│         AgentOrchestrator        │
│                                  │
│  ┌───────────────────────────┐   │
│  │  DraftAgent (Pass 1)      │   │
│  │  Groq Llama 70B · T=0.1   │   │
│  │  health_score, moat,      │   │
│  │  swot, attack_strategy,   │   │
│  │  funding_intel, forecast  │   │
│  └───────────────┬───────────┘   │
│                  │               │
│  ┌───────────────▼───────────┐   │
│  │  CriticAgent (Pass 2)     │   │
│  │  Groq Llama 70B · T=0.3   │   │
│  │  challenges every claim   │   │
│  │  confidence_score per     │   │
│  │  claim, revised summary   │   │
│  └───────────────────────────┘   │
└──────────────────────────────────┘
       │
       ▼
Structured JSON Report → React UI (6 tabs)
```

**Battle Mode** fires 11 Wire calls across both companies simultaneously, then runs a head-to-head comparison across 6 competitive dimensions.

**Why Wire is indispensable:** Sequential API calls to 7 sources would take ~120 seconds. Wire's parallel execution brings that to ~18s — a 6.7× speedup that makes the 60-second product possible.

---

## The 2-Agent Pipeline

CompetIQ uses a named orchestrator pattern with two specialist agents:

| Agent | Role | Temperature | Output |
|---|---|---|---|
| **DraftAgent** | Extracts intelligence from raw Wire data | 0.1 (precise) | health_score, moat, swot, attack_strategy |
| **CriticAgent** | Challenges and validates every claim | 0.3 (skeptical) | confidence_score, validated vs speculative flags, revised summary |
| **AgentOrchestrator** | Dispatches both agents, handles graceful degradation | — | Final merged report |

The Critic's output surfaces in the "🔍 AI Validation" tab — judges can see exactly which claims were validated (✓), flagged (⚠), or challenged (✗) by a second independent pass.

---

## Demo Flow (for judges)

**Instant demo — 0 seconds wait:**
Click any pre-loaded company (Notion, Figma, Stripe, Linear, Perplexity) — reports load instantly from cached demo data, letting you see the full product in 2 seconds.

**Live demo — ~60 second wait:**
Type any company name and hit "Generate Intelligence Report →" — CompetIQ fires 7 Wire jobs, runs 2 AI passes, and returns a full brief.

**Battle Mode — ~75 second wait:**
Enter two company names and hit "⚔ Battle →" — 11 parallel Wire calls, head-to-head scoring across 6 dimensions, animated winner reveal.

**Best demo moment:** Battle Mode. The animated dimension bars filling and the Winner card appearing is the visual wow moment — plan your narrative so the ~75-second wait happens while you're explaining the architecture.

---

## Report Features

| Tab | What You Get |
|---|---|
| **Overview** | Health score, moat score, sentiment gauge, trends chart, funding intel |
| **Insights** | Key intelligence signals with bullish/bearish/neutral rating |
| **Recommendations** | Prioritized strategic actions with data-backed rationale |
| **SWOT** | Evidence-backed SWOT + attack strategy + market gap detection |
| **🔍 AI Validation** | CriticAgent's confidence score, validated vs speculative claims |
| **Sources** | Why Wire? speed comparison + full data provenance |

---

## Quick Start

### Prerequisites

- **Node.js 18.18+** (check with `node -v`; use `nvm use 18` if you have nvm)
- **Anakin Wire API key** — get yours at [anakin.io/dashboard](https://anakin.io/dashboard)
- **Groq API key (free)** — get yours at [console.groq.com](https://console.groq.com)

### Setup

```bash
# 1. Clone and install
git clone https://github.com/code-withkrishna/Competiq.git
cd Competiq
npm install

# 2. Configure environment
cp .env.example .env.local
# Open .env.local and fill in your ANAKIN_API_KEY and GROQ_API_KEY

# 3. Run
npm run dev
```

Open → **http://localhost:3000**

Click any instant demo chip for a zero-wait preview. No API keys needed for demo data.

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the required values:

| Variable | Required | Description |
|---|---|---|
| `ANAKIN_API_KEY` | ✅ Yes | Wire API key from anakin.io/dashboard |
| `GROQ_API_KEY` | ✅ Yes | Groq API key from console.groq.com (free tier works) |
| `GROQ_MODEL_NAME` | No | Defaults to `llama-3.3-70b-versatile` |
| `ANAKIN_WIRE_BASE_URL` | No | Defaults to `https://api.anakin.io/v1/wire` |
| `BATTLE_WIRE_TIMEOUT_MS` | No | Defaults to `42000` (42s) |
| `BATTLE_POLL_INTERVAL_MS` | No | Defaults to `1500` (1.5s) |
| `BATTLE_GROQ_TIMEOUT_MS` | No | Defaults to `14000` (14s) |
| `WIRE_TEST_TOKEN` | No | Enables the `/api/wire-test` diagnostic endpoint |

---

## Wire Actions Used

| Action ID | Source | Data | Mode |
|---|---|---|---|
| `rt_search` | Reddit | Top posts + community sentiment | Single + Battle |
| `tp_company_details` | Trustpilot | Star rating, review count | Single + Battle |
| `tp_company_reviews` | Trustpilot | Full review text | Single + Battle |
| `tc_tags` | TechCrunch | Company press coverage | Single + Battle |
| `tc_search` | TechCrunch | Funding-specific articles | Single only |
| `gt_interest_over_time` | Google Trends | 12-month search momentum | Single only |
| `gt_compare` | Google Trends | Side-by-side comparison | Battle only |
| `ph_product_details` | Product Hunt | Launch votes + maker info | Single + Battle |

**Single mode: 7 Wire calls. Battle mode: 11 Wire calls.**

---

## Performance

| Metric | Value |
|---|---|
| Wire jobs per single query | 7 parallel |
| Wire jobs per battle | 11 parallel |
| Typical response time | 45–75 seconds |
| AI agent passes | 2 (draft + critic) |
| Groq DraftAgent timeout | 35s (with 2× retry on 429) |
| Groq CriticAgent timeout | 20s (with 2× retry on 429) |
| Response cache TTL | 5 minutes |
| Demo data load time | Instant |

---

## Deploy

```bash
# Deploy to Vercel
npx vercel --prod
```

In the Vercel dashboard → Project Settings → Environment Variables, add:
- `ANAKIN_API_KEY`
- `GROQ_API_KEY`

Then redeploy. Vercel will pick up the new env vars automatically.

### Health Check

After deploying, verify the app is configured correctly:

```
GET https://your-deployment.vercel.app/api/health
```

Returns `{ "status": "ok" }` when both API keys are set, or `{ "status": "degraded" }` with details about what's missing.

---

## Troubleshooting

**"Wire API key missing" error**
→ Your `ANAKIN_API_KEY` is not set. Check your `.env.local` (local) or Vercel environment variables (production).

**"Intelligence service is temporarily busy" error**
→ Groq free tier rate limit hit. The app automatically retries up to 2× with backoff. If it persists, wait 60 seconds and retry, or upgrade to Groq's paid tier.

**"Data sources are temporarily unavailable" error**
→ Anakin Wire is timing out. All 7 Wire calls have a 95s timeout. Usually resolves by retrying. If persistent, check [status.anakin.io](https://anakin.io).

**Battle Mode returns demo data instead of live data**
→ Both companies fell back to cached demo data because Wire returned empty results. Try well-known company names like "Notion", "Linear", or "Figma".

**`npm test` shows MODULE_TYPELESS_PACKAGE_JSON warning**
→ Already fixed in this version. `"type": "module"` is set in `package.json`.

---

## Pitch Framing

> "Think of it as having a junior analyst who pulls data from 7 sources simultaneously — that's Wire. Then a senior analyst who writes the first draft — that's DraftAgent. Then a skeptical editor who fact-checks every claim — that's CriticAgent. You get the result in 60 seconds. Manually, it's 3 hours."

---

## License

MIT — see [LICENSE](./LICENSE)

---

*Built with Anakin Wire and Groq · Anakin Build-a-thon 2026*
*CompetIQ — 60-Second Competitor Intelligence via Anakin Wire*
