const OpenAI = require("openai");

const MODEL_NAME = "gpt-4o-mini";

const summarizeText = async (req, res) => {
  const { text } = req.body;

  if (text === undefined) {
    return res.status(400).json({ message: "text is required" });
  }

  if (typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ message: "text must be a non-empty string" });
  }

  const normalizedText = text.trim();

  if (normalizedText.length < 50) {
    return res.status(400).json({ message: "text must be at least 50 characters long" });
  }

  if (normalizedText.length > 10000) {
    return res.status(413).json({ message: "text must not exceed 10000 characters" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ message: "OPENAI_API_KEY is not configured" });
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await client.chat.completions.create({
      model: MODEL_NAME,
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: "Summarize the following text into 3-6 concise bullet points.",
        },
        {
          role: "user",
          content: normalizedText,
        },
      ],
    });

    const summary = completion.choices?.[0]?.message?.content?.trim();

    if (!summary) {
      return res.status(502).json({ message: "LLM service unavailable" });
    }

    return res.status(200).json({
      summary,
      model: MODEL_NAME,
    });
  } catch (error) {
    return res.status(502).json({ message: "LLM service unavailable" });
  }
};

module.exports = {
  summarizeText,
};
