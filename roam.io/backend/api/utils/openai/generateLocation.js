const fs = require("fs/promises");
const path = require("path");
const openai = require("../openAiClient");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

function isTestingMode() {
  return String(process.env.TESTING).toLowerCase() === "true";
}

async function generateLocation(surveyData) {
  if (isTestingMode()) {
    console.log(
      "TESTING mode enabled in generateLocation. Returning NYC stub."
    );
    return {
      location: "NYC",
      zipcode: "10001",
    };
  }

  const promptPath = path.join(__dirname, "prompt.txt");
  const promptTemplate = await fs.readFile(promptPath, "utf8");

  const surveyJsonString = JSON.stringify(surveyData, null, 2);
  const prompt = promptTemplate.replace("{{SURVEY_JSON}}", surveyJsonString);

  const response = await openai.chat.completions.create({
    model: "gpt-5-nano",
    messages: [{ role: "system", content: prompt }],
  });

  const text = response.choices[0].message.content.trim();
  const locationResult = JSON.parse(text);

  return {
    ...locationResult,
    tripStartDate: surveyData.tripStartDate,
    tripEndDate: surveyData.tripEndDate,
    departureCity: surveyData.departureCity,
    budget: surveyData.budget,
    travelCompanions: surveyData.travelCompanions,
  };
}

module.exports = generateLocation;