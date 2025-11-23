const fs = require("fs/promises");
const path = require("path");
const openai = require("../openAiClient");

async function generateLocation(surveyData) {
  const promptPath = path.join(__dirname, "prompt.txt");
  const systemPrompt = await fs.readFile(promptPath, "utf8");

  const messages = [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: JSON.stringify(surveyData, null, 2),
    },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-5-nano",
    messages,
  });

  return response.choices[0].message.content.trim();
}

module.exports = generateLocation;
