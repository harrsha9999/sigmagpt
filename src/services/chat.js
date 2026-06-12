import { truncateHistory } from "./context.js";
import { LRUCache } from "./cache.js";
import { fetchWithRetry } from "../utils/fetchWithRetry.js";

const cache = new LRUCache(200);
const MAX_CONTEXT_TOKENS = Number(process.env.MAX_CONTEXT_TOKENS) || 1000;

// Generates a reply. Truncates context to budget, checks cache, then calls the
// LLM if a key is configured — otherwise a deterministic offline responder so
// the app runs end-to-end with no external dependency.
export async function generateReply(messages) {
  const { messages: trimmed, estimatedTokens, truncated } =
    truncateHistory(messages, MAX_CONTEXT_TOKENS);

  const key = LRUCache.key(trimmed);
  const cached = cache.get(key);
  if (cached) {
    return { reply: cached, estimatedTokens, truncated, cached: true };
  }

  const reply = process.env.OPENAI_API_KEY
    ? await callOpenAI(trimmed)
    : offlineReply(trimmed);

  cache.set(key, reply);
  return { reply, estimatedTokens, truncated, cached: false };
}

function offlineReply(messages) {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const text = lastUser?.content?.trim() || "";
  if (!text) return "Ask me anything to get started.";
  if (/\?$/.test(text)) {
    return `Good question. Here's how I'd think about "${text}" — break it into smaller parts, handle the core case first, then edge cases. (Offline mode: set OPENAI_API_KEY for full answers.)`;
  }
  return `You said: "${text}". I'm running in offline mode — add an OPENAI_API_KEY to enable full LLM responses.`;
}

async function callOpenAI(messages) {
  const data = await fetchWithRetry("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages,
    }),
    timeoutMs: 15000,
    retries: 2,
  });
  return data.choices?.[0]?.message?.content?.trim() || "(no content)";
}
