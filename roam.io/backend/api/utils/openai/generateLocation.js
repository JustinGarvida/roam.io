const fs = require("fs/promises");
const path = require("path");
const openai = require("../openAiClient");

async function generateLocation(surveyData) {
  const promptPath = path.join(__dirname, "prompt.txt");
  let promptTemplate = await fs.readFile(promptPath, "utf8");

  const surveyJsonString = JSON.stringify(surveyData, null, 2);
  const prompt = promptTemplate.replace("{{SURVEY_JSON}}", surveyJsonString);

  const response = await openai.chat.completions.create({
    model: "gpt-5-nano",
    messages: [{ role: "system", content: prompt }],
  });

  // Raw response from OpenAI
  console.log("OpenAI raw response:");
  console.dir(response, { depth: null });

  const text = response.choices[0].message.content.trim();

  // Text parsed from openai response
  console.log("OpenAI returned text:");
  console.log(text);

  return JSON.parse(text);
}

module.exports = generateLocation;
