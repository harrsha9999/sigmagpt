import { test } from "node:test";
import assert from "node:assert/strict";
import { estimateTokens, truncateHistory } from "../src/services/context.js";

test("estimateTokens approximates ~4 chars/token", () => {
  assert.equal(estimateTokens("12345678"), 2);
  assert.equal(estimateTokens(""), 0);
});

test("truncateHistory keeps everything when under budget", () => {
  const msgs = [
    { role: "system", content: "be helpful" },
    { role: "user", content: "hi" },
    { role: "assistant", content: "hello" },
  ];
  const r = truncateHistory(msgs, 1000);
  assert.equal(r.truncated, false);
  assert.equal(r.messages.length, 3);
});

test("truncateHistory always keeps system and drops oldest turns", () => {
  const big = "x".repeat(400); // ~100 tokens each
  const msgs = [
    { role: "system", content: "sys" },
    { role: "user", content: big },     // old
    { role: "assistant", content: big },
    { role: "user", content: "newest" },
  ];
  const r = truncateHistory(msgs, 130);
  assert.equal(r.truncated, true);
  assert.equal(r.messages[0].role, "system");
  // newest user message must survive
  assert.equal(r.messages[r.messages.length - 1].content, "newest");
});

test("truncateHistory handles empty input", () => {
  const r = truncateHistory([], 100);
  assert.deepEqual(r.messages, []);
  assert.equal(r.estimatedTokens, 0);
});
