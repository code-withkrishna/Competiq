const DEFAULT_BASE_URL = "https://api.anakin.io/v1/wire";
const DEFAULT_TIMEOUT_MS = 95_000;
const DEFAULT_POLL_INTERVAL_MS = 1_500;

function actionEnv(name, fallback) {
  return process.env[`WIRE_ACTION_${name}`] || fallback;
}

export const ACTIONS = Object.freeze({
  REDDIT_SEARCH: actionEnv("REDDIT_SEARCH", "rt_search"),
  TP_DETAILS: actionEnv("TP_DETAILS", "tp_company_details"),
  TP_REVIEWS: actionEnv("TP_REVIEWS", "tp_company_reviews"),
  TC_TAGS: actionEnv("TC_TAGS", "tc_tags"),
  TC_SEARCH: actionEnv("TC_SEARCH", "tc_search"),
  GT_INTEREST: actionEnv("GT_INTEREST", "gt_interest_over_time"),
  GT_COMPARE: actionEnv("GT_COMPARE", "gt_compare"),
  PH_PRODUCT: actionEnv("PH_PRODUCT", "ph_product_details"),
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function baseUrl() {
  return (process.env.ANAKIN_WIRE_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, "");
}

async function readJSON(res) {
  const text = await res.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Wire [${res.status}] returned non-JSON: ${text.slice(0, 160)}`);
  }
}

function wireErrorMessage(payload, fallback) {
  if (typeof payload?.error === "string") return payload.error;
  if (payload?.error?.message) return payload.error.message;
  if (payload?.message) return payload.message;
  if (payload?.code) return payload.code;
  return fallback;
}

async function requestWire(path, init = {}) {
  const apiKey = process.env.ANAKIN_API_KEY;
  if (!apiKey) throw new Error("Wire API key missing: set ANAKIN_API_KEY");

  const res = await fetch(`${baseUrl()}${path}`, {
    ...init,
    headers: {
      "X-API-Key": apiKey,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });

  const payload = await readJSON(res);
  if (!res.ok) {
    throw new Error(`Wire [${res.status}]: ${wireErrorMessage(payload, res.statusText)}`);
  }

  return payload;
}

function jobIdFrom(payload) {
  if (typeof payload?.job_id === "string") {
    return payload.job_id;
  }
  return null;
}

function statusFrom(payload) {
  const raw = String(payload?.status || payload?.state || payload?.job?.status || "").toLowerCase();
  if (["completed", "complete", "succeeded", "success", "done"].includes(raw)) return "complete";
  if (["failed", "error", "cancelled", "canceled"].includes(raw)) return "failed";
  if (!raw && (payload?.data || payload?.result || payload?.output)) return "complete";
  return "pending";
}

function dataFrom(payload) {
  return (
    payload?.data?.result ??
    payload?.data?.output ??
    payload?.data ??
    payload?.result ??
    payload?.output ??
    payload?.job?.data ??
    payload?.job?.result ??
    payload
  );
}

function normalizeFailure(err) {
  return err?.message || "Unknown Wire error";
}

export async function wire(action_id, params = {}, options = {}) {
  if (!action_id) throw new Error("Wire action_id is required");

  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    pollIntervalMs = DEFAULT_POLL_INTERVAL_MS,
    credential_id,
  } = options;

  const body = {
    action_id,
    params: params || {},
    ...(credential_id ? { credential_id } : {}),
  };

  const started = Date.now();
  const submitted = await requestWire("/task", {
    method: "POST",
    body: JSON.stringify(body),
  });

  const submittedStatus = statusFrom(submitted);
  if (submittedStatus === "failed") {
    throw new Error(`Wire action ${action_id} failed: ${wireErrorMessage(submitted, "execution failed")}`);
  }

  const jobId = jobIdFrom(submitted);
  if (!jobId) return dataFrom(submitted);

  while (Date.now() - started < timeoutMs) {
    const job = await requestWire(`/jobs/${encodeURIComponent(jobId)}`);
    const status = statusFrom(job);

    if (status === "complete") return dataFrom(job);
    if (status === "failed") {
      throw new Error(`Wire action ${action_id} failed: ${wireErrorMessage(job, "execution failed")}`);
    }

    await sleep(pollIntervalMs);
  }

  throw new Error(`Wire action ${action_id} timed out after ${timeoutMs}ms`);
}

function normalizeCall(call) {
  if (Array.isArray(call)) {
    return { action_id: call[0], params: call[1] || {}, options: call[2] || {} };
  }

  if (call && typeof call === "object") {
    return {
      action_id: call.action_id || call.actionId,
      params: call.params || {},
      options: call.options || {},
    };
  }

  throw new Error("Wire call must be [action_id, params] or an object");
}

export async function wireAll(plan, options = {}) {
  const { allowAllFailed = false, ...sharedOptions } = options;
  const entries = Object.entries(plan || {});
  const data = {};
  const diagnostics = {};
  const started = Date.now();

  const results = await Promise.all(entries.map(async ([key, call]) => {
    const callStarted = Date.now();
    const { action_id, params, options: callOptions } = normalizeCall(call);

    try {
      const result = await wire(action_id, params, { ...sharedOptions, ...callOptions });
      return {
        key,
        result,
        diagnostics: {
          ok: true,
          action_id,
          duration_ms: Date.now() - callStarted,
        },
      };
    } catch (err) {
      return {
        key,
        result: null,
        diagnostics: {
          ok: false,
          action_id,
          duration_ms: Date.now() - callStarted,
          error: normalizeFailure(err),
        },
      };
    }
  }));

  let successCount = 0;
  for (const item of results) {
    data[item.key] = item.result;
    diagnostics[item.key] = item.diagnostics;
    if (item.diagnostics.ok) successCount += 1;
  }

  diagnostics._summary = {
    ok: successCount,
    failed: entries.length - successCount,
    duration_ms: Date.now() - started,
  };

  if (entries.length > 0 && successCount === 0 && !allowAllFailed) {
    throw new Error(`Wire failed for all ${entries.length} requested actions`);
  }

  return { data, diagnostics };
}
