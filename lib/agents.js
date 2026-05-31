/**
 * CompetIQ Agent Pipeline
 * 
 * Two specialist agents orchestrated by AgentOrchestrator:
 *   - DraftAgent: draws intelligence from raw Wire data
 *   - CriticAgent: challenges and validates the draft
 * 
 * This module makes the "2 AI agents" claim architecturally honest.
 */

import { groqCall } from "@/lib/api-helpers";
import {
  buildAnalysisPrompt,
  buildCriticPrompt,
  SYSTEM_PROMPT,
  CRITIC_SYSTEM_PROMPT,
} from "@/lib/prompts";

const MODEL = "llama-3.3-70b-versatile";

// ── DraftAgent ─────────────────────────────────────────────────────────────
export class DraftAgent {
  constructor({ maxTokens = 4096, temperature = 0.1 } = {}) {
    this.maxTokens   = maxTokens;
    this.temperature = temperature;
    this.name        = "DraftAgent";
  }

  /**
   * Run the draft agent against raw Wire data.
   * Returns a structured intelligence report JSON.
   */
  async run(company, wireData) {
    const startMs = Date.now();
    const result  = await groqCall(
      SYSTEM_PROMPT,
      buildAnalysisPrompt(company, wireData),
      this.maxTokens,
      MODEL,
      this.temperature,
    );
    result._agent_meta = {
      agent: this.name,
      model: MODEL,
      duration_ms: Date.now() - startMs,
    };
    return result;
  }
}

// ── CriticAgent ────────────────────────────────────────────────────────────
export class CriticAgent {
  constructor({ maxTokens = 2048, temperature = 0.3 } = {}) {
    this.maxTokens   = maxTokens;
    this.temperature = temperature;
    this.name        = "CriticAgent";
  }

  /**
   * Run the critic agent against a draft report.
   * Returns validation JSON with confidence scores and a revised summary.
   * Throws on failure — AgentOrchestrator handles graceful degradation.
   */
  async run(company, draftReport) {
    const startMs = Date.now();
    const result  = await groqCall(
      CRITIC_SYSTEM_PROMPT,
      buildCriticPrompt(company, draftReport),
      this.maxTokens,
      MODEL,
      this.temperature,
    );
    result._agent_meta = {
      agent: this.name,
      model: MODEL,
      duration_ms: Date.now() - startMs,
    };
    return result;
  }
}

// ── AgentOrchestrator ──────────────────────────────────────────────────────
export class AgentOrchestrator {
  constructor() {
    this.draft  = new DraftAgent();
    this.critic = new CriticAgent();
    this.name   = "AgentOrchestrator";
  }

  /**
   * Run the full 2-agent pipeline:
   *   1. DraftAgent extracts intelligence from Wire data
   *   2. CriticAgent validates and challenges the draft
   * 
   * Returns { report, criticReport, agentPasses, criticAvailable }
   * Critic failure is gracefully handled — DraftAgent output is always returned.
   */
  async run(company, wireData) {
    const orchestratorStart = Date.now();

    // ── Pass 1: DraftAgent ───────────────────────────────────────
    const draftReport = await this.draft.run(company, wireData);

    // ── Pass 2: CriticAgent (graceful degradation) ───────────────
    let criticReport     = null;
    let criticAvailable  = false;

    try {
      criticReport    = await this.critic.run(company, draftReport);
      criticAvailable = true;
    } catch (err) {
      console.warn(`[${this.name}] CriticAgent failed, continuing with DraftAgent only:`, err.message);
    }

    return {
      draftReport,
      criticReport,
      agentPasses:     criticAvailable ? 2 : 1,
      criticAvailable,
      orchestratorMs:  Date.now() - orchestratorStart,
    };
  }
}
