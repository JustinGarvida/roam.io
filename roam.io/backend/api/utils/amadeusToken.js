const axios = require("axios");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

function loadEnvConfig() {
  const API_KEY = process.env.AMADEUS_API_KEY;
  const API_SECRET = process.env.AMADEUS_API_SECRET;

  if (!API_KEY || !API_SECRET) {
    throw new Error(
      "Missing AMADEUS_API_KEY or AMADEUS_API_SECRET in your .env file"
    );
  }
  return { API_KEY, API_SECRET };
}

/**
 * Generic OAuth2 client_credentials token fetcher
 * - Fetches a new token every time
 * - Returns the access token as a string
 */
async function fetchAccessToken({ tokenUrl, clientId, clientSecret }) {
  try {
    const body = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    });

    const response = await axios.post(tokenUrl, body, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return response.data.access_token;
  } catch (err) {
    console.error("Failed to fetch token:", err.response?.data || err.message);
    throw new Error("Error fetching access token");
  }
}

async function getAmadeusToken() {
  const { API_KEY, API_SECRET } = loadEnvConfig();

  return fetchAccessToken({
    tokenUrl: "https://test.api.amadeus.com/v1/security/oauth2/token",
    clientId: API_KEY,
    clientSecret: API_SECRET,
  });
}

module.exports = {
  loadEnvConfig,
  fetchAccessToken,
  getAmadeusToken,
};
