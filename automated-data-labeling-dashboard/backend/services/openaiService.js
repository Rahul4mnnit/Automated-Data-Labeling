const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function autoLabel(text) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Classify the sentiment as Positive, Negative, or Neutral:\n"${text}"`,
        },
      ],
      temperature: 0,
    });

    return response.choices[0].message.content.trim();
  } catch (err) {
    console.error("⚠️ OpenAI error:", err.code || err.message);

    // 🔹 Fallback label when OpenAI fails
    return "Unknown";
  }
}

module.exports = autoLabel;
