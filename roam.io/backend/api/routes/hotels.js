const express = require("express");
const router = express.Router();
const {
  getHotels,
  getCheapestHotelsByZip,
  getCheapestHotelsByLocation,
} = require("../utils/hotels/hotelList");

// Amadeus API follows YYYY-MM-DD format. This function is used to validate date input from the client request
function isValidDate(dateStr) {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
}

/**
 * GET /api/hotels
 *
 * Examples:
 *   /api/hotels?zipCode=19104&miles=10
 *   /api/hotels?location=Philadelphia,PA&miles=15
 */
router.get("/", async (req, res) => {
  try {
    const { zipCode, location, miles = 20, countryCode = "US" } = req.query;

    if (!zipCode && !location) {
      return res.status(400).json({
        error: "Provide either 'zipCode' or 'location'.",
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

/**
 * GET /api/hotels/cheapest
 *
 * Required:
 *   - checkInDate (YYYY-MM-DD)
 *   - checkOutDate (YYYY-MM-DD)
 *   - zipCode OR location
 *
 * Examples:
 *   /api/hotels/cheapest?zipCode=19104&checkInDate=2025-12-20&checkOutDate=2025-12-22
 *   /api/hotels/cheapest?location=Philadelphia,PA&checkInDate=2025-12-20&checkOutDate=2025-12-22
 */
router.get("/cheapest", async (req, res) => {
  try {
    const {
      zipCode,
      location,
      miles = 20,
      checkInDate,
      checkOutDate,
      countryCode = "US",
      adults = 1,
      roomQuantity = 1,
      currencyCode = "USD",
    } = req.query;

    if (!zipCode && !location) {
      return res.status(400).json({
        error: "Provide either 'zipCode' or 'location'.",
      });
    }

    if (!checkInDate || !checkOutDate) {
      return res.status(400).json({
        error: "'checkInDate' and 'checkOutDate' are required.",
      });
    }

    if (!isValidDate(checkInDate) || !isValidDate(checkOutDate)) {
      return res.status(400).json({
        error: "Dates must be in YYYY-MM-DD format.",
      });
    }

    const milesNum = Number(miles);

    let hotels;
    if (zipCode) {
      hotels = await getCheapestHotelsByZip({
        zipCode,
        miles: milesNum,
        checkInDate,
        checkOutDate,
        countryCode,
        adults: Number(adults),
        roomQuantity: Number(roomQuantity),
        currencyCode,
      });
    } else {
      hotels = await getCheapestHotelsByLocation({
        location,
        miles: milesNum,
        checkInDate,
        checkOutDate,
        adults: Number(adults),
        roomQuantity: Number(roomQuantity),
        currencyCode,
      });
    }

    res.status(200).json({ results: hotels });
  } catch (error) {
    console.error("Error fetching cheapest hotels:", error.message);
    res.status(500).json({
      error: "Failed to retrieve cheapest hotel options",
      details: error.message,
    });
  }
});

module.exports = router;
