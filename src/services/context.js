// Bounded-context management. Approximates tokens (~4 chars/token) and trims a
// conversation to fit a budget while ALWAYS keeping the system message and the
// most recent turns. Pure + deterministic = unit-testable.

export function estimateTokens(text) {
  return Math.ceil((text || "").length / 4);
}

export function messageTokens(message) {
  return estimateTokens(message.content) + 4; // small per-message overhead
}

// Returns { messages, estimatedTokens, truncated }.
export function truncateHistory(messages, maxTokens = 1000) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return { messages: [], estimatedTokens: 0, truncated: false };
  }

  const system = messages.filter((m) => m.role === "system");
  const rest = messages.filter((m) => m.role !== "system");

  const systemCost = system.reduce((s, m) => s + messageTokens(m), 0);
  let budget = maxTokens - systemCost;

  // Walk from the newest message backwards, keeping what fits.
  const kept = [];
  for (let i = rest.length - 1; i >= 0; i--) {
    const cost = messageTokens(rest[i]);
    if (cost <= budget) {
      kept.unshift(rest[i]);
      budget -= cost;
    } else {
      break;
    }
  }

  const finalMessages = [...system, ...kept];
  const estimatedTokens = finalMessages.reduce((s, m) => s + messageTokens(m), 0);

  return {
    messages: finalMessages,
    estimatedTokens,
    truncated: kept.length < rest.length,
  };
}
