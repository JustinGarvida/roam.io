import axios from "axios";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const OPEN_CAGE_URL = "https://api.opencagedata.com/geocode/v1/json";
const OPEN_CAGE_KEY = process.env.OPEN_CAGE_API_KEY;

/**
 * Get coordinates by ZIP code
 * @param {string} zip - ZIP code to search for (e.g., "19104")
 * @param {string} [countryCode] - Optional 2-letter ISO country code (e.g., "US")
 */
export async function getCoordinatesByZip(zip, countryCode = "US") {
  try {
    const response = await axios.get(OPEN_CAGE_URL, {
      params: {
        q: `${zip}, ${countryCode}`,
        key: OPEN_CAGE_KEY,
        limit: 1,
      },
    });

    const result = response.data.results?.[0];
    if (!result) throw new Error("No results found");

    const { lat, lng } = result.geometry;
    return { lat, lng };
  } catch (error) {
    console.error("Error fetching coordinates by ZIP:", error.message);
    throw error;
  }
}

/**
 * Get coordinates by location text
 * @param {string} location - City or address text (e.g., "Philadelphia, PA")
 */
export async function getCoordinatesByLocation(location) {
  try {
    const response = await axios.get(OPEN_CAGE_URL, {
      params: {
        q: location,
        key: OPEN_CAGE_KEY,
        limit: 1,
      },
    });

    const result = response.data.results?.[0];
    if (!result) throw new Error("No results found");

    const { lat, lng } = result.geometry;
    return { lat, lng };
  } catch (error) {
    console.error("Error fetching coordinates by location:", error.message);
    throw error;
  }
}