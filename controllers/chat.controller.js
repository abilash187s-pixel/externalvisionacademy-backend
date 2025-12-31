import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Detect Tamil or English
function detectLanguage(text) {
  return /[\u0B80-\u0BFF]/.test(text) ? "ta" : "en";
}

export async function chatWithAI(req, res) {
    console.log("demo")
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message is required" });
    }

    const language = detectLanguage(message);

    const systemPrompt =
      language === "ta"
        ? "Reply in simple Tamil-English mix. You are an assistant for an English learning academy."
        : "You are an assistant for an English learning academy.";

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    res.json({
      reply: response.choices[0].message.content,
    });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({
      reply: "Sorry, something went wrong. Please try again.",
    });
  }
}
