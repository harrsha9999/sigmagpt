import { test } from "node:test";
import assert from "node:assert/strict";
import { LRUCache } from "../src/services/cache.js";

test("returns undefined on miss, value on hit", () => {
  const c = new LRUCache(2);
  assert.equal(c.get("a"), undefined);
  c.set("a", 1);
  assert.equal(c.get("a"), 1);
});

test("evicts least-recently-used over capacity", () => {
  const c = new LRUCache(2);
  c.set("a", 1);
  c.set("b", 2);
  c.get("a");          // 'a' now most recent
  c.set("c", 3);       // should evict 'b'
  assert.equal(c.get("b"), undefined);
  assert.equal(c.get("a"), 1);
  assert.equal(c.get("c"), 3);
});

test("key() is stable regardless of case/whitespace", () => {
  const k1 = LRUCache.key([{ role: "user", content: " Hello " }]);
  const k2 = LRUCache.key([{ role: "user", content: "hello" }]);
  assert.equal(k1, k2);
});
