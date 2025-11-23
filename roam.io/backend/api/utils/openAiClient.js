const path = require("path");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config({
  path: path.resolve(__dirname, "..", ".env"),
});

if (!process.env.OPEN_API_KEY) {
  throw new Error("Missing OPEN_API_KEY in .env");
}

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});

module.exports = openai;
