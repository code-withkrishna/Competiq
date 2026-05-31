import assert from "node:assert/strict";
import test from "node:test";

import { guessDomain, guessSlug } from "../lib/domain.mjs";
import { extractLargestJSON } from "../lib/json.mjs";
import { countComparisonQuality, shouldRejectComparisonForNoData } from "../lib/quality.mjs";

test("guessDomain applies known non-.com overrides", () => {
  assert.equal(guessDomain("Notion"), "notion.so");
  assert.equal(guessDomain("Linear"), "linear.app");
});

test("guessDomain falls back to a normalized .com domain", () => {
  assert.equal(guessDomain("Acme AI, Inc."), "acmeaiinc.com");
  assert.equal(guessSlug("Acme AI, Inc."), "acme-ai-inc");
});

test("extractLargestJSON returns the largest valid JSON object from mixed text", () => {
  const text = 'note {"small":true} later {"outer":{"nested":true},"items":[1,2,3]} done';
  assert.deepEqual(extractLargestJSON(text), {
    outer: { nested: true },
    items: [1, 2, 3],
  });
});

test("extractLargestJSON returns null when no valid object exists", () => {
  assert.equal(extractLargestJSON("prefix {not json} suffix"), null);
});

test("comparison quality gate rejects only when both companies have no evidence", () => {
  const empty = { reddit: { posts: [] }, trustpilot: { details: {} }, techcrunch: { articles: [] } };
  const withReddit = { reddit: { posts: [{ title: "signal" }] }, trustpilot: { details: {} }, techcrunch: { articles: [] } };

  assert.equal(countComparisonQuality(empty), 0);
  assert.equal(countComparisonQuality(withReddit), 1);
  assert.equal(shouldRejectComparisonForNoData(empty, empty), true);
  assert.equal(shouldRejectComparisonForNoData(empty, withReddit), false);
});
