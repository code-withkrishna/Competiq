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

```bash
# 1. Install
npm install

# 2. Add API keys
echo "ANAKIN_API_KEY=ask_xxx" >> .env.local
echo "GROQ_API_KEY=gsk_xxx" >> .env.local

# 3. Run
npm run dev
```

Open → **http://localhost:3000**

Click any instant demo chip for a zero-wait preview. No API keys needed for demo data.

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
| Response cache TTL | 5 minutes |
| Demo data load time | Instant |

---

## Deploy

```bash
npx vercel --prod
# Add ANAKIN_API_KEY + GROQ_API_KEY in Vercel dashboard
```

---

## Pitch Framing

> "Think of it as having a junior analyst who pulls data from 7 sources simultaneously — that's Wire. Then a senior analyst who writes the first draft — that's DraftAgent. Then a skeptical editor who fact-checks every claim — that's CriticAgent. You get the result in 60 seconds. Manually, it's 3 hours."

---

*Built with Anakin Wire and Groq · Anakin Build-a-thon 2026*
*CompetIQ — 60-Second Competitor Intelligence via Anakin Wire*
