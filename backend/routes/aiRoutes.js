import express from "express";
import Groq from "groq-sdk";

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post("/suggest-message", async (req, res) => {
  try {
    const { objective } = req.body;

    if (!objective) {
      return res.status(400).json({ error: "Objective is required" });
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",  // lightweight + fast
      messages: [
        { role: "system", content: "You are a creative marketing assistant." },
        { role: "user", content: objective },
      ],
      max_tokens: 150,
      temperature: 0.8,
    });

    const text = response.choices[0]?.message?.content || "";
    const suggestions = text
      .split("\n")
      .map(s => s.replace(/^\d+\.\s*/, "").trim())
      .filter(Boolean);

    res.json({ suggestions });
  } catch (err) {
    console.error("Groq AI error:", err);
    res.status(500).json({ error: "AI suggestion failed" });
  }
});

export default router;
