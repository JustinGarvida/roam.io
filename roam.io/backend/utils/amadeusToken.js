import axios from "axios";

/**
 * Generic OAuth2 client_credentials token fetcher
 * - Fetches a new token every time
 * - Returns the access token as a string
 */
export async function fetchAccessToken({ tokenUrl, clientId, clientSecret }) {
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

export async function getAmadeusToken() {
  return fetchAccessToken({
    tokenUrl: "https://test.api.amadeus.com/v1/security/oauth2/token",
    clientId: process.env.AMADEUS_API_KEY,
    clientSecret: process.env.AMADEUS_API_SECRET,
  });
}
