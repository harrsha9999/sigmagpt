# SigmaGPT — Multi-turn AI Chat

A full-stack conversational AI app with multi-turn context, built to learn
cost-efficient LLM integration (bounded context + response caching).

🔗 **Live demo:** https://sigmagpt-harsha.vercel.app
💻 **Stack:** React · Node.js · Express · OpenAI API · MongoDB

---

## Why I built it
To understand the real cost and latency tradeoffs of building on top of an LLM,
not just calling it once.

## Features
- Multi-turn conversations with preserved context
- Bounded context window to cap token usage
- Response caching for repeated/similar prompts
- Conversation history per user

## Tech Stack
| Layer     | Tech                      |
|-----------|---------------------------|
| Frontend  | React                     |
| Backend   | Node.js, Express.js (MVC) |
| AI        | OpenAI API                |
| Database  | MongoDB                   |

## Engineering notes
- **Token control:** truncate history to the last N relevant turns before each
  call; **measured `<X>%` token reduction** vs. sending full history.  <!-- measure it -->
- **Caching:** cache responses for repeated prompts to cut API calls.
- **Clean separation:** MVC layout for testability.

## Getting Started
```bash
git clone https://github.com/harrsha9999/sigmagpt.git
cd sigmagpt
npm install
cp .env.example .env
npm run dev
```

### Environment variables
```
OPENAI_API_KEY=
MONGODB_URI=
PORT=5000
```

## Roadmap
- [ ] Streaming responses
- [ ] System-prompt presets
- [ ] Usage dashboard

## Author
**Harsha Vardhan G** — [LinkedIn](https://linkedin.com/in/haarsha9999) · [GitHub](https://github.com/harrsha9999)
