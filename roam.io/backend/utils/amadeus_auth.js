// backend/utils/auth.js
import axios from "axios";

// Because the Amadeus API Requires an Auth Token, we need to generate an 
let accessToken = null;
let tokenExpiresAt = 0;

const TOKEN_URL = "https://test.api.amadeus.com/v1/security/oauth2/token";
const BUFFER_SEC = 30;

async function fetchNewToken() {
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: process.env.AMADEUS_API_KEY,
    client_secret: process.env.AMADEUS_API_SECRET,
  });

  const resp = await axios.post(TOKEN_URL, body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  console.log(resp);

  const { access_token, expires_in } = resp.data;
  accessToken = access_token;
  tokenExpiresAt = Date.now() + Math.max(0, expires_in - BUFFER_SEC) * 1000;
  return accessToken;
}

export async function getAccessToken(force = false) {
  const valid = accessToken && Date.now() < tokenExpiresAt;
  if (!force && valid) return accessToken;
  return fetchNewToken();
}

export function invalidateToken() {
  accessToken = null;
  tokenExpiresAt = 0;
}

export async function withAmadeus(fn) {
  try {
    const token = await getAccessToken();
    return await fn(token);
  } catch (err) {
    if (err?.response?.status === 401) {
      await getAccessToken(true);
      return fn(accessToken);
    }
    throw err;
  }
}
