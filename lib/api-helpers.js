import { extractLargestJSON } from "./json.mjs";

const DEFAULT_RATE_LIMIT_MESSAGE = "Too many requests. Please try again in a moment.";

function getStore(name) {
  const key = `__competiq_${name}`;
  globalThis[key] ??= new Map();
  return globalThis[key];
}

// ── Response cache (5-minute TTL) ─────────────────────────────────────────
// Prevents duplicate Wire API calls for the same company within 5 minutes.
// Cuts demo reload time to ~0ms after the first live query.
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function getCache(key) {
  const store = getStore("response_cache");
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.data;
}

export function setCache(key, data) {
  const store = getStore("response_cache");
  // Evict expired entries to prevent memory growth
  for (const [k, v] of store.entries()) {
    if (Date.now() > v.expiresAt) store.delete(k);
  }
  store.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

export function invalidateCache(key) {
  getStore("response_cache").delete(key);
}

export function clientKey(req, scope) {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = req.headers.get("x-real-ip")?.trim();
  return `${scope}:${forwarded || realIp || "unknown"}`;
}

export function checkRateLimit(key, { limit = 6, windowMs = 60_000 } = {}) {
  const now = Date.now();
  const store = getStore("rate_limits");
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: existing.resetAt,
      retryAfter: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { allowed: true, remaining: limit - existing.count, resetAt: existing.resetAt };
}

export function rateLimitResponse(result, message = DEFAULT_RATE_LIMIT_MESSAGE) {
  return Response.json(
    { error: message },
    {
      status: 429,
      headers: result.retryAfter ? { "Retry-After": String(result.retryAfter) } : undefined,
    }
  );
}

export async function readJSONBody(req) {
  try {
    return await req.json();
  } catch {
    throw new InputValidationError("Request body must be valid JSON");
  }
}

export { extractLargestJSON } from "./json.mjs";

export function parseGroqJSON(text = "") {
  const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {}

  const extracted = extractLargestJSON(text);
  if (extracted) return extracted;

  throw new Error("Groq JSON parse failed");
}

export async function groqCall(
  system,
  userContent,
  maxTokens = 4096,
  model = "llama-3.3-70b-versatile",
  temperature = 0.1
) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      temperature,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userContent },
      ],
    }),
  });

  if (!res.ok) throw new Error(`Groq [${res.status}]`);

  const data = await res.json();
  return parseGroqJSON(data.choices?.[0]?.message?.content ?? "{}");
}

export function sanitizeError(err, fallback = "Analysis could not complete. Please try again.") {
  const message = err?.message ?? "";

  if (message.includes("Groq") || message.includes("429") || message.includes("model")) {
    return "Intelligence service is temporarily busy. Please try again in a moment.";
  }
  if (message.includes("Wire") || message.includes("timeout")) {
    return "Data sources are temporarily unavailable. Please retry in 10 seconds.";
  }
  if (message.includes("JSON parse") || message.includes("parse failed")) {
    return "Analysis output was malformed. Please try again.";
  }

  return fallback;
}

function normalizeCompany(value, fieldName) {
  if (typeof value !== "string") {
    throw new InputValidationError(`${fieldName} is required`);
  }

  const normalized = value
    .normalize("NFKC")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/[<>{}[\]`"\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) throw new InputValidationError(`${fieldName} is required`);
  if (normalized.length > 80) throw new InputValidationError(`${fieldName} must be 80 characters or fewer`);
  if (!/[a-z0-9]/i.test(normalized)) throw new InputValidationError(`${fieldName} must include letters or numbers`);

  return normalized;
}

function normalizeDomain(value, fieldName) {
  if (value == null || value === "") return "";
  if (typeof value !== "string") throw new InputValidationError(`${fieldName} must be a valid domain`);

  let normalized = value.normalize("NFKC").trim().toLowerCase();
  normalized = normalized.replace(/^https?:\/\//, "").replace(/^www\./, "").split(/[/?#]/)[0];
  normalized = normalized.replace(/[^a-z0-9.-]/g, "");
  normalized = normalized.replace(/^\.+|\.+$/g, "");

  if (!normalized) return "";
  if (normalized.length > 253) throw new InputValidationError(`${fieldName} must be 253 characters or fewer`);
  if (!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/.test(normalized)) {
    throw new InputValidationError(`${fieldName} must be a valid domain`);
  }

  return normalized;
}

export class InputValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "InputValidationError";
  }
}

export function normalizeAnalyzeInput(body) {
  return {
    company: normalizeCompany(body?.company, "company"),
    domain: normalizeDomain(body?.domain, "domain"),
  };
}

export function normalizeCompareInput(body) {
  return {
    company_a: normalizeCompany(body?.company_a, "company_a"),
    company_b: normalizeCompany(body?.company_b, "company_b"),
    domain_a: normalizeDomain(body?.domain_a, "domain_a"),
    domain_b: normalizeDomain(body?.domain_b, "domain_b"),
  };
}
