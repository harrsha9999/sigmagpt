// Resilient fetch with timeout + exponential backoff (used for the OpenAI call).
export async function fetchWithRetry(
  url,
  { timeoutMs = 10000, retries = 2, baseDelayMs = 400, ...options } = {}
) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`Upstream responded ${res.status}`);
      return await res.json();
    } catch (err) {
      clearTimeout(timer);
      lastError = err;
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, baseDelayMs * 2 ** attempt));
      }
    }
  }
  throw new Error(`fetchWithRetry exhausted ${retries + 1} attempts: ${lastError?.message}`);
}
