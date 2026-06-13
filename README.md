# SigmaGPT — Multi-turn AI Chat

A conversational chat app built to practice **cost-efficient LLM integration**:
bounded-context truncation to cap token usage and an LRU cache to skip repeat
calls. Runs fully offline with a deterministic responder; add an OpenAI key for
real model responses.

🔗 **Live demo:** https://sigmagpt-harsha.onrender.com
💻 **Stack:** Node.js · Express · Vanilla JS frontend (OpenAI optional)

---

## Why I built it
To understand the real cost/latency tradeoffs of building on top of an LLM —
not just calling it once.

## Features
- Multi-turn chat (conversation kept in the browser session)
- Bounded-context truncation: keeps the system prompt + most recent turns
  within a token budget
- LRU response cache: identical prompts skip the model call
- Per-message context-token estimate + cache-hit indicator in the UI
- Works with no API key (deterministic responder); OpenAI key optional

## How it works
1. Client POSTs the full message list to `/api/chat`.
2. Server truncates history to a token budget (`MAX_CONTEXT_TOKENS`), always
   keeping the system message and newest turns.
3. Checks an LRU cache; on miss, calls OpenAI (if a key is set) or a
   deterministic offline responder.
4. Returns the reply plus `estimatedTokens`, `truncated`, and `cached` flags.

The truncation and cache logic are pure and unit-tested.

## Tech Stack
| Layer    | Tech                                |
|----------|-------------------------------------|
| Backend  | Node.js, Express.js                 |
| Frontend | Vanilla HTML/CSS/JS                  |
| AI       | OpenAI API (optional upgrade path)  |
| Tests    | Node.js built-in test runner        |

## Getting Started
```bash
git clone https://github.com/harrsha9999/sigmagpt.git
cd sigmagpt
npm install
npm run dev      # open http://localhost:5000
npm test         # 7 unit tests (context truncation + LRU cache)
```

### Environment variables (all optional)
```
PORT=5000
OPENAI_API_KEY=         # if set, real LLM responses; otherwise offline responder
OPENAI_MODEL=gpt-4o-mini
MAX_CONTEXT_TOKENS=1000
```

## API
| Method | Endpoint    | Description                    |
|--------|-------------|--------------------------------|
| GET    | /api/health | Status + whether a key is set  |
| POST   | /api/chat   | { messages[] } -> reply + meta |

## Roadmap
- [ ] Streaming responses
- [ ] Server-side conversation persistence
- [ ] System-prompt presets

## Author
**Harsha Vardhan G** — [LinkedIn](https://linkedin.com/in/haarsha9999) · [GitHub](https://github.com/harrsha9999)
