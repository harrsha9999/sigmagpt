import { Router } from "express";
import { generateReply } from "../services/chat.js";

export function chatRouter() {
  const router = Router();

  // POST /api/chat  body: { messages: [{role, content}, ...] }
  router.post("/", async (req, res) => {
    const { messages } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages[] is required" });
    }
    const valid = messages.every(
      (m) => m && typeof m.content === "string" && ["system", "user", "assistant"].includes(m.role)
    );
    if (!valid) {
      return res.status(400).json({ error: "each message needs a valid role and string content" });
    }
    try {
      const result = await generateReply(messages);
      res.json(result);
    } catch (err) {
      res.status(502).json({ error: err.message });
    }
  });

  return router;
}
