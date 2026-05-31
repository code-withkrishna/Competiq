import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const readme = read("README.md");
const layout = read("app/layout.js");
const page = read("app/page.js");
const moatScore = read("components/report/MoatScore.jsx");
const packageJson = JSON.parse(read("package.json"));

assert(!/\bANTHROPIC\b|Claude/.test(`${readme}\n${layout}`), "Docs/metadata must reference Groq, not Anthropic/Claude.");
assert(!/\]\(#\)/.test(readme), "README must not contain placeholder # links.");
assert(!/under 20 seconds/i.test(readme), "README timing claim must stay realistic.");
assert(!/20 seconds|under 20 seconds|<20s/i.test(page), "UI timing copy must stay realistic.");

assert(!("lucide-react" in packageJson.dependencies), "lucide-react should not be a direct dependency unless imported.");
assert(!("clsx" in packageJson.dependencies), "clsx should not be a direct dependency unless imported.");

const strokeDashoffsetCount = moatScore.match(/strokeDashoffset=/g)?.length ?? 0;
assert.equal(strokeDashoffsetCount, 1, "MoatScore should define strokeDashoffset once.");
