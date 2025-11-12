// utils/geocodeCoordinates.js
const axios = require("axios");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const OPEN_CAGE_URL = "https://api.opencagedata.com/geocode/v1/json";
const OPEN_CAGE_KEY = process.env.OPEN_CAGE_API_KEY;

async function getCoordinatesByZip(zip, countryCode = "US") {
  try {
    const response = await axios.get(OPEN_CAGE_URL, {
      params: { q: `${zip}, ${countryCode}`, key: OPEN_CAGE_KEY, limit: 1 },
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

async function getCoordinatesByLocation(location) {
  try {
    const response = await axios.get(OPEN_CAGE_URL, {
      params: { q: location, key: OPEN_CAGE_KEY, limit: 1 },
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

module.exports = { getCoordinatesByZip, getCoordinatesByLocation };

(async function runTests() {
  console.log("=== Testing getCoordinatesByZip ===");
  const coordsZip = await getCoordinatesByZip("19104", "US");
  console.log("ZIP Result:", coordsZip);

  console.log("\n=== Testing getCoordinatesByLocation ===");
  const coordsLoc = await getCoordinatesByLocation("Philadelphia, PA");
  console.log("Location Result:", coordsLoc);
})();
