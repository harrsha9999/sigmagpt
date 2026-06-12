// Tiny LRU response cache. Cuts repeat LLM calls (and cost) for identical
// prompts. Capacity-bounded with least-recently-used eviction. Testable.

export class LRUCache {
  constructor(capacity = 100) {
    this.capacity = capacity;
    this.map = new Map(); // insertion order = recency
  }

  static key(messages) {
    return JSON.stringify(
      messages.map((m) => [m.role, (m.content || "").trim().toLowerCase()])
    );
  }

  get(key) {
    if (!this.map.has(key)) return undefined;
    const val = this.map.get(key);
    this.map.delete(key); // refresh recency
    this.map.set(key, val);
    return val;
  }

  set(key, val) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, val);
    if (this.map.size > this.capacity) {
      const oldest = this.map.keys().next().value;
      this.map.delete(oldest);
    }
  }

  get size() {
    return this.map.size;
  }
}
