// Pre-generated demo reports — load instantly, no API call needed
// Judges see a finished product the moment they land on the page

const RAW_DEMO_REPORTS = {
  Notion: {
    company: "Notion",
    generated_at: new Date().toISOString(),
    executive_summary: "Notion holds dominant brand recognition in the collaborative workspace market with 4.1/5 Trustpilot from 8,200+ reviews, but faces mounting pressure from Linear and Coda with 43% of negative reviews citing mobile performance. Reddit's r/Notion (287k members) shows strong community loyalty despite recurring complaints about database slowness on large workspaces.",
    validated_summary: "Notion leads on brand and ecosystem depth but has measurable mobile UX debt — 43% of 1-star Trustpilot reviews mention mobile specifically. Reddit sentiment is 72% positive, anchored by power users; churn risk concentrates in teams scaling beyond 50 active pages.",
    health_score: 78,
    health_label: "Healthy",
    sentiment_score: 72,
    sentiment_label: "Positive",
    momentum: "Stable",
    momentum_reason: "Search interest flat YoY but AI feature launch driving new signups",
    moat_score: 74,
    moat_components: { brand_strength: 85, community_activity: 80, funding_position: 88, sentiment_quality: 65, growth_trend: 55 },
    swot: {
      strengths: ["Category-defining brand with 30k+ community templates", "Strong enterprise adoption post $275M Series C (Sequoia, Coatue)", "AI features launched to 4M users in 2024 — top-5 Product Hunt launch"],
      weaknesses: ["Mobile app rated 2.8/5 — cited in 43% of 1-star Trustpilot reviews", "Performance degrades significantly on databases >1000 rows (Reddit top complaint)", "Complex pricing confusion vs competitors — 3 pricing tiers vs Linear's 2"],
      opportunities: ["AI-native workflow market growing 34% YoY — Notion AI is well-positioned", "Education sector largely untapped — less than 5% of enterprise deals are EDU", "API ecosystem could unlock developer segment currently going to Coda"],
      threats: ["Microsoft Loop bundled free with M365 for enterprise buyers", "Linear gaining dev-adjacent teams with 40% faster load times", "Coda's formula engine winning spreadsheet-heavy power users"],
    },
    market_gaps: [
      { gap: "Mobile-first productivity for remote teams", evidence: "43% of Trustpilot 1-star reviews mention mobile", opportunity_size: "large" },
      { gap: "Offline-first document editing", evidence: "Reddit: 2.3k upvote post 'Notion offline still broken in 2025'", opportunity_size: "medium" },
      { gap: "Performance at scale (>10k pages)", evidence: "Reddit r/Notion top monthly post on database slowness", opportunity_size: "large" },
    ],
    attack_strategy: {
      recommended_positioning: "Mobile-first productivity tool that works offline",
      target_segment: "Remote teams of 10-50 people frustrated with Notion's mobile lag",
      key_weakness_to_exploit: "Mobile UX — 43% of negative reviews cite this specifically",
      suggested_messaging: "Works beautifully on mobile, offline, always",
      pricing_strategy: "Simple 2-tier pricing undercutting Notion's Plus plan by 30%",
      growth_channels: ["Reddit r/Notion (287k members)", "Product Hunt (high Notion community overlap)", "Twitter/X dev community"],
    },
    key_insights: [
      { type: "sentiment", title: "Reddit loyalty masks quiet churn", body: "r/Notion has 287k members and strong engagement, but top posts this month are about switching to Obsidian or Linear — a leading indicator.", signal: "bearish" },
      { type: "funding", title: "$275M Series C signals enterprise push", body: "TechCrunch: 4 enterprise announcements in 90 days, 68% of open roles are enterprise sales/success.", signal: "bullish" },
      { type: "product", title: "Notion AI gaining real traction", body: "18.4k Product Hunt votes, search queries for 'notion ai' up 340% YoY per Google Trends.", signal: "bullish" },
      { type: "market", title: "Mobile is the competitive gap", body: "Competitor apps all score higher on mobile — this is a structural vulnerability, not a product roadmap item.", signal: "bearish" },
    ],
    customer_pain_points: ["Slow performance on large databases", "Mobile app clunky vs desktop", "Steep learning curve for new users", "No reliable offline mode", "Confusing pricing for teams"],
    what_customers_love: ["All-in-one flexibility", "Beautiful templates", "Strong community", "Generous free tier", "Notion AI for writing"],
    trend_forecast: { direction: "Stable", confidence: 72, reasoning: "Search interest flat but AI features creating new growth vector; mobile complaints could trigger churn if competitor ships strong mobile-first alternative" },
    funding_intel: { last_round: "Series C", amount: "$275M", investors: ["Sequoia Capital", "Coatue Management", "Tiger Global"], source: "Notion raises $275M at $10B valuation — TechCrunch", tc_mentions: 12 },
    strategic_recommendations: [
      { priority: "high", action: "Target mobile-frustrated Notion users with a mobile-first alternative", rationale: "43% of negative Trustpilot reviews mention mobile specifically — this is the biggest known weakness" },
      { priority: "high", action: "Publish performance benchmarks vs Notion on large databases", rationale: "Reddit's top monthly post is about Notion slowness; owning this narrative would drive SEO and press" },
      { priority: "medium", action: "Build r/Notion presence with genuine helpful content", rationale: "287k members who are already frustrated — lowest-cost acquisition channel" },
    ],
    critic: {
      confidence_score: 76,
      critic_summary: "Strong evidence base for mobile/performance weaknesses — directly cited in reviews. Funding intel is solid from TechCrunch. Opportunity sizing is inferred, not measured; treat market gap claims as directional.",
      validated_insights: ["Mobile UX weakness — direct review evidence", "Series C funding details — TC sourced", "r/Notion community size"],
      speculative_flags: ["34% AI market growth figure not verified in this dataset", "Education sector opportunity is inference, not data"],
      missing_data_signals: ["Glassdoor reviews would strengthen hiring/culture claims", "LinkedIn follower growth rate", "App Store ratings trend over time"],
      swot_challenges: {
        strengths: [{ claim: "Category-defining brand", challenge: "Validated — consistent across Reddit, PH, Trustpilot", confidence: 90 }],
        weaknesses: [{ claim: "Mobile rated 2.8/5", challenge: "Validated — consistent Trustpilot signal", confidence: 88 }],
        opportunities: [{ claim: "AI market growing 34% YoY", challenge: "Figure not verified in this dataset — treat as directional", confidence: 55 }],
        threats: [{ claim: "Loop bundled with M365", challenge: "Validated — TC coverage confirms enterprise threat", confidence: 82 }],
      },
    },
    _meta: {
      reddit_count: 47, tp_rating: 4.1, tp_review_count: 8243,
      tc_article_count: 12, ph_votes: 18400, trends_available: true,
      sources_verified: 5,
      wire_calls: 7, agent_passes: 2,
      reddit_titles: [
        "Notion is getting too slow — anyone else considering switching? (4.2k upvotes)",
        "After 3 years I finally moved from Notion to Obsidian — here's why",
        "Notion AI is genuinely impressive now — updated my whole workspace",
        "Why is Notion still so bad on mobile in 2025?",
        "Notion vs ClickUp for a 20-person startup — what would you choose?",
      ],
      tc_titles: [
        "Notion raises $275M Series C at $10B valuation",
        "Notion AI hits 4M users, expands to enterprise",
        "Can Notion fend off Linear and Coda in the enterprise?",
        "Notion acquires startup to boost collaboration features",
      ],
      tp_reviews_sample: [
        { rating: 5, text: "Game changer for our team. The templates are incredible and Notion AI saves us hours every week." },
        { rating: 1, text: "Completely unusable on mobile. The app crashes constantly and offline mode simply doesn't work." },
        { rating: 3, text: "Great concept but gets painfully slow when you have a large database. The desktop version is fine." },
      ],
      trends_timeline: Array.from({length: 12}, (_,i) => ({
        date: `2025-${String(i+1).padStart(2,'0')}-01`,
        value: 65 + Math.round(Math.sin(i*0.5)*15 + Math.random()*8)
      })),
    },
  },

  "Perplexity AI": {
    company: "Perplexity AI",
    generated_at: new Date().toISOString(),
    executive_summary: "Perplexity AI is one of the fastest-growing AI search products with explosive Reddit momentum (r/perplexity 45k members, 89% positive sentiment) and $520M Series B from SoftBank. However, Trustpilot data is sparse and the product faces existential threat from Google's AI Overviews cannibalizing their core use case.",
    validated_summary: "Perplexity's growth signals are genuine — Reddit sentiment 89% positive, 3.2k PH votes on latest launch, $520M funding confirmed. The Google threat is material: AI Overviews directly competes. Critical risk: product-market fit is powerful but defensibility is weak without a moat beyond UX quality.",
    health_score: 84,
    health_label: "Thriving",
    sentiment_score: 89,
    sentiment_label: "Positive",
    momentum: "Rising",
    momentum_reason: "Search interest up 280% YoY, funding announcements driving mainstream press",
    moat_score: 52,
    moat_components: { brand_strength: 65, community_activity: 82, funding_position: 90, sentiment_quality: 88, growth_trend: 95 },
    swot: {
      strengths: ["Exceptional user sentiment — 89% positive Reddit, most praised for answer quality", "$520M Series B (SoftBank) gives 2+ years runway at current burn", "Product Hunt 3.2k votes — strong dev community adoption"],
      weaknesses: ["No proprietary data moat — relies on crawling like competitors", "Limited Trustpilot presence suggests weak enterprise buyer trust", "No offline capability or enterprise SSO mentioned in reviews"],
      opportunities: ["Enterprise market largely untapped — current users are power consumers, not buyers", "API access for developers — currently undermonetized based on GitHub discussions", "Education market — students are heaviest users per Reddit"],
      threats: ["Google AI Overviews directly competes with core use case", "OpenAI ChatGPT browsing mode is functionally similar", "Potential legal exposure around content aggregation without licensing"],
    },
    market_gaps: [
      { gap: "B2B team research workflows", evidence: "Reddit: most users are individual professionals, no team features mentioned", opportunity_size: "large" },
      { gap: "Vertical-specific research agents (medical, legal, finance)", evidence: "Product Hunt comments request specialized versions", opportunity_size: "large" },
    ],
    attack_strategy: {
      recommended_positioning: "Enterprise research platform with team collaboration",
      target_segment: "Research teams at PE firms, consulting firms, media companies",
      key_weakness_to_exploit: "No team features or enterprise-grade security",
      suggested_messaging: "Research together, cite everything automatically",
      pricing_strategy: "Team tier at $25/seat/month — 50% below typical research tool cost",
      growth_channels: ["LinkedIn (research/professional audience)", "Hacker News", "Legal/finance subreddits"],
    },
    key_insights: [
      { type: "sentiment", title: "Strongest positive sentiment in AI search", body: "89% positive Reddit sentiment across 340 analyzed posts — users consistently praise answer accuracy and citation quality.", signal: "bullish" },
      { type: "funding", title: "$520M Series B removes near-term risk", body: "SoftBank-led round confirmed by TechCrunch gives 2+ year runway and validates enterprise trajectory.", signal: "bullish" },
      { type: "market", title: "Google threat is real and growing", body: "AI Overviews launched in May 2024 — Perplexity's core value prop is directly in Google's crosshairs at zero cost to users.", signal: "bearish" },
    ],
    customer_pain_points: ["Occasional hallucinations on niche topics", "No team/collaboration features", "Mobile app not as polished as web", "Rate limits on free tier frustrating"],
    what_customers_love: ["Citation quality — always shows sources", "Answer accuracy for research", "Clean UI vs ChatGPT", "Speed of responses", "Pro search mode for complex queries"],
    trend_forecast: { direction: "Growing", confidence: 83, reasoning: "280% YoY search growth, funding validates trajectory, but Google threat could plateau growth in 12-18 months" },
    funding_intel: { last_round: "Series B", amount: "$520M", investors: ["SoftBank", "Jeff Bezos", "NVIDIA"], source: "Perplexity AI raises $520M Series B led by SoftBank — TechCrunch", tc_mentions: 8 },
    strategic_recommendations: [
      { priority: "high", action: "Build team research workflows before Google does", rationale: "Perplexity lacks team features — this is the enterprise gap that Google won't prioritize" },
      { priority: "high", action: "Target legal and financial research teams specifically", rationale: "These buyers need citations, accuracy, and compliance — Perplexity's strengths align perfectly" },
    ],
    critic: {
      confidence_score: 79,
      critic_summary: "Funding intel is strongly validated from TechCrunch. Sentiment data from Reddit is robust at 340 posts. Google threat assessment is well-reasoned but market impact timeline is speculative.",
      validated_insights: ["$520M Series B from SoftBank — confirmed TechCrunch", "89% positive Reddit sentiment", "PH vote count"],
      speculative_flags: ["Enterprise untapped claim — inferred not measured", "Legal exposure risk — directional, not confirmed"],
      missing_data_signals: ["App store rating trends", "Google Trends comparison vs ChatGPT", "Enterprise customer logos"],
      swot_challenges: {
        strengths: [{ claim: "89% positive Reddit sentiment", challenge: "Validated — high sample size", confidence: 88 }],
        weaknesses: [{ claim: "Limited Trustpilot presence", challenge: "Validated — signals B2C focus, enterprise trust gap real", confidence: 78 }],
        opportunities: [{ claim: "Enterprise untapped", challenge: "Reasonable inference but no enterprise deal data", confidence: 58 }],
        threats: [{ claim: "Google AI Overviews competes directly", challenge: "Validated — TC coverage confirms this explicitly", confidence: 90 }],
      },
    },
    _meta: {
      reddit_count: 38, tp_rating: 3.9, tp_review_count: 420,
      tc_article_count: 8, ph_votes: 3200, trends_available: true,
      sources_verified: 5,
      wire_calls: 7, agent_passes: 2,
      reddit_titles: [
        "Perplexity Pro is genuinely better than GPT-4 for research tasks (1.8k upvotes)",
        "Why I switched from Google Scholar to Perplexity for literature reviews",
        "Perplexity vs ChatGPT for daily work — 6 month comparison",
        "The citation feature alone is worth the $20/month",
      ],
      tc_titles: [
        "Perplexity AI raises $520M Series B led by SoftBank",
        "Perplexity AI hits 100M monthly active users",
        "Can Perplexity survive Google's AI search push?",
      ],
      tp_reviews_sample: [
        { rating: 5, text: "Best AI research tool I've used. Citations are accurate, answers are well-reasoned. Pro is worth every cent." },
        { rating: 4, text: "Great for most research tasks. Occasionally gets dates wrong but the source citations let you verify easily." },
        { rating: 2, text: "Rate limits on free tier are too aggressive. Hits the cap after 5 questions which is frustrating." },
      ],
      trends_timeline: Array.from({length: 12}, (_,i) => ({
        date: `2025-${String(i+1).padStart(2,'0')}-01`,
        value: 30 + Math.round(i * 5.5 + Math.random()*6)
      })),
    },
  },

  Figma: {
    company: "Figma",
    generated_at: new Date().toISOString(),
    executive_summary: "Figma remains the collaboration default for design teams with strong Product Hunt and Reddit visibility, but sentiment is pressured by pricing, performance on large files, and Adobe-acquisition-era trust residue. Its moat is still high because multiplayer design workflows, plugins, and org-wide design systems are deeply embedded.",
    validated_summary: "Figma's collaboration moat is durable and broadly validated across community channels. The main competitive openings are pricing frustration, large-file performance, and handoff complexity for engineering teams.",
    health_score: 81,
    health_label: "Healthy",
    sentiment_score: 76,
    sentiment_label: "Positive",
    momentum: "Stable",
    momentum_reason: "Search interest is steady with periodic spikes around Config and AI feature announcements",
    moat_score: 82,
    moat_components: { brand_strength: 90, community_activity: 84, funding_position: 86, sentiment_quality: 72, growth_trend: 66 },
    swot: {
      strengths: ["Default collaborative design platform for product teams", "Deep plugin and template ecosystem", "Strong enterprise penetration and design-system workflows"],
      weaknesses: ["Pricing complaints from freelancers and smaller teams", "Large files can become sluggish in complex design systems", "Developer handoff still creates duplicate work for frontend teams"],
      opportunities: ["AI-assisted design iteration and asset generation", "Closer product-management and engineering workflow integration", "Design ops analytics for enterprise teams"],
      threats: ["Canva pushing into lightweight product design", "Framer winning interactive prototyping and web publishing", "Penpot appealing to open-source and cost-sensitive teams"],
    },
    market_gaps: [
      { gap: "Affordable design-system collaboration for small teams", evidence: "Reddit complaints cluster around seat pricing and plan packaging", opportunity_size: "medium" },
      { gap: "Designer-to-developer handoff without rework", evidence: "Community threads repeatedly mention token drift and implementation mismatch", opportunity_size: "large" },
      { gap: "Fast performance for massive component libraries", evidence: "Power users cite lag in large enterprise files", opportunity_size: "medium" },
    ],
    attack_strategy: {
      recommended_positioning: "Design-to-code workspace for teams tired of handoff drift",
      target_segment: "Product teams with 5-50 designers and frontend engineers",
      key_weakness_to_exploit: "Engineering handoff remains lossy despite strong design collaboration",
      suggested_messaging: "Design systems that ship exactly as designed",
      pricing_strategy: "Bundle designers and developers together instead of charging every viewer seat",
      growth_channels: ["Design Twitter/X", "Figma community creators", "Frontend engineering newsletters"],
    },
    key_insights: [
      { type: "product", title: "Collaboration moat remains the core advantage", body: "Community discussion consistently frames Figma as the easiest place for design teams to work together in real time.", signal: "bullish" },
      { type: "sentiment", title: "Pricing is the clearest wedge", body: "Negative reviews and Reddit threads skew toward plan packaging, seat costs, and small-team affordability.", signal: "bearish" },
      { type: "market", title: "Handoff is still unresolved", body: "Competitors can win teams that want design tokens, code output, and implementation review in one loop.", signal: "bearish" },
    ],
    customer_pain_points: ["Seat pricing feels high for small teams", "Large files can lag", "Developer handoff requires manual interpretation", "Branching and governance can be complex", "Offline access is limited"],
    what_customers_love: ["Real-time collaboration", "Component libraries", "Plugin ecosystem", "Community templates", "Fast onboarding for designers"],
    trend_forecast: { direction: "Stable", confidence: 74, reasoning: "Figma is entrenched, but growth depends on whether AI and Dev Mode convert beyond the design org" },
    funding_intel: { last_round: "Acquisition terminated", amount: "$20B proposed deal", investors: ["Adobe"], source: "Adobe and Figma terminate acquisition agreement — TechCrunch", tc_mentions: 18 },
    strategic_recommendations: [
      { priority: "high", action: "Position against handoff rework, not design collaboration", rationale: "Figma is too strong in collaboration; the sharper gap is implementation fidelity" },
      { priority: "medium", action: "Offer transparent small-team pricing", rationale: "Pricing frustration is the most repeatable negative signal" },
      { priority: "medium", action: "Publish performance benchmarks on massive component libraries", rationale: "Enterprise design-system lag is a credible wedge for power users" },
    ],
    critic: {
      confidence_score: 77,
      critic_summary: "The collaboration and ecosystem claims are strongly supported by broad community signals. Pricing and performance gaps are validated directionally, while exact churn impact is inferred.",
      validated_insights: ["Strong collaborative design moat", "Pricing complaint pattern", "High Product Hunt visibility"],
      speculative_flags: ["Exact enterprise churn risk not measured", "AI adoption impact still emerging"],
      missing_data_signals: ["Current G2 enterprise ratings", "Seat expansion trend", "Dev Mode conversion data"],
      swot_challenges: {
        strengths: [{ claim: "Default collaborative design platform", challenge: "Validated by community and market visibility", confidence: 88 }],
        weaknesses: [{ claim: "Pricing complaints", challenge: "Validated directionally across community posts", confidence: 78 }],
        opportunities: [{ claim: "AI-assisted design iteration", challenge: "Plausible but adoption depth is still unclear", confidence: 62 }],
        threats: [{ claim: "Framer winning publishing workflows", challenge: "Validated for prototyping/web publishing niche", confidence: 74 }],
      },
    },
    _meta: {
      reddit_count: 34, tp_rating: 3.8, tp_review_count: 1180,
      tc_article_count: 18, ph_votes: 12600, trends_available: true,
      sources_verified: 5,
      wire_calls: 7, agent_passes: 2,
      reddit_titles: [
        "Figma pricing is getting harder to justify for our small team",
        "Dev Mode is useful but handoff still takes too much manual cleanup",
        "Large design system files are painfully slow this week",
        "Why our team still comes back to Figma after trying Framer",
      ],
      tc_titles: [
        "Adobe and Figma terminate acquisition agreement",
        "Figma adds AI features for design teams",
        "Figma expands Dev Mode for engineering handoff",
      ],
      tp_reviews_sample: [
        { rating: 5, text: "The collaboration features are unmatched. Our design reviews are faster and more organized." },
        { rating: 2, text: "Pricing keeps going up and the plan limits are confusing for smaller teams." },
        { rating: 3, text: "Great product, but large files with many components can become slow." },
      ],
      trends_timeline: Array.from({length: 12}, (_,i) => ({
        date: `2025-${String(i+1).padStart(2,'0')}-01`,
        value: 70 + Math.round(Math.sin(i*0.45)*10 + Math.random()*5)
      })),
    },
  },

  Linear: {
    company: "Linear",
    generated_at: new Date().toISOString(),
    executive_summary: "Linear has unusually strong developer sentiment and a premium brand in issue tracking, but its narrow focus creates openings for broader work-management suites. Reddit and Product Hunt signals point to speed, polish, and opinionated workflows as the core moat.",
    validated_summary: "Linear's positive sentiment is driven by speed and taste. The biggest risk is buyer consolidation: larger organizations may prefer Jira, Asana, or Notion-style suites when cross-functional stakeholders outnumber engineers.",
    health_score: 86,
    health_label: "Thriving",
    sentiment_score: 88,
    sentiment_label: "Positive",
    momentum: "Rising",
    momentum_reason: "Search momentum climbs around enterprise launches and developer-community mentions",
    moat_score: 68,
    moat_components: { brand_strength: 74, community_activity: 80, funding_position: 78, sentiment_quality: 90, growth_trend: 82 },
    swot: {
      strengths: ["Fast, keyboard-first UX loved by engineering teams", "Strong brand among startups and product-led companies", "Opinionated workflow reduces setup overhead"],
      weaknesses: ["Less flexible for non-engineering departments", "Advanced reporting and portfolio planning trail enterprise incumbents", "Pricing can be hard to justify alongside existing suite tools"],
      opportunities: ["Enterprise engineering planning without Jira complexity", "AI-assisted triage and roadmap summarization", "Deeper GitHub, Slack, and incident-management workflows"],
      threats: ["Jira remains entrenched in large enterprises", "Notion and Asana bundle lightweight issue tracking", "GitHub Issues can absorb budget-sensitive teams"],
    },
    market_gaps: [
      { gap: "Jira replacement for high-growth engineering orgs", evidence: "Reddit threads praise Linear speed while complaining about Jira complexity", opportunity_size: "large" },
      { gap: "Executive-ready reporting without admin bloat", evidence: "Reviews ask for better portfolio and planning views", opportunity_size: "medium" },
    ],
    attack_strategy: {
      recommended_positioning: "The issue tracker for engineering teams that refuse Jira bloat",
      target_segment: "Seed-to-Series C software companies with 10-200 engineers",
      key_weakness_to_exploit: "Limited cross-functional reporting for executives and non-engineering stakeholders",
      suggested_messaging: "Linear speed with boardroom-ready planning",
      pricing_strategy: "Per-editor pricing with free stakeholder dashboards",
      growth_channels: ["Hacker News", "GitHub communities", "Founder/operator newsletters"],
    },
    key_insights: [
      { type: "sentiment", title: "Developer love is the moat", body: "Positive community signals repeatedly mention speed, keyboard shortcuts, and low-friction workflows.", signal: "bullish" },
      { type: "market", title: "Cross-functional adoption is the constraint", body: "Linear can lose when product, marketing, and leadership want broader planning surfaces.", signal: "bearish" },
      { type: "product", title: "AI triage is a natural expansion path", body: "Issue summarization and duplicate detection align with Linear's speed-focused brand.", signal: "bullish" },
    ],
    customer_pain_points: ["Portfolio reporting is limited", "Non-engineering teammates may find it too opinionated", "Migration from Jira can be messy", "Advanced permissions need care", "Suite consolidation can undermine budget"],
    what_customers_love: ["Fast interface", "Keyboard shortcuts", "GitHub and Slack workflows", "Clean cycles and roadmaps", "Low admin overhead"],
    trend_forecast: { direction: "Growing", confidence: 80, reasoning: "Developer sentiment is excellent and enterprise demand for Jira alternatives remains durable" },
    funding_intel: { last_round: "Series B", amount: "$35M", investors: ["Accel", "Sequoia Capital"], source: "Linear raises Series B to build modern software planning — TechCrunch", tc_mentions: 7 },
    strategic_recommendations: [
      { priority: "high", action: "Target teams actively migrating from Jira", rationale: "The strongest pain signal is Jira complexity, and Linear has credibility there" },
      { priority: "medium", action: "Add stakeholder dashboards without slowing core UX", rationale: "This closes the cross-functional gap while preserving developer love" },
      { priority: "medium", action: "Package migration tooling as a growth channel", rationale: "Switching cost is the main blocker for larger teams" },
    ],
    critic: {
      confidence_score: 81,
      critic_summary: "Community sentiment around speed and developer appeal is highly consistent. Enterprise reporting gaps are plausible from feature comparisons, but exact lost-deal impact is not present in this dataset.",
      validated_insights: ["Strong developer sentiment", "Jira replacement positioning", "Product Hunt and Reddit traction"],
      speculative_flags: ["Executive reporting demand size", "AI triage adoption timeline"],
      missing_data_signals: ["Win/loss data vs Jira", "Enterprise customer count", "Churn by company size"],
      swot_challenges: {
        strengths: [{ claim: "Fast keyboard-first UX", challenge: "Validated by repeated community praise", confidence: 91 }],
        weaknesses: [{ claim: "Less flexible for non-engineering departments", challenge: "Reasonable from product scope and review patterns", confidence: 72 }],
        opportunities: [{ claim: "Enterprise planning without Jira complexity", challenge: "Validated as demand signal, sizing is inferred", confidence: 70 }],
        threats: [{ claim: "Jira remains entrenched", challenge: "Validated by market position", confidence: 86 }],
      },
    },
    _meta: {
      reddit_count: 29, tp_rating: 4.4, tp_review_count: 610,
      tc_article_count: 7, ph_votes: 9800, trends_available: true,
      sources_verified: 5,
      wire_calls: 7, agent_passes: 2,
      reddit_titles: [
        "Linear is the first issue tracker our engineers actually like",
        "Migrating from Jira to Linear: what broke and what got better",
        "Linear is great until non-engineering teams need reporting",
        "Cycles finally made sprint planning less painful",
      ],
      tc_titles: [
        "Linear raises Series B to rethink software planning",
        "Linear launches enterprise features for larger engineering teams",
        "The startup tools challenging Jira's dominance",
      ],
      tp_reviews_sample: [
        { rating: 5, text: "Fast, clean, and easy to use. Our team actually keeps issues updated now." },
        { rating: 4, text: "Excellent for engineering, but leadership dashboards could be stronger." },
        { rating: 3, text: "Migration from Jira took more effort than expected." },
      ],
      trends_timeline: Array.from({length: 12}, (_,i) => ({
        date: `2025-${String(i+1).padStart(2,'0')}-01`,
        value: 38 + Math.round(i * 3.8 + Math.sin(i*0.7)*4 + Math.random()*4)
      })),
    },
  },

  Stripe: {
    company: "Stripe",
    generated_at: new Date().toISOString(),
    executive_summary: "Stripe is still the developer-default payments platform with unmatched documentation and ecosystem depth, but customer sentiment is mixed around support, account holds, and dispute handling. The moat is strong, though competitors can attack trust and merchant support.",
    validated_summary: "Stripe's developer brand and product breadth remain excellent. The clearest weakness is operational trust: negative reviews concentrate around frozen funds, support escalation, and dispute outcomes.",
    health_score: 75,
    health_label: "Stable",
    sentiment_score: 63,
    sentiment_label: "Mixed",
    momentum: "Stable",
    momentum_reason: "Search interest remains high and resilient, with spikes around product launches and valuation news",
    moat_score: 85,
    moat_components: { brand_strength: 92, community_activity: 76, funding_position: 95, sentiment_quality: 56, growth_trend: 72 },
    swot: {
      strengths: ["Best-in-class developer docs and APIs", "Broad platform covering payments, billing, tax, issuing, and fraud", "Massive ecosystem and startup mindshare"],
      weaknesses: ["Support complaints are persistent among smaller merchants", "Account holds and risk reviews create severe negative sentiment", "Pricing can be complex as businesses scale"],
      opportunities: ["Embedded finance for SaaS platforms", "Global expansion and local payment methods", "AI-assisted fraud and dispute operations"],
      threats: ["Adyen and Checkout.com in enterprise payments", "PayPal/Braintree for merchants prioritizing buyer familiarity", "Vertical SaaS platforms bundling payments directly"],
    },
    market_gaps: [
      { gap: "High-touch support for growing SMB merchants", evidence: "Trustpilot-style complaints center on support delays and account holds", opportunity_size: "large" },
      { gap: "Transparent dispute and risk workflows", evidence: "Negative reviews cite unclear escalation paths", opportunity_size: "large" },
      { gap: "Simpler pricing visibility at scale", evidence: "Community discussions mention surprise fees and add-on complexity", opportunity_size: "medium" },
    ],
    attack_strategy: {
      recommended_positioning: "Payments with human support when money is on the line",
      target_segment: "SMB and mid-market online merchants with $1M-$50M GMV",
      key_weakness_to_exploit: "Support and account-hold anxiety",
      suggested_messaging: "Developer-friendly payments with support you can reach",
      pricing_strategy: "Transparent blended pricing with support SLA included above volume threshold",
      growth_channels: ["Shopify communities", "Indie hacker forums", "SaaS founder newsletters"],
    },
    key_insights: [
      { type: "product", title: "Developer experience remains elite", body: "Positive community mentions consistently point to docs, API ergonomics, and speed of integration.", signal: "bullish" },
      { type: "sentiment", title: "Support issues drag trust", body: "Negative reviews are less about API quality and more about operational outcomes when accounts are reviewed or disputes arise.", signal: "bearish" },
      { type: "market", title: "Enterprise moat is stronger than SMB moat", body: "Large platforms value breadth and reliability; smaller merchants are more vulnerable to support-led competitors.", signal: "mixed" },
    ],
    customer_pain_points: ["Account holds can feel opaque", "Support escalation is difficult for smaller merchants", "Disputes are stressful and documentation-heavy", "Pricing gets complex", "Risk reviews can interrupt cash flow"],
    what_customers_love: ["Excellent APIs", "Clear documentation", "Fast setup", "Broad product suite", "Reliable global infrastructure"],
    trend_forecast: { direction: "Stable", confidence: 76, reasoning: "Stripe's platform breadth supports durable demand, but support sentiment limits trust among smaller merchants" },
    funding_intel: { last_round: "Tender/secondary", amount: "$65B valuation", investors: ["Sequoia Capital", "Andreessen Horowitz", "Founders Fund"], source: "Stripe valuation and secondary transaction coverage — TechCrunch", tc_mentions: 24 },
    strategic_recommendations: [
      { priority: "high", action: "Attack with support guarantees and transparent risk workflows", rationale: "Operational trust is the most consistent negative signal" },
      { priority: "medium", action: "Create merchant education around disputes and holds", rationale: "Reducing anxiety can convert support pain into differentiation" },
      { priority: "medium", action: "Avoid competing head-on with Stripe's API breadth", rationale: "Stripe's developer moat is too strong; focus on trust and service" },
    ],
    critic: {
      confidence_score: 78,
      critic_summary: "Developer-experience strengths are strongly validated by market and community signals. Support and account-hold weaknesses are highly visible in reviews, but review samples overrepresent unhappy merchants.",
      validated_insights: ["Developer docs/API strength", "Support and account-hold complaint pattern", "Strong funding and valuation coverage"],
      speculative_flags: ["Exact SMB churn impact", "Competitor win rate from support positioning"],
      missing_data_signals: ["Segmented NPS by merchant size", "Support SLA benchmarks", "Payment success-rate comparisons"],
      swot_challenges: {
        strengths: [{ claim: "Best-in-class developer docs and APIs", challenge: "Validated by broad developer sentiment", confidence: 92 }],
        weaknesses: [{ claim: "Support complaints are persistent", challenge: "Validated in review data, but sample may skew negative", confidence: 80 }],
        opportunities: [{ claim: "Embedded finance for SaaS platforms", challenge: "Validated by product direction and market demand", confidence: 78 }],
        threats: [{ claim: "Adyen and Checkout.com in enterprise", challenge: "Validated by enterprise payments market", confidence: 84 }],
      },
    },
    _meta: {
      reddit_count: 42, tp_rating: 3.2, tp_review_count: 2970,
      tc_article_count: 24, ph_votes: 7200, trends_available: true,
      sources_verified: 5,
      wire_calls: 7, agent_passes: 2,
      reddit_titles: [
        "Stripe docs are still the gold standard for payments APIs",
        "Account hold with Stripe: how did you resolve it?",
        "Stripe vs Adyen for a SaaS platform doing international payments",
        "Billing and Tax saved us months of internal work",
      ],
      tc_titles: [
        "Stripe valuation rises in secondary transaction",
        "Stripe expands embedded finance products",
        "Payments giants compete for enterprise platform customers",
      ],
      tp_reviews_sample: [
        { rating: 5, text: "The API and documentation made integration incredibly straightforward." },
        { rating: 1, text: "Our funds were held and support responses were slow and vague." },
        { rating: 4, text: "Powerful platform, but pricing and add-ons take time to understand." },
      ],
      trends_timeline: Array.from({length: 12}, (_,i) => ({
        date: `2025-${String(i+1).padStart(2,'0')}-01`,
        value: 78 + Math.round(Math.sin(i*0.4)*7 + Math.random()*5)
      })),
    },
  },
};

const SWOT_DEFAULTS = {
  strengths:     { source: "producthunt", evidence: "Demo synthesis from launch, community, and press signals." },
  weaknesses:    { source: "trustpilot",  evidence: "Demo synthesis from review and community complaint patterns." },
  opportunities: { source: "trends",      evidence: "Demo synthesis from market momentum and unmet-demand signals." },
  threats:       { source: "techcrunch",  evidence: "Demo synthesis from competitor, funding, and market coverage." },
};

function withEvidenceBackedSwot(report) {
  const swot = Object.fromEntries(
    Object.entries(report.swot ?? {}).map(([section, items]) => {
      const defaults = SWOT_DEFAULTS[section] ?? { source: "reddit", evidence: "Demo synthesis from public source signals." };
      return [
        section,
        (items ?? []).map(item => (
          typeof item === "string"
            ? { point: item, evidence: defaults.evidence, source: defaults.source }
            : item
        )),
      ];
    })
  );

  return { ...report, swot };
}

export const DEMO_REPORTS = Object.fromEntries(
  Object.entries(RAW_DEMO_REPORTS).map(([company, report]) => [company, withEvidenceBackedSwot(report)])
);

export const DEMO_COMPANIES = [
  { label: "Notion", subtitle: "Productivity" },
  { label: "Perplexity AI", subtitle: "AI Search" },
  { label: "Figma", subtitle: "Design" },
  { label: "Linear", subtitle: "Dev Tools" },
  { label: "Stripe", subtitle: "Payments" },
];
