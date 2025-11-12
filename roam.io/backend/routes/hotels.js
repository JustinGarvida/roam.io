const express = require("express");
const router = express.Router();
const { getHotels } = require("../utils/hotels/hotelList");

/**
 * GET /api/hotels
 * Example queries:
 *   /api/hotels?zipCode=19104&miles=10
 *   /api/hotels?location=Philadelphia,PA&miles=15
 *   /api/hotels?zipCode=19104&miles=5&limit=10&countryCode=US
 */
router.get("/", async (req, res) => {
  try {
    const { zipCode, location, miles = 20, countryCode = "US" } = req.query;

    // Option to pick between ZIP or Location. If there's neither in the param, throw an error
    if (!zipCode && !location) {
      return res.status(400).json({
        error:
          "You must provide either 'zipCode' or 'location' as a query parameter.",
      });
    }

    const milesNum = Number(miles);

    const hotels = await getHotels({
      zipCode,
      location,
      miles: milesNum,
      countryCode,
    });

    res.status(200).json({ results: hotels });
  } catch (error) {
    console.error("Error fetching hotels:", error.message);
    res.status(500).json({
      error: "Failed to retrieve hotels",
      details: error.message,
    });
  }
});

module.exports = router;
